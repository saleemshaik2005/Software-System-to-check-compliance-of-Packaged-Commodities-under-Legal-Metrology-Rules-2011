// Inspack Multilingual Internationalization (i18n) Service
// Official Support for:
// - English (en) - Default
// - हिन्दी / Hindi (hi)
// - తెలుగు / Telugu (te)
// Provides UI translations, statutory Legal Metrology terms, role titles, and dynamic product text translation

import { Language } from '../types';

export const LANG_STORAGE_KEY = 'inspack_lang_v1';
export const LANG_CHANGE_EVENT = 'inspack_lang_change';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳' }
];

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
    if (saved === 'en' || saved === 'hi' || saved === 'te') {
      return saved;
    }
  } catch {}
  return 'en';
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: { lang } }));
  } catch {}
}

// Comprehensive UI Dictionary
const UI_DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar & Navbar
    sih_title: 'SMART INDIA HACKATHON 2026',
    ministry_title: 'Ministry of Consumer Affairs, Food & Public Distribution',
    rule_title: 'Legal Metrology (Packaged Commodities) Rules, 2011',
    team_title: 'Team Neural Knights',
    cloud_synced: 'Cloud Database: Synced',
    sync_now: 'Sync Now',
    syncing: 'Syncing...',
    synced_just_now: 'Synced just now',
    sign_in: 'Sign In',
    sign_out: 'Sign Out',
    official_portal: 'Official Portal',

    // Nav Tabs
    tab_scanner: 'Package Inspector',
    tab_ecommerce: 'E-Commerce Audit',
    tab_enforcement: 'Enforcement Hub',
    tab_analytics: 'All Scans & Records',
    tab_manufacturer: 'Brand Portal',
    tab_surveillance: 'National Surveillance',
    tab_admin: 'Platform Admin',
    tab_rulebook: 'LMPC Rulebook',
    tab_scan_package: 'Scan / Snap Package',
    tab_fair_pack: 'Fair Pack & MRP Report',
    tab_artwork_precheck: 'Artwork Pre-Check Simulator',
    tab_precompliance: 'Pre-Compliance Audit Sheet',

    // Role Subtitles
    role_officer_sub: 'Legal Metrology Enforcement Field Station',
    role_citizen_sub: 'Consumer Protection • Fair Pack & Pricing',
    role_manufacturer_sub: 'Brand Packaging Pre-Compliance Portal',
    role_surveillance_sub: 'National Legal Metrology Directorate',
    role_admin_sub: 'Platform Administration Console',

    // Statutory Declarations & Verification Cards
    product_details: 'Product Commodity Details',
    stat_product_name: 'Commodity Name',
    stat_brand: 'Brand',
    stat_category: 'Category',
    stat_net_qty: 'Net Quantity',
    stat_mrp: 'Retail Sale Price (MRP)',
    stat_usp: 'Unit Sale Price (USP)',
    stat_mfg_date: 'Date of Manufacture',
    stat_exp_date: 'Date of Expiry',
    stat_best_before: 'Best Before',
    stat_consumer_care: 'Consumer Care Helpline',
    stat_origin: 'Country of Origin',
    stat_manufacturer: 'Manufacturer Details',
    stat_address: 'Postal Address & PIN',
    stat_batch_no: 'Batch / Lot Number',
    stat_ingredients: 'Ingredients & Additives',
    stat_compliance_score: 'Compliance Score',
    stat_violations: 'Violations Detected',
    stat_total_fine: 'Total Compounding Fine',

    // Status Badges
    status_compliant: 'COMPLIANT',
    status_non_compliant: 'NON-COMPLIANT',
    status_needs_review: 'NEEDS REVIEW',
    status_verified: 'Statutorily Verified',
    status_seizure_order: 'Seizure Order Issued',

    // Actions
    action_download_pdf: 'Download PDF Report',
    action_preview_pdf: 'Preview PDF Sheet',
    action_edit_sheet: 'Edit Inspection Details',
    action_save_changes: 'Apply Changes & Re-render',
    action_cancel: 'Cancel',
    action_verify: 'Verify Compliance',
    action_bulk_upload: 'Bulk Multi-Panel Upload',
    action_select_photos: 'Select Photos',

    // Health & Safety
    health_safety_title: 'Food Additives & Health Safety Audit',
    health_clean: '100% Clean Formulation',
    health_additives: 'Contains Permitted Food Additives',
    health_warning: 'Statutory Health Warning Required',

    // Shelf Life
    shelf_life_title: 'Shelf-Life & Expiry Status',
    shelf_life_remaining: 'Remaining Shelf-Life',
    shelf_life_expired: 'EXPIRED COMMODITY - Offence under Section 36',
    shelf_life_active: 'Valid & Fresh'
  },

  hi: {
    // Top Bar & Navbar
    sih_title: 'स्मार्ट इंडिया हैकाथॉन 2026',
    ministry_title: 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय',
    rule_title: 'विधिक मापविज्ञान (पैकेज्ड वस्तुएं) नियम, 2011',
    team_title: 'टीम न्यूरल नाइट्स',
    cloud_synced: 'क्लाउड डेटाबेस: सिंक हुआ',
    sync_now: 'सिंक करें',
    syncing: 'सिंक हो रहा है...',
    synced_just_now: 'अभी सिंक हुआ',
    sign_in: 'साइन इन करें',
    sign_out: 'साइन आउट',
    official_portal: 'आधिकारिक पोर्टल',

    // Nav Tabs
    tab_scanner: 'पैकेज निरीक्षक',
    tab_ecommerce: 'ई-कॉमर्स ऑडिट',
    tab_enforcement: 'प्रवर्तन केंद्र',
    tab_analytics: 'सभी स्कैन व रिकॉर्ड',
    tab_manufacturer: 'ब्रांड पोर्टल',
    tab_surveillance: 'राष्ट्रीय निगरानी',
    tab_admin: 'सिस्टम एडमिन',
    tab_rulebook: 'एलएमपीसी नियम पुस्तिका',
    tab_scan_package: 'पैकेज स्कैन / फोटो लें',
    tab_fair_pack: 'उचित पैक व मूल्य रिपोर्ट',
    tab_artwork_precheck: 'आर्टवर्क प्री-चेक सिम्युलेटर',
    tab_precompliance: 'प्री-कंप्लायंस ऑडिट शीट',

    // Role Subtitles
    role_officer_sub: 'विधिक मापविज्ञान प्रवर्तन फील्ड स्टेशन',
    role_citizen_sub: 'उपभोक्ता संरक्षण • सही वजन व उचित मूल्य',
    role_manufacturer_sub: 'ब्रांड पैकेजिंग प्री-कंप्लायंस पोर्टल',
    role_surveillance_sub: 'राष्ट्रीय विधिक मापविज्ञान निदेशालय',
    role_admin_sub: 'प्लेटफ़ॉर्म व्यवस्थापक नियंत्रण कक्ष',

    // Statutory Declarations & Verification Cards
    product_details: 'पैकेज्ड वस्तु का वैधानिक विवरण',
    stat_product_name: 'उत्पाद वस्तु का नाम',
    stat_brand: 'ब्रांड का नाम',
    stat_category: 'वस्तु की श्रेणी',
    stat_net_qty: 'शुद्ध मात्रा (नेट वजन)',
    stat_mrp: 'अधिकतम खुदरा मूल्य (MRP)',
    stat_usp: 'इकाई विक्रय मूल्य (USP)',
    stat_mfg_date: 'निर्माण की तिथि (माह/वर्ष)',
    stat_exp_date: 'समाप्ति की तिथि',
    stat_best_before: 'सर्वोत्तम उपभोग अवधि',
    stat_consumer_care: 'उपभोक्ता सेवा हेल्पलाइन',
    stat_origin: 'उत्पत्ति का देश (कंट्री ऑफ ओरिजिन)',
    stat_manufacturer: 'निर्माता / पैकर का विवरण',
    stat_address: 'डाक का पता और पिन कोड',
    stat_batch_no: 'बैच / लॉट संख्या',
    stat_ingredients: 'सामग्री व खाद्य योजक',
    stat_compliance_score: 'वैधानिक अनुपालन स्कोर',
    stat_violations: 'पाए गए नियम उल्लंघन',
    stat_total_fine: 'कुल शमन जुर्माना',

    // Status Badges
    status_compliant: 'पूर्ण अनुपालन (वैध)',
    status_non_compliant: 'गैर-अनुपालन (अवैध)',
    status_needs_review: 'पुनरावलोकन आवश्यक',
    status_verified: 'वैधानिक रूप से सत्यापित',
    status_seizure_order: 'जब्ती आदेश जारी',

    // Actions
    action_download_pdf: 'पीडीएफ रिपोर्ट डाउनलोड करें',
    action_preview_pdf: 'पीडीएफ शीट देखें',
    action_edit_sheet: 'निरीक्षण विवरण संपादित करें',
    action_save_changes: 'परिवर्तन लागू करें व पुनः बनाएं',
    action_cancel: 'रद्द करें',
    action_verify: 'अनुपालन सत्यापित करें',
    action_bulk_upload: 'एक साथ कई फोटो अपलोड करें',
    action_select_photos: 'तस्वीरें चुनें',

    // Health & Safety
    health_safety_title: 'खाद्य योजक, रंग व स्वास्थ्य सुरक्षा जांच',
    health_clean: '100% शुद्ध व योजक-मुक्त',
    health_additives: 'अनुमत खाद्य योजक मौजूद हैं',
    health_warning: 'वैधानिक स्वास्थ्य चेतावनी अनिवार्य है',

    // Shelf Life
    shelf_life_title: 'शेल्फ-लाइफ व समाप्ति स्थिति',
    shelf_life_remaining: 'शेष शेल्फ-लाइफ',
    shelf_life_expired: 'अवधि समाप्त वस्तु - धारा 36 के तहत अपराध',
    shelf_life_active: 'उपभोग हेतु वैध'
  },

  te: {
    // Top Bar & Navbar
    sih_title: 'స్మార్ట్ ఇండియా హ్యాకథాన్ 2026',
    ministry_title: 'వినియోగదారుల వ్యవహారాలు, ఆహార & ప్రజా పంపిణీ మంత్రిత్వ శాఖ',
    rule_title: 'లీగల్ మెట్రాలజీ (ప్యాకేజ్డ్ కమోడిటీస్) నిబంధనలు, 2011',
    team_title: 'టీమ్ న్యూరల్ నైట్స్',
    cloud_synced: 'క్లౌడ్ డేటాబేస్: సింక్ చేయబడింది',
    sync_now: 'ఇప్పుడే సింక్ చేయండి',
    syncing: 'సింక్ అవుతోంది...',
    synced_just_now: 'ఇప్పుడే సింక్ చేయబడింది',
    sign_in: 'సైన్ ఇన్ చేయండి',
    sign_out: 'సైన్ అవుట్',
    official_portal: 'అధికారిక పోర్టల్',

    // Nav Tabs
    tab_scanner: 'ప్యాకేజీ ఇన్‌స్పెక్టర్',
    tab_ecommerce: 'ఈ-కామర్స్ ఆడిట్',
    tab_enforcement: 'ఎన్‌ఫోర్స్‌మెంట్ హబ్',
    tab_analytics: 'అన్ని స్కాన్‌లు & రికార్డులు',
    tab_manufacturer: 'బ్రాండ్ పోర్టల్',
    tab_surveillance: 'జాతీయ నిఘా విభాగం',
    tab_admin: 'సిస్టమ్ అడ్మిన్',
    tab_rulebook: 'ఎల్‌ఎమ్‌పీసీ రూల్‌బుక్',
    tab_scan_package: 'ప్యాకేజీ స్కాన్ / ఫోటో తీయండి',
    tab_fair_pack: 'సరైన ప్యాకింగ్ & ధర రిపోర్ట్',
    tab_artwork_precheck: 'ప్యాకేజింగ్ ఆర్ట్‌వర్క్ ప్రీ-చెక్',
    tab_precompliance: 'ప్రీ-కంప్లైయెన్స్ ఆడిట్ షీట్',

    // Role Subtitles
    role_officer_sub: 'లీగల్ మెట్రాలజీ ఎన్‌ఫోర్స్‌మెంట్ ఫీల్డ్ స్టేషన్',
    role_citizen_sub: 'వినియోగదారుల హక్కుల రక్షణ • సరైన బరువు & ధర',
    role_manufacturer_sub: 'బ్రాండ్ ప్యాకేజింగ్ ముందస్తు పరిశీలన పోర్టల్',
    role_surveillance_sub: 'జాతీయ లీగల్ మెట్రాలజీ డైరెక్టరేట్',
    role_admin_sub: 'ప్లాట్‌ఫారమ్ అడ్మినిస్ట్రేషన్ కంట్రోల్ సెంటర్',

    // Statutory Declarations & Verification Cards
    product_details: 'ప్యాకేజ్డ్ వస్తువు అధికారిక వివరాలు',
    stat_product_name: 'ఉత్పత్తి వస్తువు పేరు',
    stat_brand: 'బ్రాండ్ పేరు',
    stat_category: 'వస్తువు వర్గం',
    stat_net_qty: 'నికర పరిమాణం (నెట్ క్వాంటిటీ)',
    stat_mrp: 'గరిష్ట చిల్లర ధర (MRP)',
    stat_usp: 'యూనిట్ అమ్మకపు ధర (USP)',
    stat_mfg_date: 'తయారీ తేదీ (నెల/సంవత్సరం)',
    stat_exp_date: 'గడువు ముగింపు తేదీ',
    stat_best_before: 'ఉత్తమ వినియోగ వ్యవధి',
    stat_consumer_care: 'వినియోగదారుల కేర్ హెల్ప్‌లైన్',
    stat_origin: 'తయారైన దేశం (కంట్రీ ఆఫ్ ఆరిజిన్)',
    stat_manufacturer: 'తయారీదారు / ప్యాకర్ వివరాలు',
    stat_address: 'పోస్టల్ చిరునామా & పిన్ కోడ్',
    stat_batch_no: 'బ్యాచ్ / లాట్ సంఖ్య',
    stat_ingredients: 'పదార్థాలు & సంకలనాలు',
    stat_compliance_score: 'చట్టబద్ధ అనుకూలత స్కోర్',
    stat_violations: 'గుర్తించబడిన నిబంధనల ఉల్లంఘనలు',
    stat_total_fine: 'మొత్తం కాంపౌండింగ్ జరిమానా',

    // Status Badges
    status_compliant: 'పూర్తి నిబంధనలకు అనుగుణంగా ఉంది (చట్టబద్ధమైనది)',
    status_non_compliant: 'నిబంధనల ఉల్లంఘన (అక్రమమైనది)',
    status_needs_review: 'సమీక్ష అవసరం',
    status_verified: 'అధికారికంగా ధృవీకరించబడింది',
    status_seizure_order: 'సీజర్ ఆర్డర్ జారీ చేయబడింది',

    // Actions
    action_download_pdf: 'PDF రిపోర్ట్ డౌన్‌లోడ్ చేయండి',
    action_preview_pdf: 'PDF షీట్ చూడండి',
    action_edit_sheet: 'తనిఖీ వివరాలను సవరించండి',
    action_save_changes: 'మార్పులను వర్తింపజేసి మళ్లీ రూపొందించండి',
    action_cancel: 'రద్దు చేయండి',
    action_verify: 'నిబంధనల అమలును ధృవీకరించండి',
    action_bulk_upload: 'బల్క్ ఫోటోల అప్‌లోడ్',
    action_select_photos: 'ఫోటోలను ఎంచుకోండి',

    // Health & Safety
    health_safety_title: 'ఆహార సంకలనాలు, రంగులు & ఆరోగ్య భద్రతా తనిఖీ',
    health_clean: '100% స్వచ్ఛమైన & రసాయన రహితం',
    health_additives: 'అనుమతించబడిన ఆహార సంకలనాలు ఉన్నాయి',
    health_warning: 'చట్టబద్ధమైన ఆరోగ్య హెచ్చరిక తప్పనిసరి',

    // Shelf Life
    shelf_life_title: 'షెల్ఫ్ లైఫ్ & గడువు స్థితి',
    shelf_life_remaining: 'మిగిలిన షెల్ఫ్ లైఫ్',
    shelf_life_expired: 'గడువు ముగిసిన వస్తువు - సెక్షన్ 36 కింద నేరం',
    shelf_life_active: 'వినియోగానికి చెల్లుబాటు అవుతుంది'
  }
};

