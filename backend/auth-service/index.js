const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const db = require('../db');
const app = express();
const PORT = process.env.AUTH_PORT || 5001;
app.use(cors());
app.use(express.json());

// POST /register
app.post('/register', (req, res) => {
  const { name, email, password, role, restaurantName, address, phone, city, area } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ error: 'name, email, password, role wajib diisi' });
  if (!['donor', 'volunteer'].includes(role))
    return res.status(400).json({ error: 'role harus donor atau volunteer' });

  const exists = db.prepare('SELECT user_id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ error: 'Email sudah terdaftar' });

  const hashed = bcrypt.hashSync(password, 10);
  const userId = uuidv4();

  try {
    db.prepare('INSERT INTO users (user_id,name,email,password,role) VALUES (?,?,?,?,?)').run(userId, name, email, hashed, role);

    if (role === 'donor') {
      db.prepare('INSERT INTO donors (donor_id,user_id,restaurant_name,address,phone,city) VALUES (?,?,?,?,?,?)')
        .run(uuidv4(), userId, restaurantName || name, address || '', phone || '', city || '');
    } else {
      const code = 'VOL-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      db.prepare('INSERT INTO volunteers (volunteer_id,user_id,volunteer_code,area,phone) VALUES (?,?,?,?,?)')
        .run(uuidv4(), userId, code, area || '', phone || '');
    }

    const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Registrasi berhasil', token, user: { userId, name, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registrasi gagal' });
  }
});

// POST /login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email dan password wajib diisi' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Email atau password salah' });

  let profile = {};
  if (user.role === 'donor') {
    profile = db.prepare('SELECT * FROM donors WHERE user_id = ?').get(user.user_id) || {};
  } else {
    profile = db.prepare('SELECT * FROM volunteers WHERE user_id = ?').get(user.user_id) || {};
  }

  const token = jwt.sign({ userId: user.user_id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { userId: user.user_id, name: user.name, email: user.email, role: user.role, profile } });
});

// GET /me
app.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare('SELECT user_id,name,email,role,created_at FROM users WHERE user_id = ?').get(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    let profile = {};
    if (user.role === 'donor') profile = db.prepare('SELECT * FROM donors WHERE user_id = ?').get(user.user_id) || {};
    else profile = db.prepare('SELECT * FROM volunteers WHERE user_id = ?').get(user.user_id) || {};
    res.json({ ...user, profile });
  } catch {
    res.status(403).json({ error: 'Token tidak valid' });
  }
});

// PUT /profile
app.put('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, phone, address, city, area, restaurantName } = req.body;
    db.prepare('UPDATE users SET name = ? WHERE user_id = ?').run(name, decoded.userId);
    if (decoded.role === 'donor') {
      db.prepare('UPDATE donors SET phone=?,address=?,city=?,restaurant_name=? WHERE user_id=?').run(phone, address, city, restaurantName, decoded.userId);
    } else {
      db.prepare('UPDATE volunteers SET phone=?,area=? WHERE user_id=?').run(phone, area, decoded.userId);
    }
    res.json({ message: 'Profil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update gagal' });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'auth' }));
app.listen(PORT, () => console.log(`Auth      → http://localhost:${PORT}`));
