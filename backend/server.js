require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.get('/', (req, res) => {
  res.json({ status: 'NoisePrint backend is running' });
});

app.post('/alert', async (req, res) => {
  const { location, decibel } = req.body;
  console.log('ALERT RECEIVED');
  console.log('Location: ' + location);
  console.log('Decibel level: ' + decibel);

  try {
    await client.calls.create({
      twiml: '<Response><Say voice="alice">NoisePrint Alert. Threat detected. Please respond immediately.</Say></Response>',
      to: process.env.EMERGENCY_CONTACT_1,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    console.log('Call fired successfully');
    res.json({ message: 'Alert received. Contacts notified.' });
  } catch (error) {
    console.error('Call failed: ' + error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('NoisePrint server running on port ' + PORT);
});
