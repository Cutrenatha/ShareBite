const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'backend', 'data', 'sharebite.db');
if (!fs.existsSync(dbPath)) {
  console.log('Database belum ada! Jalankan dulu: npm run init:db\n');
  process.exit(1);
}

const services = [
  { name: 'Auth Service',         dir: 'backend/auth-service',         color: '\x1b[36m' },
  { name: 'Donation Service',     dir: 'backend/donation-service',     color: '\x1b[33m' },
  { name: 'Delivery Service',     dir: 'backend/delivery-service',     color: '\x1b[32m' },
  { name: 'Notification Service', dir: 'backend/notification-service', color: '\x1b[35m' },
  { name: 'Reporting Service',    dir: 'backend/reporting-service',    color: '\x1b[34m' },
  { name: 'Gateway',              dir: 'backend/gateway',              color: '\x1b[31m' },
];

const reset = '\x1b[0m';
console.log('\x1b[1mShareBite starting...\x1b[0m');
console.log('Tekan Ctrl+C untuk stop semua service.\n');

services.forEach(({ name, dir, color }) => {
  const cwd = path.join(__dirname, dir);
  const proc = spawn('node', ['index.js'], { cwd, shell: true });
  proc.stdout.on('data', (d) => process.stdout.write(`${color}[${name}]${reset} ${d}`));
  proc.stderr.on('data', (d) => process.stderr.write(`${color}[${name}]${reset} ${d}`));
  proc.on('close', (code) => {
    if (code !== 0) console.log(`${color}[${name}] Berhenti (kode ${code})${reset}`);
  });
});
