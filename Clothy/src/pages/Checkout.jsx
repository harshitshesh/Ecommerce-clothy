/**
 * Checkout Page — Multi-stage seamless checkout
 * Addresses, delivery methods, mock payment (UPI/Card/COD), and instant order confirmation
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';
import CheckoutStepper from '../components/features/CheckoutStepper';
import AddressForm from '../components/features/AddressForm';
import EmptyState from '../components/ui/EmptyState';
import useCartStore from '../store/useCartStore';
import useUserStore from '../store/useUserStore';
import { formatCurrency } from '../utils/formatCurrency';

export default function Checkout() {
  const { items, getSubtotal, getDiscount, getShipping, clearCart } = useCartStore();
  const { addresses, addAddress } = useUserStore();

  const [step, setStep] = useState(2); // 2: Address, 3: Payment, 4: Confirmed
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' or 'express'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'cod'
  const [orderConfirmedData, setOrderConfirmedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const baseShipping = getShipping();
  const shippingCost = shippingMethod === 'express' ? baseShipping + 199 : baseShipping;
  const finalTotal = subtotal - discount + shippingCost;

  if (items.length === 0 && step !== 4) {
    return (
      <div className="pt-32 pb-20 container-custom">
        <EmptyState
          type="cart"
          title="No Items to Checkout"
          description="Your shopping bag is currently empty."
          actionText="Explore Catalogue"
          actionHref="/shop"
        />
      </div>
    );
  }

  const handleAddNewAddress = (newAddr) => {
    addAddress(newAddr);
    setShowNewAddressForm(false);
    setSelectedAddressIndex(addresses.length);
    toast.success('Shipping address saved!');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
      const activeAddress = addresses[selectedAddressIndex] || addresses[0];

      const confirmedData = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...items],
        total: finalTotal,
        address: activeAddress,
        paymentMethod: paymentMethod.toUpperCase(),
      };

      setOrderConfirmedData(confirmedData);
      clearCart();
      setIsProcessing(false);
      setStep(4);
      toast.success('Order placed successfully!', { icon: '🎉' });
    }, 1200);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom">
        {/* Progress Stepper */}
        <CheckoutStepper currentStep={step} />

        {step === 4 && orderConfirmedData ? (
          /* Confirmation View */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center px-8 py-12 rounded-3xl bg-cream dark:bg-charcoal border border-gold/40 shadow-elevated"
          >
            <div className="w-16 h-16 rounded-full bg-success/15 text-success mx-auto flex items-center justify-center mb-6">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
              Payment Authorized
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal dark:text-cream mb-2">
              Thank You for Your Patronage
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-md mx-auto">
              Your order <strong className="text-charcoal dark:text-cream">{orderConfirmedData.id}</strong> has been received by our atelier and is being carefully prepared.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-cream-dark/50 dark:bg-charcoal-light/30 rounded-2xl p-6 text-left text-xs space-y-3 mb-8 border border-gray-200/60 dark:border-gray-800">
              <div className="flex justify-between border-b border-gray-200/40 dark:border-gray-700 pb-2.5">
                <span className="text-gray-400">Order Reference</span>
                <span className="font-mono font-bold text-charcoal dark:text-cream">{orderConfirmedData.id}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/40 dark:border-gray-700 pb-2.5">
                <span className="text-gray-400">Delivery Destination</span>
                <span className="font-medium text-charcoal dark:text-cream">
                  {orderConfirmedData.address?.name}, {orderConfirmedData.address?.city}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200/40 dark:border-gray-700 pb-2.5">
                <span className="text-gray-400">Payment Mode</span>
                <span className="font-medium text-charcoal dark:text-cream">{orderConfirmedData.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-charcoal dark:text-cream">Amount Charged</span>
                <span className="text-gold font-serif text-base">{formatCurrency(orderConfirmedData.total)}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/account/orders"
                className="px-6 py-3.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Track Order
              </Link>
              <Link
                to="/shop"
                className="px-6 py-3.5 border border-charcoal/20 dark:border-cream/20 text-charcoal dark:text-cream rounded-xl text-xs font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Two-Column Checkout Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-4">
            {/* Main Stage Panel (Col 8) */}
            <div className="lg:col-span-8 bg-cream dark:bg-charcoal p-6 sm:p-8 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card">
              <AnimatePresence mode="wait">
                {step === 2 ? (
                  /* Step 2: Shipping Address & Delivery Option */
                  <motion.div
                    key="step-address"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 dark:border-gray-800">
                      <div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal dark:text-cream">
                          Delivery Address
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Where shall our couriers deliver your garments?
                        </p>
                      </div>
                      {!showNewAddressForm && (
                        <button
                          onClick={() => setShowNewAddressForm(true)}
                          className="text-xs font-bold uppercase tracking-wider text-gold hover:underline"
                        >
                          + New Address
                        </button>
                      )}
                    </div>

                    {showNewAddressForm ? (
                      <div className="p-4 rounded-xl bg-cream-dark/30 dark:bg-charcoal-light/20 border border-gold/30">
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-4">
                          Add New Destination
                        </h3>
                        <AddressForm
                          onSubmit={handleAddNewAddress}
                          onCancel={() => setShowNewAddressForm(false)}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((addr, idx) => (
                          <div
                            key={addr.id || idx}
                            onClick={() => setSelectedAddressIndex(idx)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedAddressIndex === idx
                                ? 'border-gold bg-gold/5 shadow-sm'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-xs text-charcoal dark:text-cream">
                                {addr.name}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] bg-charcoal text-cream dark:bg-cream dark:text-charcoal px-2 py-0.5 rounded font-semibold">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                              {addr.line1}, {addr.line2 ? `${addr.line2}, ` : ''}{addr.city}, {addr.state} — {addr.pin}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Phone: {addr.phone}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Delivery Option */}
                    <div className="pt-6 border-t border-gray-200/60 dark:border-gray-800">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream mb-3">
                        Shipping Service
                      </h3>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            shippingMethod === 'standard'
                              ? 'border-gold bg-gold/5'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={shippingMethod === 'standard'}
                              onChange={() => setShippingMethod('standard')}
                              className="w-4 h-4 accent-gold"
                            />
                            <div>
                              <span className="text-xs font-bold block text-charcoal dark:text-cream">
                                Complimentary Standard Shipping
                              </span>
                              <span className="text-[11px] text-gray-500">
                                3–5 business days across all metros
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-success">
                            {baseShipping === 0 ? 'FREE' : formatCurrency(baseShipping)}
                          </span>
                        </label>

                        <label
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            shippingMethod === 'express'
                              ? 'border-gold bg-gold/5'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={shippingMethod === 'express'}
                              onChange={() => setShippingMethod('express')}
                              className="w-4 h-4 accent-gold"
                            />
                            <div>
                              <span className="text-xs font-bold block text-charcoal dark:text-cream">
                                Priority Atelier Express (Next Day)
                              </span>
                              <span className="text-[11px] text-gray-500">
                                Delivered by 6 PM tomorrow
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gold">
                            +{formatCurrency(199)}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200/60 dark:border-gray-800 flex justify-end">
                      <button
                        onClick={() => setStep(3)}
                        className="px-8 py-3.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 shadow-soft"
                      >
                        <span>Continue to Payment</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Step 3: Payment Method */
                  <motion.div
                    key="step-payment"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="pb-4 border-b border-gray-200/60 dark:border-gray-800">
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal dark:text-cream">
                        Payment Method
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Select your preferred payment gateway
                      </p>
                    </div>

                    {/* Payment Mode Tabs */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all ${
                          paymentMethod === 'upi'
                            ? 'border-gold bg-gold/10 text-gold shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'
                        }`}
                      >
                        <QrCode size={22} />
                        <span>UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all ${
                          paymentMethod === 'card'
                            ? 'border-gold bg-gold/10 text-gold shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'
                        }`}
                      >
                        <CreditCard size={22} />
                        <span>Cards</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all ${
                          paymentMethod === 'cod'
                            ? 'border-gold bg-gold/10 text-gold shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'
                        }`}
                      >
                        <Truck size={22} />
                        <span>Cash on Delivery</span>
                      </button>
                    </div>

                    {/* Method Details */}
                    {paymentMethod === 'upi' && (
                      <div className="p-5 rounded-xl bg-cream-dark/30 dark:bg-charcoal-light/20 border border-gray-200/60 dark:border-gray-800 space-y-4 text-xs">
                        <p className="font-semibold text-charcoal dark:text-cream">
                          Pay instantly using any UPI App (GPay, PhonePe, Paytm):
                        </p>
                        <input
                          type="text"
                          placeholder="yourname@okhdfcbank"
                          defaultValue="arjun.mehta@oksbi"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal"
                        />
                        <p className="text-[11px] text-gray-500">
                          A payment mandate will be sent directly to your UPI smartphone application.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="p-5 rounded-xl bg-cream-dark/30 dark:bg-charcoal-light/20 border border-gray-200/60 dark:border-gray-800 space-y-3 text-xs">
                        <div>
                          <label className="block uppercase font-bold text-gray-400 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="4532 •••• •••• 8920"
                            defaultValue="4532 8921 4452 8920"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block uppercase font-bold text-gray-400 mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              defaultValue="09/28"
                              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal font-mono"
                            />
                          </div>
                          <div>
                            <label className="block uppercase font-bold text-gray-400 mb-1">
                              CVV
                            </label>
                            <input
                              type="password"
                              placeholder="•••"
                              defaultValue="382"
                              maxLength={4}
                              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="p-5 rounded-xl bg-cream-dark/30 dark:bg-charcoal-light/20 border border-gray-200/60 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
                        <p>
                          Pay with cash or UPI QR code upon doorstep delivery. Our courier will carry a point-of-sale scanner for contactless payment.
                        </p>
                      </div>
                    )}

                    <div className="pt-6 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-charcoal dark:hover:text-cream flex items-center gap-1.5"
                      >
                        <ArrowLeft size={14} /> Back to Address
                      </button>

                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="px-8 py-3.5 bg-gold text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gold-dark transition-colors flex items-center gap-2 shadow-soft disabled:opacity-50"
                      >
                        {isProcessing ? 'Authorizing Order...' : `Pay ${formatCurrency(finalTotal)}`}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Compact Order Summary Sidebar (Col 4) */}
            <div className="lg:col-span-4 bg-cream dark:bg-charcoal p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card space-y-5">
              <h3 className="font-serif font-bold text-base text-charcoal dark:text-cream pb-3 border-b border-gray-200/60 dark:border-gray-800">
                Garments in Order ({items.length})
              </h3>

              {/* Items preview */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-200/40 dark:divide-gray-800 space-y-3">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="pt-3 first:pt-0 flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-lg bg-gray-100 dark:bg-gray-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-charcoal dark:text-cream line-clamp-1">
                        {item.name}
                      </h5>
                      <p className="text-[10px] text-gray-400">
                        Qty {item.quantity} • Size {item.size}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-charcoal dark:text-cream">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-gray-200/60 dark:border-gray-800 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal dark:text-cream">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <strong className="text-success">FREE</strong> : formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-charcoal dark:text-cream pt-2 border-t border-gray-200/40 dark:border-gray-700">
                  <span>Final Total</span>
                  <span className="text-gold font-serif text-lg">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                  <ShieldCheck size={14} className="text-gold" />
                  Protected by 256-Bit SSL Encryption
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
