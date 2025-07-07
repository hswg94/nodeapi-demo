
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.status(200).send('Health Check OK');
  console.log('Health Check Endpoint Hit by IP:', req.ip);
});

app.get('/', (req, res) => {
  res.status(200).send('OK');
  console.log('Root Endpoint Hit by IP:', req.ip);
});

app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port}`);
});
