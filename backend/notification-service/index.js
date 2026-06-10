const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '../.env' });

const db = require('../db');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173', methods: ['GET','POST'], credentials: true }
});

const PORT = process.env.NOTIFICATION_PORT || 5004;
app.use(cors());
app.use(express.json());

const connectedUsers = new Map();

io.on('connection', (socket) => {
  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);
  });
  socket.on('disconnect', () => {
    for (const [uid, sid] of connectedUsers.entries()) {
      if (sid === socket.id) { connectedUsers.delete(uid); break; }
    }
  });
});

// GET /
app.get('/', (req, res) => {
  const userId = req.headers['x-user-id'];
  const { limit = 30, unread_only } = req.query;
  try {
    let rows;
    if (unread_only === 'true') {
      rows = db.prepare('SELECT * FROM notifications WHERE user_id=? AND is_read=0 ORDER BY created_at DESC LIMIT ?').all(userId, parseInt(limit));
    } else {
      rows = db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT ?').all(userId, parseInt(limit));
    }
    const unread = db.prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id=? AND is_read=0').get(userId).c;
    res.json({ notifications: rows, unread_count: unread });
  } catch (err) { res.status(500).json({ error: 'Gagal' }); }
});

// PUT /read/:id
app.put('/read/:id', (req, res) => {
  const userId = req.headers['x-user-id'];
  db.prepare('UPDATE notifications SET is_read=1 WHERE notif_id=? AND user_id=?').run(req.params.id, userId);
  res.json({ message: 'Dibaca' });
});

// PUT /read-all
app.put('/read-all', (req, res) => {
  db.prepare('UPDATE notifications SET is_read=1 WHERE user_id=?').run(req.headers['x-user-id']);
  res.json({ message: 'Semua dibaca' });
});

// Internal: notify satu user
app.post('/internal/notify', (req, res) => {
  const { userId, message, type, relatedId } = req.body;
  try {
    const notif_id = uuidv4();
    db.prepare('INSERT INTO notifications (notif_id,user_id,message,type,related_id) VALUES (?,?,?,?,?)').run(notif_id, userId, message, type || 'info', relatedId || '');
    const notif = db.prepare('SELECT * FROM notifications WHERE notif_id=?').get(notif_id);
    io.to(`user:${userId}`).emit('notification', notif);
    res.json({ sent: true });
  } catch (err) { res.status(500).json({ error: 'Gagal' }); }
});

// Internal: broadcast ke semua volunteer
app.post('/internal/broadcast', (req, res) => {
  const { donationId, foodName } = req.body;
  try {
    const volunteers = db.prepare("SELECT u.user_id FROM volunteers v JOIN users u ON v.user_id=u.user_id WHERE v.is_available=1").all();
    const message = `Donasi baru tersedia: "${foodName}"! Segera ambil tugas pickup. 🍱`;
    for (const v of volunteers) {
      const notif_id = uuidv4();
      db.prepare('INSERT INTO notifications (notif_id,user_id,message,type,related_id) VALUES (?,?,?,?,?)').run(notif_id, v.user_id, message, 'new_donation', donationId);
      const notif = db.prepare('SELECT * FROM notifications WHERE notif_id=?').get(notif_id);
      io.to(`user:${v.user_id}`).emit('notification', notif);
    }
    res.json({ broadcasted: volunteers.length });
  } catch (err) { res.status(500).json({ error: 'Broadcast gagal' }); }
});

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'notification', connected: connectedUsers.size }));
httpServer.listen(PORT, () => console.log(`Notif     → http://localhost:${PORT}`));
