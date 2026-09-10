const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'demo');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// 1. Gold Winner Front SVG
const gwFront = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
  <defs>
    <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="40%" stop-color="#FDE047" />
      <stop offset="75%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <linearGradient id="sunflowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#DC2626" />
      <stop offset="100%" stop-color="#991B1B" />
    </linearGradient>
  </defs>

  <rect width="600" height="750" fill="#F8FAFC" />

  <!-- Pouch Outline -->
  <rect x="70" y="30" width="460" height="690" rx="36" fill="url(#pouchBg)" stroke="#CA8A04" stroke-width="3" />

  <!-- Top Seal -->
  <path d="M 80,65 Q 300,55 520,65" fill="none" stroke="#CA8A04" stroke-width="3" stroke-dasharray="8,6" />
  <text x="300" y="52" fill="#713F12" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" letter-spacing="1">✂ CUT ALONG THE DOTTED LINE FOR EASY POURING</text>

  <!-- Green Veg Symbol on Top Right -->
  <rect x="460" y="80" width="40" height="40" rx="6" fill="#FFFFFF" stroke="#16A34A" stroke-width="2" />
  <circle cx="480" cy="100" r="10" fill="#16A34A" />

  <!-- Heart / Health Icon Top Left -->
  <rect x="100" y="80" width="120" height="32" rx="8" fill="#15803D" />
  <text x="160" y="101" fill="#FFFFFF" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">100% HEALTHY</text>

  <!-- Brand Banner -->
  <rect x="110" y="135" width="380" height="68" rx="16" fill="url(#badgeGrad)" stroke="#FFFFFF" stroke-width="2" />
  <text x="300" y="180" fill="#FEF08A" font-family="sans-serif" font-size="34" font-weight="900" text-anchor="middle" letter-spacing="3">GOLD WINNER</text>
  <text x="300" y="196" fill="#FFFFFF" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle" letter-spacing="4">THE EDIBLE OIL EXPERTS</text>

  <!-- Sunflower Graphic -->
  <circle cx="300" cy="290" r="70" fill="url(#sunflowerGrad)" stroke="#FFFFFF" stroke-width="3" />
  <circle cx="300" cy="290" r="40" fill="#78350F" />
  <text x="300" y="295" fill="#FEF08A" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">PURE</text>
  <text x="300" y="310" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">SUNFLOWER</text>

  <!-- Rule 6(1)(b) Generic Name -->
  <rect x="95" y="380" width="410" height="54" rx="14" fill="#FFFFFF" stroke="#CA8A04" stroke-width="2" />
  <text x="300" y="401" fill="#713F12" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" letter-spacing="1">COMMON / GENERIC NAME (RULE 6(1)(b))</text>
  <text x="300" y="424" fill="#1E293B" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">REFINED SUNFLOWER OIL</text>

  <!-- Rule 6(1)(c) & Rule 7 Standard Net Qty -->
  <rect x="95" y="445" width="410" height="60" rx="14" fill="#0A3663" stroke="#FFFFFF" stroke-width="2" />
  <text x="300" y="467" fill="#93C5FD" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">STANDARDIZED NET QUANTITY (RULE 6(1)(c) &amp; RULE 7)</text>
  <text x="300" y="494" fill="#FFFFFF" font-family="sans-serif" font-size="24" font-weight="900" text-anchor="middle">1 L (910 g)</text>

  <!-- Rule 6(1)(e) & Rule 6(11) MRP & USP -->
  <rect x="95" y="515" width="410" height="64" rx="14" fill="#14532D" stroke="#FFFFFF" stroke-width="2" />
  <text x="300" y="535" fill="#86EFAC" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">MAXIMUM RETAIL PRICE &amp; UNIT SALE PRICE</text>
  <text x="300" y="560" fill="#FFFFFF" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">₹145.00 (incl. of all taxes) • ₹0.145 / ml</text>
  <text x="300" y="573" fill="#BBF7D0" font-family="sans-serif" font-size="10" text-anchor="middle">Rule 6(11) Unit Sale Price compliant</text>

  <!-- Fortified with Vit A & D -->
  <rect x="115" y="590" width="370" height="34" rx="8" fill="#FEF9C3" stroke="#CA8A04" stroke-width="1.5" />
  <text x="300" y="612" fill="#854D0E" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">FORTIFIED WITH VITAMIN A &amp; D • +FSSAI LOGO</text>

  <!-- Bottom Manufacturer Footer Tag -->
  <rect x="95" y="635" width="410" height="55" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
  <text x="300" y="653" fill="#0F172A" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">KALEESUWARI REFINERY PRIVATE LIMITED</text>
  <text x="300" y="668" fill="#64748B" font-family="sans-serif" font-size="10" text-anchor="middle">Chennai, Tamil Nadu - 600081 • FSSAI Lic No: 10012042000214</text>
  <text x="300" y="682" fill="#2563EB" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">PRINCIPAL DISPLAY PANEL • FRONT VIEW</text>
