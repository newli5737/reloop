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
      address: 'Quận Cầu Giấy, Hà Nội',
    },
  });

  const sellerPassword = await bcrypt.hash('seller123', 10);
  const seller = await prisma.user.upsert({
    where: { email: 'seller@reloop.vn' },
    update: {},
    create: {
      email: 'seller@reloop.vn',
      password: sellerPassword,
      name: 'Trần Thị B',
      role: 'USER',
      phone: '0987654321',
      address: 'Quận 1, TP. HCM',
      verificationStatus: 'VERIFIED',
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
    {
      title: 'Áo khoác Uniqlo Ultra Light Down',
      description: 'Size M, màu đen, mặc vài lần, còn rất mới.',
      price: 650000,
      originalPrice: 1290000,
      category: 'Thời trang',
      condition: 'GOOD' as const,
      location: 'Hà Nội',
      images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600'],
      status: 'ACTIVE' as const,
      userId: seller.id,
    },
    {
      title: 'Bộ sách Doraemon tập 1-45',
      description: 'Bộ truyện tranh Doraemon bản in đẹp, đọc cẩn thận, không rách.',
      price: 850000,
      originalPrice: 1500000,
      category: 'Sách',
      condition: 'FAIR' as const,
      location: 'Hải Phòng',
      images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600'],
      status: 'ACTIVE' as const,
      userId: seller.id,
    },
    {
      title: 'PlayStation 5 Slim 1TB',
      description: 'Máy chơi game PS5 Slim, kèm 2 tay cầm DualSense, còn bảo hành.',
      price: 11500000,
      originalPrice: 14500000,
      category: 'Đồ chơi',
      condition: 'GOOD' as const,
      location: 'TP. HCM',
      images: ['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600'],
      status: 'ACTIVE' as const,
      userId: seller.id,
    },
    {
      title: 'Xe đạp thể thao Giant Escape 3',
      description: 'Xe đạp size M, bánh 700c, phanh đĩa cơ, phù hợp đi phố.',
      price: 5200000,
      originalPrice: 8900000,
      category: 'Xe cộ',
      condition: 'GOOD' as const,
      location: 'Cần Thơ',
      images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600'],
      status: 'ACTIVE' as const,
      userId: user.id,
    },
    {
      title: 'Vợt cầu lông Yonex Astrox 77 Pro',
      description: 'Vợt cầu lông chính hãng Yonex, căng 26lbs, ít sử dụng.',
      price: 2800000,
      originalPrice: 4200000,
      category: 'Thể thao',
      condition: 'GOOD' as const,
      location: 'Đà Nẵng',
      images: ['https://images.unsplash.com/photo-1721760886713-1ab0c5045bf7?w=600'],
      status: 'ACTIVE' as const,
      userId: seller.id,
    },
    {
      title: 'Máy pha cà phê DeLonghi cũ',
      description: 'Máy pha espresso gia đình, hoạt động tốt, kèm phụ kiện cơ bản.',
      price: 1200000,
      originalPrice: 3500000,
      category: 'Khác',
      condition: 'FAIR' as const,
      location: 'Hà Nội',
      images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'],
      status: 'ACTIVE' as const,
      userId: user.id,
    },
    {
      title: 'Samsung Galaxy Tab S9 FE',
      description: 'Máy tính bảng còn bảo hành, kèm bút S Pen và ốp lưng.',
      price: 7800000,
      originalPrice: 10900000,
      category: 'Điện tử',
      condition: 'NEW' as const,
      location: 'TP. HCM',
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'],
      status: 'PENDING' as const,
      userId: seller.id,
    },
    {
      title: 'Tủ quần áo gỗ công nghiệp 1m6',
      description: 'Tủ 3 cánh, màu trắng sồi, tình trạng tốt, tự lắp đặt.',
      price: 1800000,
      originalPrice: 3200000,
      category: 'Nội thất',
      condition: 'FAIR' as const,
      location: 'Bình Dương',
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
      status: 'SOLD' as const,
      userId: user.id,
    },
  ];

  const listings = [];
  for (const listing of sampleListings) {
    const existing = await prisma.listing.findFirst({ where: { title: listing.title } });
    if (existing) {
      listings.push(
        await prisma.listing.update({
          where: { id: existing.id },
          data: { images: listing.images },
        }),
      );
    } else {
      listings.push(await prisma.listing.create({ data: listing }));
    }
  }

  const iphone = listings.find((l) => l.title === 'iPhone 13 Pro Max 256GB');
  if (iphone) {
    const commentExists = await prisma.comment.findFirst({
      where: { listingId: iphone.id, content: 'Máy còn bảo hành Apple không bạn?' },
    });
    if (!commentExists) {
      await prisma.comment.create({
        data: {
          content: 'Máy còn bảo hành Apple không bạn?',
          listingId: iphone.id,
          userId: seller.id,
        },
      });
    }

    const replyExists = await prisma.comment.findFirst({
      where: { listingId: iphone.id, content: 'Còn bảo hành đến tháng 12/2026 nhé!' },
    });
    if (!replyExists) {
      await prisma.comment.create({
        data: {
          content: 'Còn bảo hành đến tháng 12/2026 nhé!',
          listingId: iphone.id,
          userId: user.id,
        },
      });
    }

    const conversation = await prisma.conversation.upsert({
      where: { listingId_buyerId: { listingId: iphone.id, buyerId: seller.id } },
      update: {},
      create: {
        listingId: iphone.id,
        buyerId: seller.id,
        sellerId: user.id,
      },
    });

    const messageSeeds = [
      { senderId: seller.id, content: 'Chào bạn, iPhone này còn không ạ?' },
      { senderId: user.id, content: 'Dạ còn bạn nhé, máy zin 100%.' },
      { senderId: seller.id, content: 'Bạn có thể giảm thêm 500k được không?' },
    ];

    for (const msg of messageSeeds) {
      const exists = await prisma.message.findFirst({
        where: { conversationId: conversation.id, content: msg.content },
      });
      if (!exists) {
        await prisma.message.create({
          data: { conversationId: conversation.id, ...msg },
        });
      }
    }
  }

  console.log('Seed completed!');
  console.log('Admin:  admin@reloop.vn  / admin123');
  console.log('User:   user@reloop.vn   / user123');
  console.log('Seller: seller@reloop.vn / seller123');
  console.log(`Listings: ${listings.length} items across 8 categories`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
