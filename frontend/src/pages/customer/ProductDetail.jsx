import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { mediaUrl } from '../../api/axios.js';
import { ChevronLeft, ChevronRight, Phone, Smartphone, Check } from 'lucide-react';
import StoreNavbar from '../../components/StoreNavbar.jsx';
import StoreFooter from '../../components/StoreFooter.jsx';
import WhatsAppIcon from '../../components/WhatsAppIcon.jsx';
import { WHATSAPP_E164, PHONE_E164, PHONE_DISPLAY } from '../../constants/contact.js';

function normalizeProductImages(images) {
  if (!images) return [];
  const list = Array.isArray(images)
    ? images
    : typeof images === 'string' && images
      ? [images]
      : [];
  return list.filter(img => img && !img.startsWith('/uploads/'));
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFullDetails, setShowFullDetails] = useState(false);

  useEffect(() => {
    setLoading(true);
    setImgIndex(0);
    setShowFullDetails(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    api.get(`/api/products/${id}`)
      .then(r => setProduct(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
        <StoreNavbar backTo="/" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Smartphone size={48} className="text-slate-200" />
        <p className="font-display">Product not found</p>
        <Link to="/" className="btn-primary">Back to Store</Link>
      </div>
    );
  }

  const images = normalizeProductImages(product.images);
  const waMessage = `Habari! Nataka kuorder: *${product.name}*\nBei: TZS ${Number(product.price).toLocaleString()}\n\nNaomba maelezo zaidi.`;
  const specLines = product.specs?.split('\n').filter(Boolean) || [];
  const hasLongDescription = (product.description?.length || 0) > 120;
  const hasManySpecs = specLines.length > 4;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <StoreNavbar backTo="/" />

      <div className="max-w-5xl mx-auto w-full px-4 py-5 sm:py-8 flex-1 animate-slide-from-top">
        {/* Breadcrumb */}
        <nav className="text-xs font-body text-slate-400 mb-4 flex items-center gap-1.5">
          <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-600">{product.category}</span>
          <span>/</span>
          <span className="text-slate-800 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[minmax(0,380px)_1fr] gap-6 lg:gap-8 items-start">
          {/* Gallery */}
          <div className="w-full max-w-[320px] sm:max-w-[380px] mx-auto lg:mx-0">
            <div className="relative panel overflow-hidden aspect-square w-full">
              {images.length > 0 ? (
                <>
                  <img src={mediaUrl(images[imgIndex])} alt={product.name} className="w-full h-full object-contain bg-slate-50 p-3" />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-slate-700 p-2 rounded-full shadow-md border border-slate-100 transition-all hover:scale-105"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setImgIndex(i => (i + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-slate-700 p-2 rounded-full shadow-md border border-slate-100 transition-all hover:scale-105"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-brand-500 w-4' : 'bg-white/70'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-100 bg-slate-50">
                  <Smartphone size={48} strokeWidth={1} />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <>
                <p className="text-center text-xs text-slate-400 mt-2 font-body">
                  {imgIndex + 1} / {images.length} · tap thumbnails to switch
                </p>
                <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide justify-center lg:justify-start pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImgIndex(i)}
                      className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-brand-500 ring-1 ring-brand-100' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={mediaUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="section-label mb-2">{product.category}</p>
            <h1 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="font-display font-bold text-xl sm:text-2xl text-brand-500">
                TZS {Number(product.price).toLocaleString()}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-display font-semibold ${product.inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {product.inStock && <Check size={12} />}
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {(product.description || specLines.length > 0) && (
              <div className="mb-4 panel p-3 sm:p-4">
                {product.description && (
                  <div className="mb-3 last:mb-0">
                    <h3 className="font-display font-semibold text-slate-800 text-xs mb-1">Description</h3>
                    <p className={`text-slate-500 font-body text-xs leading-relaxed whitespace-pre-wrap ${!showFullDetails && hasLongDescription ? 'line-clamp-2' : ''}`}>
                      {product.description}
                    </p>
                  </div>
                )}

                {specLines.length > 0 && (
                  <div>
                    <h3 className="font-display font-semibold text-slate-800 text-xs mb-1.5">Specifications</h3>
                    <ul className="space-y-1">
                      {(showFullDetails ? specLines : specLines.slice(0, 4)).map((line, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 font-body">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-brand-400 shrink-0" />
                          {line}
                        </li>
                      ))}
                    </ul>
                    {!showFullDetails && hasManySpecs && (
                      <p className="text-[11px] text-slate-400 mt-1">+{specLines.length - 4} more</p>
                    )}
                  </div>
                )}

                {(hasLongDescription || hasManySpecs) && (
                  <button
                    type="button"
                    onClick={() => setShowFullDetails(v => !v)}
                    className="mt-2 text-xs font-display font-semibold text-brand-500 hover:text-brand-700 transition-colors"
                  >
                    {showFullDetails ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}

            <div className="mt-auto space-y-2.5 lg:sticky lg:top-20">
              <a
                href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Order via WhatsApp
              </a>
              <a
                href={`tel:+${PHONE_E164}`}
                className="flex items-center justify-center gap-2 w-full btn-outline py-2.5 rounded-xl text-sm"
              >
                <Phone size={15} /> Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </div>

      <StoreFooter />
    </div>
  );
}
