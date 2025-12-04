const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { dni, password } = req.body;
    const user = await prisma.user.findUnique({ where: { dni } });
    if (!user || user.role !== 'ADMIN') return res.status(401).json({ error: 'No autorizado' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'No autorizado' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    // En desarrollo, secure: false y sameSite: 'lax'. En producción, secure: true y sameSite: 'none'.
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error de login' });
  }
});

// Middleware auth
function auth(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// GET /api/admin/kpi
router.get('/kpi', auth, async (req, res) => {
  try {
    const active = await prisma.clocking.count({ where: { timeOut: null } });
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0,0,0,0);
    const totalHours = await prisma.clocking.aggregate({
      _sum: {
        diff: {
          select: {
            hours: true
          }
        }
      },
      where: {
        timeIn: { gte: weekStart },
        timeOut: { not: null }
      }
    });
    res.json({ active, totalHours: totalHours._sum?.diff?.hours || 0 });
  } catch (e) {
    res.status(500).json({ error: 'Error KPI' });
  }
});

// GET /api/admin/chart
router.get('/chart', auth, async (req, res) => {
  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0,0,0,0);
    const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    const data = await prisma.clocking.findMany({
      where: { timeIn: { gte: weekStart }, timeOut: { not: null } },
      select: { timeIn: true, timeOut: true }
    });
    const chart = Array(7).fill(0);
    data.forEach(c => {
      const day = new Date(c.timeIn).getDay();
      const hours = (new Date(c.timeOut) - new Date(c.timeIn)) / 3600000;
      chart[day] += hours;
    });
    res.json(days.map((day, i) => ({ day, hours: Math.round(chart[i]*100)/100 })));
  } catch (e) {
    res.status(500).json({ error: 'Error chart' });
  }
});

// GET /api/admin/audit
router.get('/audit', auth, async (req, res) => {
  try {
    const { date, dni } = req.query;
    const where = {};
    if (date) {
      const d = new Date(date);
      where.timeIn = { gte: new Date(d.setHours(0,0,0,0)), lte: new Date(d.setHours(23,59,59,999)) };
    }
    if (dni) {
      const user = await prisma.user.findUnique({ where: { dni } });
      if (user) where.userId = user.id;
      else return res.json([]);
    }
    const clockings = await prisma.clocking.findMany({
      where,
      include: { user: { select: { name: true, dni: true } } },
      orderBy: { timeIn: 'desc' }
    });
    res.json(clockings);
  } catch (e) {
    res.status(500).json({ error: 'Error auditoría' });
  }
});

module.exports = router;
