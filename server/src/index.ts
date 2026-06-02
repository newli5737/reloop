import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import adminRoutes from './routes/admin.js';
import commentRoutes from './routes/comments.js';
import messageRoutes from './routes/messages.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file ảnh'));
  },
});

const corsOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://reloop.dosutech.site',
  'https://reloop.dosutech.site',
  'http://api-reloop.dosutech.site',
  'https://api-reloop.dosutech.site',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

app.post('/api/upload', upload.array('images', 8), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) {
    return res.status(400).json({ error: 'Không có file nào được tải lên' });
  }
  const urls = files.map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/listings', commentRoutes);
app.use('/api/conversations', messageRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
