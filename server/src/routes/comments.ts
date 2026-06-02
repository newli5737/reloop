import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/:listingId/comments', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { listingId: req.params.listingId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comments);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.post('/:listingId/comments', authRequired, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ error: 'Nội dung bình luận không được trống' });
    }

    const listing = await prisma.listing.findUnique({ where: { id: req.params.listingId } });
    if (!listing || listing.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        listingId: req.params.listingId,
        userId: req.user!.id,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json(comment);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.delete('/comments/:id', authRequired, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) return res.status(404).json({ error: 'Không tìm thấy bình luận' });
    if (comment.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Không có quyền xóa' });
    }
    await prisma.comment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Đã xóa bình luận' });
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
