/**
 * CLOZARI — Category Data
 */
const categories = [
  {
    id: 'cat_01',
    name: 'Shirts',
    slug: 'shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
    description: 'Premium shirts for every occasion',
    productCount: 5,
  },
  {
    id: 'cat_02',
    name: 'T-Shirts',
    slug: 't-shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    description: 'Essential tees & casual tops',
    productCount: 6,
  },
  {
    id: 'cat_03',
    name: 'Jeans',
    slug: 'jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    description: 'Denim crafted to perfection',
    productCount: 4,
  },
  {
    id: 'cat_04',
    name: 'Dresses',
    slug: 'dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    description: 'Elegant dresses for every moment',
    productCount: 4,
  },
  {
    id: 'cat_05',
    name: 'Jackets',
    slug: 'jackets',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    description: 'Outerwear that defines your style',
    productCount: 6,
  },
  {
    id: 'cat_06',
    name: 'Footwear',
    slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
    description: 'Shoes & sneakers for every step',
    productCount: 5,
  },
  {
    id: 'cat_07',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    description: 'The finishing touches',
    productCount: 7,
  },
];

export default categories;

export const getCategoryBySlug = (slug) => {
  return categories.find((c) => c.slug === slug);
};
