/**
 * CLOZARI — Mock Orders Data
 * These belong to the seeded showcase account (usr_demo) only — every other
 * account sees exactly the orders it placed itself.
 * Dates are relative to "now" so the delivered demo order always sits inside
 * the 7-day return/exchange window.
 */
const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const at = (daysAgo) => new Date(now - daysAgo * DAY).toISOString().slice(0, 10);

const time = (hour, minute, meridiem) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${meridiem}`;

/** Customer snapshot frozen on every order (also drives the PDF invoice). */
const demoCustomer = {
  name: 'Demo Patron',
  email: 'demo@clozari.com',
  phone: '9876000000',
  address: {
    name: 'Demo Patron',
    line1: 'Studio 12, 5th Cross',
    line2: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pin: '560038',
    phone: '9876000000',
  },
};

const orders = [
  {
    id: 'ORD-2026-001',
    userId: 'usr_demo',
    date: at(6),
    status: 'Delivered',
    deliveredAt: new Date(now - 2 * DAY).toISOString(),
    items: [
      { productId: 'prod_001', name: 'Oversized Cotton Shirt', size: 'L', color: 'Charcoal', quantity: 1, price: 1899, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80' },
      { productId: 'prod_004', name: 'Essential Crew Neck Tee', size: 'M', color: 'Black', quantity: 2, price: 999, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80' },
    ],
    subtotal: 3897,
    discount: 500,
    shipping: 0,
    total: 3397,
    address: demoCustomer.address,
    customer: demoCustomer,
    paymentMethod: 'UPI',
    payment: { method: 'UPI', last4: '****' },
    tracking: [
      { status: 'Order Placed', date: `${at(6)} ${time(10, 30, 'AM')}`, completed: true },
      { status: 'Confirmed', date: `${at(6)} ${time(11, 0, 'AM')}`, completed: true },
      { status: 'Shipped', date: `${at(5)} ${time(2, 0, 'PM')}`, completed: true },
      { status: 'Out for Delivery', date: `${at(3)} ${time(9, 0, 'AM')}`, completed: true },
      { status: 'Delivered', date: `${at(2)} ${time(3, 30, 'PM')}`, completed: true },
    ],
  },
  {
    id: 'ORD-2026-002',
    userId: 'usr_demo',
    date: at(3),
    status: 'Shipped',
    items: [
      { productId: 'prod_013', name: 'Leather Biker Jacket', size: 'M', color: 'Black', quantity: 1, price: 9999, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&q=80' },
    ],
    subtotal: 9999,
    discount: 0,
    shipping: 0,
    total: 9999,
    address: demoCustomer.address,
    customer: demoCustomer,
    paymentMethod: 'Card',
    payment: { method: 'Card', last4: '4242' },
    tracking: [
      { status: 'Order Placed', date: `${at(3)} ${time(8, 15, 'AM')}`, completed: true },
      { status: 'Confirmed', date: `${at(3)} ${time(8, 45, 'AM')}`, completed: true },
      { status: 'Shipped', date: `${at(2)} ${time(11, 0, 'AM')}`, completed: true },
      { status: 'Out for Delivery', date: '', completed: false },
      { status: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: 'ORD-2026-003',
    userId: 'usr_demo',
    date: at(1),
    status: 'Processing',
    items: [
      { productId: 'prod_010', name: 'Midi Wrap Dress — Emerald', size: 'S', color: 'Emerald', quantity: 1, price: 3599, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80' },
      { productId: 'prod_025', name: 'Aviator Sunglasses', size: 'One Size', color: 'Gold/Green', quantity: 1, price: 2399, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&q=80' },
    ],
    subtotal: 5998,
    discount: 200,
    shipping: 0,
    total: 5798,
    address: demoCustomer.address,
    customer: demoCustomer,
    paymentMethod: 'COD',
    payment: { method: 'COD', last4: '' },
    tracking: [
      { status: 'Order Placed', date: `${at(1)} ${time(10, 0, 'AM')}`, completed: true },
      { status: 'Confirmed', date: `${at(1)} ${time(10, 30, 'AM')}`, completed: true },
      { status: 'Shipped', date: '', completed: false },
      { status: 'Out for Delivery', date: '', completed: false },
      { status: 'Delivered', date: '', completed: false },
    ],
  },
];

export default orders;

export const getOrderById = (id) => orders.find((o) => o.id === id);
