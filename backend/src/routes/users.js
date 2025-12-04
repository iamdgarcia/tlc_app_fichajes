const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, dni: true, position: true, role: true } });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const { name, dni, position, password } = req.body;
    if (!name || !dni || !position || !password) return res.status(400).json({ error: 'Faltan campos' });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, dni, position, password: hash, role: 'EMPLOYEE' } });
    res.json({ id: user.id });
  } catch (e) {
    res.status(400).json({ error: 'Error al crear usuario' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { name, position, password } = req.body;
    const data = { name, position };
    if (password) data.password = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: Number(req.params.id) }, data });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
