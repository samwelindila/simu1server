import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import {
  saveUploadedFiles,
  parseFormArray,
  normalizeImages,
  productForList,
  isBrokenLegacyPath,
} from '../utils/imageStorage.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1500 * 1024, files: 5 },
});

const uploadImages = (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

function parseExistingImages(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return normalizeImages(parsed).filter(img => !isBrokenLegacyPath(img));
  } catch {
    return normalizeImages(parseFormArray(raw)).filter(img => !isBrokenLegacyPath(img));
  }
}

// Public
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products.map(productForList));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    const doc = product.toObject();
    doc.images = normalizeImages(doc.images);
    doc.imageCount = doc.images.length;
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin
router.post('/', protect, uploadImages, async (req, res) => {
  try {
    const { name, price, description, specs, category, inStock, featured } = req.body;
    const images = (await saveUploadedFiles(req.files)).slice(0, 5);
    if (!images.length) {
      return res.status(400).json({ message: 'Add at least one product image' });
    }
    const product = await Product.create({
      name,
      price: Number(price),
      description,
      specs,
      category,
      inStock: inStock === 'true',
      featured: featured === 'true',
      images,
    });
    const doc = product.toObject();
    doc.imageCount = doc.images.length;
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, uploadImages, async (req, res) => {
  try {
    const { name, price, description, specs, category, inStock, featured, existingImages } = req.body;
    const kept = parseExistingImages(existingImages);
    const newImages = await saveUploadedFiles(req.files);
    const images = [...kept, ...newImages].slice(0, 5);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: Number(price),
        description,
        specs,
        category,
        inStock: inStock === 'true',
        featured: featured === 'true',
        images,
      },
      { new: true }
    );
    const doc = product.toObject();
    doc.images = normalizeImages(doc.images);
    doc.imageCount = doc.images.length;
    res.json(doc);
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
