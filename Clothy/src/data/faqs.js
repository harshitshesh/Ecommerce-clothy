/**
 * CLOZARI — FAQ Data
 * 23 real questions across the six service categories.
 * Answers mirror the app's actual rules: 7-day return/exchange window,
 * free shipping above Rs. 1,999, GST included in every displayed price,
 * one coupon per order and a 1-coin-per-Rs.100 wallet.
 */
const faqs = [
  {
    category: 'Orders & Payment',
    items: [
      {
        q: 'Which payment methods can I use?',
        a: 'Clozari accepts UPI (GPay, PhonePe, Paytm), all major credit and debit cards and Cash on Delivery. You can also pay fully or partly with Clozari Wallet coins — on the payment step, switch on "Use wallet coins" and the rest of the amount can go on any other method.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes. COD is available at checkout as a payment method. Pay the courier by cash or by the UPI QR code they carry on delivery — no advance payment is needed.',
      },
      {
        q: 'How do coupons work?',
        a: 'Enter your code in the coupon box on the cart or checkout page and press Apply. Only one coupon can be used per order, and every code has a minimum order value (shown next to it under "Available offers"). If your bag is short, the offer card tells you exactly how much more to add.',
      },
      {
        q: 'How do I cancel my order?',
        a: 'Orders can be cancelled before they are shipped. Open My Orders, choose the order and contact our concierge with the order reference — once an order is out for delivery you can instead use the 7-day return or exchange option after it arrives.',
      },
      {
        q: 'Can I download my invoice?',
        a: 'Yes. Open the order from My Orders and press "Download Invoice". The PDF contains the billed-to and shipped-to details, every item, GST breakup and the exact totals shown on screen.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'How much is shipping?',
        a: 'Standard shipping is free on every order above Rs. 1,999 — below that a flat Rs. 99 applies. Priority Atelier Express (next-day delivery in metros) costs an extra Rs. 199 and can be selected on the address step of checkout.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 3–5 business days across metros and 5–7 days elsewhere in India. Express orders are delivered by 6 PM the next day if you order before the cut-off shown at checkout.',
      },
      {
        q: 'How do I track my order?',
        a: 'Go to My Orders and open the order — the Delivery Milestones timeline shows Placed, Confirmed, Shipped, Out for Delivery and Delivered with dates as they happen.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Not yet. Clozari currently ships across India only. International delivery is on our roadmap — subscribe to the newsletter to be told when it launches.',
      },
    ],
  },
  {
    category: 'Size & Fit',
    items: [
      {
        q: 'How do I pick the right size?',
        a: 'Open any product page and click "Size Guide" next to the size picker — it shows body measurements in inches and centimetres. Measure chest, waist and length, match them to the chart and check the fit note (slim, regular or oversized) in the description.',
      },
      {
        q: 'Are Clozari garments true to size?',
        a: 'Our regular and slim fits run true to size, while pieces marked oversized are intentionally roomy — size down if you want a closer fit. Customer reviews on each product page call out any style that runs small or large.',
      },
      {
        q: 'The colour looks different from the photos.',
        a: 'Screens and lighting vary, so shades can shift slightly from the photo. Product shots are taken in daylight with minimal editing; if the piece still does not match what you expected, exchange it for another colour within the 7-day window.',
      },
    ],
  },
  {
    category: 'Returns & Exchange',
    items: [
      {
        q: 'What is the return and exchange window?',
        a: 'You have 7 days from the date of delivery. The Return and Exchange buttons appear on each item of the Order Detail page while the window is open; after that they are disabled because the window has closed.',
      },
      {
        q: 'How do I exchange a size?',
        a: 'On the order, press Exchange, choose the quantity and a reason, then pick the new size for the same product and colour. Sizes that are out of stock are disabled. Select a pickup slot and confirm — the new size is reserved for you as soon as the request is submitted.',
      },
      {
        q: 'How do I return an item and how long is the refund?',
        a: 'Press Return on the item, choose a reason and a pickup slot, then select your refund method. Refunds to the original payment method take 5–7 business days after the pickup; refunds to Clozari Wallet coins land instantly and can be used on your next order.',
      },
      {
        q: 'What happens to the coins I earned on a returned item?',
        a: 'The share of wallet coins earned on that item is reversed, and any wallet coins you spent on it are added back to your balance. You can follow the whole request in the Returns & Exchanges list under My Orders.',
      },
      {
        q: 'What if the exchange size is out of stock?',
        a: 'Unavailable sizes cannot be selected. If nothing suitable is left, request a refund instead — the modal offers you that option, and you can reorder another size as soon as it is back.',
      },
    ],
  },
  {
    category: 'Offers & Wallet',
    items: [
      {
        q: 'How does the Clozari Wallet work?',
        a: 'The wallet holds coins where 1 coin = Re. 1. You earn 1 coin for every Rs. 100 you actually pay, credited as soon as an order is placed, and you start with a 50-coin welcome bonus. Spend them on the payment step — partially or on their own.',
      },
      {
        q: 'How do I use my coins at checkout?',
        a: 'On the payment step, switch on "Use wallet coins". We deduct as many coins as you have (up to the order total) and show a "Wallet coins used" row in the breakdown. If your balance covers the whole order, the other payment methods disappear and the order is paid entirely by wallet.',
      },
      {
        q: 'Do wallet coins expire?',
        a: 'Coins stay valid for 12 months from the date they are credited — the expiry is shown against each entry in your wallet history, so spend them before then. The balance can never go below zero.',
      },
      {
        q: 'Where can I see my offers and my coin balance?',
        a: 'All live coupons are listed on the Offers page and again under "Available offers" in the cart and at checkout. Your coin balance and full transaction history sit in Account → Clozari Wallet, and the balance also appears in the account menu in the navbar.',
      },
    ],
  },
  {
    category: 'Account',
    items: [
      {
        q: 'How do I change my delivery address?',
        a: 'Go to Account → Saved Destinations to add or remove addresses, or edit it from the address step during checkout. Your address book is private to your account and starts empty — add the destinations you actually use.',
      },
      {
        q: 'I forgot my password. What now?',
        a: 'Ask for a reset on the sign-in screen or write to care@clozari.com from your registered email — we send a secure reset link within 24 hours. For security, our team can never see your current password.',
      },
      {
        q: 'How do I see only my own orders?',
        a: 'Everything in My Orders, Returns & Exchanges and the wallet belongs to the account you are signed in with. Signing out and into another account shows only that account\'s orders, addresses, returns and coins.',
      },
    ],
  },
];

export default faqs;
