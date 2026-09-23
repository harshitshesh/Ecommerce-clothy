/**
 * CLOZARI — Mock Product Data
 * ~35 premium clothing products across categories
 * All images from Unsplash for realistic fashion photography
 */

const products = [
  // ===== SHIRTS =====
  {
    id: 'prod_001',
    name: 'Oversized Cotton Shirt',
    slug: 'oversized-cotton-shirt',
    category: 'Shirts',
    gender: 'Men',
    price: 2499,
    discountPrice: 1899,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#1A1A1A' },
      { name: 'Cream', hex: '#F8F6F2' },
    ],
    rating: 4.5,
    reviewsCount: 128,
    tags: ['new', 'bestseller'],
    stock: 12,
    description: 'A relaxed-fit oversized cotton shirt crafted from premium 100% organic cotton. Features a dropped shoulder, button-front closure, and a boxy silhouette that drapes beautifully. Perfect for layering or wearing on its own.',
    material: '100% Organic Cotton',
    care: ['Machine wash cold', 'Tumble dry low', 'Iron on medium heat'],
  },
  {
    id: 'prod_002',
    name: 'Linen Blend Resort Shirt',
    slug: 'linen-blend-resort-shirt',
    category: 'Shirts',
    gender: 'Men',
    price: 2999,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Sand', hex: '#C2B280' },
    ],
    rating: 4.3,
    reviewsCount: 89,
    tags: ['trending'],
    stock: 25,
    description: 'A breezy linen-blend resort shirt with a relaxed camp collar. The lightweight fabric keeps you cool in warm weather, while the tailored cut ensures a polished look.',
    material: '55% Linen, 45% Cotton',
    care: ['Hand wash recommended', 'Hang dry', 'Iron on low heat'],
  },
  {
    id: 'prod_003',
    name: 'Silk Satin Blouse',
    slug: 'silk-satin-blouse',
    category: 'Shirts',
    gender: 'Women',
    price: 3499,
    discountPrice: 2799,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80',
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Ivory', hex: '#FFFFF0' },
      { name: 'Blush', hex: '#DE98AB' },
    ],
    rating: 4.7,
    reviewsCount: 156,
    tags: ['bestseller'],
    stock: 8,
    description: 'Elegant silk satin blouse with a delicate drape and lustrous finish. Features a V-neckline, long cuffed sleeves, and a flattering relaxed fit.',
    material: '100% Mulberry Silk',
    care: ['Dry clean only', 'Store on padded hanger'],
  },

  // ===== T-SHIRTS =====
  {
    id: 'prod_004',
    name: 'Essential Crew Neck Tee',
    slug: 'essential-crew-neck-tee',
    category: 'T-Shirts',
    gender: 'Unisex',
    price: 1299,
    discountPrice: 999,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Grey', hex: '#808080' },
    ],
    rating: 4.6,
    reviewsCount: 342,
    tags: ['bestseller', 'essential'],
    stock: 50,
    description: 'The perfect everyday crew neck t-shirt. Made from premium combed cotton with a soft hand feel and excellent shape retention wash after wash.',
    material: '100% Combed Cotton, 180 GSM',
    care: ['Machine wash cold', 'Tumble dry low', 'Do not bleach'],
  },
  {
    id: 'prod_005',
    name: 'Graphic Print Tee — Urban',
    slug: 'graphic-print-tee-urban',
    category: 'T-Shirts',
    gender: 'Men',
    price: 1599,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Olive', hex: '#556B2F' },
    ],
    rating: 4.2,
    reviewsCount: 97,
    tags: ['new'],
    stock: 30,
    description: 'Bold graphic print tee with an urban-inspired design. Made from heavyweight cotton with a relaxed fit for all-day comfort.',
    material: '100% Cotton, 220 GSM',
    care: ['Machine wash cold inside out', 'Hang dry', 'Do not iron on print'],
  },
  {
    id: 'prod_006',
    name: 'Crop Top — Ribbed Knit',
    slug: 'crop-top-ribbed-knit',
    category: 'T-Shirts',
    gender: 'Women',
    price: 1199,
    discountPrice: 899,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Mocha', hex: '#967969' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.4,
    reviewsCount: 215,
    tags: ['trending', 'new'],
    stock: 18,
    description: 'A versatile ribbed knit crop top with a fitted silhouette. The stretchy fabric provides a comfortable, body-hugging fit. Perfect for layering or pairing with high-waisted bottoms.',
    material: '95% Cotton, 5% Elastane',
    care: ['Machine wash cold', 'Lay flat to dry'],
  },

  // ===== JEANS =====
  {
    id: 'prod_007',
    name: 'Slim Fit Selvedge Denim',
    slug: 'slim-fit-selvedge-denim',
    category: 'Jeans',
    gender: 'Men',
    price: 4999,
    discountPrice: 3999,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Indigo', hex: '#3F5277' },
      { name: 'Raw', hex: '#2C3E50' },
    ],
    rating: 4.8,
    reviewsCount: 203,
    tags: ['premium', 'bestseller'],
    stock: 15,
    description: 'Premium Japanese selvedge denim in a modern slim fit. Features authentic selvedge detailing, copper rivets, and a slight stretch for comfort. These jeans will develop beautiful fading and character over time.',
    material: '98% Cotton, 2% Elastane (14oz Selvedge)',
    care: ['Wash sparingly', 'Cold wash inside out', 'Hang dry'],
  },
  {
    id: 'prod_008',
    name: 'High-Rise Wide Leg Jeans',
    slug: 'high-rise-wide-leg-jeans',
    category: 'Jeans',
    gender: 'Women',
    price: 3499,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&q=80',
    ],
    sizes: ['24', '26', '28', '30', '32'],
    colors: [
      { name: 'Light Wash', hex: '#B5C7D3' },
      { name: 'Dark Wash', hex: '#2C3E50' },
    ],
    rating: 4.6,
    reviewsCount: 178,
    tags: ['trending'],
    stock: 22,
    description: 'Flattering high-rise wide leg jeans with a vintage-inspired silhouette. Features a button fly, classic five-pocket styling, and a comfortable stretch denim fabric.',
    material: '99% Cotton, 1% Elastane',
    care: ['Machine wash cold', 'Tumble dry low'],
  },
  {
    id: 'prod_009',
    name: 'Relaxed Tapered Jeans',
    slug: 'relaxed-tapered-jeans',
    category: 'Jeans',
    gender: 'Unisex',
    price: 2999,
    discountPrice: 2399,
    images: [
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Washed Black', hex: '#3D3D3D' },
      { name: 'Stone', hex: '#B8B09C' },
    ],
    rating: 4.4,
    reviewsCount: 134,
    tags: ['new'],
    stock: 28,
    description: 'A contemporary relaxed-tapered fit that sits comfortably at the waist with a roomy thigh that tapers to a clean ankle. Perfect everyday denim.',
    material: '100% Cotton Denim',
    care: ['Machine wash cold inside out', 'Hang dry recommended'],
  },

  // ===== DRESSES =====
  {
    id: 'prod_010',
    name: 'Midi Wrap Dress — Emerald',
    slug: 'midi-wrap-dress-emerald',
    category: 'Dresses',
    gender: 'Women',
    price: 4499,
    discountPrice: 3599,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald', hex: '#0E4B3F' },
      { name: 'Burgundy', hex: '#800020' },
    ],
    rating: 4.9,
    reviewsCount: 267,
    tags: ['bestseller', 'premium'],
    stock: 6,
    description: 'A stunning midi wrap dress in rich emerald. The flattering wrap silhouette cinches at the waist and flows into a graceful midi-length skirt. Made from luxurious crepe fabric with beautiful drape.',
    material: '100% Viscose Crepe',
    care: ['Dry clean recommended', 'Iron on low heat'],
  },
  {
    id: 'prod_011',
    name: 'Slip Dress — Satin',
    slug: 'slip-dress-satin',
    category: 'Dresses',
    gender: 'Women',
    price: 3999,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Champagne', hex: '#F7E7CE' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.7,
    reviewsCount: 189,
    tags: ['trending', 'premium'],
    stock: 10,
    description: 'An effortlessly elegant satin slip dress with delicate spaghetti straps and a cowl neckline. The bias-cut construction creates a fluid, body-skimming silhouette.',
    material: '100% Silk Satin',
    care: ['Dry clean only', 'Store on padded hanger'],
  },
  {
    id: 'prod_012',
    name: 'Floral Maxi Dress',
    slug: 'floral-maxi-dress',
    category: 'Dresses',
    gender: 'Women',
    price: 3299,
    discountPrice: 2499,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Floral Print', hex: '#E8D5B7' },
    ],
    rating: 4.5,
    reviewsCount: 142,
    tags: ['new', 'sale'],
    stock: 14,
    description: 'A romantic floral maxi dress with a tiered skirt and puff sleeves. The lightweight, flowy fabric is perfect for summer outings and special occasions.',
    material: '100% Rayon',
    care: ['Machine wash cold gentle cycle', 'Hang dry'],
  },

  // ===== JACKETS =====
  {
    id: 'prod_013',
    name: 'Leather Biker Jacket',
    slug: 'leather-biker-jacket',
    category: 'Jackets',
    gender: 'Men',
    price: 12999,
    discountPrice: 9999,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Brown', hex: '#5C4033' },
    ],
    rating: 4.8,
    reviewsCount: 95,
    tags: ['premium', 'bestseller'],
    stock: 5,
    description: 'A classic leather biker jacket crafted from butter-soft genuine lambskin leather. Features asymmetric zip closure, snap lapels, zippered pockets, and quilted shoulder panels.',
    material: '100% Genuine Lambskin Leather, Polyester Lining',
    care: ['Professional leather clean only', 'Condition regularly'],
  },
  {
    id: 'prod_014',
    name: 'Wool Blend Overcoat',
    slug: 'wool-blend-overcoat',
    category: 'Jackets',
    gender: 'Men',
    price: 8999,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1544923246-77307dd270f9?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Charcoal', hex: '#36454F' },
    ],
    rating: 4.7,
    reviewsCount: 67,
    tags: ['premium'],
    stock: 9,
    description: 'A timeless wool-blend overcoat with a clean, minimal silhouette. Features notched lapels, side pockets, and a knee-length cut. The perfect layering piece for colder months.',
    material: '70% Wool, 20% Polyester, 10% Cashmere',
    care: ['Dry clean only', 'Store in garment bag'],
  },
  {
    id: 'prod_015',
    name: 'Cropped Puffer Jacket',
    slug: 'cropped-puffer-jacket',
    category: 'Jackets',
    gender: 'Women',
    price: 5499,
    discountPrice: 4199,
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80',
      'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sage', hex: '#B2AC88' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Cream', hex: '#FFFDD0' },
    ],
    rating: 4.5,
    reviewsCount: 183,
    tags: ['trending', 'new'],
    stock: 20,
    description: 'A trendy cropped puffer jacket with a cozy oversized collar. Filled with recycled down alternative for warmth without bulk. Features an adjustable drawstring hem and zip closure.',
    material: 'Shell: 100% Recycled Nylon, Fill: Recycled Polyester',
    care: ['Machine wash cold', 'Tumble dry low with tennis balls'],
  },
  {
    id: 'prod_016',
    name: 'Denim Trucker Jacket',
    slug: 'denim-trucker-jacket',
    category: 'Jackets',
    gender: 'Unisex',
    price: 3999,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Medium Wash', hex: '#6E8FAE' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.3,
    reviewsCount: 121,
    tags: ['essential'],
    stock: 30,
    description: 'The timeless denim trucker jacket reimagined with a modern fit. Features classic button front, chest flap pockets, and adjustable waist tabs.',
    material: '100% Cotton Denim (12oz)',
    care: ['Machine wash cold inside out', 'Hang dry'],
  },

  // ===== FOOTWEAR =====
  {
    id: 'prod_017',
    name: 'Minimalist Leather Sneakers',
    slug: 'minimalist-leather-sneakers',
    category: 'Footwear',
    gender: 'Unisex',
    price: 5999,
    discountPrice: 4499,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
    ],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.7,
    reviewsCount: 298,
    tags: ['bestseller', 'premium'],
    stock: 16,
    description: 'Clean, minimalist leather sneakers handcrafted from full-grain Italian leather. Features a memory foam insole, margom rubber outsole, and hand-stitched detailing.',
    material: 'Full-Grain Italian Leather, Rubber Sole',
    care: ['Wipe with damp cloth', 'Use leather conditioner monthly'],
  },
  {
    id: 'prod_018',
    name: 'Chelsea Boots — Suede',
    slug: 'chelsea-boots-suede',
    category: 'Footwear',
    gender: 'Men',
    price: 7999,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1638953927673-bc8be3638a9b?w=800&q=80',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80',
    ],
    sizes: ['7', '8', '9', '10', '11'],
    colors: [
      { name: 'Tan', hex: '#D2B48C' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.6,
    reviewsCount: 76,
    tags: ['premium'],
    stock: 11,
    description: 'Classic Chelsea boots in luxurious suede with elastic side panels and a pull tab. Features a leather-lined interior, cushioned insole, and durable rubber sole.',
    material: 'Premium Suede, Leather Lining',
    care: ['Use suede brush regularly', 'Apply waterproof spray', 'Store with shoe trees'],
  },
  {
    id: 'prod_019',
    name: 'Strappy Block Heels',
    slug: 'strappy-block-heels',
    category: 'Footwear',
    gender: 'Women',
    price: 3499,
    discountPrice: 2799,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=80',
    ],
    sizes: ['5', '6', '7', '8', '9'],
    colors: [
      { name: 'Nude', hex: '#E3BC9A' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.4,
    reviewsCount: 152,
    tags: ['trending'],
    stock: 19,
    description: 'Elegant strappy block heels with a comfortable 3-inch heel height. Features an adjustable ankle strap, cushioned footbed, and non-slip sole.',
    material: 'Faux Leather, Rubber Sole',
    care: ['Wipe clean with damp cloth'],
  },
  {
    id: 'prod_020',
    name: 'Canvas Platform Sneakers',
    slug: 'canvas-platform-sneakers',
    category: 'Footwear',
    gender: 'Women',
    price: 2499,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    ],
    sizes: ['5', '6', '7', '8', '9'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Sage', hex: '#B2AC88' },
    ],
    rating: 4.3,
    reviewsCount: 201,
    tags: ['new'],
    stock: 35,
    description: 'Trendy canvas platform sneakers with a chunky rubber sole for added height. Features lace-up closure, padded collar, and vulcanized construction for durability.',
    material: 'Canvas Upper, Rubber Platform Sole',
    care: ['Spot clean with mild soap', 'Air dry'],
  },

  // ===== ACCESSORIES =====
  {
    id: 'prod_021',
    name: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    category: 'Accessories',
    gender: 'Women',
    price: 4999,
    discountPrice: 3999,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Tan', hex: '#D2B48C' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.8,
    reviewsCount: 234,
    tags: ['bestseller', 'premium'],
    stock: 13,
    description: 'A beautifully crafted leather crossbody bag with an adjustable strap and magnetic flap closure. Features multiple interior compartments and a hidden zip pocket.',
    material: 'Full-Grain Leather, Cotton Lining',
    care: ['Condition leather regularly', 'Store in dust bag'],
  },
  {
    id: 'prod_022',
    name: 'Silk Scarf — Abstract Print',
    slug: 'silk-scarf-abstract-print',
    category: 'Accessories',
    gender: 'Women',
    price: 1999,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
      'https://images.unsplash.com/photo-1601924921557-45e8e0950586?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Multicolor', hex: '#B08D57' },
    ],
    rating: 4.5,
    reviewsCount: 87,
    tags: ['new'],
    stock: 20,
    description: 'A luxurious silk scarf featuring an exclusive abstract print. Can be worn as a neck scarf, hair accessory, or tied to your bag for a pop of color.',
    material: '100% Silk Twill',
    care: ['Dry clean only', 'Store rolled, not folded'],
  },
  {
    id: 'prod_023',
    name: 'Classic Leather Belt',
    slug: 'classic-leather-belt',
    category: 'Accessories',
    gender: 'Men',
    price: 1799,
    discountPrice: 1399,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80',
    ],
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'Brown', hex: '#5C4033' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.6,
    reviewsCount: 165,
    tags: ['essential'],
    stock: 40,
    description: 'A timeless leather belt crafted from genuine full-grain leather with a brushed silver buckle. The perfect finishing touch for any outfit.',
    material: 'Full-Grain Leather, Metal Buckle',
    care: ['Condition occasionally', 'Avoid excessive moisture'],
  },
  {
    id: 'prod_024',
    name: 'Wool Fedora Hat',
    slug: 'wool-fedora-hat',
    category: 'Accessories',
    gender: 'Unisex',
    price: 2299,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800&q=80',
      'https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=800&q=80',
    ],
    sizes: ['S/M', 'L/XL'],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.3,
    reviewsCount: 54,
    tags: ['trending'],
    stock: 17,
    description: 'A sophisticated wool fedora hat with a grosgrain ribbon band. Adds instant polish to any outfit, from casual to smart.',
    material: '100% Australian Wool',
    care: ['Spot clean only', 'Store on hat form'],
  },
  {
    id: 'prod_025',
    name: 'Aviator Sunglasses',
    slug: 'aviator-sunglasses',
    category: 'Accessories',
    gender: 'Unisex',
    price: 2999,
    discountPrice: 2399,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Gold/Green', hex: '#B08D57' },
      { name: 'Silver/Grey', hex: '#C0C0C0' },
    ],
    rating: 4.5,
    reviewsCount: 198,
    tags: ['bestseller'],
    stock: 25,
    description: 'Classic aviator sunglasses with UV400 protection lenses and a lightweight metal frame. Features adjustable nose pads for a comfortable, secure fit.',
    material: 'Metal Frame, Polarized Glass Lenses',
    care: ['Clean with microfiber cloth', 'Store in hard case'],
  },

  // ===== MORE SHIRTS/TEES =====
  {
    id: 'prod_026',
    name: 'Oxford Button-Down Shirt',
    slug: 'oxford-button-down-shirt',
    category: 'Shirts',
    gender: 'Men',
    price: 2799,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Light Blue', hex: '#ADD8E6' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Pink', hex: '#FFB6C1' },
    ],
    rating: 4.4,
    reviewsCount: 221,
    tags: ['essential'],
    stock: 35,
    description: 'A wardrobe staple — the classic Oxford button-down shirt. Made from premium cotton oxford cloth with a naturally textured weave. Features a button-down collar, chest pocket, and tailored fit.',
    material: '100% Cotton Oxford Cloth',
    care: ['Machine wash warm', 'Tumble dry low', 'Iron while slightly damp'],
  },
  {
    id: 'prod_027',
    name: 'Oversized Hoodie',
    slug: 'oversized-hoodie',
    category: 'T-Shirts',
    gender: 'Unisex',
    price: 2499,
    discountPrice: 1999,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
      'https://images.unsplash.com/photo-1578768079470-a84f44e7e3a0?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Cream', hex: '#FFFDD0' },
      { name: 'Forest', hex: '#228B22' },
    ],
    rating: 4.7,
    reviewsCount: 312,
    tags: ['bestseller', 'essential'],
    stock: 42,
    description: 'Ultra-soft oversized hoodie made from heavyweight 400 GSM French terry cotton. Features a spacious kangaroo pocket, drawstring hood, and ribbed cuffs. The perfect cozy essential.',
    material: '100% Cotton French Terry, 400 GSM',
    care: ['Machine wash cold', 'Tumble dry low'],
  },

  // ===== MORE DRESSES =====
  {
    id: 'prod_028',
    name: 'Blazer Dress — Structured',
    slug: 'blazer-dress-structured',
    category: 'Dresses',
    gender: 'Women',
    price: 5999,
    discountPrice: 4799,
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Ivory', hex: '#FFFFF0' },
    ],
    rating: 4.8,
    reviewsCount: 94,
    tags: ['premium', 'new'],
    stock: 7,
    description: 'A power-dressing blazer dress with sharp tailoring and confident structure. Features padded shoulders, double-breasted gold button closure, and a flattering belted waist.',
    material: '65% Polyester, 30% Viscose, 5% Elastane',
    care: ['Dry clean recommended'],
  },

  // ===== MORE FOOTWEAR =====
  {
    id: 'prod_029',
    name: 'Suede Loafers',
    slug: 'suede-loafers',
    category: 'Footwear',
    gender: 'Men',
    price: 4499,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80',
      'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=800&q=80',
    ],
    sizes: ['7', '8', '9', '10', '11'],
    colors: [
      { name: 'Navy', hex: '#000080' },
      { name: 'Tan', hex: '#D2B48C' },
    ],
    rating: 4.5,
    reviewsCount: 88,
    tags: ['premium'],
    stock: 13,
    description: 'Handcrafted suede loafers with a classic penny slot detail. Features leather lining, cushioned insole, and a flexible rubber sole for all-day comfort.',
    material: 'Premium Suede, Leather Lining',
    care: ['Use suede brush', 'Apply protector spray'],
  },

  // ===== JEANS =====
  {
    id: 'prod_030',
    name: 'Skinny Fit Black Jeans',
    slug: 'skinny-fit-black-jeans',
    category: 'Jeans',
    gender: 'Unisex',
    price: 2499,
    discountPrice: 1799,
    images: [
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.4,
    reviewsCount: 276,
    tags: ['essential', 'bestseller'],
    stock: 45,
    description: 'Classic skinny fit jeans in jet black. Made from stretch denim for a snug, comfortable fit that moves with you. A wardrobe essential for any occasion.',
    material: '98% Cotton, 2% Elastane',
    care: ['Machine wash cold inside out', 'Hang dry to maintain color'],
  },

  // ===== ACCESSORIES =====
  {
    id: 'prod_031',
    name: 'Canvas Tote Bag',
    slug: 'canvas-tote-bag',
    category: 'Accessories',
    gender: 'Unisex',
    price: 1499,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Natural', hex: '#F5F5DC' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.2,
    reviewsCount: 143,
    tags: ['essential'],
    stock: 50,
    description: 'A sturdy canvas tote bag with reinforced handles and a spacious interior. Features an inner zip pocket and magnetic snap closure. Perfect for everyday use.',
    material: 'Heavy-Duty Canvas, Leather Trim',
    care: ['Spot clean', 'Machine wash cold gentle cycle'],
  },
  {
    id: 'prod_032',
    name: 'Minimalist Watch — Gold',
    slug: 'minimalist-watch-gold',
    category: 'Accessories',
    gender: 'Unisex',
    price: 6999,
    discountPrice: 5499,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Gold/Cream', hex: '#B08D57' },
      { name: 'Silver/White', hex: '#C0C0C0' },
    ],
    rating: 4.9,
    reviewsCount: 312,
    tags: ['premium', 'bestseller'],
    stock: 8,
    description: 'An exquisitely minimal timepiece with a slim gold-tone case, cream dial, and Italian leather strap. Japanese quartz movement ensures precision. Water resistant to 30m.',
    material: 'Stainless Steel Case, Italian Leather Strap, Sapphire Crystal',
    care: ['Avoid contact with water', 'Store in watch box'],
  },

  // ===== MORE T-SHIRTS =====
  {
    id: 'prod_033',
    name: 'Striped Polo Shirt',
    slug: 'striped-polo-shirt',
    category: 'T-Shirts',
    gender: 'Men',
    price: 1899,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy/White', hex: '#000080' },
      { name: 'Green/White', hex: '#228B22' },
    ],
    rating: 4.3,
    reviewsCount: 109,
    tags: ['essential'],
    stock: 27,
    description: 'A refined striped polo shirt with a ribbed collar and two-button placket. Made from breathable piqué cotton for a comfortable, polished look.',
    material: '100% Cotton Piqué',
    care: ['Machine wash cold', 'Tumble dry low'],
  },

  // ===== MORE JACKETS =====
  {
    id: 'prod_034',
    name: 'Linen Blazer — Unstructured',
    slug: 'linen-blazer-unstructured',
    category: 'Jackets',
    gender: 'Men',
    price: 6499,
    discountPrice: 4999,
    images: [
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#C8B88A' },
      { name: 'Navy', hex: '#000080' },
    ],
    rating: 4.6,
    reviewsCount: 73,
    tags: ['premium', 'new'],
    stock: 11,
    description: 'An unstructured linen blazer that balances sophistication with effortless ease. Features patch pockets, a two-button closure, and a soft, deconstructed shoulder for a relaxed silhouette.',
    material: '100% European Linen',
    care: ['Dry clean recommended', 'Iron on medium heat while damp'],
  },
  {
    id: 'prod_035',
    name: 'Rain Jacket — Waterproof',
    slug: 'rain-jacket-waterproof',
    category: 'Jackets',
    gender: 'Unisex',
    price: 3999,
    discountPrice: 2999,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Olive', hex: '#556B2F' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.4,
    reviewsCount: 156,
    tags: ['new', 'essential'],
    stock: 22,
    description: 'A lightweight, packable rain jacket with fully sealed seams and a water-resistant zipper. Features an adjustable hood, zippered pockets, and reflective details for visibility.',
    material: '100% Recycled Polyester with DWR coating',
    care: ['Machine wash cold', 'Tumble dry low to reactivate DWR'],
  },
];

export default products;

/**
 * Get all unique categories from products.
 */
export const getCategories = () => {
  return [...new Set(products.map((p) => p.category))];
};

/**
 * Get products by category slug.
 */
export const getProductsByCategory = (category) => {
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Get a single product by its ID.
 */
export const getProductById = (id) => {
  return products.find((p) => p.id === id);
};

/**
 * Get a single product by slug.
 */
export const getProductBySlug = (slug) => {
  return products.find((p) => p.slug === slug);
};

/**
 * Get products filtered by tags.
 */
export const getProductsByTag = (tag) => {
  return products.filter((p) => p.tags.includes(tag));
};

/**
 * Search products by name or description.
 */
export const searchProducts = (query) => {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );
};
