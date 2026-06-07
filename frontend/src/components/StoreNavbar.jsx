import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { LogoLink } from './Logo.jsx';

const WHATSAPP = '255613374380';

export default function StoreNavbar({ backTo }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-nav">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {backTo ? (
          <>
            <Link to={backTo} className="btn-ghost shrink-0 -ml-2 text-sm text-slate-700">
              ← Back
            </Link>
            <LogoLink to="/" size="sm" className="ml-auto" />
          </>
        ) : (
          <>
            <LogoLink to="/" size="md" showTagline />
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-display font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md shrink-0"
            >
              <Phone size={15} />
              <span className="hidden sm:inline">WhatsApp Us</span>
              <span className="sm:hidden">Chat</span>
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
