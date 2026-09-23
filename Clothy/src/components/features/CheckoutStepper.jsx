/**
 * CheckoutStepper — Visual multi-stage checkout progress bar
 */
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Shopping Bag' },
  { id: 2, label: 'Delivery Address' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirmation' },
];

export default function CheckoutStepper({ currentStep = 2 }) {
  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0" />
        
        {/* Active Line Fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-6 h-0.5 bg-gold transition-all duration-500 -z-0"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Step Nodes */}
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-gold text-white shadow-sm'
                    : isCurrent
                    ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal ring-4 ring-gold/20'
                    : 'bg-cream dark:bg-charcoal border-2 border-gray-300 dark:border-gray-700 text-gray-400'
                }`}
              >
                {isCompleted ? <Check size={14} /> : step.id}
              </div>
              <span
                className={`text-[11px] font-semibold mt-2 uppercase tracking-wider hidden sm:block ${
                  isCurrent
                    ? 'text-charcoal dark:text-cream'
                    : isCompleted
                    ? 'text-gold'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
