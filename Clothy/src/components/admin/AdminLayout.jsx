/**
 * AdminLayout — Staff command center layout with dedicated sidebar navigation
 * Visually consistent with Clozari's stone/cream/charcoal/gold tokens
 */
import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  RefreshCw,
  Tag,
  Users,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAdminAuthStore from '../../store/useAdminAuthStore';
import useUIStore from '../../store/useUIStore';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/exchanges', label: 'Exchanges & Returns', icon: RefreshCw },
  { path: '/admin/offers', label: 'Offers & Coupons', icon: Tag },
  { path: '/admin/customers', label: 'Customers', icon: Users },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAdminAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out of Admin Portal');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-cream-dark/30 dark:bg-charcoal text-charcoal dark:text-cream">
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-cream/95 dark:bg-charcoal/95 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-charcoal dark:text-cream"
            aria-label="Toggle menu"
          >
            {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold tracking-wider">CLOZARI</span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-gray-500 hover:text-gold"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl text-gray-500 hover:text-gold"
            title="View Store"
          >
            <ExternalLink size={18} />
          </Link>
        </div>
      </header>

      {/* Backdrop for mobile */}
      {isMobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 w-64 bg-cream dark:bg-charcoal-light border-r border-gray-200/60 dark:border-gray-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Brand */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200/50 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-widest text-charcoal dark:text-cream">
                  CLOZARI
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                  Staff
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Management Portal</p>
            </div>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-charcoal dark:hover:text-cream"
            >
              <X size={18} />
            </button>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal shadow-soft font-bold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-gold' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-5 border-t border-gray-200/50 dark:border-gray-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gold hover:bg-gold/5 transition-colors border border-gray-200/60 dark:border-gray-700/60"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-gold" />
              <span>Live Storefront</span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono">public ↗</span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center font-bold text-xs shrink-0 border border-gold/30">
                <Shield size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-charcoal dark:text-cream truncate">
                  {admin?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-gray-400 truncate">{admin?.email || 'admin@clozari.com'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-error transition-colors rounded-lg"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0">
        <div className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
