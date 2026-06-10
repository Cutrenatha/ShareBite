const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const db = require('../db');
const app = express();
const PORT = process.env.REPORTING_PORT || 5005;
app.use(cors());
app.use(express.json());

// GET /history
app.get('/history', (req, res) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  const { limit = 50 } = req.query;
  try {
    let rows;
    if (userRole === 'donor') {
      const donor = db.prepare('SELECT donor_id FROM donors WHERE user_id=?').get(userId);
      if (!donor) return res.json({ history: [] });
      rows = db.prepare(`SELECT dr.*,u.name as volunteer_name,v.phone as volunteer_phone FROM delivery_reports dr JOIN volunteers v ON dr.volunteer_id=v.volunteer_id JOIN users u ON v.user_id=u.user_id WHERE dr.donor_id=? ORDER BY dr.distributed_at DESC LIMIT ?`).all(donor.donor_id, parseInt(limit));
    } else {
      const vol = db.prepare('SELECT volunteer_id FROM volunteers WHERE user_id=?').get(userId);
      if (!vol) return res.json({ history: [] });
      rows = db.prepare(`SELECT dr.*,dn.restaurant_name as donor_name,dn.address as donor_address FROM delivery_reports dr JOIN donors dn ON dr.donor_id=dn.donor_id WHERE dr.volunteer_id=? ORDER BY dr.distributed_at DESC LIMIT ?`).all(vol.volunteer_id, parseInt(limit));
    }
    res.json({ history: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal' });
  }
});

// GET /dashboard
app.get('/dashboard', (req, res) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  try {
    if (userRole === 'donor') {
      const donor = db.prepare('SELECT donor_id FROM donors WHERE user_id=?').get(userId);
      const did = donor?.donor_id || 'none';
      const total_donations = db.prepare('SELECT COUNT(*) as c FROM donations WHERE donor_id=?').get(did).c;
      const active_donations = db.prepare("SELECT COUNT(*) as c FROM donations WHERE donor_id=? AND status='available'").get(did).c;
      const completed_donations = db.prepare("SELECT COUNT(*) as c FROM donations WHERE donor_id=? AND status='distributed'").get(did).c;
      const total_recipients = db.prepare('SELECT COALESCE(SUM(recipient_count),0) as s FROM delivery_reports WHERE donor_id=?').get(did).s;
      const total_portions_donated = db.prepare("SELECT COALESCE(SUM(quantity),0) as s FROM donations WHERE donor_id=? AND status='distributed'").get(did).s;
      const monthly = db.prepare("SELECT strftime('%Y-%m',created_at) as month, COUNT(*) as count FROM donations WHERE donor_id=? GROUP BY month ORDER BY month DESC LIMIT 6").all(did);
      const recent = db.prepare('SELECT * FROM donations WHERE donor_id=? ORDER BY created_at DESC LIMIT 5').all(did);
      res.json({ stats: { total_donations, active_donations, completed_donations, total_recipients, total_portions_donated }, monthly, recent });
    } else {
      const vol = db.prepare('SELECT volunteer_id,total_deliveries FROM volunteers WHERE user_id=?').get(userId);
      const vid = vol?.volunteer_id || 'none';
      const total_pickups = db.prepare('SELECT COUNT(*) as c FROM pickups WHERE volunteer_id=?').get(vid).c;
      const completed_pickups = db.prepare("SELECT COUNT(*) as c FROM pickups WHERE volunteer_id=? AND status='distributed'").get(vid).c;
      const active_pickups = db.prepare("SELECT COUNT(*) as c FROM pickups WHERE volunteer_id=? AND status IN ('assigned','on_the_way','picked_up')").get(vid).c;
      const total_recipients_helped = db.prepare('SELECT COALESCE(SUM(recipient_count),0) as s FROM delivery_reports WHERE volunteer_id=?').get(vid).s;
      const monthly = db.prepare("SELECT strftime('%Y-%m',created_at) as month, COUNT(*) as count FROM pickups WHERE volunteer_id=? GROUP BY month ORDER BY month DESC LIMIT 6").all(vid);
      const recent = db.prepare('SELECT p.*,d.food_name,d.pickup_location,dn.restaurant_name FROM pickups p JOIN donations d ON p.donation_id=d.donation_id JOIN donors dn ON d.donor_id=dn.donor_id WHERE p.volunteer_id=? ORDER BY p.created_at DESC LIMIT 5').all(vid);
      res.json({ stats: { total_pickups, completed_pickups, active_pickups, total_recipients_helped }, monthly, recent, total_deliveries: vol?.total_deliveries || 0 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal' });
  }
});

// GET /leaderboard
app.get('/leaderboard', (_, res) => {
  try {
    const rows = db.prepare(`SELECT u.name,v.area,v.total_deliveries,COUNT(dr.report_id) as reports,COALESCE(SUM(dr.recipient_count),0) as total_recipients FROM volunteers v JOIN users u ON v.user_id=u.user_id LEFT JOIN delivery_reports dr ON v.volunteer_id=dr.volunteer_id GROUP BY v.volunteer_id ORDER BY v.total_deliveries DESC LIMIT 10`).all();
    res.json({ leaderboard: rows });
  } catch (err) { res.status(500).json({ error: 'Gagal' }); }
});

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'reporting' }));
app.listen(PORT, () => console.log(`Reporting → http://localhost:${PORT}`));
