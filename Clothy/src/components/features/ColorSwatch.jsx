/**
 * ColorSwatch — Swatch circles for color selection
 */
import { Check } from 'lucide-react';

export default function ColorSwatch({ colors = [], selectedColor, onSelectColor }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider mb-2.5 text-gray-500">
        Selected Shade: <strong className="text-charcoal dark:text-cream">{selectedColor?.name || colors[0]?.name}</strong>
      </div>
      <div className="flex gap-3">
        {colors.map((c) => {
          const isSelected = selectedColor?.name === c.name;
          const isLight = c.hex?.toLowerCase() === '#ffffff' || c.hex?.toLowerCase() === '#f5f5f0' || c.hex?.toLowerCase() === '#d2b48c';
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onSelectColor(c)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? 'ring-2 ring-gold ring-offset-2 scale-110 shadow-sm'
                  : 'border border-gray-300 dark:border-gray-700 hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            >
              {isSelected && (
                <Check
                  size={14}
                  className={isLight ? 'text-charcoal' : 'text-white'}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
