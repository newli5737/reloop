import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { authRequired, signToken } from '../middleware/auth.js';
import { profileSelect } from '../lib/profileSelect.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, phone },
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      token,
      user: await prisma.user.findUnique({ where: { id: user.id }, select: profileSelect }),
    });
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      token,
      user: await prisma.user.findUnique({ where: { id: user.id }, select: profileSelect }),
    });
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.get('/me', authRequired, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: profileSelect,
    });

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    res.json(user);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
