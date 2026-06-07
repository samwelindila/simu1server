import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus, Package, Star } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/products');
      setProducts(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="section-label mb-1">Inventory</p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">Products</h2>
          <p className="text-slate-500 font-body text-sm mt-1">{products.length} products in your store</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary shrink-0">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="panel h-20 animate-pulse bg-slate-50" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="panel text-center py-20 px-6">
          <Package size={48} className="mx-auto mb-4 text-slate-200" strokeWidth={1.5} />
          <p className="font-display text-lg text-slate-700 mb-1">No products yet</p>
          <p className="text-sm text-slate-400 font-body mb-6">Add your first product to get started</p>
          <Link to="/admin/products/new" className="btn-primary">
            <Plus size={16} /> Add First Product
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="panel overflow-hidden hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left p-4 text-slate-500 font-body text-xs font-semibold uppercase tracking-wide">Product</th>
                  <th className="text-left p-4 text-slate-500 font-body text-xs font-semibold uppercase tracking-wide">Category</th>
                  <th className="text-left p-4 text-slate-500 font-body text-xs font-semibold uppercase tracking-wide">Price</th>
                  <th className="text-left p-4 text-slate-500 font-body text-xs font-semibold uppercase tracking-wide">Status</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-display font-semibold text-slate-800 text-sm">{p.name}</p>
                          {p.featured && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-display font-semibold">
                              <Star size={10} fill="currentColor" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-body text-sm">{p.category}</td>
                    <td className="p-4 text-brand-500 font-display font-semibold text-sm">
                      TZS {Number(p.price).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-display font-semibold ${p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 justify-end">
                        <Link to={`/admin/products/edit/${p._id}`} className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all">
                          <Pencil size={16} />
                        </Link>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {products.map(p => (
              <div key={p._id} className="panel p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-slate-800 text-sm truncate">{p.name}</p>
                    <p className="text-brand-500 font-display font-bold text-sm mt-0.5">TZS {Number(p.price).toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-slate-400">{p.category}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-display font-semibold ${p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                  <Link to={`/admin/products/edit/${p._id}`} className="btn-outline flex-1 py-2 text-xs">
                    <Pencil size={14} /> Edit
                  </Link>
                  <button onClick={() => handleDelete(p._id, p.name)} className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 font-display font-semibold py-2 rounded-xl text-xs transition-all">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
