import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { asArray } from '../../api/axios.js';
import { Package, Star, AlertCircle, Plus, ArrowUpRight } from 'lucide-react';

function StatCard({ icon: Icon, label, value, accent }) {
  const accents = {
    blue: 'bg-brand-50 text-brand-500',
    amber: 'bg-amber-50 text-amber-500',
    red: 'bg-red-50 text-red-500',
  };
  return (
    <div className="panel p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
      <div className={`p-3 rounded-xl ${accents[accent]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-body uppercase tracking-wide">{label}</p>
        <p className="font-display font-bold text-3xl text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, featured: 0, outOfStock: 0 });

  useEffect(() => {
    api.get('/api/products').then(r => {
      const products = asArray(r.data);
      setStats({
        total: products.length,
        featured: products.filter(p => p.featured).length,
        outOfStock: products.filter(p => !p.inStock).length,
      });
    });
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <p className="section-label mb-1">Overview</p>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">Dashboard</h2>
        <p className="text-slate-500 font-body text-sm mt-1">Welcome back — here's your store at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Package} label="Total Products" value={stats.total} accent="blue" />
        <StatCard icon={Star} label="Featured" value={stats.featured} accent="amber" />
        <StatCard icon={AlertCircle} label="Out of Stock" value={stats.outOfStock} accent="red" />
      </div>

      <div className="panel p-6">
        <h3 className="font-display font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products/new" className="btn-primary">
            <Plus size={16} /> Add Product
          </Link>
          <Link to="/admin/products" className="btn-outline">
            Manage Products
          </Link>
          <a href="/" target="_blank" rel="noreferrer" className="btn-ghost">
            View Store <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
