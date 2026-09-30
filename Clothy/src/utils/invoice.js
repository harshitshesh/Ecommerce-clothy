/**
 * invoice.js — PDF invoice generator.
 * Dynamily imports jspdf so it never lands in the initial bundle.
 * Totals come from the same pricing object the Order Detail page renders,
 * so the PDF can never disagree with the UI.
 */
import { pricingFromOrder, formatRs } from './pricing';

const INK = [26, 26, 26];
const GOLD = [176, 141, 87];
const GRAY = [138, 138, 138];
const LINE = [226, 226, 226];
const WHITE = [255, 255, 255];

const addressLines = (address, extras = []) => {
  const parts = [];
  if (address) {
    parts.push(
      address.line1,
      address.line2 ? `${address.line2},` : '',
      `${address.city},`,
      address.state,
      `— ${address.pin}`,
      address.phone ? `Phone: ${address.phone}` : ''
    );
  }
  const lines = [
    address?.name || '',
    ...parts.filter(Boolean),
    ...extras.filter(Boolean),
  ].filter(Boolean);
  return lines.length ? lines : ['—'];
};

export async function downloadInvoice(order) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const autoTable = autoTableModule.default || autoTableModule.autoTable;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pricing = pricingFromOrder(order);
  const LEFT = 48;
  const RIGHT = 547;

  const invoiceNo = order.invoiceNo || `INV-${String(order.id).replace('ORD-', '')}`;

  /* ---------- Letterhead ---------- */
  doc.setTextColor(...INK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setCharSpace(5);
  doc.text('CLOZARI', LEFT, 74);
  doc.setCharSpace(0);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text('CURATED LUXURY FASHION', LEFT, 90);

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...INK);
  doc.text('TAX INVOICE', RIGHT, 74, { align: 'right' });

  doc.setLineWidth(2);
  doc.setDrawColor(...GOLD);
  doc.line(LEFT, 100, 140, 100);
  doc.setLineWidth(0.6);
  doc.setDrawColor(...LINE);
  doc.line(146, 100, RIGHT, 100);

  /* ---------- Meta ---------- */
  const meta = (label, value, x, y, align = 'left') => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GRAY);
    doc.text(label, x, y, { align });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...INK);
    doc.text(String(value ?? '—'), x, y + 14, { align });
  };

  meta('INVOICE NO.', invoiceNo, LEFT, 124);
  meta('ORDER ID', order.id, LEFT, 158);
  meta('ORDER DATE', order.date, 250, 124);
  meta('PAYMENT MODE', order.paymentMethod || order.payment?.method || '—', 250, 158);
  meta('ORDER STATUS', order.status || 'Processing', RIGHT, 124, 'right');

  /* ---------- Addresses (from the customer snapshot frozen on the order) ---------- */
  const block = (heading, lines, x, y) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GRAY);
    doc.text(heading, x, y);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...INK);
    doc.text(lines, x, y + 14, { maxWidth: 220, lineHeightFactor: 1.45 });
  };

  const customer = order.customer || {};
  const shippedAddress = customer.address || order.address;
  const billedExtras = [customer.email, customer.phone ? `Phone: ${customer.phone}` : ''];

  block('BILLED TO', addressLines(shippedAddress, billedExtras), LEFT, 208);
  block('SHIPPED TO', addressLines(shippedAddress), 300, 208);

  /* ---------- Items table ---------- */
  const body = pricing.lines.map((line) => [
    line.sku,
    `${line.name}\n${[line.colour, line.size].filter(Boolean).join(' • ')}`,
    String(line.quantity),
    formatRs(line.price),
    line.discount > 0 ? `-${formatRs(line.discount)}` : formatRs(0),
    `${line.gstRate}%`,
    formatRs(line.total),
  ]);

  autoTable(doc, {
    startY: 268,
    head: [['SKU', 'PRODUCT + COLOUR + SIZE', 'QTY', 'PRICE', 'DISCOUNT', 'GST %', 'TOTAL']],
    body,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 7,
      textColor: INK,
      lineColor: LINE,
      lineWidth: 0.5,
      valign: 'middle',
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: INK,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 7.5,
    },
    alternateRowStyles: { fillColor: [249, 249, 249] },
    columnStyles: {
      0: { cellWidth: 72, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }, // takes the remaining width
      2: { cellWidth: 34, halign: 'center' },
      3: { cellWidth: 62, halign: 'right' },
      4: { cellWidth: 68, halign: 'right' },
      5: { cellWidth: 44, halign: 'center' },
      6: { cellWidth: 66, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: LEFT, right: 48 },
  });

  const tableBottom = doc.lastAutoTable?.finalY || 420;

  /* ---------- Totals (mirrors <PriceBreakdown/>) ---------- */
  const totals = [
    ['MRP Total', formatRs(pricing.mrpTotal), false],
    ['Product Discount', `-${formatRs(pricing.productDiscount)}`, true],
    ['Subtotal', formatRs(pricing.subtotal), false],
    ...(pricing.offerCode
      ? [[`Offer ${pricing.offerCode}`, `-${formatRs(pricing.offerDiscount)}`, true]]
      : []),
    ['Shipping', pricing.shipping === 0 ? 'FREE' : formatRs(pricing.shipping), false],
    ...(pricing.walletCoinsUsed > 0
      ? [['Wallet coins used', `-${formatRs(pricing.walletCoinsUsed)}`, true]]
      : []),
    ['GST included (in prices)', formatRs(pricing.gstIncluded), false],
  ];

  let y = tableBottom + 26;
  totals.forEach(([label, value, muted]) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...(muted ? [46, 125, 50] : GRAY));
    doc.text(label, 340, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...INK);
    doc.text(String(value), RIGHT, y, { align: 'right' });
    y += 18;
  });

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.2);
  doc.line(340, y + 2, RIGHT, y + 2);

  y += 24;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GRAY);
  doc.text('TOTAL PAYABLE', 340, y);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GOLD);
  doc.text(formatRs(pricing.grandTotal), RIGHT, y, { align: 'right' });

  y += 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...[46, 125, 50]);
  doc.text(`YOU SAVED ${formatRs(pricing.totalSavings)}`, RIGHT, y, { align: 'right' });

  if (pricing.walletCoinsUsed > 0) {
    y += 18;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GRAY);
    doc.text('CHARGED TO PAYMENT METHOD', 340, y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...INK);
    doc.text(formatRs(pricing.amountDue), RIGHT, y, { align: 'right' });
    y += 14;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text(
      `Paid with ${order.paymentMethod || order.payment?.method || 'wallet'} — ${
        pricing.walletCoinsUsed
      } wallet coins applied (1 coin = Re. 1).`,
      340,
      y
    );
  }

  /* ---------- Notes ---------- */
  let noteY = tableBottom + 26;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GRAY);
  doc.text('BANK / GST NOTES', LEFT, noteY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...INK);
  doc.text(
    [
      'GST is included in all prices shown above.',
      '5% GST applies to items up to Rs. 2,500 per piece,',
      '18% GST applies above Rs. 2,500 per piece.',
      '',
      'Prices inclusive of all applicable taxes.',
      'Goods once sold may be exchanged within 7 days',
      'with the original invoice.',
    ],
    LEFT,
    noteY + 14,
    { lineHeightFactor: 1.5 }
  );

  /* ---------- Footer ---------- */
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.5);
  doc.line(LEFT, pageHeight - 54, RIGHT, pageHeight - 54);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text('Thank you for your patronage — Clozari Atelier, Bengaluru', LEFT, pageHeight - 40);
  doc.text('Computer generated invoice. No signature required.', RIGHT, pageHeight - 40, {
    align: 'right',
  });

  doc.save(`Clozari-Invoice-${order.id}.pdf`);
}

export default downloadInvoice;
