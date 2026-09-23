/**
 * Contact Page — Boutique concierge inquiry form and flagship atelier locations
 */
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    toast.success('Your message has been dispatched to our concierge team!', { icon: '✉️' });
    setTimeout(() => {
      setIsSent(false);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 3000);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: 'Concierge & Contact' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
            Client Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-3">
            Atelier Concierge
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Have an inquiry regarding bespoke fitting, capsule drops, or existing orders? We are here to assist you.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
          {/* Left: Contact Form (Col 7) */}
          <div className="lg:col-span-7 bg-cream dark:bg-charcoal p-6 sm:p-10 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-card">
            <h2 className="font-serif font-bold text-xl text-charcoal dark:text-cream mb-2">
              Send a Message
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Our stylists respond to all inquiries within 24 business hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Arjun Mehta"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="arjun@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal-light text-charcoal dark:text-cream focus:outline-none focus:border-gold cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order & Delivery">Order & Delivery Assistance</option>
                  <option value="Size & Bespoke Styling">Size & Bespoke Styling Advice</option>
                  <option value="Press & Collaborations">Press & Collaborations</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How may our concierge assist you today?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSent}
                className="w-full py-4 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
              >
                {isSent ? (
                  <>
                    <Check size={16} /> Dispatched
                  </>
                ) : (
                  <>
                    <Send size={15} /> Send Inquiry
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Atelier Info & Locations (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-cream dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-card space-y-6 text-xs">
              <h3 className="font-serif font-bold text-lg text-charcoal dark:text-cream pb-3 border-b border-gray-200/60 dark:border-gray-800">
                Concierge Contact
              </h3>

              <div className="flex gap-3 items-start">
                <Mail size={18} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal dark:text-cream block">Email</span>
                  <a href="mailto:concierge@clozari.com" className="text-gray-500 hover:text-gold">
                    concierge@clozari.com
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Phone size={18} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal dark:text-cream block">Telephone</span>
                  <p className="text-gray-500">+91 (080) 4920 1100 (Toll Free)</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Clock size={18} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal dark:text-cream block">Operating Hours</span>
                  <p className="text-gray-500">Monday – Saturday: 10:00 AM – 8:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Flagship Atelier Locations */}
            <div className="bg-cream dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-card space-y-4 text-xs">
              <h3 className="font-serif font-bold text-lg text-charcoal dark:text-cream pb-3 border-b border-gray-200/60 dark:border-gray-800">
                Flagship Boutiques
              </h3>

              <div className="space-y-1">
                <h4 className="font-bold text-charcoal dark:text-cream flex items-center gap-1.5">
                  <MapPin size={14} className="text-gold" /> Mumbai Flagship
                </h4>
                <p className="text-gray-500 pl-5">
                  14, Kala Ghoda Arts Precinct, Fort, Mumbai 400001
                </p>
              </div>

              <div className="space-y-1 pt-2">
                <h4 className="font-bold text-charcoal dark:text-cream flex items-center gap-1.5">
                  <MapPin size={14} className="text-gold" /> Bangalore Atelier
                </h4>
                <p className="text-gray-500 pl-5">
                  84, Lavelle Road, Shanthala Nagar, Bangalore 560001
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
