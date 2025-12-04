require('dotenv').config();
const express = require('express');
const path = require('path');

const cors = require('cors');

const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

// CORS para desarrollo: permite cookies y credenciales desde Vite

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- API ROUTES ---
app.use('/api/users', require('./routes/users'));
app.use('/api/clocking', require('./routes/clocking'));
app.use('/api/admin', require('./routes/admin'));

// --- SERVE FRONTEND BUILD ---
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
