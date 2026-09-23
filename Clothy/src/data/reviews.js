/**
 * CLOZARI — Mock Reviews Data
 */
const reviews = [
  { id: 'rev_01', productId: 'prod_001', userName: 'Arjun M.', rating: 5, date: '2026-09-10', title: 'Perfect fit and quality', text: 'The oversized fit is exactly what I was looking for. The cotton feels incredibly soft and premium. Will definitely order more colors.', helpful: 24, images: [] },
  { id: 'rev_02', productId: 'prod_001', userName: 'Priya S.', rating: 4, date: '2026-09-05', title: 'Great quality, slightly long', text: 'Love the fabric quality and the relaxed fit. It runs a bit long for my height (5\'4") but still looks great tucked in.', helpful: 18, images: [] },
  { id: 'rev_03', productId: 'prod_004', userName: 'Rahul K.', rating: 5, date: '2026-08-28', title: 'Best basic tee ever', text: 'I\'ve been searching for the perfect crew neck tee and this is it. The weight is just right — not too thin, not too thick. Ordered 3 of each color.', helpful: 42, images: [] },
  { id: 'rev_04', productId: 'prod_007', userName: 'Vikram P.', rating: 5, date: '2026-08-20', title: 'Premium selvedge at great price', text: 'The selvedge detailing is beautiful. These jeans are stiff initially but are breaking in beautifully. The slim fit is perfect — snug but comfortable.', helpful: 31, images: [] },
  { id: 'rev_05', productId: 'prod_010', userName: 'Ananya R.', rating: 5, date: '2026-09-12', title: 'Absolutely stunning', text: 'This wrap dress is gorgeous. The emerald color is even more beautiful in person. I wore it to a cocktail party and got so many compliments.', helpful: 56, images: [] },
  { id: 'rev_06', productId: 'prod_013', userName: 'Karan D.', rating: 5, date: '2026-07-15', title: 'Worth every rupee', text: 'The leather is butter-soft and the quality is exceptional. This jacket makes any outfit look 10x better. The fit runs slightly slim, size up if between sizes.', helpful: 67, images: [] },
  { id: 'rev_07', productId: 'prod_017', userName: 'Sneha T.', rating: 4, date: '2026-08-01', title: 'Clean and versatile', text: 'Love the minimalist design. They go with everything. Only gripe is the break-in period — they were stiff for the first week.', helpful: 23, images: [] },
  { id: 'rev_08', productId: 'prod_021', userName: 'Meera J.', rating: 5, date: '2026-09-01', title: 'My everyday bag', text: 'The leather quality is outstanding and the size is perfect for daily essentials. The tan color has developed a beautiful patina over time.', helpful: 39, images: [] },
  { id: 'rev_09', productId: 'prod_027', userName: 'Aditya S.', rating: 5, date: '2026-08-15', title: 'Coziest hoodie I own', text: 'The 400 GSM weight makes this hoodie incredibly warm and cozy. The oversized fit is perfect for lounging. Ordered two more!', helpful: 45, images: [] },
  { id: 'rev_10', productId: 'prod_032', userName: 'Riya P.', rating: 5, date: '2026-09-08', title: 'Elegant timepiece', text: 'This watch is absolutely beautiful. The gold tone is subtle and elegant, not flashy. The leather strap is comfortable from day one. Gets compliments everywhere.', helpful: 73, images: [] },
  { id: 'rev_11', productId: 'prod_010', userName: 'Nandini K.', rating: 4, date: '2026-08-22', title: 'Beautiful but delicate', text: 'The dress is absolutely beautiful and fits like a dream. The fabric drapes wonderfully. Just be careful — it wrinkles easily.', helpful: 15, images: [] },
  { id: 'rev_12', productId: 'prod_015', userName: 'Tanvi M.', rating: 5, date: '2026-09-14', title: 'Cute and warm', text: 'Perfect puffer for autumn! The cropped length looks great with high-waisted jeans. Surprisingly warm for how lightweight it is.', helpful: 28, images: [] },
];

export default reviews;

export const getReviewsByProductId = (productId) => {
  return reviews.filter((r) => r.productId === productId);
};
