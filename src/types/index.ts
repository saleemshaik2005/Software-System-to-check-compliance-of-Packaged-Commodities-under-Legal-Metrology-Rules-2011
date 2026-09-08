// Types for Inspack - Legal Metrology (Packaged Commodities) Rules, 2011 Compliance System

export type ProductCommodityCategory =
  | 'baby_food'
  | 'weaning_food'
  | 'biscuits'
  | 'bread'
  | 'butter_margarine'
  | 'cereals_pulses'
  | 'coffee'
  | 'tea'
  | 'beverage_concentrate'
  | 'edible_oils'
  | 'milk_powder'
  | 'detergent_powder'
  | 'detergent_soap'
  | 'rice_flour_atta_suji'
  | 'salt'
  | 'toilet_soap'
  | 'aerated_soft_drinks'
  | 'mineral_water'
  | 'cement'
  | 'paint_varnish'
  | 'general_fmcg'
  | 'electronics'
  | 'cosmetics'
  | 'general_packaged';

export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_REVIEW';
export type RuleStatus = 'PASS' | 'FAIL' | 'WARNING' | 'EXEMPT';
export type UserRole = 'OFFICER' | 'CITIZEN' | 'MANUFACTURER';

export interface BoundingBox {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage
  height: number; // percentage
  label: string;
  ruleRef: string;
  status: RuleStatus;
  detectedText?: string;
  message: string;
}

export interface RuleEvaluation {
  ruleId: string;
  ruleNumber: string;
  ruleTitle: string;
  category: 'MANDATORY_DECLARATIONS' | 'NET_QUANTITY_SI' | 'MRP_PRICING' | 'FONT_PDP_SIZE' | 'CLEAR_SPACE' | 'STANDARD_PACK' | 'MPE_ACCURACY' | 'CONSUMER_CARE' | 'ORIGIN_MANUFACTURER';
  status: RuleStatus;
  detectedValue: string;
  requiredStandard: string;
  legalReference: string;
  gazettePage: number;
  explanation: string;
  penaltySection: string;
  compoundingFine: number; // in INR
  bbox?: BoundingBox;
}

export interface ExtractedProductInfo {
  productName: string;
  genericName?: string;
  brandName?: string;
  category: ProductCommodityCategory;
  netQuantity: number;
  quantityUnit: string; // 'g', 'kg', 'ml', 'l', 'm', 'cm', 'N', 'U'
  rawQuantityString: string;
  mrp: number;
  currency: string;
  mrpString: string;
  hasInclAllTaxes: boolean;
  isStickerPrice: boolean;
  isDualPrice: boolean;
  mfgMonth: string;
  mfgYear: string;
  expMonth?: string;
  expYear?: string;
  manufacturerName: string;
  manufacturerAddress: string;
  manufacturerPinCode?: string;
  packerName?: string;
  packerAddress?: string;
  importerName?: string;
  importerAddress?: string;
  countryOfOrigin: string;
  consumerCareName?: string;
  consumerCarePhone?: string;
  consumerCareEmail?: string;
  consumerCareAddress?: string;
  batchNumber?: string;
  pdpAreaCm2?: number;
  measuredNumeralHeightMm?: number;
  actualNetWeightSample?: number; // for Form A testing
  lotSize?: number;
  sampleSize?: number;
  hasStandardPackDisclaimer?: boolean;
}

export interface ComplianceReport {
  id: string;
  scanTimestamp: string;
  inspectorName?: string;
  inspectorBadgeNumber?: string;
  location?: string;
  productInfo: ExtractedProductInfo;
  score: number; // 0 to 100
  overallStatus: ComplianceStatus;
  violationsCount: number;
  warningsCount: number;
  passedCount: number;
  totalCompoundingFine: number;
  evaluations: RuleEvaluation[];
  boundingBoxes: BoundingBox[];
  capturedImages: {
    front?: string;
    back?: string;
    side?: string;
  };
  activeView: 'front' | 'back' | 'side';
  ocrRawText?: string;
  formType: 'Form A' | 'Form B';
  summaryRemarks: string;
}

export interface StandardPackSizeRule {
  category: ProductCommodityCategory;
  name: string;
  scheduleItemNo: number;
  allowedSizes: {
    unit: string;
    exactValues?: number[];
    multiplesAbove?: number;
    step?: number;
    maxLimit?: number;
    specialRules?: string;
  };
}

export interface MPEThreshold {
  minQty: number; // in g or ml
  maxQty: number;
  percent?: number;
  absoluteGramOrMl?: number;
}
