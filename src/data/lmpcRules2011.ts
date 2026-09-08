// Official Legal Metrology (Packaged Commodities) Rules, 2011 Database
// Extracted from Ministry of Consumer Affairs Gazette Notification GSR 202(E)

export interface LMPCRuleDefinition {
  id: string;
  ruleNumber: string;
  title: string;
  category: 'MANDATORY_DECLARATIONS' | 'NET_QUANTITY_SI' | 'MRP_PRICING' | 'FONT_PDP_SIZE' | 'CLEAR_SPACE' | 'STANDARD_PACK' | 'MPE_ACCURACY' | 'CONSUMER_CARE' | 'ORIGIN_MANUFACTURER';
  gazettePage: number;
  description: string;
  mandatoryFields: string[];
  statutoryFine: number; // INR under Rule 32
  legalSection: string;
}

export const LMPC_RULES: LMPCRuleDefinition[] = [
  {
    id: 'RULE_6_1_A',
    ruleNumber: 'Rule 6(1)(a) & Rule 10',
    title: 'Manufacturer / Packer / Importer Identity & Complete Postal Address',
    category: 'ORIGIN_MANUFACTURER',
    gazettePage: 5,
    description: 'Every package shall bear the name and complete postal address (factory location, street, city, state, and PIN code) of the manufacturer, or packer, or for imported commodities, the name and address of the importer in India.',
    mandatoryFields: ['manufacturerName', 'manufacturerAddress', 'pinCode'],
    statutoryFine: 2000,
    legalSection: 'Section 18 & 36 of Legal Metrology Act 2009 read with Rule 6(1)(a) & 10'
  },
  {
    id: 'RULE_6_1_B',
    ruleNumber: 'Rule 6(1)(b)',
    title: 'Common or Generic Name of Commodity',
    category: 'MANDATORY_DECLARATIONS',
    gazettePage: 5,
    description: 'The common or generic name of the commodity contained in the package must be prominently declared. In case of multi-commodity packages, name and quantity of each must appear.',
    mandatoryFields: ['genericName'],
    statutoryFine: 2000,
    legalSection: 'Rule 6(1)(b) of Legal Metrology (PC) Rules, 2011'
  },
  {
    id: 'RULE_6_1_C_13',
    ruleNumber: 'Rule 6(1)(c) & Rule 13',
    title: 'Net Quantity in Prescribed Standard SI Units',
    category: 'NET_QUANTITY_SI',
    gazettePage: 5,
    description: 'Net quantity must be declared in correct SI units (g, kg, ml, l, m, cm, or N/U for number). Archaic units like dozen, gross, lbs, or incorrect abbreviations like gm, gms, ml. are strictly prohibited under Rule 13(4) & 13(5).',
    mandatoryFields: ['netQuantity', 'quantityUnit'],
    statutoryFine: 2000,
    legalSection: 'Rule 6(1)(c) & Rule 13 of Legal Metrology (PC) Rules, 2011'
  },
  {
    id: 'RULE_6_1_D',
    ruleNumber: 'Rule 6(1)(d)',
    title: 'Month and Year of Manufacture / Packing / Import',
    category: 'MANDATORY_DECLARATIONS',
    gazettePage: 5,
    description: 'The month and year in which the commodity is manufactured or pre-packed or imported must be clearly stated on the package (e.g., 08/2024 or Aug 2024).',
    mandatoryFields: ['mfgMonth', 'mfgYear'],
    statutoryFine: 2000,
    legalSection: 'Rule 6(1)(d) of Legal Metrology (PC) Rules, 2011'
  },
  {
    id: 'RULE_6_1_E_18',
    ruleNumber: 'Rule 6(1)(e) & Rule 18',
    title: 'Maximum Retail Price (MRP) & Tax Inclusion Declaration',
    category: 'MRP_PRICING',
    gazettePage: 6,
    description: 'Retail sale price must follow statutory format: Maximum Retail Price Rs./₹ XX.XX (incl. of all taxes). Smudging, overwriting, dual-pricing, or unapproved stickers for hiking prices is strictly prohibited under Rule 18(2), 18(3) and 18(5).',
    mandatoryFields: ['mrp', 'hasInclAllTaxes'],
    statutoryFine: 2000,
    legalSection: 'Rule 6(1)(e) & Rule 18 of Legal Metrology (PC) Rules, 2011'
  },
  {
    id: 'RULE_6_2',
    ruleNumber: 'Rule 6(2)',
    title: 'Consumer Care Helpline & Redressal Information',
    category: 'CONSUMER_CARE',
    gazettePage: 7,
    description: 'Every package shall bear the name, postal address, telephone number, and email address of the person or office that can be contacted in case of consumer complaints.',
    mandatoryFields: ['consumerCarePhone', 'consumerCareEmail'],
    statutoryFine: 2000,
    legalSection: 'Rule 6(2) of Legal Metrology (PC) Rules, 2011'
  },
  {
    id: 'RULE_7_TABLE_I_II',
    ruleNumber: 'Rule 7 (Tables I & II)',
    title: 'Principal Display Panel (PDP) Numeral & Font Height',
    category: 'FONT_PDP_SIZE',
    gazettePage: 8,
    description: 'Font and numeral height on PDP must meet minimum statutory standards based on package net quantity or PDP surface area (Minimum 1mm to 6mm for normal print; 2mm to 6mm for embossed/blown lettering). Letter width must be at least 1/3rd of height.',
    mandatoryFields: ['measuredNumeralHeightMm'],
    statutoryFine: 2000,
    legalSection: 'Rule 7 and Tables I & II of Legal Metrology (PC) Rules, 2011'
  },
  {
    id: 'RULE_8',
    ruleNumber: 'Rule 8',
    title: 'Surrounding Clear Area for Net Quantity Declaration',
    category: 'CLEAR_SPACE',
    gazettePage: 9,
    description: 'The area surrounding the quantity declaration must be free from any other printed matter: space equal to numeral height above and below, and twice the numeral height to the left and right.',
    mandatoryFields: ['clearSpaceMargin'],
    statutoryFine: 2000,
    legalSection: 'Rule 8 of Legal Metrology (PC) Rules, 2011'
  },
  {
    id: 'RULE_9',
    ruleNumber: 'Rule 9',
    title: 'Prominence, Conspicuous Contrast & Language Script',
    category: 'MANDATORY_DECLARATIONS',
    gazettePage: 10,
    description: 'Declarations must be conspicuous and contrast sharply against the background color. Particulars must be rendered in English or Hindi in Devanagari script.',
    mandatoryFields: ['highContrast', 'languageScript'],
    statutoryFine: 2000,
    legalSection: 'Rule 9 of Legal Metrology (PC) Rules, 2011'
  },
  {
    id: 'RULE_5_SECOND_SCHEDULE',
    ruleNumber: 'Rule 5 & Second Schedule',
    title: 'Mandatory Standard Pack Size Compliance',
    category: 'STANDARD_PACK',
    gazettePage: 4,
    description: 'Commodities specified in Second Schedule (Biscuits, Tea, Edible Oils, Soaps, Atta, etc.) must be sold ONLY in prescribed standard quantities. Non-standard sizes without conspicuous prominent disclaimer are prohibited.',
    mandatoryFields: ['standardPackMatch'],
    statutoryFine: 2000,
    legalSection: 'Rule 5 read with Second Schedule of Legal Metrology (PC) Rules, 2011'
  },
  {
    id: 'RULE_22_FIRST_SCHEDULE',
    ruleNumber: 'Rule 22 & First Schedule',
    title: 'Maximum Permissible Error (MPE) on Net Quantity',
    category: 'MPE_ACCURACY',
    gazettePage: 21,
    description: 'The deficiency in net quantity contained in individual packages must not exceed the Maximum Permissible Error limits specified in the First Schedule.',
    mandatoryFields: ['actualNetWeightSample'],
    statutoryFine: 4000,
    legalSection: 'Rule 22 read with First Schedule of Legal Metrology (PC) Rules, 2011'
  }
];
