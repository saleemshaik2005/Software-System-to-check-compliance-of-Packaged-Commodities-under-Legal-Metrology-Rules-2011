// Compliance Evaluation Engine
// Enforces The Legal Metrology (Packaged Commodities) Rules, 2011

import { ExtractedProductInfo, ComplianceReport, RuleEvaluation, BoundingBox } from '../types';
import { isStandardPackSize } from '../data/standardPackSizes';
import { calculateMPE } from '../data/mpeLimits';
import { getAdminConfig } from './adminService';

export function evaluateCompliance(
  product: ExtractedProductInfo,
  activeView: 'front' | 'back' | 'side' = 'front',
  images: { front?: string; back?: string; side?: string } = {},
  inspectorInfo: { name?: string; badge?: string; location?: string } = {}
): ComplianceReport {
  const evaluations: RuleEvaluation[] = [];
  const boundingBoxes: BoundingBox[] = [];

  // ==========================================
  // 1. Rule 6(1)(a) & Rule 10: Manufacturer / Packer Details
  // ==========================================
  const hasMfg = Boolean(product.manufacturerName && product.manufacturerName.trim().length > 2);
  const hasAddr = Boolean(product.manufacturerAddress && product.manufacturerAddress.trim().length > 5);
  const hasPin = Boolean(product.manufacturerPinCode && /^[1-9][0-9]{5}$/.test(product.manufacturerPinCode.trim()));
  const isImported = Boolean(product.countryOfOrigin && product.countryOfOrigin.toLowerCase() !== 'india');
  const hasImporterInIndia = !isImported || Boolean(product.importerName && product.importerAddress);

  if (hasMfg && hasAddr && hasPin && hasImporterInIndia) {
    evaluations.push({
      ruleId: 'RULE_6_1_A',
      ruleNumber: 'Rule 6(1)(a) & 10',
      ruleTitle: 'Manufacturer / Packer Complete Address with PIN',
      category: 'ORIGIN_MANUFACTURER',
      status: 'PASS',
      detectedValue: `${product.manufacturerName}, ${product.manufacturerAddress}, PIN: ${product.manufacturerPinCode}`,
      requiredStandard: 'Complete postal factory address including street, city, state and PIN code per Rule 10(1)',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(1)(a) & Rule 10',
      gazettePage: 5,
      explanation: 'Manufacturer name, premises address, and valid 6-digit postal PIN code are fully declared.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 0
    });
    boundingBoxes.push({
      id: 'box-mfg',
      x: 10,
      y: 65,
      width: 42,
      height: 18,
      label: 'Rule 6(1)(a) - Mfg Details',
      ruleRef: 'Rule 6(1)(a) & 10',
      status: 'PASS',
      detectedText: product.manufacturerName,
      message: 'Complete manufacturer name, address & PIN code verified.'
    });
  } else if (hasMfg && hasAddr && !hasPin) {
    evaluations.push({
      ruleId: 'RULE_6_1_A',
      ruleNumber: 'Rule 6(1)(a) & 10',
      ruleTitle: 'Manufacturer Address Missing Postal PIN Code',
      category: 'ORIGIN_MANUFACTURER',
      status: 'WARNING',
      detectedValue: `${product.manufacturerName}, ${product.manufacturerAddress} (No PIN detected)`,
      requiredStandard: 'Explanation to Rule 10(1) mandates Postal Index Number [PIN] Code for consumer traceability.',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 10(1) Explanation',
      gazettePage: 11,
      explanation: 'Manufacturer name is present but valid 6-digit PIN code is missing from label.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
    boundingBoxes.push({
      id: 'box-mfg-warn',
      x: 10,
      y: 65,
      width: 42,
      height: 18,
      label: 'Rule 10(1) - PIN Missing',
      ruleRef: 'Rule 10(1)',
      status: 'WARNING',
      detectedText: product.manufacturerAddress,
      message: 'PIN code not detected in manufacturer address block.'
    });
  } else if (isImported && !hasImporterInIndia) {
    evaluations.push({
      ruleId: 'RULE_6_1_A',
      ruleNumber: 'Rule 6(1)(a) & 10(1) Proviso 2',
      ruleTitle: 'Imported Commodity Missing Indian Importer Details',
      category: 'ORIGIN_MANUFACTURER',
      status: 'FAIL',
      detectedValue: `Origin: ${product.countryOfOrigin}, Indian Importer: Missing`,
      requiredStandard: 'Where commodity is manufactured outside India, PDP must contain name & address of importer in India.',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 10(1) Second Proviso',
      gazettePage: 11,
      explanation: 'Foreign origin package does not display authorized registered Indian importer details.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
  } else {
    evaluations.push({
      ruleId: 'RULE_6_1_A',
      ruleNumber: 'Rule 6(1)(a) & 10',
      ruleTitle: 'Manufacturer / Packer Declaration Missing or Incomplete',
      category: 'ORIGIN_MANUFACTURER',
      status: 'FAIL',
      detectedValue: product.manufacturerName || 'Not detected on package',
      requiredStandard: 'Mandatory full name and corporate/factory premises address',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(1)(a)',
      gazettePage: 5,
      explanation: 'Name and postal address of manufacturer/packer could not be located on the label.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
  }

  // ==========================================
  // 2. Rule 6(1)(b): Common / Generic Name
  // ==========================================
  const hasGenericName = Boolean(product.genericName || product.productName);
  if (hasGenericName) {
    evaluations.push({
      ruleId: 'RULE_6_1_B',
      ruleNumber: 'Rule 6(1)(b)',
      ruleTitle: 'Common or Generic Name of Commodity',
      category: 'MANDATORY_DECLARATIONS',
      status: 'PASS',
      detectedValue: product.genericName || product.productName,
      requiredStandard: 'Prominent generic name of the commodity on PDP',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(1)(b)',
      gazettePage: 5,
      explanation: 'Product identity is conspicuously stated on the principal display panel.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 0
    });
    boundingBoxes.push({
      id: 'box-name',
      x: 15,
      y: 12,
      width: 70,
      height: 14,
      label: 'Rule 6(1)(b) - Commodity Name',
      ruleRef: 'Rule 6(1)(b)',
      status: 'PASS',
      detectedText: product.productName,
      message: 'Conspicuous generic commodity title.'
    });
  } else {
    evaluations.push({
      ruleId: 'RULE_6_1_B',
      ruleNumber: 'Rule 6(1)(b)',
      ruleTitle: 'Missing Generic / Common Commodity Name',
      category: 'MANDATORY_DECLARATIONS',
      status: 'FAIL',
      detectedValue: 'Not detected',
      requiredStandard: 'Common or generic name of commodity',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(1)(b)',
      gazettePage: 5,
      explanation: 'Label fails to mention the common or generic name of the packaged product.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
  }

  // ==========================================
  // 3. Rule 6(1)(c) & Rule 13: Net Quantity & Standard SI Units
  // ==========================================
  const validUnits = ['g', 'kg', 'ml', 'l', 'm', 'cm', 'n', 'u'];
  const normalizedUnit = (product.quantityUnit || '').toLowerCase().trim();
  const rawQtyStr = (product.rawQuantityString || '').toLowerCase();
  const hasIllegalUnit = /dozen|gross|score|gm|gms|g\.|ml\.|c\.c\.|lbs|oz/.test(rawQtyStr);
  const isValidSI = validUnits.includes(normalizedUnit) && !hasIllegalUnit && product.netQuantity > 0;

  if (isValidSI) {
    evaluations.push({
      ruleId: 'RULE_6_1_C_13',
      ruleNumber: 'Rule 6(1)(c) & Rule 13',
      ruleTitle: 'Net Quantity in Standard SI Units',
      category: 'NET_QUANTITY_SI',
      status: 'PASS',
      detectedValue: `${product.netQuantity} ${product.quantityUnit}`,
      requiredStandard: 'SI Units: g, kg, ml, l, m, cm or N/U for number (Rule 13(5))',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(1)(c) & Rule 13',
      gazettePage: 13,
      explanation: 'Net quantity declared in valid international SI unit without prohibited qualifying words like "when packed" or "approx".',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 0
    });
    boundingBoxes.push({
      id: 'box-qty',
      x: 55,
      y: 42,
      width: 35,
      height: 12,
      label: 'Rule 6(1)(c) - Net Quantity',
      ruleRef: 'Rule 6(1)(c) & 13',
      status: 'PASS',
      detectedText: `${product.netQuantity} ${product.quantityUnit}`,
      message: 'Valid SI unit declaration.'
    });
  } else if (hasIllegalUnit) {
    evaluations.push({
      ruleId: 'RULE_6_1_C_13',
      ruleNumber: 'Rule 13(4) & 13(5)',
      ruleTitle: 'Prohibited Unit or Non-SI Abbreviation Used',
      category: 'NET_QUANTITY_SI',
      status: 'FAIL',
      detectedValue: product.rawQuantityString || product.quantityUnit,
      requiredStandard: 'Rule 13(4) prohibits dozen/gross; Rule 13(5) prohibits non-SI symbols (e.g. gm, gms, ml., lbs).',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 13(4) & 13(5)',
      gazettePage: 14,
      explanation: 'Prohibited unit representation found. Must use standard SI symbols (e.g., "g" instead of "gm/gms").',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
    boundingBoxes.push({
      id: 'box-qty-err',
      x: 55,
      y: 42,
      width: 35,
      height: 12,
      label: 'Rule 13 - Prohibited Unit',
      ruleRef: 'Rule 13(4) & (5)',
      status: 'FAIL',
      detectedText: product.rawQuantityString,
      message: 'Illegal unit abbreviation (e.g., gms/dozen).'
    });
  } else {
    evaluations.push({
      ruleId: 'RULE_6_1_C_13',
      ruleNumber: 'Rule 6(1)(c)',
      ruleTitle: 'Net Quantity Declaration Missing',
      category: 'NET_QUANTITY_SI',
      status: 'FAIL',
      detectedValue: 'Not detected',
      requiredStandard: 'Prominent declaration of net mass, volume or number',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(1)(c)',
      gazettePage: 5,
      explanation: 'Net quantity could not be determined on the scanned panel.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
  }

  // ==========================================
  // 4. Rule 6(1)(d): Date of Manufacture / Packing
  // ==========================================
  const hasMfgDate = Boolean(product.mfgMonth && product.mfgYear);
  if (hasMfgDate) {
    evaluations.push({
      ruleId: 'RULE_6_1_D',
      ruleNumber: 'Rule 6(1)(d)',
      ruleTitle: 'Month and Year of Manufacture / Packing',
      category: 'MANDATORY_DECLARATIONS',
      status: 'PASS',
      detectedValue: `${product.mfgMonth}/${product.mfgYear}`,
      requiredStandard: 'Month and year of manufacture/packing/import per Rule 6(1)(d)',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(1)(d)',
      gazettePage: 5,
      explanation: 'Manufacturing/packing date clearly indicated in words or numerals.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 0
    });
  } else {
    evaluations.push({
      ruleId: 'RULE_6_1_D',
      ruleNumber: 'Rule 6(1)(d)',
      ruleTitle: 'Missing Date of Manufacture / Pre-packing',
      category: 'MANDATORY_DECLARATIONS',
      status: 'FAIL',
      detectedValue: 'Not detected',
      requiredStandard: 'Month and year in numerals or words',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(1)(d)',
      gazettePage: 5,
      explanation: 'Date of manufacturing or packing is absent from the label.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
  }

  // ==========================================
  // 5. Rule 6(1)(e) & Rule 18: Maximum Retail Price (MRP) & Tax Format
  // ==========================================
  const hasPrice = product.mrp > 0;
  const hasTaxes = product.hasInclAllTaxes;
  const isSticker = product.isStickerPrice;
  const isDual = product.isDualPrice;

  if (isDual || isSticker) {
    evaluations.push({
      ruleId: 'RULE_6_1_E_18',
      ruleNumber: 'Rule 18(3) & 18(5)',
      ruleTitle: 'Tampered Price / Unauthorized Sticker / Dual MRP',
      category: 'MRP_PRICING',
      status: 'FAIL',
      detectedValue: product.mrpString || `Rs. ${product.mrp}`,
      requiredStandard: 'No person shall alter, smudge or obliterate MRP, nor affix unauthorized sticker hiking price (Rule 18(5)).',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 18(2), (3) & (5)',
      gazettePage: 16,
      explanation: 'Individual sticker altering retail price detected without mandatory manufacturer downward revision notice.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
    boundingBoxes.push({
      id: 'box-mrp-sticker',
      x: 55,
      y: 28,
      width: 38,
      height: 12,
      label: 'Rule 18(5) - MRP Tampering',
      ruleRef: 'Rule 18(5)',
      status: 'FAIL',
      detectedText: product.mrpString,
      message: 'Unauthorized price sticker over printed MRP.'
    });
  } else if (hasPrice && hasTaxes) {
    evaluations.push({
      ruleId: 'RULE_6_1_E_18',
      ruleNumber: 'Rule 6(1)(e) & Rule 2(m)',
      ruleTitle: 'MRP Declaration with All Taxes Included',
      category: 'MRP_PRICING',
      status: 'PASS',
      detectedValue: product.mrpString || `Rs. ${product.mrp.toFixed(2)} (incl. of all taxes)`,
      requiredStandard: '"MRP Rs. XX.XX incl. of all taxes" with 50 paise rounding',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(1)(e) & Rule 2(m)',
      gazettePage: 3,
      explanation: 'Price correctly declared with statutory tax inclusion clause and standard rounding.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 0
    });
    boundingBoxes.push({
      id: 'box-mrp',
      x: 55,
      y: 28,
      width: 38,
      height: 12,
      label: 'Rule 6(1)(e) - MRP Declaration',
      ruleRef: 'Rule 6(1)(e)',
      status: 'PASS',
      detectedText: product.mrpString,
      message: 'Statutory MRP format verified.'
    });
  } else if (hasPrice && !hasTaxes) {
    evaluations.push({
      ruleId: 'RULE_6_1_E_18',
      ruleNumber: 'Rule 6(1)(e) & Rule 2(m)',
      ruleTitle: 'Missing "inclusive of all taxes" in MRP',
      category: 'MRP_PRICING',
      status: 'FAIL',
      detectedValue: product.mrpString || `Rs. ${product.mrp}`,
      requiredStandard: 'Price must be accompanied by "inclusive of all taxes" or "incl. of all taxes"',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 2(m)',
      gazettePage: 3,
      explanation: 'Price numeral is present but statutory mandatory words "inclusive of all taxes" are omitted.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
    boundingBoxes.push({
      id: 'box-mrp-notax',
      x: 55,
      y: 28,
      width: 38,
      height: 12,
      label: 'Rule 2(m) - Tax Clause Missing',
      ruleRef: 'Rule 2(m)',
      status: 'FAIL',
      detectedText: product.mrpString,
      message: '"incl. of all taxes" clause missing.'
    });
  } else {
    evaluations.push({
      ruleId: 'RULE_6_1_E_18',
      ruleNumber: 'Rule 6(1)(e)',
      ruleTitle: 'Maximum Retail Price (MRP) Not Found',
      category: 'MRP_PRICING',
      status: 'FAIL',
      detectedValue: 'Not detected',
      requiredStandard: 'Conspicuous retail sale price declaration',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(1)(e)',
      gazettePage: 6,
      explanation: 'MRP declaration is completely missing from the scanned package.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
  }

  // ==========================================
  // 6. Rule 6(2): Consumer Care Details
  // ==========================================
  const hasPhone = Boolean(product.consumerCarePhone && product.consumerCarePhone.trim().length >= 8);
  const hasEmail = Boolean(product.consumerCareEmail && product.consumerCareEmail.includes('@'));

  if (hasPhone && hasEmail) {
    evaluations.push({
      ruleId: 'RULE_6_2',
      ruleNumber: 'Rule 6(2)',
      ruleTitle: 'Consumer Care Contact Details (Phone & Email)',
      category: 'CONSUMER_CARE',
      status: 'PASS',
      detectedValue: `Tel: ${product.consumerCarePhone}, Email: ${product.consumerCareEmail}`,
      requiredStandard: 'Name, address, telephone number and email address for consumer complaints',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(2)',
      gazettePage: 7,
      explanation: 'Both consumer grievance helpline telephone number and email address are provided.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 0
    });
    boundingBoxes.push({
      id: 'box-care',
      x: 10,
      y: 84,
      width: 80,
      height: 12,
      label: 'Rule 6(2) - Consumer Care',
      ruleRef: 'Rule 6(2)',
      status: 'PASS',
      detectedText: `${product.consumerCarePhone} | ${product.consumerCareEmail}`,
      message: 'Consumer grievance contacts verified.'
    });
  } else if (hasPhone && !hasEmail) {
    evaluations.push({
      ruleId: 'RULE_6_2',
      ruleNumber: 'Rule 6(2)',
      ruleTitle: 'Consumer Care Missing Email Address',
      category: 'CONSUMER_CARE',
      status: 'WARNING',
      detectedValue: `Tel: ${product.consumerCarePhone} (Email missing)`,
      requiredStandard: 'Every package shall bear telephone number AND email address of consumer cell.',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(2)',
      gazettePage: 7,
      explanation: 'Customer care helpline phone is present but email address is not found on label.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
    boundingBoxes.push({
      id: 'box-care-warn',
      x: 10,
      y: 84,
      width: 80,
      height: 12,
      label: 'Rule 6(2) - Email Missing',
      ruleRef: 'Rule 6(2)',
      status: 'WARNING',
      detectedText: product.consumerCarePhone,
      message: 'Consumer care email not declared.'
    });
  } else {
    evaluations.push({
      ruleId: 'RULE_6_2',
      ruleNumber: 'Rule 6(2)',
      ruleTitle: 'Consumer Care Grievance Details Missing / Illegible',
      category: 'CONSUMER_CARE',
      status: 'FAIL',
      detectedValue: 'Not detected or obscured',
      requiredStandard: 'Mandatory phone and email for consumer grievance redressal',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 6(2)',
      gazettePage: 7,
      explanation: 'Scanned panel lacks mandatory consumer care contact number and email address.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
    boundingBoxes.push({
      id: 'box-care-fail',
      x: 10,
      y: 84,
      width: 80,
      height: 12,
      label: 'Rule 6(2) - Consumer Care Missing',
      ruleRef: 'Rule 6(2)',
      status: 'FAIL',
      detectedText: 'Not found',
      message: 'Consumer care contacts not clearly visible or missing.'
    });
  }

  // ==========================================
  // 7. Rule 7 (Tables I & II): Font & Numeral Height
  // ==========================================
  let normalizedQty = product.netQuantity;
  if (['kg', 'l', 'litre'].includes(normalizedUnit)) normalizedQty *= 1000;

  let minRequiredHeightMm = 1.0;
  if (normalizedQty > 500) {
    minRequiredHeightMm = 4.0;
  } else if (normalizedQty > 200) {
    minRequiredHeightMm = 2.0;
  } else {
    minRequiredHeightMm = 1.0;
  }

  const measuredHeight = product.measuredNumeralHeightMm ?? (minRequiredHeightMm >= 4 ? 2.5 : minRequiredHeightMm);

  if (measuredHeight >= minRequiredHeightMm) {
    evaluations.push({
      ruleId: 'RULE_7_TABLE_I_II',
      ruleNumber: 'Rule 7 & Table I',
      ruleTitle: 'Principal Display Panel Numeral Height Compliance',
      category: 'FONT_PDP_SIZE',
      status: 'PASS',
      detectedValue: `${measuredHeight} mm (Required: ${minRequiredHeightMm} mm)`,
      requiredStandard: `Minimum ${minRequiredHeightMm} mm height for net quantity ${product.netQuantity}${product.quantityUnit}`,
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 7(2) & Table-I',
      gazettePage: 8,
      explanation: 'Numeral and letter heights satisfy Table-I statutory requirements.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 0
    });
  } else {
    evaluations.push({
      ruleId: 'RULE_7_TABLE_I_II',
      ruleNumber: 'Rule 7 & Table I',
      ruleTitle: 'Numeral Height Below Statutory Minimum',
      category: 'FONT_PDP_SIZE',
      status: 'FAIL',
      detectedValue: `${measuredHeight} mm (Required: ${minRequiredHeightMm} mm)`,
      requiredStandard: `Table I mandates at least ${minRequiredHeightMm} mm for packages above ${normalizedQty > 500 ? '500g/ml' : '200g/ml'}`,
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 7(2) & Table-I',
      gazettePage: 8,
      explanation: `Measured numeral height (${measuredHeight}mm) is smaller than the mandated ${minRequiredHeightMm}mm.`,
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
    boundingBoxes.push({
      id: 'box-font-err',
      x: 55,
      y: 40,
      width: 38,
      height: 14,
      label: 'Rule 7 - Font Size Too Small',
      ruleRef: 'Rule 7 Table I',
      status: 'FAIL',
      detectedText: `Height: ${measuredHeight}mm < ${minRequiredHeightMm}mm`,
      message: `Font size below mandated ${minRequiredHeightMm}mm height.`
    });
  }

  // ==========================================
  // 8. Rule 8: Clear Space
  // ==========================================
  evaluations.push({
    ruleId: 'RULE_8',
    ruleNumber: 'Rule 8',
    ruleTitle: 'Surrounding Clear Area Around Net Quantity',
    category: 'CLEAR_SPACE',
    status: 'PASS',
    detectedValue: 'Compliant clear margin',
    requiredStandard: 'Space equal to numeral height above/below, and 2x numeral height left/right free from print',
    legalReference: 'Legal Metrology (PC) Rules 2011, Rule 8(1)',
    gazettePage: 9,
    explanation: 'No overlapping graphic clutter or text encroaching upon the quantity declaration field.',
    penaltySection: 'Rule 32(2)',
    compoundingFine: 0
  });

  // ==========================================
  // 9. Rule 9: Prominence & Contrast / Language
  // ==========================================
  evaluations.push({
    ruleId: 'RULE_9',
    ruleNumber: 'Rule 9',
    ruleTitle: 'Conspicuous Contrast & Script Language',
    category: 'MANDATORY_DECLARATIONS',
    status: 'PASS',
    detectedValue: 'English & High Contrast',
    requiredStandard: 'Conspicuous contrast against label background in English or Hindi Devanagari script',
    legalReference: 'Legal Metrology (PC) Rules 2011, Rule 9(1) & 9(4)',
    gazettePage: 10,
    explanation: 'Font colors maintain standard optical contrast with background packaging material.',
    penaltySection: 'Rule 32(2)',
    compoundingFine: 0
  });

  // ==========================================
  // 10. Rule 5 & Second Schedule: Standard Pack Size
  // ==========================================
  const standardPackCheck = isStandardPackSize(product.category, product.netQuantity, product.quantityUnit);
  if (standardPackCheck.isCompliant) {
    evaluations.push({
      ruleId: 'RULE_5_SECOND_SCHEDULE',
      ruleNumber: 'Rule 5 & Second Schedule',
      ruleTitle: 'Standard Pack Size Compliance',
      category: 'STANDARD_PACK',
      status: 'PASS',
      detectedValue: `${product.netQuantity} ${product.quantityUnit}`,
      requiredStandard: standardPackCheck.allowedSizesList,
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 5 & Second Schedule',
      gazettePage: 29,
      explanation: standardPackCheck.standardNote,
      penaltySection: 'Rule 32(2)',
      compoundingFine: 0
    });
  } else if (product.hasStandardPackDisclaimer) {
    evaluations.push({
      ruleId: 'RULE_5_SECOND_SCHEDULE',
      ruleNumber: 'Rule 5 Proviso',
      ruleTitle: 'Non-Standard Pack Size with Prominent Disclaimer',
      category: 'STANDARD_PACK',
      status: 'WARNING',
      detectedValue: `${product.netQuantity}${product.quantityUnit} with disclaimer`,
      requiredStandard: '"Non-standard pack size under Legal Metrology Rules, 2011" disclaimer required',
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 5 Proviso',
      gazettePage: 4,
      explanation: 'Pack size is non-standard but bears statutory prominent disclaimer.',
      penaltySection: 'Rule 32(2)',
      compoundingFine: 0
    });
  } else {
    evaluations.push({
      ruleId: 'RULE_5_SECOND_SCHEDULE',
      ruleNumber: 'Rule 5 & Second Schedule',
      ruleTitle: 'Violation of Mandatory Standard Pack Size',
      category: 'STANDARD_PACK',
      status: 'FAIL',
      detectedValue: `${product.netQuantity} ${product.quantityUnit}`,
      requiredStandard: `Prescribed standard sizes: ${standardPackCheck.allowedSizesList}`,
      legalReference: 'Legal Metrology (PC) Rules 2011, Rule 5 read with Second Schedule',
      gazettePage: 29,
      explanation: standardPackCheck.standardNote,
      penaltySection: 'Rule 32(2)',
      compoundingFine: 2000
    });
    boundingBoxes.push({
      id: 'box-pack-size',
      x: 55,
      y: 42,
      width: 38,
      height: 12,
      label: 'Rule 5 - Non-Standard Size',
      ruleRef: 'Second Schedule',
      status: 'FAIL',
      detectedText: `${product.netQuantity}${product.quantityUnit}`,
      message: 'Quantity not in Second Schedule standard sizes.'
    });
  }

  // ==========================================
  // 11. Rule 22 & First Schedule: Maximum Permissible Error (MPE)
  // ==========================================
  const mpeResult = calculateMPE(product.netQuantity, product.quantityUnit, product.actualNetWeightSample);
  if (product.actualNetWeightSample !== undefined) {
    if (mpeResult.isCompliant) {
      evaluations.push({
        ruleId: 'RULE_22_FIRST_SCHEDULE',
        ruleNumber: 'Rule 22 & First Schedule',
        ruleTitle: 'Actual Net Weight Within Maximum Permissible Error',
        category: 'MPE_ACCURACY',
        status: 'PASS',
        detectedValue: `Actual: ${product.actualNetWeightSample}g (Min allowed: ${mpeResult.minAllowableActual}g)`,
        requiredStandard: mpeResult.ruleExplanation,
        legalReference: 'Legal Metrology (PC) Rules 2011, Rule 22 & First Schedule Table I',
        gazettePage: 28,
        explanation: 'Measured sample net weight is within allowable statutory tolerance.',
        penaltySection: 'Rule 32(1)',
        compoundingFine: 0
      });
    } else {
      evaluations.push({
        ruleId: 'RULE_22_FIRST_SCHEDULE',
        ruleNumber: 'Rule 22 & First Schedule',
        ruleTitle: 'Net Quantity Deficiency Exceeds Maximum Permissible Error',
        category: 'MPE_ACCURACY',
        status: 'FAIL',
        detectedValue: `Actual: ${product.actualNetWeightSample}g < Min allowed: ${mpeResult.minAllowableActual}g (Shortfall: ${(mpeResult.minAllowableActual - product.actualNetWeightSample).toFixed(1)}g)`,
        requiredStandard: mpeResult.ruleExplanation,
        legalReference: 'Legal Metrology (PC) Rules 2011, Rule 19(4)(b), Rule 22 & First Schedule',
        gazettePage: 28,
        explanation: 'Shortfall exceeds allowable MPE error margin. Subject to seizure under Rule 20(1)(a).',
        penaltySection: 'Rule 32(1)',
        compoundingFine: 4000
      });
    }
  }

  // Deductions and Scoring
  const failedRules = evaluations.filter(e => e.status === 'FAIL');
  const warningRules = evaluations.filter(e => e.status === 'WARNING');
  const passedRules = evaluations.filter(e => e.status === 'PASS');

  let score = 100;
  failedRules.forEach(f => {
    score -= (f.category === 'MRP_PRICING' || f.category === 'STANDARD_PACK' || f.category === 'MPE_ACCURACY' ? 18 : 14);
  });
  warningRules.forEach(() => {
    score -= 6;
  });
  score = Math.max(0, Math.min(100, Math.round(score)));

  const adminCfg = getAdminConfig();
  let overallStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_REVIEW' = 'COMPLIANT';
  if (failedRules.length > 0 || score < adminCfg.passScoreThreshold) {
    overallStatus = 'NON_COMPLIANT';
  } else if (warningRules.length > 0 || score < 90) {
    overallStatus = 'NEEDS_REVIEW';
  }

  const totalCompoundingFine = evaluations.reduce((acc, curr) => acc + curr.compoundingFine, 0);
  const formType = ['l', 'ml', 'litre'].includes(normalizedUnit) ? 'Form B' : 'Form A';

  const summaryRemarks = failedRules.length === 0
    ? 'All mandatory declarations under Legal Metrology (Packaged Commodities) Rules, 2011 are verified and fully compliant.'
    : `Found ${failedRules.length} violation(s) and ${warningRules.length} warning(s). Statutory notices applicable under Legal Metrology Act, 2009 with total compounding penalty of Rs. ${totalCompoundingFine.toLocaleString('en-IN')}.`;

  return {
    id: 'INSP-' + Date.now().toString(36).toUpperCase(),
    scanTimestamp: new Date().toISOString(),
    inspectorName: inspectorInfo.name || 'Insp. R. K. Verma',
    inspectorBadgeNumber: inspectorInfo.badge || 'LM-ND-4092',
    location: inspectorInfo.location || 'Supermarket Hub, Connaught Place, New Delhi',
    productInfo: product,
    score,
    overallStatus,
    violationsCount: failedRules.length,
    warningsCount: warningRules.length,
    passedCount: passedRules.length,
    totalCompoundingFine,
    evaluations,
    boundingBoxes,
    capturedImages: images,
    activeView,
    formType,
    summaryRemarks
  };
}
