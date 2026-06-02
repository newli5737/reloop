# RELOOP

Website trao đổi / mua bán đồ cũ.

## Chạy local

```bash
npm install
cd server && npm install && cp .env.example .env
npx prisma db push && npm run db:seed
cd .. && npm run dev
cd server && npm run dev
```

- Frontend: http://localhost:5174
- Backend: http://localhost:3002
- Admin: http://localhost:5174/admin/login

## Deploy

Xem `deploy/nginx/` và `deploy/ecosystem.config.cjs`.
