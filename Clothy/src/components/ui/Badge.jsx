/**
 * Badge — Versatile tag/pill component with fashion styling variants
 */
import { cn } from '../../utils/cn';

const variants = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  gold: 'bg-gold/15 text-gold border border-gold/30',
  charcoal: 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal',
  sale: 'bg-error text-white font-semibold',
  success: 'bg-success/15 text-success border border-success/30',
  outline: 'border border-gray-300 dark:border-gray-700 text-charcoal dark:text-cream',
};

const sizes = {
  xs: 'text-[10px] px-2 py-0.5 tracking-wider uppercase font-semibold rounded',
  sm: 'text-xs px-2.5 py-1 font-medium rounded-md',
  md: 'text-sm px-3 py-1.5 font-medium rounded-lg',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center transition-all',
        variants[variant] || variants.default,
        sizes[size] || sizes.sm,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
