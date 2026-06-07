import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  specs: { type: String, default: '' },
  category: { type: String, default: 'Smartphones' },
  images: [{ type: String }],
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
