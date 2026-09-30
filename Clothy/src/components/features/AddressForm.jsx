/**
 * AddressForm — Shipping and billing address capture form
 */
import { useState } from 'react';
import { useSession } from '../../hooks/useCurrentUser';

export default function AddressForm({ initialData = null, onSubmit, onCancel }) {
  const session = useSession();
  const [formData, setFormData] = useState(
    initialData || {
      name: session?.name || '',
      phone: session?.phone || '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pin: '',
      isDefault: false,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div>
        <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
          Street Address / House No. *
        </label>
        <input
          type="text"
          name="line1"
          required
          value={formData.line1}
          onChange={handleChange}
          placeholder="House no., street, area"
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
          Apartment, Landmark, Area (Optional)
        </label>
        <input
          type="text"
          name="line2"
          value={formData.line2}
          onChange={handleChange}
          placeholder="e.g. Near Indiranagar Metro"
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
            City *
          </label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
            State *
          </label>
          <input
            type="text"
            name="state"
            required
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
            Postal Code (PIN) *
          </label>
          <input
            type="text"
            name="pin"
            required
            value={formData.pin}
            onChange={handleChange}
            placeholder="6-digit PIN code"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer pt-2">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="w-4 h-4 accent-gold"
        />
        <span className="text-gray-600 dark:text-gray-300 font-medium">
          Set as default shipping address
        </span>
      </label>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          type="submit"
          className="px-6 py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Save Address
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