</svg>`;

// 2. Gold Winner Back SVG
const gwBack = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
  <rect width="600" height="750" fill="#F8FAFC" />

  <!-- Pouch Back Canvas -->
  <rect x="70" y="30" width="460" height="690" rx="36" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3" />

  <!-- Top Header Banner -->
  <rect x="70" y="30" width="460" height="55" rx="36" fill="#0A3663" />
  <rect x="70" y="60" width="460" height="25" fill="#0A3663" />
  <text x="300" y="64" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="900" text-anchor="middle" letter-spacing="1">STATUTORY CONSUMER DECLARATIONS</text>
  <text x="300" y="78" fill="#93C5FD" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">THE LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011</text>

  <!-- Rule 6(1)(a) & Rule 10 Manufacturer Block -->
  <rect x="95" y="100" width="410" height="115" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
  <rect x="105" y="108" width="230" height="20" rx="4" fill="#2563EB" />
  <text x="220" y="122" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(1)(a) &amp; RULE 10 • MANUFACTURER</text>
  <text x="105" y="145" fill="#0F172A" font-family="sans-serif" font-size="13" font-weight="900">Manufactured &amp; Packed by:</text>
  <text x="105" y="163" fill="#1E293B" font-family="sans-serif" font-size="12" font-weight="bold">KALEESUWARI REFINERY PRIVATE LIMITED</text>
  <text x="105" y="180" fill="#475569" font-family="sans-serif" font-size="11">Factory: Vandalur-Kelambakkam Road, Vengambakkam,</text>
  <text x="105" y="197" fill="#15803D" font-family="sans-serif" font-size="11" font-weight="bold">Chennai, Tamil Nadu - PIN: 600081 (India)</text>
  <text x="105" y="211" fill="#2563EB" font-family="sans-serif" font-size="10">FSSAI Central Lic. No.: 10012042000214</text>

  <!-- Rule 6(1)(d), 6(1)(da) & 6(1)(g) Mfg Date, Expiry & Batch -->
  <rect x="95" y="225" width="410" height="105" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
  <rect x="105" y="233" width="240" height="20" rx="4" fill="#059669" />
  <text x="225" y="247" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(1)(d), (da) &amp; (g) • DATES &amp; BATCH</text>
  <text x="105" y="270" fill="#0F172A" font-family="sans-serif" font-size="12" font-weight="bold">Date of Packaging: 08 / 2026</text>
  <text x="105" y="290" fill="#0F172A" font-family="sans-serif" font-size="12" font-weight="bold">Best Before / Expiry: 05 / 2027 (9 Months from Mfg)</text>
  <text x="105" y="310" fill="#475569" font-family="sans-serif" font-size="11">Batch No: KRL-SO-8842 • Lot: L4-A</text>
  <text x="105" y="325" fill="#15803D" font-family="sans-serif" font-size="10" font-weight="bold">✓ Formulated under strict food safety &amp; metrology norms</text>

  <!-- Rule 6(1)(e) & Rule 6(11) Pricing Declarations -->
  <rect x="95" y="340" width="410" height="95" rx="12" fill="#FEF2F2" stroke="#F87171" stroke-width="1.5" />
  <rect x="105" y="348" width="210" height="20" rx="4" fill="#DC2626" />
  <text x="210" y="362" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(1)(e) &amp; 6(11) • PRICE &amp; USP</text>
  <text x="105" y="385" fill="#991B1B" font-family="sans-serif" font-size="14" font-weight="900">MAXIMUM RETAIL PRICE (MRP): ₹ 145.00</text>
  <text x="105" y="402" fill="#7F1D1D" font-family="sans-serif" font-size="11">(Inclusive of all taxes • No stickers/alterations permitted)</text>
  <text x="105" y="422" fill="#1E3A8A" font-family="sans-serif" font-size="12" font-weight="bold">UNIT SALE PRICE (USP): ₹ 0.145 / ml</text>

  <!-- Rule 6(2) Consumer Care Cell -->
  <rect x="95" y="445" width="410" height="105" rx="12" fill="#EFF6FF" stroke="#93C5FD" stroke-width="1.5" />
  <rect x="105" y="453" width="220" height="20" rx="4" fill="#1D4ED8" />
  <text x="215" y="467" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(2) • CONSUMER COMPLAINT CELL</text>
  <text x="105" y="490" fill="#1E3A8A" font-family="sans-serif" font-size="12" font-weight="900">In case of consumer complaints, please contact:</text>
  <text x="105" y="507" fill="#0F172A" font-family="sans-serif" font-size="11">Consumer Relations Manager, Kaleesuwari Refinery Pvt Ltd</text>
  <text x="105" y="524" fill="#1E40AF" font-family="sans-serif" font-size="12" font-weight="bold">📞 Toll-Free Helpline: 1800 425 3333</text>
  <text x="105" y="541" fill="#1E40AF" font-family="sans-serif" font-size="11" font-weight="bold">✉ Email: customercare@kaleesuwari.com</text>

  <!-- Rule 6(10) Country of Origin & Barcode -->
  <rect x="95" y="560" width="410" height="80" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
  <text x="105" y="585" fill="#0F172A" font-family="sans-serif" font-size="13" font-weight="900">COUNTRY OF ORIGIN: INDIA</text>
  <text x="105" y="603" fill="#475569" font-family="sans-serif" font-size="11">Standard Pack Size conforms to Legal Metrology Second Schedule</text>
  <!-- Mock Barcode -->
  <rect x="105" y="612" width="2" height="20" fill="#000" /><rect x="110" y="612" width="3" height="20" fill="#000" /><rect x="116" y="612" width="1" height="20" fill="#000" /><rect x="120" y="612" width="4" height="20" fill="#000" /><rect x="128" y="612" width="2" height="20" fill="#000" /><rect x="133" y="612" width="3" height="20" fill="#000" /><rect x="140" y="612" width="2" height="20" fill="#000" /><rect x="145" y="612" width="4" height="20" fill="#000" /><rect x="152" y="612" width="1" height="20" fill="#000" /><rect x="156" y="612" width="3" height="20" fill="#000" /><rect x="162" y="612" width="2" height="20" fill="#000" />
  <text x="175" y="627" fill="#475569" font-family="monospace" font-size="11" font-weight="bold">8906014640012</text>

  <!-- Bottom Panel Tag -->
  <rect x="95" y="650" width="410" height="45" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1" />
  <text x="300" y="675" fill="#475569" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">STATUTORY DECLARATIONS PANEL • BACK VIEW</text>
</svg>`;

