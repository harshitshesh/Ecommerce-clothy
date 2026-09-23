/**
 * CountdownTimer — Animated countdown for flash sales
 */
import useCountdown from '../../hooks/useCountdown';
import { motion } from 'framer-motion';

export default function CountdownTimer({ targetDate, size = 'md' }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return <p className="text-sm text-gray-500 font-medium">Sale has ended</p>;
  }

  const units = [
    { label: 'Days', value: days },
    { label: 'Hrs', value: hours },
    { label: 'Min', value: minutes },
    { label: 'Sec', value: seconds },
  ];

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <motion.div
              key={unit.value}
              initial={{ y: -5, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              className={`${sizeClasses[size]} bg-charcoal dark:bg-cream-dark text-cream dark:text-charcoal rounded-lg flex items-center justify-center font-bold font-sans tabular-nums`}
            >
              {String(unit.value).padStart(2, '0')}
            </motion.div>
            <span className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-xl font-bold text-gray-400 mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
