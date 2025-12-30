
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();

connectDB();
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(5000, () => console.log('Server running on 5000'));
