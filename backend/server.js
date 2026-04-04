require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//active server
app.get('/', (req, res) => {
res.json({ status: 'NoisePrint backend is running' });
});

//alert route
app.post('/alert', (req, res) => {
const { location, decibel } = req.body;
console.log(`ALERT REVEIVED`);
console.log(`Location: ${location}`);
console.log(`Decibel level: ${decibel}`);
res.json({ message: 'Alert received. Notifying contacts.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`NoisePrint server running on port ${PORT}`);
});

