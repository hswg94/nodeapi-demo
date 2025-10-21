
import express from 'express';
import add from './utils/add.js';
import subtract from './utils/subtract.js';
import multiply from './utils/multiply.js';
import divide from './utils/divide.js';
import os from 'os';

const app = express();
const port = process.env.PORT || 3000;

// Trust proxy to get real IPs through Docker bridge
app.set('trust proxy', true);

// Get container's own IP address
function getContainerIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and loopback addresses
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Addition endpoint: /add?a=1&b=2
app.get('/add', (req, res) => {
  try {
    const result = add(Number(req.query.a), Number(req.query.b));
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Subtraction endpoint: /subtract?a=5&b=3
app.get('/subtract', (req, res) => {
  try {
    const result = subtract(Number(req.query.a), Number(req.query.b));
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Multiplication endpoint: /multiply?a=2&b=3
app.get('/multiply', (req, res) => {
  try {
    const result = multiply(Number(req.query.a), Number(req.query.b));
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Division endpoint: /divide?a=6&b=3
app.get('/divide', (req, res) => {
  try {
    const result = divide(Number(req.query.a), Number(req.query.b));
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('Health Check OK');
  console.log('Health Check Endpoint Hit by IP:', req.ip);
});

app.get('/', (req, res) => {
  const containerIP = getContainerIP();
  res.status(200).send(`OK - App Container IP: ${containerIP}, Client IP: ${req.ip}`);
  console.log('Root Endpoint Hit - Container IP:', containerIP, 'Client IP:', req.ip);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`SERVER RUNNING ON PORT ${port}`);
  });
}

export default app;