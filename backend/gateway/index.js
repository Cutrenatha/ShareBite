const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));

// JANGAN pakai express.json() global - akan memotong multipart/form-data!
// Body parsing diserahkan ke masing-masing service

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.headers['x-user-id'] = decoded.userId;
    req.headers['x-user-role'] = decoded.role;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Proxy options - stream body langsung tanpa di-parse
const proxyOptions = {
  parseReqBody: false, // <-- INI KUNCINYA: jangan parse body di gateway
  proxyReqOptDecorator: (proxyReqOpts) => {
    return proxyReqOpts;
  }
};

// Public
app.use('/api/auth', proxy(`http://localhost:${process.env.AUTH_PORT || 5001}`, proxyOptions));

// Protected
app.use('/api/donations', authenticate, proxy(`http://localhost:${process.env.DONATION_PORT || 5002}`, proxyOptions));
app.use('/api/delivery', authenticate, proxy(`http://localhost:${process.env.DELIVERY_PORT || 5003}`, proxyOptions));
app.use('/api/notifications', authenticate, proxy(`http://localhost:${process.env.NOTIFICATION_PORT || 5004}`, proxyOptions));
app.use('/api/reports', authenticate, proxy(`http://localhost:${process.env.REPORTING_PORT || 5005}`, proxyOptions));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'gateway' }));
app.listen(PORT, () => console.log(`Gateway  → http://localhost:${PORT}`));