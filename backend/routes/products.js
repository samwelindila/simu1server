import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const uploadImages = (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

// Public
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin
router.post('/', protect, uploadImages, async (req, res) => {
  try {
    const { name, price, description, specs, category, inStock, featured } = req.body;
    const images = req.files?.map(f => `/uploads/${f.filename}`) || [];
    const product = await Product.create({
      name, price: Number(price), description, specs, category,
      inStock: inStock === 'true', featured: featured === 'true', images
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, uploadImages, async (req, res) => {
  try {
    const { name, price, description, specs, category, inStock, featured, existingImages } = req.body;
    const newImages = req.files?.map(f => `/uploads/${f.filename}`) || [];
    const kept = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : [];
    const images = [...kept, ...newImages];
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price: Number(price), description, specs, category, inStock: inStock === 'true', featured: featured === 'true', images },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
