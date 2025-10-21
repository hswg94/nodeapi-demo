
import express from 'express';
import add from './utils/add.js';
import subtract from './utils/subtract.js';
import multiply from './utils/multiply.js';
import divide from './utils/divide.js';

const app = express();
const port = process.env.PORT || 3000;

// Trust proxy to get real IPs through Docker bridge
app.set('trust proxy', true);

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
  res.status(200).send(`OK - Your IP: ${req.ip}`);
  console.log('Root Endpoint Hit by IP:', req.ip);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`SERVER RUNNING ON PORT ${port}`);
  });
}

export default app;