// 3. Freedom Back SVG
const freedomBack = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
  <rect width="600" height="750" fill="#F8FAFC" />
  <rect x="70" y="30" width="460" height="690" rx="36" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3" />
  <rect x="70" y="30" width="460" height="55" rx="36" fill="#F59E0B" />
  <rect x="70" y="60" width="460" height="25" fill="#F59E0B" />
  <text x="300" y="64" fill="#78350F" font-family="sans-serif" font-size="14" font-weight="900" text-anchor="middle" letter-spacing="1">FREEDOM OIL • STATUTORY DECLARATIONS</text>
  <text x="300" y="78" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">THE LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011</text>

  <rect x="95" y="100" width="410" height="115" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
  <rect x="105" y="108" width="230" height="20" rx="4" fill="#2563EB" />
  <text x="220" y="122" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(1)(a) &amp; RULE 10 • MANUFACTURER</text>
  <text x="105" y="145" fill="#0F172A" font-family="sans-serif" font-size="13" font-weight="900">Manufactured &amp; Packed by:</text>
  <text x="105" y="163" fill="#1E293B" font-family="sans-serif" font-size="12" font-weight="bold">GEMINI EDIBLES &amp; FATS INDIA LIMITED</text>
  <text x="105" y="180" fill="#475569" font-family="sans-serif" font-size="11">Freedom House, 8-2-334/70 &amp; 71, Road No. 5, Banjara Hills,</text>
  <text x="105" y="197" fill="#15803D" font-family="sans-serif" font-size="11" font-weight="bold">Hyderabad, Telangana - PIN: 500034 (India)</text>
  <text x="105" y="211" fill="#2563EB" font-family="sans-serif" font-size="10">FSSAI Central Lic. No.: 10014047000109</text>

  <rect x="95" y="225" width="410" height="105" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
  <rect x="105" y="233" width="240" height="20" rx="4" fill="#059669" />
  <text x="225" y="247" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(1)(d), (da) &amp; (g) • DATES &amp; BATCH</text>
  <text x="105" y="270" fill="#0F172A" font-family="sans-serif" font-size="12" font-weight="bold">Date of Packaging: 08 / 2026</text>
  <text x="105" y="290" fill="#0F172A" font-family="sans-serif" font-size="12" font-weight="bold">Best Before / Expiry: 05 / 2027 (9 Months from Mfg)</text>
  <text x="105" y="310" fill="#475569" font-family="sans-serif" font-size="11">Batch No: GEF-FSO-9921 • Tank: T-08</text>
  <text x="105" y="325" fill="#15803D" font-family="sans-serif" font-size="10" font-weight="bold">✓ Standard Pack Size conforms to Second Schedule (1 L)</text>

  <rect x="95" y="340" width="410" height="95" rx="12" fill="#FEF2F2" stroke="#F87171" stroke-width="1.5" />
  <rect x="105" y="348" width="210" height="20" rx="4" fill="#DC2626" />
  <text x="210" y="362" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(1)(e) &amp; 6(11) • PRICE &amp; USP</text>
  <text x="105" y="385" fill="#991B1B" font-family="sans-serif" font-size="14" font-weight="900">MAXIMUM RETAIL PRICE (MRP): ₹ 230.00</text>
  <text x="105" y="402" fill="#7F1D1D" font-family="sans-serif" font-size="11">(Inclusive of all taxes • Listing Price: ₹179.00)</text>
  <text x="105" y="422" fill="#1E3A8A" font-family="sans-serif" font-size="12" font-weight="bold">UNIT SALE PRICE (USP): ₹ 0.230 / ml</text>

  <rect x="95" y="445" width="410" height="105" rx="12" fill="#EFF6FF" stroke="#93C5FD" stroke-width="1.5" />
  <rect x="105" y="453" width="220" height="20" rx="4" fill="#1D4ED8" />
  <text x="215" y="467" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(2) • CONSUMER CARE CELL</text>
  <text x="105" y="490" fill="#1E3A8A" font-family="sans-serif" font-size="12" font-weight="900">Consumer Relations Executive, Gemini Edibles &amp; Fats:</text>
  <text x="105" y="507" fill="#0F172A" font-family="sans-serif" font-size="11">Freedom House, Banjara Hills, Hyderabad - 500034</text>
  <text x="105" y="524" fill="#1E40AF" font-family="sans-serif" font-size="12" font-weight="bold">📞 Toll-Free Helpline: 1800 425 4444</text>
  <text x="105" y="541" fill="#1E40AF" font-family="sans-serif" font-size="11" font-weight="bold">✉ Email: care@freedomhealthywell.com</text>

  <rect x="95" y="560" width="410" height="80" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
  <text x="105" y="585" fill="#0F172A" font-family="sans-serif" font-size="13" font-weight="900">COUNTRY OF ORIGIN: INDIA</text>
  <text x="105" y="603" fill="#475569" font-family="sans-serif" font-size="11">Net Quantity: 1 L (910 g) • Vegetable Edible Oil</text>

  <rect x="95" y="650" width="410" height="45" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1" />
  <text x="300" y="675" fill="#475569" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">STATUTORY DECLARATIONS PANEL • BACK VIEW</text>
