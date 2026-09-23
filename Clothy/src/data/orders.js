/**
 * CLOZARI — Mock Orders Data
 */
const orders = [
  {
    id: 'ORD-2026-001',
    date: '2026-09-15',
    status: 'Delivered',
    items: [
      { productId: 'prod_001', name: 'Oversized Cotton Shirt', size: 'L', color: 'Charcoal', quantity: 1, price: 1899, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80' },
      { productId: 'prod_004', name: 'Essential Crew Neck Tee', size: 'M', color: 'Black', quantity: 2, price: 999, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80' },
    ],
    subtotal: 3897,
    discount: 500,
    shipping: 0,
    total: 3397,
    address: { name: 'Arjun Mehta', line1: '42, Park Street', line2: 'Koramangala', city: 'Bangalore', state: 'Karnataka', pin: '560034', phone: '9876543210' },
    payment: { method: 'UPI', last4: '****' },
    tracking: [
      { status: 'Order Placed', date: '2026-09-15 10:30 AM', completed: true },
      { status: 'Confirmed', date: '2026-09-15 11:00 AM', completed: true },
      { status: 'Shipped', date: '2026-09-16 02:00 PM', completed: true },
      { status: 'Out for Delivery', date: '2026-09-18 09:00 AM', completed: true },
      { status: 'Delivered', date: '2026-09-18 03:30 PM', completed: true },
    ],
  },
  {
    id: 'ORD-2026-002',
    date: '2026-09-20',
    status: 'Shipped',
    items: [
      { productId: 'prod_013', name: 'Leather Biker Jacket', size: 'M', color: 'Black', quantity: 1, price: 9999, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&q=80' },
    ],
    subtotal: 9999,
    discount: 0,
    shipping: 0,
    total: 9999,
    address: { name: 'Arjun Mehta', line1: '42, Park Street', line2: 'Koramangala', city: 'Bangalore', state: 'Karnataka', pin: '560034', phone: '9876543210' },
    payment: { method: 'Card', last4: '4242' },
    tracking: [
      { status: 'Order Placed', date: '2026-09-20 08:15 AM', completed: true },
      { status: 'Confirmed', date: '2026-09-20 08:45 AM', completed: true },
      { status: 'Shipped', date: '2026-09-21 11:00 AM', completed: true },
      { status: 'Out for Delivery', date: '', completed: false },
      { status: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: 'ORD-2026-003',
    date: '2026-09-22',
    status: 'Processing',
    items: [
      { productId: 'prod_010', name: 'Midi Wrap Dress — Emerald', size: 'S', color: 'Emerald', quantity: 1, price: 3599, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80' },
      { productId: 'prod_025', name: 'Aviator Sunglasses', size: 'One Size', color: 'Gold/Green', quantity: 1, price: 2399, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&q=80' },
    ],
    subtotal: 5998,
    discount: 200,
    shipping: 0,
    total: 5798,
    address: { name: 'Arjun Mehta', line1: '42, Park Street', line2: 'Koramangala', city: 'Bangalore', state: 'Karnataka', pin: '560034', phone: '9876543210' },
    payment: { method: 'COD', last4: '' },
    tracking: [
      { status: 'Order Placed', date: '2026-09-22 10:00 AM', completed: true },
      { status: 'Confirmed', date: '2026-09-22 10:30 AM', completed: true },
      { status: 'Shipped', date: '', completed: false },
      { status: 'Out for Delivery', date: '', completed: false },
      { status: 'Delivered', date: '', completed: false },
    ],
  },
];

export default orders;

export const getOrderById = (id) => orders.find((o) => o.id === id);
