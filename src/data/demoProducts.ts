// Pre-configured Test Showcases for SIH-26034 Evaluation
// Matches Slide 2 (Amul Taaza Milk) and Slide 3 (Tata Agro Basmati Rice)

import { ExtractedProductInfo } from '../types';

export interface DemoProductPreset {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  categoryDisplay: string;
  expectedResult: 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_REVIEW';
  expectedScore: number;
  keyViolation: string;
  productInfo: ExtractedProductInfo;
  imageVisual: {
    front: string;
    back: string;
    side: string;
  };
}

export const DEMO_PRESETS: DemoProductPreset[] = [
  {
    id: 'demo-amul-milk',
    badge: 'Slide 2 Demo',
    title: 'Amul Taaza Toned Milk (1 L)',
    subtitle: 'From SIH Presentation Slide 2: Non-compliant font & care details',
    categoryDisplay: 'Dairy / Liquid Beverage',
    expectedResult: 'NON_COMPLIANT',
    expectedScore: 72,
    keyViolation: 'Font size of MRP below Table-I minimum (2.2mm < 4.0mm) & missing customer care email',
    productInfo: {
      productName: 'Amul Taaza Toned Milk',
      genericName: 'Pasteurized Homogenized Toned Milk',
      brandName: 'Amul',
      category: 'aerated_soft_drinks',
      netQuantity: 1,
      quantityUnit: 'L',
      rawQuantityString: '1 L (1000 ml)',
      mrp: 70.0,
      currency: 'INR',
      mrpString: 'Rs. 70.00 (incl. of all taxes)',
      hasInclAllTaxes: true,
      isStickerPrice: false,
      isDualPrice: false,
      mfgMonth: '08',
      mfgYear: '2024',
      expMonth: '02',
      expYear: '2025',
      manufacturerName: 'Gujarat Co-operative Milk Marketing Federation Ltd.',
      manufacturerAddress: 'Amul Dairy Road, Anand, Gujarat',
      manufacturerPinCode: '388001',
      countryOfOrigin: 'India',
      consumerCareName: 'Amul Customer Feedback Cell',
      consumerCarePhone: '1800 258 3333',
      consumerCareEmail: '', // Missing email!
      batchNumber: 'BT-8849-A',
      measuredNumeralHeightMm: 2.2, // Below 4.0mm mandated for >500ml under Table-I
      pdpAreaCm2: 280,
      actualNetWeightSample: 1025
    },
    imageVisual: {
      front: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
      side: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'demo-tata-rice',
    badge: 'Slide 3 Demo',
    title: 'Tata Agro Basmati Rice (1 kg)',
    subtitle: 'From SIH Presentation Slide 3: 100% Fully Compliant Standard Pack',
    categoryDisplay: 'Rice & Foodgrain (Item #13)',
    expectedResult: 'COMPLIANT',
    expectedScore: 100,
    keyViolation: 'None (Meets all Rule 6, Rule 7, Rule 10, and Second Schedule requirements)',
    productInfo: {
      productName: 'Tata Agro Basmati Rice',
      genericName: 'Aged Long Grain Basmati Rice',
      brandName: 'Tata Agro',
      category: 'rice_flour_atta_suji',
      netQuantity: 1,
      quantityUnit: 'kg',
      rawQuantityString: '1 kg',
      mrp: 180.0,
      currency: 'INR',
      mrpString: 'Rs. 180.00 (incl. of all taxes)',
      hasInclAllTaxes: true,
      isStickerPrice: false,
      isDualPrice: false,
      mfgMonth: '06',
      mfgYear: '2024',
      expMonth: '06',
      expYear: '2026',
      manufacturerName: 'Tata Consumer Products Ltd.',
      manufacturerAddress: '1, Bishop Lefroy Road, Kolkata, West Bengal',
      manufacturerPinCode: '700020',
      countryOfOrigin: 'India',
      consumerCareName: 'Tata Consumer Care Executive',
      consumerCarePhone: '1800 108 4488',
      consumerCareEmail: 'care@tataconsumer.com',
      consumerCareAddress: 'Kirloskar Business Park, Bellary Road, Bengaluru 560024',
      batchNumber: 'TATA-BR-4029',
      measuredNumeralHeightMm: 4.8, // Complies with Table-I (>= 4.0mm)
      pdpAreaCm2: 620,
      actualNetWeightSample: 1002
    },
    imageVisual: {
      front: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop&q=80',
      side: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'demo-biscuits-nonstandard',
    badge: 'Schedule II Violation',
    title: 'Britannia Cream Biscuits (120 g)',
    subtitle: 'Non-Standard Pack Size violation under Second Schedule Item #3',
    categoryDisplay: 'Bakery / Biscuits',
    expectedResult: 'NON_COMPLIANT',
    expectedScore: 78,
    keyViolation: '120g is not an allowed standard pack size under Second Schedule (Item 3 requires 25g, 50g, 75g, 100g, 150g, 200g, 250g, 300g)',
    productInfo: {
      productName: 'Britannia Bourbon Treat Biscuits',
      genericName: 'Chocolate Cream Biscuits',
      brandName: 'Britannia',
      category: 'biscuits',
      netQuantity: 120,
      quantityUnit: 'g',
      rawQuantityString: '120 g',
      mrp: 35.0,
      currency: 'INR',
      mrpString: 'Rs. 35.00 (incl. of all taxes)',
      hasInclAllTaxes: true,
      isStickerPrice: false,
      isDualPrice: false,
      mfgMonth: '07',
      mfgYear: '2024',
      expMonth: '01',
      expYear: '2025',
      manufacturerName: 'Britannia Industries Limited',
      manufacturerAddress: '5/1A Hungerford Street, Kolkata, West Bengal',
      manufacturerPinCode: '700017',
      countryOfOrigin: 'India',
      consumerCareName: 'Britannia Consumer Care Cell',
      consumerCarePhone: '1800 425 4449',
      consumerCareEmail: 'feedback@britindia.com',
      batchNumber: 'B-7721',
      measuredNumeralHeightMm: 2.5,
      pdpAreaCm2: 180,
      actualNetWeightSample: 119.2,
      hasStandardPackDisclaimer: false
    },
    imageVisual: {
      front: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
      side: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'demo-oil-tampered',
    badge: 'Rule 18 Tampering',
    title: 'Fortune Sunlite Refined Sunflower Oil (1 L)',
    subtitle: 'Price alteration sticker hiking MRP from Rs. 145 to Rs. 165',
    categoryDisplay: 'Edible Oil (Item #10)',
    expectedResult: 'NON_COMPLIANT',
    expectedScore: 64,
    keyViolation: 'Rule 18(5) violation: Individual sticker altering MRP to hike retail price & Rule 10(1) missing PIN code',
    productInfo: {
      productName: 'Fortune Sunlite Refined Sunflower Oil',
      genericName: 'Refined Sunflower Seed Oil',
      brandName: 'Fortune',
      category: 'edible_oils',
      netQuantity: 1,
      quantityUnit: 'L',
      rawQuantityString: '1 L (910 g)',
      mrp: 165.0,
      currency: 'INR',
      mrpString: 'Rs. 165.00 (STICKER)',
      hasInclAllTaxes: false, // Omitted on sticker!
      isStickerPrice: true, // Sticker alteration!
      isDualPrice: true,
      mfgMonth: '05',
      mfgYear: '2024',
      manufacturerName: 'Adani Wilmar Limited',
      manufacturerAddress: 'Fortune House, Near Navrangpura Railway Crossing, Ahmedabad, Gujarat',
      manufacturerPinCode: '', // Missing PIN!
      countryOfOrigin: 'India',
      consumerCareName: 'Customer Care Executive',
      consumerCarePhone: '1800 233 9999',
      consumerCareEmail: 'care@adaniwilmar.in',
      batchNumber: 'AW-0912',
      measuredNumeralHeightMm: 4.2,
      pdpAreaCm2: 450,
      actualNetWeightSample: 908
    },
    imageVisual: {
      front: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80',
      side: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
    }
  }
];
