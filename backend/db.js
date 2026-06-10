// Wrapper node:sqlite agar compatible dengan API better-sqlite3
// (.prepare().get(), .prepare().run(), .prepare().all())
// Tidak perlu install apapun - pakai built-in Node v22+

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'sharebite.db');
const rawDb = new DatabaseSync(DB_PATH);

rawDb.exec('PRAGMA journal_mode = WAL');
rawDb.exec('PRAGMA foreign_keys = ON');

// Wrapper supaya .prepare(sql).get(...), .run(...), .all(...) bisa dipakai
const db = {
  prepare(sql) {
    return {
      get(...params) {
        const stmt = rawDb.prepare(sql);
        const rows = stmt.all(...params);
        return rows[0] || null;
      },
      run(...params) {
        const stmt = rawDb.prepare(sql);
        return stmt.run(...params);
      },
      all(...params) {
        const stmt = rawDb.prepare(sql);
        return stmt.all(...params);
      }
    };
  },
  exec(sql) {
    return rawDb.exec(sql);
  },
  close() {
    return rawDb.close();
  }
};

module.exports = db;