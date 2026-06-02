import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@reloop.vn' },
    update: {},
    create: {
      email: 'admin@reloop.vn',
      password: adminPassword,
      name: 'Admin RELOOP',
      role: 'ADMIN',
      phone: '0901234567',
    },
  });

  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@reloop.vn' },
    update: {},
    create: {
      email: 'user@reloop.vn',
      password: userPassword,
      name: 'Nguyễn Văn A',
      role: 'USER',
      phone: '0912345678',
    },
  });

  const sampleListings = [
    {
      title: 'iPhone 13 Pro Max 256GB',
      description: 'Máy đẹp như mới, không trầy xước, pin 98%, full box với đầy đủ phụ kiện chính hãng.',
      price: 18500000,
      originalPrice: 32000000,
      category: 'Điện tử',
      condition: 'NEW' as const,
      location: 'Hà Nội',
      images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600'],
      status: 'ACTIVE' as const,
      userId: user.id,
    },
    {
      title: 'MacBook Pro M2 14" 512GB',
      description: 'Laptop còn bảo hành, dùng ít, không lỗi phần cứng.',
      price: 35000000,
      originalPrice: 52000000,
      category: 'Điện tử',
      condition: 'GOOD' as const,
      location: 'TP. HCM',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'],
      status: 'ACTIVE' as const,
      userId: user.id,
    },
    {
      title: 'Ghế Gaming DXRacer Formula Series',
      description: 'Ghế gaming cao cấp, bọc da PU, tay vịn 4D.',
      price: 4500000,
      originalPrice: 8000000,
      category: 'Nội thất',
      condition: 'GOOD' as const,
      location: 'Đà Nẵng',
      images: ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600'],
      status: 'ACTIVE' as const,
      userId: user.id,
    },
  ];

  for (const listing of sampleListings) {
    const existing = await prisma.listing.findFirst({ where: { title: listing.title } });
    if (!existing) {
      await prisma.listing.create({ data: listing });
    }
  }

  console.log('Seed completed!');
  console.log('Admin: admin@reloop.vn / admin123');
  console.log('User: user@reloop.vn / user123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
