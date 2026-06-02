import { Router } from 'express';
import { ListingStatus, VerificationStatus } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { adminRequired } from '../middleware/auth.js';
import { profileSelect } from '../lib/profileSelect.js';

const router = Router();

router.use(adminRequired);

router.get('/stats', async (_req, res) => {
  try {
    const [totalUsers, totalListings, pendingListings, activeListings, soldListings, pendingVerifications] =
      await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'PENDING' } }),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.listing.count({ where: { status: 'SOLD' } }),
      prisma.user.count({ where: { verificationStatus: 'PENDING' } }),
    ]);

    res.json({ totalUsers, totalListings, pendingListings, activeListings, soldListings, pendingVerifications });
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.get('/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { listings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    const { role, isActive } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
      },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    res.json(user);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.get('/listings', async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status: status as ListingStatus } : {};

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(listings);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.patch('/listings/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['ACTIVE', 'REJECTED', 'PENDING', 'SOLD'].includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const listing = await prisma.listing.update({
      where: { id: req.params.id },
      data: { status: status as ListingStatus },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.json(listing);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.delete('/listings/:id', async (req, res) => {
  try {
    await prisma.listing.delete({ where: { id: req.params.id } });
    res.json({ message: 'Đã xóa tin đăng' });
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.get('/verifications', async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { verificationStatus: status as VerificationStatus } : { verificationStatus: 'PENDING' as VerificationStatus };

    const users = await prisma.user.findMany({
      where,
      select: profileSelect,
      orderBy: { updatedAt: 'desc' },
    });

    res.json(users);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.patch('/users/:id/verify', async (req, res) => {
  try {
    const { status, verificationNote } = req.body;
    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        verificationStatus: status as VerificationStatus,
        verificationNote: status === 'REJECTED' ? verificationNote || 'Hồ sơ không hợp lệ' : null,
        verifiedAt: status === 'VERIFIED' ? new Date() : null,
      },
      select: profileSelect,
    });

    res.json(user);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
