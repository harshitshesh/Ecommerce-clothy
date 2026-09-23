/**
 * Compare Page — Side-by-side garment comparison matrix
 */
import Breadcrumbs from '../components/ui/Breadcrumbs';
import CompareTable from '../components/features/CompareTable';

export default function Compare() {
  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: 'Garment Comparison' }]} />
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
            Textile & Cut Analysis
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-3">
            Compare Silhouettes
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Examine textile compositions, drape profiles, sizing, and pricing side by side to make an informed choice.
          </p>
        </div>

        {/* Matrix Table */}
        <CompareTable />
      </div>
    </div>
  );
}