</svg>`;

// 4. Tata Tea Front SVG
const tataTeaFront = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
  <defs>
    <linearGradient id="teaBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B" />
      <stop offset="50%" stop-color="#047857" />
      <stop offset="100%" stop-color="#065F46" />
    </linearGradient>
    <linearGradient id="goldBanner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>
  <rect width="600" height="750" fill="#F8FAFC" />
  <rect x="70" y="30" width="460" height="690" rx="28" fill="url(#teaBg)" stroke="#059669" stroke-width="3" />
  <rect x="460" y="70" width="40" height="40" rx="6" fill="#FFFFFF" stroke="#16A34A" stroke-width="2" />
  <circle cx="480" cy="90" r="10" fill="#16A34A" />
  <rect x="100" y="110" width="400" height="60" rx="12" fill="url(#goldBanner)" />
  <text x="300" y="148" fill="#064E3B" font-family="sans-serif" font-size="32" font-weight="900" text-anchor="middle" letter-spacing="2">TATA TEA PREMIUM</text>
  <text x="300" y="163" fill="#78350F" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="3">DESH KI CHAI</text>
  <circle cx="300" cy="270" r="75" fill="#065F46" stroke="#FDE047" stroke-width="3" />
  <text x="300" y="265" fill="#FEF08A" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle">BADHI PATTI</text>
  <text x="300" y="285" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">CHHOTI PATTI</text>
  <rect x="95" y="375" width="410" height="54" rx="12" fill="#FFFFFF" stroke="#10B981" stroke-width="2" />
  <text x="300" y="396" fill="#065F46" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">COMMON / GENERIC NAME (RULE 6(1)(b))</text>
  <text x="300" y="420" fill="#0F172A" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">BLACK TEA</text>
  <rect x="95" y="445" width="410" height="60" rx="12" fill="#0A3663" stroke="#FFFFFF" stroke-width="2" />
  <text x="300" y="467" fill="#93C5FD" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">STANDARDIZED NET QUANTITY (RULE 6(1)(c))</text>
  <text x="300" y="494" fill="#FFFFFF" font-family="sans-serif" font-size="24" font-weight="900" text-anchor="middle">500 g</text>
  <rect x="95" y="520" width="410" height="64" rx="12" fill="#FFFFFF" stroke="#059669" stroke-width="2" />
  <text x="300" y="540" fill="#065F46" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">MAXIMUM RETAIL PRICE &amp; UNIT SALE PRICE</text>
  <text x="300" y="565" fill="#0F172A" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">₹ 260.00 (incl. of all taxes) • ₹ 0.52 / g</text>
  <rect x="95" y="600" width="410" height="85" rx="12" fill="#064E3B" stroke="#059669" stroke-width="1.5" />
  <text x="300" y="625" fill="#FDE047" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">TATA CONSUMER PRODUCTS LIMITED</text>
  <text x="300" y="643" fill="#D1FAE5" font-family="sans-serif" font-size="10" text-anchor="middle">1, Bishop Lefroy Road, Kolkata, West Bengal - 700020</text>
  <text x="300" y="665" fill="#A7F3D0" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">PRINCIPAL DISPLAY PANEL • FRONT VIEW</text>
</svg>`;

