const express = require('express');
const cors = require('cors');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '../.env' });

const db = require('../db');
const app = express();
const PORT = process.env.DELIVERY_PORT || 5003;
app.use(cors());
app.use(express.json());

const notifyUser = (userId, message, type, relatedId) => {
  try {
    const data = JSON.stringify({ userId, message, type, relatedId: relatedId || '' });
    const req = http.request({ hostname: 'localhost', port: process.env.NOTIFICATION_PORT || 5004, path: '/internal/notify', method: 'POST', headers: { 'Content-Type': 'application/json' } });
    req.on('error', () => {});
    req.write(data); req.end();
  } catch (_) {}
};

// GET /pickups
app.get('/pickups', (req, res) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  const { status } = req.query;
  try {
    let rows;
    if (userRole === 'volunteer') {
      const vol = db.prepare('SELECT volunteer_id FROM volunteers WHERE user_id=?').get(userId);
      if (!vol) return res.json({ pickups: [] });
      const where = status ? 'AND p.status=?' : '';
      const params = status ? [vol.volunteer_id, status] : [vol.volunteer_id];
      rows = db.prepare(`SELECT p.*,d.food_name,d.quantity,d.unit,d.pickup_location,d.description,dn.restaurant_name,dn.address as donor_address,dn.phone as donor_phone FROM pickups p JOIN donations d ON p.donation_id=d.donation_id JOIN donors dn ON d.donor_id=dn.donor_id WHERE p.volunteer_id=? ${where} ORDER BY p.created_at DESC`).all(...params);
    } else {
      const donor = db.prepare('SELECT donor_id FROM donors WHERE user_id=?').get(userId);
      if (!donor) return res.json({ pickups: [] });
      const where = status ? 'AND p.status=?' : '';
      const params = status ? [donor.donor_id, status] : [donor.donor_id];
      rows = db.prepare(`SELECT p.*,d.food_name,d.quantity,d.unit,d.pickup_location,u.name as volunteer_name,v.phone as volunteer_phone,v.area as volunteer_area FROM pickups p JOIN donations d ON p.donation_id=d.donation_id JOIN volunteers v ON p.volunteer_id=v.volunteer_id JOIN users u ON v.user_id=u.user_id WHERE d.donor_id=? ${where} ORDER BY p.created_at DESC`).all(...params);
    }
    res.json({ pickups: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data pickup' });
  }
});

// POST /accept/:donationId
app.post('/accept/:donationId', (req, res) => {
  if (req.headers['x-user-role'] !== 'volunteer') return res.status(403).json({ error: 'Hanya volunteer yang bisa menerima pickup' });
  try {
    const donation = db.prepare("SELECT * FROM donations WHERE donation_id=? AND status='available'").get(req.params.donationId);
    if (!donation) return res.status(400).json({ error: 'Donasi tidak tersedia' });

    const vol = db.prepare('SELECT volunteer_id,user_id FROM volunteers WHERE user_id=?').get(req.headers['x-user-id']);
    if (!vol) return res.status(404).json({ error: 'Profil volunteer tidak ditemukan' });

    const pickup_id = uuidv4();
    db.prepare('INSERT INTO pickups (pickup_id,donation_id,volunteer_id,status) VALUES (?,?,?,?)').run(pickup_id, req.params.donationId, vol.volunteer_id, 'assigned');
    db.prepare("UPDATE donations SET status='claimed',updated_at=datetime('now') WHERE donation_id=?").run(req.params.donationId);

    // Notify donor
    const donorUser = db.prepare('SELECT u.user_id FROM donors d JOIN users u ON d.user_id=u.user_id WHERE d.donor_id=?').get(donation.donor_id);
    if (donorUser) notifyUser(donorUser.user_id, `Donasi "${donation.food_name}" Anda telah diambil oleh relawan!`, 'pickup_accepted', pickup_id);

    res.status(201).json({ message: 'Pickup diterima!', pickup_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menerima pickup' });
  }
});

// PUT /status/:pickupId
app.put('/status/:pickupId', (req, res) => {
  if (req.headers['x-user-role'] !== 'volunteer') return res.status(403).json({ error: 'Hanya volunteer yang bisa update status' });
  const { status, notes, recipientCount } = req.body;
  const valid = ['on_the_way', 'picked_up', 'distributed', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Status tidak valid' });

  try {
    const vol = db.prepare('SELECT volunteer_id FROM volunteers WHERE user_id=?').get(req.headers['x-user-id']);
    const pickup = db.prepare('SELECT p.*,d.food_name,d.donor_id FROM pickups p JOIN donations d ON p.donation_id=d.donation_id WHERE p.pickup_id=? AND p.volunteer_id=?').get(req.params.pickupId, vol?.volunteer_id);
    if (!pickup) return res.status(403).json({ error: 'Tidak diizinkan' });

    // Update pickup
    let extraSet = '';
    if (status === 'picked_up') extraSet = ", picked_at=datetime('now')";
    if (status === 'distributed') extraSet = ", distributed_at=datetime('now')";
    db.prepare(`UPDATE pickups SET status=?,notes=COALESCE(?,notes),updated_at=datetime('now')${extraSet} WHERE pickup_id=?`).run(status, notes || null, req.params.pickupId);

    // Update donation status
    const donMap = { on_the_way: 'claimed', picked_up: 'picked_up', distributed: 'distributed', cancelled: 'available' };
    db.prepare("UPDATE donations SET status=?,updated_at=datetime('now') WHERE donation_id=?").run(donMap[status], pickup.donation_id);

    if (status === 'distributed') {
      db.prepare('INSERT INTO delivery_reports (report_id,pickup_id,volunteer_id,donor_id,food_name,recipient_count,notes) VALUES (?,?,?,?,?,?,?)')
        .run(uuidv4(), req.params.pickupId, vol.volunteer_id, pickup.donor_id, pickup.food_name, parseInt(recipientCount) || 0, notes || '');
      db.prepare('UPDATE volunteers SET total_deliveries=total_deliveries+1 WHERE volunteer_id=?').run(vol.volunteer_id);
      // Notify donor
      const donorUser = db.prepare('SELECT u.user_id FROM donors d JOIN users u ON d.user_id=u.user_id WHERE d.donor_id=?').get(pickup.donor_id);
      if (donorUser) notifyUser(donorUser.user_id, `Donasi "${pickup.food_name}" telah berhasil didistribusikan! 🎉`, 'distributed', req.params.pickupId);
    }
    res.json({ message: `Status diperbarui ke: ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal update status' });
  }
});

// GET /stats
app.get('/stats', (req, res) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  try {
    if (userRole === 'volunteer') {
      const vol = db.prepare('SELECT volunteer_id,total_deliveries FROM volunteers WHERE user_id=?').get(userId);
      const vid = vol?.volunteer_id;
      const total = db.prepare('SELECT COUNT(*) as c FROM pickups WHERE volunteer_id=?').get(vid).c;
      const completed = db.prepare("SELECT COUNT(*) as c FROM pickups WHERE volunteer_id=? AND status='distributed'").get(vid).c;
      const active = db.prepare("SELECT COUNT(*) as c FROM pickups WHERE volunteer_id=? AND status IN ('assigned','on_the_way','picked_up')").get(vid).c;
      res.json({ total, completed, active, total_deliveries: vol?.total_deliveries || 0 });
    } else {
      const donor = db.prepare('SELECT donor_id FROM donors WHERE user_id=?').get(userId);
      const did = donor?.donor_id;
      const total = db.prepare('SELECT COUNT(*) as c FROM pickups p JOIN donations d ON p.donation_id=d.donation_id WHERE d.donor_id=?').get(did).c;
      const completed = db.prepare("SELECT COUNT(*) as c FROM pickups p JOIN donations d ON p.donation_id=d.donation_id WHERE d.donor_id=? AND p.status='distributed'").get(did).c;
      res.json({ total, completed });
    }
  } catch (err) { res.status(500).json({ error: 'Gagal' }); }
});

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'delivery' }));
app.listen(PORT, () => console.log(`Delivery  → http://localhost:${PORT}`));
