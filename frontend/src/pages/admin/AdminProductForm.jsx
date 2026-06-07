import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, X, Upload, ImagePlus } from 'lucide-react';

const CATEGORIES = ['Smartphones', 'Accessories', 'Tablets', 'Earphones', 'Chargers', 'Cases & Covers', 'Other'];

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '', price: '', description: '', specs: '',
    category: 'Smartphones', inStock: true, featured: false,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/products/${id}`).then(r => {
        const p = r.data;
        setForm({
          name: p.name, price: p.price, description: p.description || '',
          specs: p.specs || '', category: p.category, inStock: p.inStock, featured: p.featured,
        });
        setExistingImages(p.images || []);
      });
    }
  }, [id]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeExisting = (img) => setExistingImages(prev => prev.filter(i => i !== img));
  const removeNew = (idx) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, typeof v === 'boolean' ? String(v) : v);
      });
      existingImages.forEach(img => fd.append('existingImages', img));
      newFiles.forEach(file => fd.append('images', file));

      if (isEdit) {
        await axios.put(`/api/products/${id}`, fd);
        toast.success('Product updated!');
      } else {
        await axios.post('/api/products', fd);
        toast.success('Product added!');
      }
      navigate('/admin/products');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save product';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <button onClick={() => navigate('/admin/products')} className="btn-ghost -ml-2 mb-6">
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div className="mb-8">
        <p className="section-label mb-1">{isEdit ? 'Edit' : 'Create'}</p>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="panel p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImagePlus size={18} className="text-brand-500" />
            <h3 className="font-display font-semibold text-slate-900">Product Images</h3>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            {existingImages.map(img => (
              <div key={img} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExisting(img)}
                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            ))}
            {previews.map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-brand-300 group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            ))}
            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-400 hover:bg-brand-50 flex flex-col items-center justify-center cursor-pointer transition-all text-slate-400 hover:text-brand-500">
              <Upload size={20} />
              <span className="text-[10px] mt-1 font-display font-semibold">Add</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            </label>
          </div>
          <p className="text-xs text-slate-400 font-body">Up to 5 images. Hover to remove.</p>
        </div>

        {/* Details */}
        <div className="panel p-6 space-y-5">
          <h3 className="font-display font-semibold text-slate-900">Product Details</h3>

          <div>
            <label className="text-sm text-slate-600 font-body font-medium mb-1.5 block">Product Name *</label>
            <input
              type="text" required value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input-field" placeholder="e.g. Samsung Galaxy A55"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600 font-body font-medium mb-1.5 block">Price (TZS) *</label>
              <input
                type="number" required min="0" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                className="input-field" placeholder="850000"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 font-body font-medium mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="input-field"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-600 font-body font-medium mb-1.5 block">Description</label>
            <textarea
              rows={3} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input-field resize-none" placeholder="Brief product description..."
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 font-body font-medium mb-1.5 block">Specifications</label>
            <textarea
              rows={4} value={form.specs}
              onChange={e => setForm(f => ({ ...f, specs: e.target.value }))}
              className="input-field resize-none font-mono text-xs"
              placeholder={'RAM: 8GB\nStorage: 256GB\nBattery: 5000mAh\nCamera: 50MP'}
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox" checked={form.inStock}
                onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))}
                className="w-4 h-4 rounded accent-brand-500"
              />
              <span className="text-sm text-slate-600 font-body group-hover:text-slate-900">In Stock</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox" checked={form.featured}
                onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 rounded accent-brand-500"
              />
              <span className="text-sm text-slate-600 font-body group-hover:text-slate-900">Featured Product</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3.5">
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline sm:px-8 py-3.5">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
