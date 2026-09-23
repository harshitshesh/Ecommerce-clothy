/**
 * OrderTracker — Visual stepper timeline displaying package delivery status
 */
import { Check, Package, Clock, Truck, Home } from 'lucide-react';

const ICONS = {
  'Order Placed': Clock,
  'Confirmed': Check,
  'Shipped': Package,
  'Out for Delivery': Truck,
  'Delivered': Home,
};

export default function OrderTracker({ tracking = [] }) {
  return (
    <div className="py-6">
      <div className="relative pl-6 sm:pl-0 sm:flex sm:items-start sm:justify-between space-y-6 sm:space-y-0">
        {/* Desktop Connecting Line */}
        <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0" />

        {/* Mobile Vertical Line */}
        <div className="sm:hidden absolute top-3 bottom-3 left-2.5 w-0.5 bg-gray-200 dark:bg-gray-700 -z-0" />

        {tracking.map((step, idx) => {
          const Icon = ICONS[step.status] || Check;
          const isDone = step.completed;

          return (
            <div
              key={idx}
              className="relative flex sm:flex-col sm:items-center text-left sm:text-center group"
            >
              {/* Icon Bubble */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                  isDone
                    ? 'bg-gold text-white shadow-sm'
                    : 'bg-cream dark:bg-charcoal border-2 border-gray-300 dark:border-gray-700 text-gray-400'
                }`}
              >
                <Icon size={14} />
              </div>

              {/* Status Label & Date */}
              <div className="ml-4 sm:ml-0 sm:mt-2.5">
                <h5
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDone
                      ? 'text-charcoal dark:text-cream'
                      : 'text-gray-400'
                  }`}
                >
                  {step.status}
                </h5>
                {step.date ? (
                  <p className="text-[11px] text-gray-500 mt-0.5">{step.date}</p>
                ) : (
                  <p className="text-[11px] text-gray-400 mt-0.5 italic">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
