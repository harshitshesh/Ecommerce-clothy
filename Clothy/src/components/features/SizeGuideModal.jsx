/**
 * SizeGuideModal — Interactive sizing chart with Inches / CM toggle
 */
import { useState } from 'react';
import Modal from '../ui/Modal';

const SIZES_DATA = [
  { size: 'XS', chestIn: '34-36', chestCm: '86-91', waistIn: '28-30', waistCm: '71-76', hipsIn: '35-37', hipsCm: '89-94' },
  { size: 'S', chestIn: '36-38', chestCm: '91-96', waistIn: '30-32', waistCm: '76-81', hipsIn: '37-39', hipsCm: '94-99' },
  { size: 'M', chestIn: '38-40', chestCm: '96-101', waistIn: '32-34', waistCm: '81-86', hipsIn: '39-41', hipsCm: '99-104' },
  { size: 'L', chestIn: '40-42', chestCm: '101-106', waistIn: '34-36', waistCm: '86-91', hipsIn: '41-43', hipsCm: '104-109' },
  { size: 'XL', chestIn: '42-44', chestCm: '106-111', waistIn: '36-38', waistCm: '91-96', hipsIn: '43-45', hipsCm: '109-114' },
  { size: 'XXL', chestIn: '44-46', chestCm: '111-116', waistIn: '38-40', waistCm: '96-101', hipsIn: '45-47', hipsCm: '114-119' },
];

export default function SizeGuideModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState('in'); // 'in' or 'cm'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Garment Sizing Matrix" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Unit Toggle */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500">
            Standard regular fit tailored to international luxury specifications.
          </p>
          <div className="inline-flex rounded-lg p-1 bg-cream-dark dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                unit === 'in'
                  ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal shadow-sm'
                  : 'text-gray-500 hover:text-charcoal dark:hover:text-cream'
              }`}
            >
              Inches (&quot;)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                unit === 'cm'
                  ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal shadow-sm'
                  : 'text-gray-500 hover:text-charcoal dark:hover:text-cream'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pr-4">Size</th>
                <th className="pb-3 px-4">Chest</th>
                <th className="pb-3 px-4">Waist</th>
                <th className="pb-3 pl-4">Hips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800">
              {SIZES_DATA.map((row) => (
                <tr key={row.size} className="hover:bg-cream-dark/40 dark:hover:bg-gray-800/40">
                  <td className="py-3 pr-4 font-bold text-charcoal dark:text-cream">{row.size}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {unit === 'in' ? `${row.chestIn} in` : `${row.chestCm} cm`}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {unit === 'in' ? `${row.waistIn} in` : `${row.waistCm} cm`}
                  </td>
                  <td className="py-3 pl-4 text-gray-600 dark:text-gray-300">
                    {unit === 'in' ? `${row.hipsIn} in` : `${row.hipsCm} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to measure tips */}
        <div className="p-4 rounded-xl bg-cream-dark/50 dark:bg-charcoal-light/30 border border-gray-200/60 dark:border-gray-800 text-xs space-y-1.5 text-gray-600 dark:text-gray-300">
          <p className="font-bold text-charcoal dark:text-cream mb-1">Fitting Guidance:</p>
          <p>• <strong>Chest:</strong> Measure horizontally around the fullest part of your chest.</p>
          <p>• <strong>Waist:</strong> Measure around your natural waistline, maintaining a relaxed tape.</p>
          <p>• <strong>Hips:</strong> Measure around the widest part of your hips.</p>
          <p className="text-gold font-semibold pt-1">
            *If in-between sizes, we recommend sizing up for a relaxed drape or sizing down for a slim silhouette.
          </p>
        </div>
      </div>
    </Modal>
  );
}
