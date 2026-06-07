import { Phone, Instagram, Mail, MapPin } from 'lucide-react';
import Logo from './Logo.jsx';
import WhatsAppIcon from './WhatsAppIcon.jsx';
import { WHATSAPP_E164, WHATSAPP_DISPLAY, PHONE_E164, PHONE_DISPLAY } from '../constants/contact.js';

export default function StoreFooter() {
  return (
    <footer className="bg-slate-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="inline-flex items-center justify-center bg-white rounded-xl p-2 mb-4">
              <Logo size="md" />
            </div>
            <p className="text-slate-400 text-sm font-body leading-relaxed">
              Your trusted phone shop in Dar es Salaam. Genuine devices, fair prices, fast delivery.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-3">Contact</h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li>
                <a href={`https://wa.me/${WHATSAPP_E164}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors">
                  <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`tel:+${PHONE_E164}`} className="flex items-center gap-2 text-slate-400 hover:text-brand-300 transition-colors">
                  <Phone size={14} /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href="mailto:simu1@gmail.com" className="flex items-center gap-2 text-slate-400 hover:text-brand-300 transition-colors">
                  <Mail size={14} /> simu1@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} /> Dar es Salaam, Tanzania
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-3">Follow Us</h4>
            <a href="https://instagram.com/simuone_tz" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors text-sm font-body">
              <Instagram size={14} /> @simuone_tz
            </a>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-center text-slate-600 text-xs font-body">
          © {new Date().getFullYear()} Simu1. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
