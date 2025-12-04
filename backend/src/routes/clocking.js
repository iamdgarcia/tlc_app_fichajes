const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// POST /api/clocking { dni, type }
router.post('/', async (req, res) => {
  try {
    const { dni, type } = req.body;
    if (!dni || !type) return res.status(400).json({ error: 'Faltan datos' });
    const user = await prisma.user.findUnique({ where: { dni } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (type === 'ENTRADA') {
      // Check for open entry
      const open = await prisma.clocking.findFirst({ where: { userId: user.id, timeOut: null } });
      if (open) return res.status(400).json({ error: 'Ya tienes una entrada abierta' });
      const now = new Date();
      await prisma.clocking.create({ data: { userId: user.id, type: 'ENTRADA', timeIn: now } });
      return res.json({ time: now.toLocaleTimeString('es-ES') });
    } else if (type === 'SALIDA') {
      // Find last open entry
      const open = await prisma.clocking.findFirst({ where: { userId: user.id, timeOut: null }, orderBy: { timeIn: 'desc' } });
      if (!open) return res.status(400).json({ error: 'No tienes una entrada abierta' });
      const now = new Date();
      await prisma.clocking.update({ where: { id: open.id }, data: { timeOut: now, type: 'SALIDA' } });
      return res.json({ time: now.toLocaleTimeString('es-ES') });
    } else {
      return res.status(400).json({ error: 'Tipo inválido' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Error de fichaje' });
  }
});

module.exports = router;
