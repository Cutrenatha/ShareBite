const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '../.env' });

const db = require('../db');
const app = express();
const PORT = process.env.DONATION_PORT || 5002;
app.use(cors());
app.use(express.json());

// Upload folder
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Helper notify
const notifyBroadcast = (donationId, foodName) => {
  try {
    const http = require('http');
    const data = JSON.stringify({ donationId, foodName });
    const req = http.request({ hostname: 'localhost', port: process.env.NOTIFICATION_PORT || 5004, path: '/internal/broadcast', method: 'POST', headers: { 'Content-Type': 'application/json' } });
    req.on('error', () => {});
    req.write(data); req.end();
  } catch (_) {}
};

// GET / - list donasi
app.get('/', (req, res) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  const { status, limit = 50, offset = 0 } = req.query;
  try {
    let rows;
    if (userRole === 'donor') {
      const donor = db.prepare('SELECT donor_id FROM donors WHERE user_id = ?').get(userId);
      if (!donor) return res.json({ donations: [], total: 0 });
      const where = status ? 'AND d.status = ?' : '';
      const params = status ? [donor.donor_id, status, limit, offset] : [donor.donor_id, limit, offset];
      rows = db.prepare(`SELECT d.*, dn.restaurant_name, dn.address as donor_address FROM donations d JOIN donors dn ON d.donor_id=dn.donor_id WHERE d.donor_id=? ${where} ORDER BY d.created_at DESC LIMIT ? OFFSET ?`).all(...params);
    } else {
      rows = db.prepare(`SELECT d.*, dn.restaurant_name, dn.address as donor_address, dn.phone as donor_phone FROM donations d JOIN donors dn ON d.donor_id=dn.donor_id WHERE d.status='available' AND d.expired_at > datetime('now') ORDER BY d.created_at DESC LIMIT ? OFFSET ?`).all(limit, offset);
    }
    res.json({ donations: rows, total: rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil donasi' });
  }
});

// GET /:id
app.get('/stats/summary', (req, res) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  try {
    if (userRole === 'donor') {
      const donor = db.prepare('SELECT donor_id FROM donors WHERE user_id=?').get(userId);
      if (!donor) return res.json({ total: 0, available: 0, distributed: 0, in_progress: 0, total_portions: 0 });
      const did = donor.donor_id;
      const total = db.prepare("SELECT COUNT(*) as c FROM donations WHERE donor_id=?").get(did).c;
      const available = db.prepare("SELECT COUNT(*) as c FROM donations WHERE donor_id=? AND status='available'").get(did).c;
      const distributed = db.prepare("SELECT COUNT(*) as c FROM donations WHERE donor_id=? AND status='distributed'").get(did).c;
      const in_progress = db.prepare("SELECT COUNT(*) as c FROM donations WHERE donor_id=? AND status IN ('claimed','picked_up')").get(did).c;
      const total_portions = db.prepare("SELECT COALESCE(SUM(quantity),0) as s FROM donations WHERE donor_id=? AND status='distributed'").get(did).s;
      res.json({ total, available, distributed, in_progress, total_portions });
    } else {
      const total_available = db.prepare("SELECT COUNT(*) as c FROM donations WHERE status='available' AND expired_at > datetime('now')").get().c;
      res.json({ total_available });
    }
  } catch (err) { res.status(500).json({ error: 'Gagal' }); }
});

app.get('/:id', (req, res) => {
  const row = db.prepare('SELECT d.*,dn.restaurant_name,dn.address as donor_address,dn.phone as donor_phone,dn.city FROM donations d JOIN donors dn ON d.donor_id=dn.donor_id WHERE d.donation_id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Donasi tidak ditemukan' });
  res.json(row);
});

// POST / - buat donasi
app.post('/', upload.single('food_image'), (req, res) => {
  if (req.headers['x-user-role'] !== 'donor') return res.status(403).json({ error: 'Hanya donor yang bisa membuat donasi' });
  const { food_name, quantity, unit, pickup_location, description, expired_at } = req.body;
  if (!food_name || !quantity || !pickup_location || !expired_at)
    return res.status(400).json({ error: 'food_name, quantity, pickup_location, expired_at wajib diisi' });
  try {
    const donor = db.prepare('SELECT donor_id FROM donors WHERE user_id=?').get(req.headers['x-user-id']);
    if (!donor) return res.status(404).json({ error: 'Profil donor tidak ditemukan' });
    const food_image = req.file ? `/uploads/${req.file.filename}` : '';
    const donation_id = uuidv4();
    db.prepare('INSERT INTO donations (donation_id,donor_id,food_name,quantity,unit,pickup_location,description,food_image,expired_at) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(donation_id, donor.donor_id, food_name, parseInt(quantity), unit || 'porsi', pickup_location, description || '', food_image, expired_at);
    const row = db.prepare('SELECT * FROM donations WHERE donation_id=?').get(donation_id);
    notifyBroadcast(donation_id, food_name);
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat donasi' });
  }
});

// PUT /:id
app.put('/:id', (req, res) => {
  const userRole = req.headers['x-user-role'];
  const { food_name, quantity, unit, pickup_location, description, status, expired_at } = req.body;

  try {
    if (userRole === 'donor') {
      const donor = db
        .prepare('SELECT donor_id FROM donors WHERE user_id=?')
        .get(req.headers['x-user-id']);

      if (!donor) {
        return res.status(404).json({ error: 'Profil donor tidak ditemukan' });
      }

      const existing = db
        .prepare('SELECT * FROM donations WHERE donation_id=? AND donor_id=?')
        .get(req.params.id, donor.donor_id);

      if (!existing) {
        return res.status(403).json({ error: 'Tidak diizinkan' });
      }

      db.prepare(`
        UPDATE donations
        SET food_name = COALESCE(?, food_name),
            quantity = COALESCE(?, quantity),
            unit = COALESCE(?, unit),
            pickup_location = COALESCE(?, pickup_location),
            description = COALESCE(?, description),
            status = COALESCE(?, status),
            expired_at = COALESCE(?, expired_at)
        WHERE donation_id = ?
      `).run(
        food_name || null,
        quantity ? parseInt(quantity) : null,
        unit || null,
        pickup_location || null,
        description ?? null,
        status || null,
        expired_at || null,
        req.params.id
      );
    } else {
      db.prepare(`
        UPDATE donations
        SET status = ?
        WHERE donation_id = ?
      `).run(status, req.params.id);
    }

    const updated = db
      .prepare('SELECT * FROM donations WHERE donation_id=?')
      .get(req.params.id);

    res.json({
      message: 'Donasi diperbarui',
      donation: updated,
    });
  } catch (err) {
    console.error('UPDATE DONATION ERROR:', err);
    res.status(500).json({
      error: 'Gagal update',
      detail: err.message,
    });
  }
});

// DELETE /:id
app.delete('/:id', (req, res) => {
  if (req.headers['x-user-role'] !== 'donor') return res.status(403).json({ error: 'Hanya donor yang bisa menghapus' });
  try {
    const donor = db.prepare('SELECT donor_id FROM donors WHERE user_id=?').get(req.headers['x-user-id']);
    db.prepare('DELETE FROM donations WHERE donation_id=? AND donor_id=?').run(req.params.id, donor?.donor_id);
    res.json({ message: 'Donasi dihapus' });
  } catch (err) { res.status(500).json({ error: 'Gagal menghapus' }); }
});

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'donation' }));
app.listen(PORT, () => console.log(`Donation  → http://localhost:${PORT}`));