// 5. Tata Tea Back SVG
const tataTeaBack = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
  <rect width="600" height="750" fill="#F8FAFC" />
  <rect x="70" y="30" width="460" height="690" rx="28" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3" />
  <rect x="70" y="30" width="460" height="55" rx="28" fill="#047857" />
  <rect x="70" y="60" width="460" height="25" fill="#047857" />
  <text x="300" y="64" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="900" text-anchor="middle" letter-spacing="1">TATA TEA • STATUTORY DECLARATIONS</text>
  <text x="300" y="78" fill="#A7F3D0" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011</text>

  <rect x="95" y="100" width="410" height="115" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
  <rect x="105" y="108" width="230" height="20" rx="4" fill="#2563EB" />
  <text x="220" y="122" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(1)(a) &amp; RULE 10 • MANUFACTURER</text>
  <text x="105" y="145" fill="#0F172A" font-family="sans-serif" font-size="13" font-weight="900">Manufactured &amp; Marketed by:</text>
  <text x="105" y="163" fill="#1E293B" font-family="sans-serif" font-size="12" font-weight="bold">TATA CONSUMER PRODUCTS LIMITED</text>
  <text x="105" y="180" fill="#475569" font-family="sans-serif" font-size="11">1, Bishop Lefroy Road, Elgin,</text>
  <text x="105" y="197" fill="#15803D" font-family="sans-serif" font-size="11" font-weight="bold">Kolkata, West Bengal - PIN: 700020 (India)</text>
  <text x="105" y="211" fill="#2563EB" font-family="sans-serif" font-size="10">FSSAI Central Lic. No.: 10014031001025</text>

  <rect x="95" y="225" width="410" height="105" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
  <rect x="105" y="233" width="240" height="20" rx="4" fill="#059669" />
  <text x="225" y="247" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(1)(d), (da) &amp; (g) • DATES &amp; BATCH</text>
  <text x="105" y="270" fill="#0F172A" font-family="sans-serif" font-size="12" font-weight="bold">Date of Packaging: 07 / 2026</text>
  <text x="105" y="290" fill="#0F172A" font-family="sans-serif" font-size="12" font-weight="bold">Best Before / Expiry: 07 / 2027 (12 Months from Pkg)</text>
  <text x="105" y="310" fill="#475569" font-family="sans-serif" font-size="11">Batch No: TCPL-TT-2041 • Shift: S-1</text>
  <text x="105" y="325" fill="#15803D" font-family="sans-serif" font-size="10" font-weight="bold">✓ Conforms to Tea Board &amp; Legal Metrology Packaged Commodities Rules</text>

  <rect x="95" y="340" width="410" height="95" rx="12" fill="#FEF2F2" stroke="#F87171" stroke-width="1.5" />
  <rect x="105" y="348" width="210" height="20" rx="4" fill="#DC2626" />
  <text x="210" y="362" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(1)(e) &amp; 6(11) • PRICE &amp; USP</text>
  <text x="105" y="385" fill="#991B1B" font-family="sans-serif" font-size="14" font-weight="900">MAXIMUM RETAIL PRICE (MRP): ₹ 260.00</text>
  <text x="105" y="402" fill="#7F1D1D" font-family="sans-serif" font-size="11">(Inclusive of all taxes • No overprinting allowed)</text>
  <text x="105" y="422" fill="#1E3A8A" font-family="sans-serif" font-size="12" font-weight="bold">UNIT SALE PRICE (USP): ₹ 0.52 / g</text>

  <rect x="95" y="445" width="410" height="105" rx="12" fill="#EFF6FF" stroke="#93C5FD" stroke-width="1.5" />
  <rect x="105" y="453" width="220" height="20" rx="4" fill="#1D4ED8" />
  <text x="215" y="467" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">RULE 6(2) • CONSUMER CARE CELL</text>
  <text x="105" y="490" fill="#1E3A8A" font-family="sans-serif" font-size="12" font-weight="900">Senior Manager - Consumer Services, Tata Consumer Products:</text>
  <text x="105" y="507" fill="#0F172A" font-family="sans-serif" font-size="11">1, Bishop Lefroy Road, Kolkata - 700020</text>
  <text x="105" y="524" fill="#1E40AF" font-family="sans-serif" font-size="12" font-weight="bold">📞 Toll-Free Helpline: 1800 108 4488</text>
  <text x="105" y="541" fill="#1E40AF" font-family="sans-serif" font-size="11" font-weight="bold">✉ Email: care@tataconsumer.com</text>

  <rect x="95" y="560" width="410" height="80" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
  <text x="105" y="585" fill="#0F172A" font-family="sans-serif" font-size="13" font-weight="900">COUNTRY OF ORIGIN: INDIA</text>
  <text x="105" y="603" fill="#475569" font-family="sans-serif" font-size="11">Net Quantity: 500 g • Item #10 Standard Pack Size</text>

  <rect x="95" y="650" width="410" height="45" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1" />
  <text x="300" y="675" fill="#475569" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">STATUTORY DECLARATIONS PANEL • BACK VIEW</text>
</svg>`;

// Write files
fs.writeFileSync(path.join(dir, 'gold-winner-front.svg'), gwFront);
fs.writeFileSync(path.join(dir, 'gold-winner-back.svg'), gwBack);
fs.writeFileSync(path.join(dir, 'freedom-sunflower-oil-back.svg'), freedomBack);
fs.writeFileSync(path.join(dir, 'tata-tea-front.svg'), tataTeaFront);
fs.writeFileSync(path.join(dir, 'tata-tea-back.svg'), tataTeaBack);

console.log('Successfully written all demo SVG assets!');
