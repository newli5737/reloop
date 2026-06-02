import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authRequired } from '../middleware/auth.js';
import { param } from '../lib/param.js';

const router = Router();

router.get('/:listingId/comments', async (req, res) => {
  try {
    const listingId = param(req.params.listingId);
    const comments = await prisma.comment.findMany({
      where: { listingId },
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
    const listingId = param(req.params.listingId);
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ error: 'Nội dung bình luận không được trống' });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing || listing.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        listingId,
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
    const id = param(req.params.id);
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: 'Không tìm thấy bình luận' });
    if (comment.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Không có quyền xóa' });
    }
    await prisma.comment.delete({ where: { id } });
    res.json({ message: 'Đã xóa bình luận' });
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
