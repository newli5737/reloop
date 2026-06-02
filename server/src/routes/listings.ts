import { Router } from 'express';
import { Condition, ListingStatus, Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

const sellerSelect = { id: true, name: true, email: true, phone: true, avatar: true, verificationStatus: true, createdAt: true };

const conditionLabels: Record<Condition, string> = {
  NEW: 'Như mới',
  GOOD: 'Tốt',
  FAIR: 'Khá',
  POOR: 'Cần sửa chữa',
};

function formatListing(listing: {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: string;
  condition: Condition;
  location: string;
  images: string[];
  status: ListingStatus;
  views: number;
  createdAt: Date;
  user: { id: string; name: string; email: string; phone: string | null; avatar?: string | null; verificationStatus?: string; createdAt?: Date };
}) {
  return {
    ...listing,
    conditionLabel: conditionLabels[listing.condition],
    seller: {
      id: listing.user.id,
      name: listing.user.name,
      email: listing.user.email,
      phone: listing.user.phone,
      avatar: listing.user.avatar,
      verificationStatus: listing.user.verificationStatus,
      createdAt: listing.user.createdAt,
    },
    user: undefined,
  };
}

router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, condition, search } = req.query;

    const where: Prisma.ListingWhereInput = { status: 'ACTIVE' };

    if (category && category !== 'Tất cả') where.category = String(category);
    if (condition) where.condition = String(condition) as Condition;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      include: { user: { select: sellerSelect } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(listings.map(formatListing));
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.get('/my', authRequired, async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { userId: req.user!.id },
      include: { user: { select: sellerSelect } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(listings.map(formatListing));
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: { user: { select: sellerSelect } },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    if (listing.status !== 'ACTIVE') {
      const header = req.headers.authorization;
      if (!header?.startsWith('Bearer ')) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      }
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(header.slice(7), process.env.JWT_SECRET!) as { id: string; role: string };
        if (listing.userId !== decoded.id && decoded.role !== 'ADMIN') {
          return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }
      } catch {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      }
    }

    await prisma.listing.update({
      where: { id: listing.id },
      data: { views: { increment: 1 } },
    });

    res.json(formatListing({ ...listing, views: listing.views + 1 }));
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const { title, description, price, originalPrice, category, condition, location, images } = req.body;

    if (!title || !description || !price || !category || !condition || !location) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        category,
        condition: condition as Condition,
        location,
        images: images || [],
        userId: req.user!.id,
        status: 'PENDING',
      },
      include: { user: { select: sellerSelect } },
    });

    res.status(201).json(formatListing(listing));
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });

    if (!listing) {
      return res.status(404).json({ error: 'Không tìm thấy tin đăng' });
    }

    if (listing.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Không có quyền chỉnh sửa' });
    }

    const { title, description, price, originalPrice, category, condition, location, images, status } = req.body;

    const updated = await prisma.listing.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? Number(originalPrice) : null }),
        ...(category && { category }),
        ...(condition && { condition: condition as Condition }),
        ...(location && { location }),
        ...(images && { images }),
        ...(status && req.user!.role === 'ADMIN' ? { status: status as ListingStatus } : {}),
        ...(status === 'SOLD' && listing.userId === req.user!.id ? { status: 'SOLD' as ListingStatus } : {}),
      },
      include: { user: { select: sellerSelect } },
    });

    res.json(formatListing(updated));
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });

    if (!listing) {
      return res.status(404).json({ error: 'Không tìm thấy tin đăng' });
    }

    if (listing.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Không có quyền xóa' });
    }

    await prisma.listing.delete({ where: { id: req.params.id } });
    res.json({ message: 'Đã xóa tin đăng' });
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
