import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import imageRoutes from './routes/images.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Simu1 Backend API is running',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/images', imageRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDb();
});

async function connectDb() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log('✅ MongoDB connected');
    await seedAdmin();
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
    console.error('Check Atlas Network Access allows 0.0.0.0/0 and MONGO_URI on Render');
  }
}

async function seedAdmin() {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.log('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set');
      return;
    }

    const { default: User } = await import('./models/User.js');
    const bcrypt = await import('bcryptjs');

    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existing) {
      const hash = await bcrypt.default.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({ email: process.env.ADMIN_EMAIL, password: hash });
      console.log(`✅ Admin seeded: ${process.env.ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error('❌ Admin seed error:', err.message);
  }
}
