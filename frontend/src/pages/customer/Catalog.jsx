import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { asArray, mediaUrl } from '../../api/axios.js';
import { Search, Smartphone, Headphones, Zap, Shield, Package, Tablet, Truck, BadgeCheck, MessageCircle, Star } from 'lucide-react';
import StoreNavbar from '../../components/StoreNavbar.jsx';
import StoreFooter from '../../components/StoreFooter.jsx';
import WhatsAppIcon from '../../components/WhatsAppIcon.jsx';

const WHATSAPP = '255613374380';

const CATEGORY_ICONS = {
  Smartphones: Smartphone,
  Accessories: Headphones,
  Tablets: Tablet,
  Earphones: Headphones,
  Chargers: Zap,
  'Cases & Covers': Shield,
  Other: Package,
  All: Package,
};

const TRUST = [
  { icon: BadgeCheck, label: 'Genuine Products' },
  { icon: Truck, label: 'Fast Delivery' },
  { icon: MessageCircle, label: 'WhatsApp Support' },
];

const PRODUCT_GRID = 'products-grid';

function ProductCard({ product, featured = false, index = 0 }) {
  const img = product.images?.[0];
  const imgSrc = mediaUrl(img);
  return (
    <Link
      to={`/product/${product._id}`}
      className={`product-card group flex flex-col h-full animate-card-in ${featured ? 'ring-2 ring-[#1d6ff2]/30' : ''}`}
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
    >
      <div className="relative bg-slate-50 overflow-hidden aspect-square w-full">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
            <Smartphone size={36} strokeWidth={1.5} className="sm:w-10 sm:h-10" />
          </div>
        )}
        {!product.inStock && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-display font-bold uppercase tracking-wide px-2 py-0.5 sm:py-1 rounded-md shadow-sm">
            Sold Out
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2 right-2 bg-amber-400 text-amber-950 text-[10px] sm:text-xs font-display font-bold uppercase tracking-wide px-2 py-0.5 sm:py-1 rounded-md flex items-center gap-0.5 shadow-sm">
            <Star size={10} fill="currentColor" /> Featured
          </span>
        )}
      </div>
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 min-h-[5.5rem] sm:min-h-[6rem]">
        <p className="section-label mb-1 text-[10px] sm:text-xs truncate">{product.category}</p>
        <h3 className="font-display font-semibold text-slate-800 text-sm sm:text-base leading-snug mb-2 group-hover:text-[#1d6ff2] transition-colors line-clamp-2 flex-1">
          {product.name}
        </h3>
        <p className="font-display font-bold text-[#1d6ff2] text-base sm:text-lg leading-none">
          TZS {Number(product.price).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function ProductSkeleton({ index = 0 }) {
  return (
    <div
      className="product-card animate-pulse"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="aspect-square bg-slate-100" />
      <div className="p-3 space-y-2.5">
        <div className="h-2.5 bg-slate-100 rounded w-2/5" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-3/5" />
      </div>
    </div>
  );
}

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/categories')
      .then(r => setCategories(asArray(r.data).length ? asArray(r.data) : ['All']))
      .catch(() => setCategories(['All']));
    fetchProducts();
  }, []);

  useEffect(() => { fetchProducts(); }, [activeCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = activeCategory !== 'All' ? { category: activeCategory } : {};
      const r = await api.get('/api/products', { params });
      setProducts(asArray(r.data));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const featured = activeCategory === 'All' && !search
    ? products.filter(p => p.featured).slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <StoreNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a2463] via-[#0d47a1] to-[#1d6ff2]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-24 w-80 h-80 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          <p className="text-white/80 font-display text-xs uppercase tracking-[0.2em] mb-3">Dar es Salaam, Tanzania</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white mb-4 leading-tight max-w-2xl mx-auto drop-shadow-md">
            Premium Phones &amp; Accessories
          </h2>
          <p className="text-white/90 font-body text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
            Browse our collection and order directly via WhatsApp. Genuine products, fair prices, delivered fast.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search phones, tablets, accessories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/95 backdrop-blur border-0 rounded-2xl pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none font-body text-sm shadow-xl focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-6 sm:gap-12">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-slate-600">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-500">
                <Icon size={16} />
              </div>
              <span className="text-sm font-display font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {categories.map(cat => {
              const Icon = CATEGORY_ICONS[cat] || Package;
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full font-display text-sm font-semibold transition-all border ${
                    active
                      ? 'bg-[#1d6ff2] text-white border-[#1d6ff2] shadow-md ring-2 ring-[#1d6ff2]/25'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-[#1d6ff2] hover:text-[#1d6ff2]'
                  }`}
                >
                  <Icon size={14} />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8 pb-24 sm:pb-8">
        {/* Featured */}
        {featured.length > 0 && (
          <section className="mb-10 animate-fade-in">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="section-label mb-1">Top Picks</p>
                <h3 className="font-display font-bold text-xl text-slate-900">Featured Products</h3>
              </div>
            </div>
            <div className={PRODUCT_GRID}>
              {featured.map((p, i) => <ProductCard key={p._id} product={p} featured index={i} />)}
            </div>
          </section>
        )}

        {/* All products */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="section-label mb-1">Shop</p>
              <h3 className="font-display font-bold text-xl text-slate-900">
                {activeCategory === 'All' ? 'All Products' : activeCategory}
              </h3>
            </div>
            {!loading && (
              <span className="text-xs text-slate-400 font-body bg-slate-100 px-3 py-1 rounded-full">
                {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <div className={PRODUCT_GRID}>
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} index={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="panel text-center py-20 px-6">
              <Package size={48} className="mx-auto mb-4 text-slate-200" strokeWidth={1.5} />
              <p className="font-display text-lg text-slate-700 mb-1">No products found</p>
              <p className="text-sm text-slate-400 font-body">Try a different category or search term</p>
            </div>
          ) : (
            <div className={PRODUCT_GRID}>
              {filtered.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </section>
      </main>

      <StoreFooter />

      {/* Mobile WhatsApp FAB */}
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 sm:hidden flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
    </div>
  );
}
