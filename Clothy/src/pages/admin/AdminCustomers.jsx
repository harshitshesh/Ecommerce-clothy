/**
 * AdminCustomers (/admin/customers) — Registered user directory
 * Read-only list of patrons, their order count, wallet coins, and addresses
 */
import { useState, useMemo } from 'react';
import {
  Search,
  Coins,
  Eye,
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useOrdersStore from '../../store/useOrdersStore';
import useWalletStore from '../../store/useWalletStore';
import { formatCurrency } from '../../utils/formatCurrency';
import Modal from '../../components/ui/Modal';

export default function AdminCustomers() {
  const users = useAuthStore((s) => s.users);
  const getAllOrders = useOrdersStore((s) => s.getAllAdmin);
  const getWallet = useWalletStore((s) => s.getWallet);

  const allOrders = getAllOrders();

  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Compute enriched customer metrics
  const enrichedCustomers = useMemo(() => {
    return (users || []).map((u) => {
      const userOrders = allOrders.filter((o) => o.userId === u.id);
      const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const wallet = getWallet(u.id);
      const coins = wallet ? wallet.coins : 0;

      return {
        ...u,
        orderCount: userOrders.length,
        totalSpent,
        coins,
        orders: userOrders,
      };
    });
  }, [users, allOrders, getWallet]);

  const filteredCustomers = useMemo(() => {
    return enrichedCustomers.filter((c) => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }, [enrichedCustomers, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60 dark:border-gray-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal dark:text-cream">
            Customer Directory
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Read-only registry of patrons, lifetime spend, order volume, and wallet balances
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">
            {filteredCustomers.length} Registered Account{filteredCustomers.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-cream dark:bg-charcoal-light p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
            <Search size={15} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron name, email, or phone number..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-cream dark:bg-charcoal-light rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-dark/40 dark:bg-charcoal border-b border-gray-200/60 dark:border-gray-800 uppercase tracking-wider text-[10px] text-gray-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">Patron Details</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Wallet Balance</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/40 dark:divide-gray-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No customers found matching the search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gold/5 transition-colors">
                    {/* Name + ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-bold text-xs shrink-0">
                          {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-charcoal dark:text-cream">{c.name}</p>
                          <span className="font-mono text-[10px] text-gray-400">{c.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <p className="text-gray-600 dark:text-gray-300 font-medium">{c.email}</p>
                      <p className="text-[10px] text-gray-400">{c.phone || 'No phone recorded'}</p>
                    </td>

                    {/* Joined */}
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {c.joinedDate || '2026-01-15'}
                    </td>

                    {/* Orders */}
                    <td className="py-3.5 px-4 font-bold text-charcoal dark:text-cream">
                      {c.orderCount} Order{c.orderCount === 1 ? '' : 's'}
                    </td>

                    {/* Spend */}
                    <td className="py-3.5 px-4 font-bold text-charcoal dark:text-cream">
                      {formatCurrency(c.totalSpent)}
                    </td>

                    {/* Wallet Coins */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-gold px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30">
                        <Coins size={12} />
                        {c.coins} Coins
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:border-gold hover:text-gold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={13} /> View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Profile Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={`Patron Profile — ${selectedCustomer.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-cream-dark/30 dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-bold text-base">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal dark:text-cream">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-gray-500 font-mono text-[11px]">{selectedCustomer.email} · {selectedCustomer.phone}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Wallet</span>
                <span className="font-bold text-gold text-sm inline-flex items-center gap-1">
                  <Coins size={13} /> {selectedCustomer.coins} Coins (₹{selectedCustomer.coins})
                </span>
              </div>
            </div>

            {/* Saved Addresses */}
            <div>
              <span className="font-bold text-charcoal dark:text-cream block mb-2">
                Saved Shipping Addresses ({selectedCustomer.addresses?.length || 0}):
              </span>
              {!selectedCustomer.addresses || selectedCustomer.addresses.length === 0 ? (
                <p className="text-gray-400 italic">No addresses saved to patron book yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCustomer.addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-gray-200/60 dark:border-gray-800 bg-cream/40 dark:bg-charcoal/40 space-y-0.5"
                    >
                      <p className="font-bold text-charcoal dark:text-cream">
                        {addr.name} {addr.isDefault && <span className="text-gold text-[10px]">(Default)</span>}
                      </p>
                      <p className="text-gray-500">
                        {addr.line1}, {addr.line2 && `${addr.line2}, `}
                        {addr.city}, {addr.state} — {addr.pin}
                      </p>
                      <p className="text-gray-400 text-[10px]">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Orders */}
            <div>
              <span className="font-bold text-charcoal dark:text-cream block mb-2">
                Recent Orders ({selectedCustomer.orders?.length || 0}):
              </span>
              {!selectedCustomer.orders || selectedCustomer.orders.length === 0 ? (
                <p className="text-gray-400 italic">No orders recorded for this account.</p>
              ) : (
                <div className="divide-y divide-gray-200/40 dark:divide-gray-800 border rounded-xl overflow-hidden">
                  {selectedCustomer.orders.map((ord) => (
                    <div key={ord.id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-charcoal dark:text-cream">
                          {ord.id}
                        </span>
                        <span className="text-gray-400 text-[11px] ml-2">{ord.date}</span>
                        <span className="text-[10px] font-bold uppercase ml-2 px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
                          {ord.status}
                        </span>
                      </div>
                      <span className="font-bold text-charcoal dark:text-cream">
                        {formatCurrency(ord.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
