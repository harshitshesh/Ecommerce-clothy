/**
 * Account Page — User account portal with profile, address book, and notifications
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Bell, Package, Heart, LogOut, Trash2, Plus, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import AddressForm from '../components/features/AddressForm';
import useUserStore from '../store/useUserStore';

export default function Account() {
  const {
    user,
    isLoggedIn,
    login,
    logout,
    addresses,
    addAddress,
    removeAddress,
    notifications,
    markNotificationRead,
  } = useUserStore();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses', 'notifications'
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loginName, setLoginName] = useState('Arjun Mehta');
  const [loginEmail, setLoginEmail] = useState('arjun@example.com');

  if (!isLoggedIn) {
    return (
      <div className="pt-28 pb-20 container-custom max-w-md mx-auto">
        <div className="bg-cream dark:bg-charcoal p-8 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-card text-center">
          <div className="w-14 h-14 rounded-full bg-gold/15 text-gold mx-auto flex items-center justify-center mb-4">
            <User size={24} />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream mb-2">
            Patron Sign In
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            Enter your credentials to access your orders, personal sizing notes, and private privileges.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(loginName, loginEmail);
              toast.success(`Welcome, ${loginName}!`);
            }}
            className="space-y-4 text-xs text-left"
          >
            <div>
              <label className="block font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-soft"
            >
              Sign In to Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: 'My Account' }]} />
        </div>

        {/* User Card Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gold"
            />
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
                {user?.name}
              </h1>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <p className="text-[11px] text-gold font-medium mt-0.5">
                Patron Member since {user?.joinedDate || '2026'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              toast.success('Signed out successfully');
            }}
            className="px-4 py-2 text-xs font-semibold text-error hover:bg-error/10 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar (Col 3) */}
          <div className="lg:col-span-3 bg-cream dark:bg-charcoal p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors flex items-center gap-3 ${
                activeTab === 'profile'
                  ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-cream-dark dark:hover:bg-gray-800'
              }`}
            >
              <User size={16} /> Profile Overview
            </button>

            <Link
              to="/account/orders"
              className="w-full text-left px-4 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
            >
              <Package size={16} /> Order History
            </Link>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors flex items-center gap-3 ${
                activeTab === 'addresses'
                  ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-cream-dark dark:hover:bg-gray-800'
              }`}
            >
              <MapPin size={16} /> Saved Destinations ({addresses.length})
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-between ${
                activeTab === 'notifications'
                  ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-cream-dark dark:hover:bg-gray-800'
              }`}
            >
              <span className="flex items-center gap-3">
                <Bell size={16} /> Notifications
              </span>
              {notifications.some((n) => !n.read) && (
                <span className="w-2 h-2 rounded-full bg-gold" />
              )}
            </button>

            <Link
              to="/wishlist"
              className="w-full text-left px-4 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
            >
              <Heart size={16} /> Saved Wardrobe
            </Link>
          </div>

          {/* Main Content Area (Col 9) */}
          <div className="lg:col-span-9 bg-cream dark:bg-charcoal p-6 sm:p-8 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card">
            {/* Tab 1: Profile Overview */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-serif font-bold text-xl text-charcoal dark:text-cream pb-3 border-b border-gray-200/60 dark:border-gray-800">
                  Patron Profile
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-cream-dark/30 dark:bg-charcoal-light/20 border border-gray-200/50 dark:border-gray-800">
                    <span className="text-gray-400 block mb-1">Full Legal Name</span>
                    <span className="font-semibold text-charcoal dark:text-cream text-sm">{user.name}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-cream-dark/30 dark:bg-charcoal-light/20 border border-gray-200/50 dark:border-gray-800">
                    <span className="text-gray-400 block mb-1">Email Destination</span>
                    <span className="font-semibold text-charcoal dark:text-cream text-sm">{user.email}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-cream-dark/30 dark:bg-charcoal-light/20 border border-gray-200/50 dark:border-gray-800">
                    <span className="text-gray-400 block mb-1">Tier Status</span>
                    <span className="font-semibold text-gold text-sm">Privilege Atelier Gold</span>
                  </div>
                  <div className="p-4 rounded-xl bg-cream-dark/30 dark:bg-charcoal-light/20 border border-gray-200/50 dark:border-gray-800">
                    <span className="text-gray-400 block mb-1">Security Status</span>
                    <span className="font-semibold text-success text-sm flex items-center gap-1">
                      <ShieldCheck size={14} /> Two-Factor Enabled
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200/60 dark:border-gray-800">
                  <h3 className="font-serif font-bold text-base text-charcoal dark:text-cream mb-3">
                    Recent Activity
                  </h3>
                  <p className="text-xs text-gray-500">
                    Your order history and tailoring preferences are securely stored. You can review all orders or print invoices at any time.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 dark:border-gray-800">
                  <div>
                    <h2 className="font-serif font-bold text-xl text-charcoal dark:text-cream">
                      Saved Destinations
                    </h2>
                    <p className="text-xs text-gray-500">
                      Manage shipping addresses for swift one-click checkout
                    </p>
                  </div>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-4 py-2 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add Address
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <div className="p-5 rounded-2xl bg-cream-dark/30 dark:bg-charcoal-light/20 border border-gold/30">
                    <AddressForm
                      onSubmit={(data) => {
                        addAddress(data);
                        setShowAddressForm(false);
                        toast.success('Address added to book!');
                      }}
                      onCancel={() => setShowAddressForm(false)}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs text-charcoal dark:text-cream">
                              {addr.name}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-charcoal text-cream dark:bg-cream dark:text-charcoal px-2 py-0.5 rounded font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                            {addr.line1}, {addr.line2 && `${addr.line2}, `}
                            {addr.city}, {addr.state} — {addr.pin}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">Phone: {addr.phone}</p>
                        </div>

                        <div className="pt-4 mt-3 border-t border-gray-200/40 dark:border-gray-700 flex justify-end">
                          <button
                            onClick={() => {
                              removeAddress(addr.id);
                              toast.success('Address removed');
                            }}
                            className="text-xs text-error hover:underline flex items-center gap-1"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h2 className="font-serif font-bold text-xl text-charcoal dark:text-cream pb-3 border-b border-gray-200/60 dark:border-gray-800">
                  Concierge Notifications
                </h2>

                <div className="divide-y divide-gray-200/50 dark:divide-gray-800">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-colors ${
                        notif.read
                          ? 'opacity-70 hover:opacity-100'
                          : 'bg-gold/5 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-charcoal dark:text-cream">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-gray-400">{notif.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
