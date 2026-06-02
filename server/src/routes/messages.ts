import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);

router.get('/', async (req, res) => {
  try {
    const userId = req.user!.id;
    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      include: {
        listing: { select: { id: true, title: true, images: true, price: true } },
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true, senderId: true, readAt: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const result = conversations.map((c) => {
      const other = c.buyerId === userId ? c.seller : c.buyer;
      const lastMsg = c.messages[0];
      const unread = lastMsg && lastMsg.senderId !== userId && !lastMsg.readAt ? 1 : 0;
      return {
        id: c.id,
        listing: c.listing,
        otherUser: other,
        lastMessage: lastMsg ? { content: lastMsg.content, createdAt: lastMsg.createdAt } : null,
        unread,
        updatedAt: c.updatedAt,
      };
    });

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user!.id;
    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      select: { id: true },
    });
    const ids = conversations.map((c) => c.id);
    const count = await prisma.message.count({
      where: { conversationId: { in: ids }, senderId: { not: userId }, readAt: null },
    });
    res.json({ count });
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { listingId } = req.body;
    if (!listingId) return res.status(400).json({ error: 'Thiếu listingId' });

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing || listing.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    if (listing.userId === req.user!.id) {
      return res.status(400).json({ error: 'Không thể nhắn tin với chính mình' });
    }

    const conversation = await prisma.conversation.upsert({
      where: { listingId_buyerId: { listingId, buyerId: req.user!.id } },
      update: {},
      create: { listingId, buyerId: req.user!.id, sellerId: listing.userId },
      include: {
        listing: { select: { id: true, title: true, images: true, price: true } },
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    res.json(conversation);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.get('/:id/messages', async (req, res) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.id },
    });

    if (!conversation) return res.status(404).json({ error: 'Không tìm thấy cuộc trò chuyện' });

    const userId = req.user!.id;
    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }

    await prisma.message.updateMany({
      where: { conversationId: req.params.id, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      include: { sender: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.post('/:id/messages', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Tin nhắn không được trống' });

    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.id },
    });

    if (!conversation) return res.status(404).json({ error: 'Không tìm thấy cuộc trò chuyện' });

    const userId = req.user!.id;
    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      return res.status(403).json({ error: 'Không có quyền gửi tin' });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        senderId: userId,
        content: content.trim(),
      },
      include: { sender: { select: { id: true, name: true } } },
    });

    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { updatedAt: new Date() },
    });

    res.status(201).json(message);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
