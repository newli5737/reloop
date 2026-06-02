import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authRequired } from '../middleware/auth.js';
import { profileSelect } from '../lib/profileSelect.js';

const router = Router();

router.use(authRequired);

router.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: profileSelect,
    });
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { name, phone, address, dateOfBirth, gender, bio } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Họ tên không được trống' });

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        dateOfBirth: dateOfBirth?.trim() || null,
        gender: gender?.trim() || null,
        bio: bio?.trim() || null,
      },
      select: profileSelect,
    });

    res.json(user);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.put('/avatar', async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ error: 'Thiếu ảnh avatar' });

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatar },
      select: profileSelect,
    });

    res.json(user);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const current = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!current) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    if (current.verificationStatus === 'VERIFIED') {
      return res.status(400).json({ error: 'Tài khoản đã được xác thực' });
    }
    if (current.verificationStatus === 'PENDING') {
      return res.status(400).json({ error: 'Hồ sơ đang chờ duyệt, vui lòng đợi admin xử lý' });
    }

    const {
      cccdNumber,
      cccdFullName,
      cccdDateOfBirth,
      cccdGender,
      cccdNationality,
      cccdPlaceOfOrigin,
      cccdPlaceOfResidence,
      cccdIssueDate,
      cccdExpiryDate,
      cccdFrontImage,
      cccdBackImage,
    } = req.body;

    const required = [
      ['cccdNumber', cccdNumber],
      ['cccdFullName', cccdFullName],
      ['cccdDateOfBirth', cccdDateOfBirth],
      ['cccdGender', cccdGender],
      ['cccdPlaceOfOrigin', cccdPlaceOfOrigin],
      ['cccdPlaceOfResidence', cccdPlaceOfResidence],
      ['cccdIssueDate', cccdIssueDate],
      ['cccdFrontImage', cccdFrontImage],
      ['cccdBackImage', cccdBackImage],
    ] as const;

    for (const [, val] of required) {
      if (!val?.trim?.()) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin CCCD và tải ảnh mặt trước/sau' });
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        verificationStatus: 'PENDING',
        verificationNote: null,
        cccdNumber: cccdNumber.trim(),
        cccdFullName: cccdFullName.trim(),
        cccdDateOfBirth: cccdDateOfBirth.trim(),
        cccdGender: cccdGender.trim(),
        cccdNationality: cccdNationality?.trim() || 'Việt Nam',
        cccdPlaceOfOrigin: cccdPlaceOfOrigin.trim(),
        cccdPlaceOfResidence: cccdPlaceOfResidence.trim(),
        cccdIssueDate: cccdIssueDate.trim(),
        cccdExpiryDate: cccdExpiryDate?.trim() || null,
        cccdFrontImage,
        cccdBackImage,
      },
      select: profileSelect,
    });

    res.json(user);
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
