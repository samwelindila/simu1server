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

dotenv.config();
dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;

// MongoDB: use mongodb:// (not mongodb+srv) on Windows to avoid SRV DNS failures
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedAdmin();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

// Seed admin
async function seedAdmin() {
  try {
    const { default: User } = await import('./models/User.js');
    const bcrypt = await import('bcryptjs');
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existing) {
      const hash = await bcrypt.default.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({ email: process.env.ADMIN_EMAIL, password: hash });
      console.log('✅ Admin seeded:', process.env.ADMIN_EMAIL);
    }
  } catch (err) {
    console.error('❌ Admin seed error:', err.message);
  }
}
