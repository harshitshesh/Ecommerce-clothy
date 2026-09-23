/**
 * Breadcrumbs — Navigation breadcrumbs with semantic markup
 */
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        <li>
          <Link
            to="/"
            className="text-gray-500 dark:text-gray-400 hover:text-gold transition-colors flex items-center gap-1"
          >
            <Home size={14} />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-gray-400" />
            {index === items.length - 1 ? (
              <span className="text-charcoal dark:text-cream font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-gray-500 dark:text-gray-400 hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