/**
 * Get translated UI string by key for active language
 */
export function getTranslation(key: string, lang: Language = 'en'): string {
  const dict = UI_DICTIONARY[lang] || UI_DICTIONARY.en;
  return dict[key] || UI_DICTIONARY.en[key] || key;
}

// Product Terminology and Commodity Dictionary for Vernacular Translation
interface ProductTermMapping {
  enMatch: RegExp;
  hi: string;
  te: string;
}

const COMMODITY_DICTIONARY: ProductTermMapping[] = [
  // Pintola & Peanut Butter
  {
    enMatch: /pintola\s*all[- ]natural\s*peanut\s*butter\s*(crunchy|creamy)?/i,
    hi: 'पिंटोला ऑल-नेचुरल पीनट बटर (क्रंची)',
    te: 'పింటోలా ఆల్-నేచురల్ పీనట్ బటర్ (క్రంచీ)'
  },
  {
    enMatch: /peanut\s*butter/i,
    hi: 'पीनट बटर (मूंगफली का मक्खन)',
    te: 'పీనట్ బటర్ (వేరుశెనగ వెన్న)'
  },
  // Atta & Flour
  {
    enMatch: /aashirvaad\s*shudh\s*chakki\s*(whole\s*wheat)?\s*atta/i,
    hi: 'आशीर्वाद शुद्ध चक्की साबुत गेहूं का आटा',
    te: 'ఆశీర్వాద్ శుద్ధ చక్కి గోధుమ పిండి'
  },
  {
    enMatch: /chakki\s*atta|wheat\s*atta|wheat\s*flour/i,
    hi: 'चक्की गेहूं का आटा',
    te: 'గోధుమ పిండి'
  },
  // Edible Oil
  {
    enMatch: /fortune\s*sunlite\s*refined\s*sunflower\s*oil/i,
    hi: 'फॉर्च्यून सनलाइट रिफाइंड सूरजमुखी तेल',
    te: 'ఫార్చ్యూన్ సన్‌లైట్ రిఫైన్డ్ సన్‌ఫ్లవర్ నూనె'
  },
  {
    enMatch: /sunflower\s*oil/i,
    hi: 'रिफाइंड सूरजमुखी तेल',
    te: 'రిఫైన్డ్ సన్‌ఫ్లవర్ నూనె'
  },
  {
    enMatch: /mustard\s*oil/i,
    hi: 'कच्ची घानी सरसों का तेल',
    te: 'ఆవాల నూనె'
  },
  // Chocolate & Biscuits
  {
    enMatch: /lindt\s*excellence\s*85%\s*cocoa\s*dark\s*chocolate/i,
    hi: 'लिंड्ट एक्सीलेंस 85% कोको डार्क चॉकलेट',
    te: 'లిండ్ట్ ఎక్సలెన్స్ 85% కోకో డార్క్ చాక్లెట్'
  },
  {
    enMatch: /dark\s*chocolate/i,
    hi: 'डार्क चॉकलेट बार',
    te: 'డార్క్ చాక్లెట్'
  },
  {
    enMatch: /sunfeast\s*farmlite\s*digestive\s*biscuits?/i,
    hi: 'सनफीस्ट फार्मलाइट डाइजेस्टिव बिस्कुट',
    te: 'సన్‌ఫీస్ట్ ఫార్మ్‌లైట్ డైజెస్టివ్ బిస్కెట్లు'
  },
  {
    enMatch: /digestive\s*biscuits?/i,
    hi: 'डाइजेस्टिव बिस्कुट',
    te: 'డైజెస్టివ్ బిస్కెట్లు'
  },
  {
    enMatch: /hershey[’']?s\s*chocolate\s*(flavored\s*)?syrup/i,
    hi: 'हर्शीज़ चॉकलेट फ्लेवर्ड सिरप',
    te: 'హెర్షీస్ చాక్లెట్ సిరప్'
  },
  // Common Commodities
  { enMatch: /\brice\b/i, hi: 'चावल (बासमती)', te: 'బియ్యం (రైస్)' },
  { enMatch: /\bmilk\b/i, hi: 'ताजा दूध', te: 'పాలు' },
  { enMatch: /\btea\b|chai/i, hi: 'प्रीमियम चायपत्ती', te: 'టీ పొడి' },
  { enMatch: /\bcoffee\b/i, hi: 'कॉफ़ी पाउडर', te: 'కాఫీ పొడి' },
  { enMatch: /\bsalt\b/i, hi: 'आयोडीन युक्त नमक', te: 'ఉప్పు (సాల్ట్)' },
  { enMatch: /\bsugar\b/i, hi: 'रिफाइंड चीनी', te: 'చక్కెర' },
  { enMatch: /\bghee\b/i, hi: 'शुद्ध देसी घी', te: 'స్వచ్ఛమైన నెయ్యి' },
  { enMatch: /\bbutter\b/i, hi: 'मक्खन (बटर)', te: 'వెన్న (బటర్)' }
];

// Brand transliteration dictionary
const BRAND_DICTIONARY: Record<string, { hi: string; te: string }> = {
  'Pintola': { hi: 'पिंटोला', te: 'పింటోలా' },
  'Aashirvaad': { hi: 'आशीर्वाद', te: 'ఆశీర్వాద్' },
  'Fortune': { hi: 'फॉर्च्यून', te: 'ఫార్చ్యూన్' },
  'Lindt': { hi: 'लिंड्ट', te: 'లిండ్ట్' },
  'Sunfeast': { hi: 'सनफीस्ट', te: 'సన్‌ఫీస్ట్' },
  'Hershey’s': { hi: 'हर्शीज़', te: 'హెర్షీస్' },
  'Amul': { hi: 'अमूल', te: 'అమూల్' },
  'Tata': { hi: 'टाटा', te: 'టాటా' },
  'ITC': { hi: 'आईटीसी', te: 'ఐటీసీ' },
  'Nestle': { hi: 'नेस्ले', te: 'నెస్లే' },
  'Britannia': { hi: 'ब्रिटानिया', te: 'బ్రిటానియా' },
  'Parle': { hi: 'पारले', te: 'పార్లే' }
};

/**
 * Dynamically translate product commodity titles, brand names, and declarations into Hindi or Telugu
 */
export function translateProductText(text: string, lang: Language): string {
  if (!text || lang === 'en') return text;

  // 1. Direct commodity lookup
  for (const item of COMMODITY_DICTIONARY) {
    if (item.enMatch.test(text)) {
      return item[lang];
    }
  }

  // 2. Direct brand lookup
  for (const [brand, trans] of Object.entries(BRAND_DICTIONARY)) {
    if (text.toLowerCase() === brand.toLowerCase()) {
      return trans[lang];
    }
  }

  // 3. Common words replacement
  let translated = text;
  if (lang === 'hi') {
    translated = translated
      .replace(/\bPeanut\b/gi, 'मूंगफली')
      .replace(/\bButter\b/gi, 'मक्खन')
      .replace(/\bChocolate\b/gi, 'चॉकलेट')
      .replace(/\bOil\b/gi, 'तेल')
      .replace(/\bAtta\b/gi, 'आटा')
      .replace(/\bFlour\b/gi, 'आटा')
      .replace(/\bSalt\b/gi, 'नमक')
      .replace(/\bSugar\b/gi, 'चीनी')
      .replace(/\bMilk\b/gi, 'दूध')
      .replace(/\bBiscuits?\b/gi, 'बिस्कुट')
      .replace(/\bIndia\b/gi, 'भारत')
      .replace(/\bSwitzerland\b/gi, 'स्विट्ज़रलैंड');
  } else if (lang === 'te') {
    translated = translated
      .replace(/\bPeanut\b/gi, 'వేరుశెనగ')
      .replace(/\bButter\b/gi, 'వెన్న')
      .replace(/\bChocolate\b/gi, 'చాక్లెట్')
      .replace(/\bOil\b/gi, 'నూనె')
      .replace(/\bAtta\b/gi, 'గోధుమ పిండి')
      .replace(/\bFlour\b/gi, 'పిండి')
      .replace(/\bSalt\b/gi, 'ఉప్పు')
      .replace(/\bSugar\b/gi, 'చక్కెర')
      .replace(/\bMilk\b/gi, 'పాలు')
      .replace(/\bBiscuits?\b/gi, 'బిస్కెట్లు')
      .replace(/\bIndia\b/gi, 'భారతదేశం')
      .replace(/\bSwitzerland\b/gi, 'స్విట్జర్లాండ్');
  }

  return translated;
}

/**
 * Format statutory net quantity with vernacular units
 */
export function formatNetQuantityVernacular(qty: number, unit: string, lang: Language): string {
  if (lang === 'en') return `${qty} ${unit}`;
  if (lang === 'hi') {
    const unitHi = unit === 'g' || unit === 'gm' ? 'ग्राम' : unit === 'kg' ? 'कि.ग्रा.' : unit === 'ml' ? 'मि.ली.' : unit === 'l' ? 'लीटर' : unit;
    return `${qty} ${unitHi}`;
  }
  if (lang === 'te') {
    const unitTe = unit === 'g' || unit === 'gm' ? 'గ్రాములు' : unit === 'kg' ? 'కిలోలు' : unit === 'ml' ? 'మి.లీ.' : unit === 'l' ? 'లీటర్లు' : unit;
    return `${qty} ${unitTe}`;
  }
  return `${qty} ${unit}`;
}
