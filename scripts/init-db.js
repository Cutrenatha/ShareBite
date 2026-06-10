// node:sqlite built-in - Node.js v22.5+ / v24 (tidak perlu npm install apapun untuk SQLite!)
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', 'backend', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'sharebite.db');

if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('🗑️  Database lama dihapus, membuat yang baru...');
}

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys = ON');
db.exec('PRAGMA journal_mode = WAL');

console.log('Membuat tabel...');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('donor','volunteer')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS donors (
    donor_id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    restaurant_name TEXT NOT NULL,
    address TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    city TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS volunteers (
    volunteer_id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    volunteer_code TEXT UNIQUE,
    is_available INTEGER DEFAULT 1,
    area TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    total_deliveries INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS donations (
    donation_id TEXT PRIMARY KEY,
    donor_id TEXT REFERENCES donors(donor_id) ON DELETE CASCADE,
    food_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT DEFAULT 'porsi',
    pickup_location TEXT NOT NULL,
    description TEXT DEFAULT '',
    food_image TEXT DEFAULT '',
    status TEXT DEFAULT 'available' CHECK(status IN ('available','claimed','picked_up','distributed','expired')),
    expired_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pickups (
    pickup_id TEXT PRIMARY KEY,
    donation_id TEXT REFERENCES donations(donation_id) ON DELETE CASCADE,
    volunteer_id TEXT REFERENCES volunteers(volunteer_id),
    status TEXT DEFAULT 'assigned' CHECK(status IN ('assigned','on_the_way','picked_up','distributed','cancelled')),
    notes TEXT DEFAULT '',
    scheduled_at TEXT DEFAULT (datetime('now')),
    picked_at TEXT,
    distributed_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS notifications (
    notif_id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read INTEGER DEFAULT 0,
    related_id TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS delivery_reports (
    report_id TEXT PRIMARY KEY,
    pickup_id TEXT REFERENCES pickups(pickup_id),
    volunteer_id TEXT REFERENCES volunteers(volunteer_id),
    donor_id TEXT REFERENCES donors(donor_id),
    food_name TEXT DEFAULT '',
    recipient_count INTEGER DEFAULT 0,
    distributed_at TEXT DEFAULT (datetime('now')),
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

console.log('Tabel berhasil dibuat!');
console.log('Membuat data demo...');

const hash1 = bcrypt.hashSync('password123', 10);
const hash2 = bcrypt.hashSync('password123', 10);
const hash3 = bcrypt.hashSync('password123', 10);
const hash4 = bcrypt.hashSync('password123', 10);

const uid1 = uuidv4(), uid2 = uuidv4(), uid3 = uuidv4(), uid4 = uuidv4();
const did1 = uuidv4(), did2 = uuidv4();
const vid1 = uuidv4(), vid2 = uuidv4();

db.prepare('INSERT INTO users (user_id,name,email,password,role) VALUES (?,?,?,?,?)').run(uid1,'Resto Padang Sejahtera','padang@example.com',hash1,'donor');
db.prepare('INSERT INTO users (user_id,name,email,password,role) VALUES (?,?,?,?,?)').run(uid2,'Kafe Nusantara','nusantara@example.com',hash2,'donor');
db.prepare('INSERT INTO users (user_id,name,email,password,role) VALUES (?,?,?,?,?)').run(uid3,'Ahmad Relawan','ahmad@example.com',hash3,'volunteer');
db.prepare('INSERT INTO users (user_id,name,email,password,role) VALUES (?,?,?,?,?)').run(uid4,'Siti Volunteer','siti@example.com',hash4,'volunteer');

db.prepare('INSERT INTO donors (donor_id,user_id,restaurant_name,address,phone,city) VALUES (?,?,?,?,?,?)').run(did1,uid1,'Resto Padang Sejahtera','Jl. Sudirman No. 10','081234567890','Banda Aceh');
db.prepare('INSERT INTO donors (donor_id,user_id,restaurant_name,address,phone,city) VALUES (?,?,?,?,?,?)').run(did2,uid2,'Kafe Nusantara','Jl. Teuku Umar No. 5','089876543210','Banda Aceh');

db.prepare('INSERT INTO volunteers (volunteer_id,user_id,volunteer_code,area,phone) VALUES (?,?,?,?,?)').run(vid1,uid3,'VOL-001','Banda Aceh Utara','081111111111');
db.prepare('INSERT INTO volunteers (volunteer_id,user_id,volunteer_code,area,phone) VALUES (?,?,?,?,?)').run(vid2,uid4,'VOL-002','Banda Aceh Selatan','082222222222');

const don1 = uuidv4(), don2 = uuidv4();
db.prepare('INSERT INTO donations (donation_id,donor_id,food_name,quantity,unit,pickup_location,description,status,expired_at) VALUES (?,?,?,?,?,?,?,?,?)').run(
  don1,did1,'Nasi Padang',30,'porsi','Jl. Sudirman No. 10, Banda Aceh','Nasi padang lengkap dengan lauk, masih fresh','available',
  new Date(Date.now()+6*60*60*1000).toISOString()
);
db.prepare('INSERT INTO donations (donation_id,donor_id,food_name,quantity,unit,pickup_location,description,status,expired_at) VALUES (?,?,?,?,?,?,?,?,?)').run(
  don2,did2,'Roti Bakery',20,'box','Jl. Teuku Umar No. 5, Banda Aceh','Berbagai roti sisa produksi hari ini','available',
  new Date(Date.now()+4*60*60*1000).toISOString()
);

db.close();

console.log('');
console.log('Database berhasil diinisialisasi!');
console.log('File database: backend/data/sharebite.db');
console.log('');
console.log('👤 Akun Demo:');
console.log('   Donor 1    : padang@example.com     / password123');
console.log('   Donor 2    : nusantara@example.com  / password123');
console.log('   Volunteer 1: ahmad@example.com      / password123');
console.log('   Volunteer 2: siti@example.com       / password123');
console.log('');
