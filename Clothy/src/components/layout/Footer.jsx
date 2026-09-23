/**
 * Footer — Premium footer with brand info, links, newsletter, social
 */
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

function InstagramIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function TwitterIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  );
}

function FacebookIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function YoutubeIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
    </svg>
  );
}

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', path: '/shop?tag=new' },
    { label: 'Bestsellers', path: '/shop?tag=bestseller' },
    { label: 'Shirts', path: '/category/shirts' },
    { label: 'Dresses', path: '/category/dresses' },
    { label: 'Jackets', path: '/category/jackets' },
    { label: 'Footwear', path: '/category/footwear' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Careers', path: '/about' },
    { label: 'Press', path: '/about' },
  ],
  Help: [
    { label: 'FAQ', path: '/help' },
    { label: 'Shipping', path: '/help' },
    { label: 'Returns', path: '/help' },
    { label: 'Size Guide', path: '/help' },
    { label: 'Track Order', path: '/account/orders' },
  ],
};

const socialLinks = [
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: TwitterIcon, label: 'Twitter', href: '#' },
  { icon: FacebookIcon, label: 'Facebook', href: '#' },
  { icon: YoutubeIcon, label: 'YouTube', href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Welcome to the CLOZARI family! 🎉');
    setEmail('');
  };

  return (
    <footer className="bg-charcoal text-cream">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container-custom py-14 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="text-center lg:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-3">
              Join the <span className="text-gradient-gold">CLOZARI</span> Club
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto lg:mx-0 leading-relaxed">
              Subscribe for early access to new collections, exclusive offers, and style inspiration.
            </p>
          </div>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex w-full max-w-md rounded-xl overflow-hidden border border-gray-700 focus-within:border-gold transition-colors"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 min-w-0 px-4 py-3.5 bg-gray-800 border-none text-sm text-cream placeholder:text-gray-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-5 sm:px-6 py-3.5 bg-gold text-white hover:bg-gold-dark transition-colors flex items-center gap-2 text-sm font-medium shrink-0"
            >
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Links Section */}
      <div className="container-custom py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-bold tracking-widest mb-5 block">
              CLOZARI
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium fashion for the modern individual. Curated collections that blend timeless elegance with contemporary style.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2.5 bg-gray-800 rounded-full text-gray-400 hover:text-gold hover:bg-gray-700 transition-colors"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-5 text-cream">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-gold transition-colors inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-7 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Mail size={14} /> hello@clozari.com
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={14} /> +91 98765 43210
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> Bangalore, India
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center sm:text-right">
            © 2026 CLOZARI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
