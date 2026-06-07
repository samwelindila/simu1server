import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, Package, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import Logo from '../../components/Logo.jsx';

export default function AdminLayout() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${
      isActive
        ? 'bg-brand-500 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const sidebar = (
    <>
      <div className="p-5 border-b border-slate-100">
        <Logo size="md" />
        <p className="text-xs text-slate-400 font-body mt-2">Admin Panel</p>
      </div>
      <nav className="p-3 flex-1 space-y-1">
        <NavLink to="/admin" end className={navClass} onClick={() => setSidebarOpen(false)}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={navClass} onClick={() => setSidebarOpen(false)}>
          <Package size={16} /> Products
        </NavLink>
      </nav>
      <div className="p-3 border-t border-slate-100 space-y-1">
        {admin?.email && (
          <p className="px-3 py-2 text-xs text-slate-400 font-body truncate">{admin.email}</p>
        )}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-display font-semibold text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <ExternalLink size={16} /> View Store
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-display font-semibold text-sm text-red-500 hover:text-white hover:bg-red-500 transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-slate-200 flex-col fixed h-full shadow-nav text-slate-800">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-white h-full flex flex-col shadow-xl animate-slide-up text-slate-800">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700">
              <X size={20} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between shadow-nav">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
          <Logo size="sm" />
          <div className="w-9" />
        </header>

        <main className="flex-1 p-5 sm:p-8 max-w-5xl text-slate-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
