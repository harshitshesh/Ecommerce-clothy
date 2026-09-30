/**
 * Checkout Page — Multi-stage seamless checkout
 * Addresses, delivery methods, mock payment (UPI/Card/COD), and instant order confirmation
 */
import { useState, useEffect } from 'react';
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
  Coins,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import CheckoutStepper from '../components/features/CheckoutStepper';
import AddressForm from '../components/features/AddressForm';
import EmptyState from '../components/ui/EmptyState';
import PriceBreakdown from '../components/features/PriceBreakdown';
import CouponInput from '../components/features/CouponInput';
import OfferList from '../components/features/OfferList';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import useOrdersStore from '../store/useOrdersStore';
import useWalletStore from '../store/useWalletStore';
import useWallet from '../hooks/useWallet';
import { useAddresses } from '../hooks/useCurrentUser';
import usePricing from '../hooks/usePricing';
import { EXPRESS_SHIPPING_FEE } from '../utils/pricing';
import { coinsEarnedFor } from '../utils/wallet';
import { formatCurrency } from '../utils/formatCurrency';
import {
  decrementVariantStock,
  softReserveCheckout,
  clearCheckoutReservation,
  getVariantSku,
} from '../utils/variantStock';

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const session = useAuthStore((s) => s.session);
  const addresses = useAddresses();
  const addAddress = useAuthStore((s) => s.addAddress);
  const addOrder = useOrdersStore((state) => state.addOrder);
  const { coins: walletBalance } = useWallet(session?.id);

  const [step, setStep] = useState(2); // 2: Address, 3: Payment, 4: Confirmed
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(addresses.length === 0);
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' or 'express'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'cod'
  const [useWalletCoins, setUseWalletCoins] = useState(false);
  const [orderConfirmedData, setOrderConfirmedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const extraShipping = shippingMethod === 'express' ? EXPRESS_SHIPPING_FEE : 0;
  const pricingWithoutWallet = usePricing(extraShipping);
  const walletCoinsUsed = useWalletCoins
    ? Math.min(walletBalance, pricingWithoutWallet.grandTotal)
    : 0;
  const pricing = usePricing(extraShipping, walletCoinsUsed);
  const standardShipping = usePricing(0).shipping;
  const amountDue = pricing.amountDue;
  const fullyPaidByWallet = walletCoinsUsed > 0 && amountDue === 0;
  const coinsToEarn = coinsEarnedFor(amountDue);

  // Safe Stock Locking: Soft-reserve SKU stock during checkout (PRD Section 4)
  useEffect(() => {
    if (items.length > 0 && step !== 4) {
      softReserveCheckout(items);
    }
    return () => {
      // Release soft reservations if customer navigates away before placing order
      if (step !== 4) {
        clearCheckoutReservation();
      }
    };
  }, [items, step]);

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
    const saved = addAddress(newAddr);
    setShowNewAddressForm(false);
    if (saved) setSelectedAddressIndex(addresses.length);
    toast.success('Shipping address saved!');
  };

  const handlePlaceOrder = () => {
    const activeAddress = addresses[selectedAddressIndex] || addresses[0];
    if (!activeAddress) {
      setShowNewAddressForm(true);
      setStep(2);
      toast.error('Please add a delivery address before placing the order.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;

      // Freeze the exact totals the customer saw before the cart is cleared
      const snapshot = pricing;
      const now = new Date();
      const orderDate = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const baseMethod =
        paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : 'COD';
      const paymentLabel =
        walletCoinsUsed <= 0
          ? baseMethod
          : walletCoinsUsed >= snapshot.grandTotal
            ? 'Wallet'
            : `Wallet + ${baseMethod}`;

      // Customer snapshot frozen onto the order (invoice "Billed to"/"Shipped to")
      const customer = {
        name: session?.name || activeAddress.name,
        email: session?.email || '',
        phone: session?.phone || activeAddress.phone || '',
        address: activeAddress,
      };

      // Wallet: spend the coins, then credit what the order earned
      if (walletCoinsUsed > 0) {
        useWalletStore.getState().debit(session?.id, walletCoinsUsed, {
          type: 'spent',
          orderId,
          note: `Wallet coins used on order ${orderId}`,
        });
      }
      const coinsEarned = coinsToEarn;
      if (coinsEarned > 0) {
        useWalletStore.getState().credit(session?.id, coinsEarned, {
          type: 'earned',
          orderId,
          note: `Earned on order ${orderId}`,
        });
      }

      const confirmedItems = items.map((item) => {
        const pId = item.id || item.productId;
        const cName = typeof item.color === 'string' ? item.color : item.color?.name;
        return {
          ...item,
          sku: item.sku || getVariantSku(pId, cName, item.size),
        };
      });

      // Permanently decrement stock for each purchased SKU (PRD 3.1 Step 10 & Section 4)
      confirmedItems.forEach((item) => {
        const pId = item.id || item.productId;
        const cName = typeof item.color === 'string' ? item.color : item.color?.name;
        decrementVariantStock(pId, cName, item.size, item.quantity || 1);
      });
      clearCheckoutReservation();

      const confirmedData = {
        id: orderId,
        invoiceNo: `INV-${orderId.replace('ORD-', '')}`,
        userId: session?.id,
        date: orderDate,
        status: 'Processing',
        items: confirmedItems,
        pricing: snapshot,
        subtotal: snapshot.subtotal,
        discount: snapshot.offerDiscount,
        shipping: snapshot.shipping,
        offerCode: snapshot.offerCode,
        total: snapshot.grandTotal,
        walletCoinsUsed,
        amountPaid: amountDue,
        coinsUsed: walletCoinsUsed,
        coinsEarned,
        address: activeAddress,
        customer,
        paymentMethod: paymentLabel,
        payment: {
          method: paymentLabel,
          last4: paymentMethod === 'card' ? '8920' : paymentMethod === 'upi' ? '****' : '',
        },
        tracking: [
          { status: 'Order Placed', date: `${orderDate} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`, completed: true },
          { status: 'Confirmed', date: `${orderDate} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`, completed: true },
          { status: 'Shipped', date: '', completed: false },
          { status: 'Out for Delivery', date: '', completed: false },
          { status: 'Delivered', date: '', completed: false },
        ],
      };

      addOrder(confirmedData);
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
              {session?.name
                ? `Thank You, ${session.name.split(' ')[0]}`
                : 'Thank You for Your Patronage'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-md mx-auto">
              Your order <strong className="text-charcoal dark:text-cream">{orderConfirmedData.id}</strong> has been received by our atelier and is being carefully prepared for{' '}
              {orderConfirmedData.address?.name || session?.name || 'you'}.
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
              <div className="flex justify-between border-b border-gray-200/40 dark:border-gray-700 pb-2.5">
                <span className="text-gray-400">Wallet Coins Used</span>
                <span className="font-medium text-charcoal dark:text-cream">
                  {orderConfirmedData.coinsUsed > 0
                    ? `${orderConfirmedData.coinsUsed} coins (−${formatCurrency(orderConfirmedData.coinsUsed)})`
                    : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Coins Earned</span>
                <span className="font-bold text-gold">
                  +{orderConfirmedData.coinsEarned || 0} coins
                </span>
              </div>
            </div>

            {/* Full pricing breakdown — same component as cart, checkout & invoice */}
            <div className="bg-cream dark:bg-charcoal p-6 rounded-2xl border border-gold/30 shadow-card text-left mb-8">
              <PriceBreakdown pricing={orderConfirmedData.pricing} title="Order Breakdown" />
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
                    ) : addresses.length === 0 ? (
                      <div className="p-8 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
                        <MapPin size={22} className="mx-auto text-gold mb-3" />
                        <p className="font-serif font-bold text-base text-charcoal dark:text-cream mb-1">
                          Add your first address
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          Save a delivery destination so we know where to send your order.
                        </p>
                        <button
                          onClick={() => setShowNewAddressForm(true)}
                          className="px-5 py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                        >
                          + Add Address
                        </button>
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
                            {standardShipping === 0 ? 'FREE' : formatCurrency(standardShipping)}
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
                            +{formatCurrency(EXPRESS_SHIPPING_FEE)}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200/60 dark:border-gray-800 flex justify-end">
                      <button
                        onClick={() => {
                          if (addresses.length === 0) {
                            setShowNewAddressForm(true);
                            toast.error('Add your first address to continue.');
                            return;
                          }
                          setStep(3);
                        }}
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

                    {/* Clozari Wallet */}
                    <div
                      className={`p-4 rounded-xl border ${
                        useWalletCoins && walletCoinsUsed > 0
                          ? 'border-gold bg-gold/5'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                            <Coins size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-bold block text-charcoal dark:text-cream">
                              Clozari Wallet
                            </span>
                            <span className="text-[11px] text-gray-500">
                              Balance: <strong className="text-gold">{walletBalance}</strong> coins
                              {' '}(1 coin = Rs. 1)
                            </span>
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer shrink-0">
                          <span className="text-[11px] font-semibold text-gray-500">
                            Use wallet coins
                          </span>
                          <input
                            type="checkbox"
                            checked={useWalletCoins}
                            disabled={walletBalance <= 0}
                            onChange={(e) => setUseWalletCoins(e.target.checked)}
                            className="w-4 h-4 accent-gold disabled:opacity-40"
                            aria-label="Use wallet coins"
                          />
                        </label>
                      </div>

                      {walletBalance <= 0 && (
                        <p className="text-[11px] text-gray-400 mt-2">
                          Your wallet balance is 0 — place an order to start earning coins.
                        </p>
                      )}

                      {useWalletCoins && walletCoinsUsed > 0 && (
                        <p className="text-[11px] font-semibold text-success mt-2">
                          {walletCoinsUsed} coins applied — you pay{' '}
                          {formatCurrency(amountDue)} via{' '}
                          {fullyPaidByWallet ? 'wallet only' : 'another method'}.
                        </p>
                      )}
                    </div>

                    {/* Payment Mode Tabs (hidden when the wallet covers everything) */}
                    {!fullyPaidByWallet && (
                    <>
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
                            placeholder="Card number"
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
                    </>
                    )}

                    {/* Earnings preview + place order */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/30 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-success">
                        <Coins size={14} /> You will earn {coinsToEarn} coins on this order
                      </span>
                      <span className="font-bold text-charcoal dark:text-cream">
                        {formatCurrency(amountDue)} to pay
                      </span>
                    </div>

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
                        {isProcessing
                          ? 'Authorizing Order...'
                          : fullyPaidByWallet
                            ? 'Place Order with Wallet'
                            : `Pay ${formatCurrency(amountDue)}`}
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
              <PriceBreakdown pricing={pricing} title="Order Summary" />

              {/* Offers — always visible while checking out, wallet or not */}
              <div className="pt-4 border-t border-gray-200/60 dark:border-gray-800 space-y-4">
                <div>
                  <CouponInput />
                </div>
                <OfferList />
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
