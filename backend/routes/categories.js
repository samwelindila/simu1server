import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(['All', ...categories]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
