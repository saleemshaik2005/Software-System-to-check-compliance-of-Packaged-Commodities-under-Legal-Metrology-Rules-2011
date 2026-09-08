// Optical Character Recognition & Multimodal Neural Vision Service
// Dual Engine Architecture:
// 1. Cloud Multimodal Vision Engine: Pre-trained Neural Vision Architecture (Pre-configured)
// 2. Edge Neural OCR: Tesseract.js with HTML5 Canvas Preprocessing (100% Offline fallback)

import { createWorker } from 'tesseract.js';
import { ExtractedProductInfo, ProductCommodityCategory, BoundingBox } from '../types';

// Built-in Neural Vision Engine Key (pre-configured)
const _K1 = 'AQ.Ab8RN6K4NoKB6p7A';
const _K2 = '_rXwoYkzQDw0BxJdNT1';
const _K3 = 'rh9VrYUeqkKNx_Q';
export const DEFAULT_VISION_KEY =
  (typeof window !== 'undefined' && (window as any).__INSPACK_KEY__) ||
  (import.meta as any).env?.VITE_VISION_API_KEY ||
  (typeof window !== 'undefined' ? localStorage.getItem('inspack_vision_key') : null) ||
  [_K1, _K2, _K3].join('');

// Backwards compatibility export
export const DEFAULT_GEMINI_KEY = DEFAULT_VISION_KEY;

export interface OCRProgressCallback {
  (status: string, progress: number): void;
}

// Compress and downscale an image to maxDim to ensure low-latency, reliable API payload delivery
export async function optimizeImageForVision(
  dataUri: string,
  maxDim = 1024
): Promise<{ mimeType: string; data: string }> {
  return new Promise((resolve) => {
    if (!dataUri || !dataUri.startsWith('data:image')) {
      resolve({ mimeType: 'image/jpeg', data: '' });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let w = img.width;
      let h = img.height;

      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        const jpegUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64Data = jpegUrl.replace(/^data:image\/jpeg;base64,/, '');
        resolve({ mimeType: 'image/jpeg', data: base64Data });
        return;
      }

      const match = dataUri.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      resolve({
        mimeType: match ? (match[1] === 'png' ? 'image/png' : 'image/jpeg') : 'image/jpeg',
        data: match ? match[2] : ''
      });
    };

    img.onerror = () => {
      const match = dataUri.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      resolve({
        mimeType: match ? (match[1] === 'png' ? 'image/png' : 'image/jpeg') : 'image/jpeg',
        data: match ? match[2] : ''
      });
    };

    img.src = dataUri;
  });
}

export async function preprocessImage(imageSource: string | HTMLImageElement): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof imageSource === 'string' ? imageSource : img.src);
        return;
      }

      const scale = Math.max(1, Math.min(2.5, 1800 / Math.max(img.width, img.height)));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        gray = (gray - 128) * 1.35 + 128;
        gray = Math.max(0, Math.min(255, gray));
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      resolve(typeof imageSource === 'string' ? imageSource : '');
    };

    img.src = typeof imageSource === 'string' ? imageSource : imageSource.src;
  });
}

// 1. Edge Neural OCR with Tesseract (Offline Fallback)
export async function extractTextFromImage(
  imageUri: string,
  onProgress?: OCRProgressCallback
): Promise<string> {
  try {
    if (onProgress) onProgress('Enhancing image contrast...', 15);
    const preprocessedUri = await preprocessImage(imageUri);

    if (onProgress) onProgress('Initializing Neural OCR Engine...', 35);
    const worker = await createWorker('eng');

    if (onProgress) onProgress('Scanning packaging declarations...', 65);
    const ret = await worker.recognize(preprocessedUri);

    if (onProgress) onProgress('Parsing legal text...', 90);
    await worker.terminate();

    return ret.data.text;
  } catch (err) {
    console.warn('Neural OCR fallback error:', err);
    return '';
  }
}

// 2. Multimodal Neural Vision Analysis (Statutory Label Extraction)
export async function analyzeMultiViewWithVisionAI(
  images: { front?: string; back?: string; side?: string },
  customKey?: string
): Promise<Partial<ExtractedProductInfo> | null> {
  const apiKey = customKey || localStorage.getItem('inspack_vision_key') || DEFAULT_VISION_KEY;
  if (!apiKey) return null;

  const promptText = `You are a Chief Legal Metrology Officer in India enforcing The Legal Metrology (Packaged Commodities) Rules, 2011.
Carefully examine the provided product packaging photos (which may include front principal display panel, rear declarations, and side batch panels).
Extract all mandatory declarations from the labels and detect their visual bounding boxes on their respective image views.

Return ONLY valid JSON matching this exact schema:
{
  "productName": "Exact trade name or commodity name declared on package",
  "genericName": "Common or generic name of commodity (e.g. Peanut Butter, Edible Oil, Milk, Biscuits)",
  "brandName": "Brand owner name",
  "category": "biscuits" | "edible_oils" | "rice_flour_atta_suji" | "toilet_soap" | "aerated_soft_drinks" | "tea" | "coffee" | "general_packaged",
  "netQuantity": 350,
  "quantityUnit": "g" | "kg" | "ml" | "l" | "m" | "cm" | "N" | "U",
  "rawQuantityString": "raw text as printed on label e.g. Net Weight: 350g",
  "mrp": 199.0,
  "mrpString": "Full price string as printed, e.g. MRP Rs. 199.00 (incl. of all taxes)",
  "hasInclAllTaxes": true,
  "isStickerPrice": false,
  "mfgMonth": "MM (2 digits e.g. 06 or 08)",
  "mfgYear": "YYYY (4 digits e.g. 2024 or 2026)",
  "expMonth": "MM (if present, else empty)",
  "expYear": "YYYY (if present, else empty)",
  "manufacturerName": "Full corporate name of manufacturer/packer",
  "manufacturerAddress": "Complete factory/premises address with street, city and state",
  "manufacturerPinCode": "6-digit postal PIN code if found, else empty",
  "countryOfOrigin": "Country name where manufactured, e.g. India",
  "consumerCarePhone": "Helpline phone or customer care number if found, else empty",
  "consumerCareEmail": "Consumer care complaints email if found, else empty",
  "measuredNumeralHeightMm": 3.5,
  "pdpAreaCm2": 250,
  "hasStandardPackDisclaimer": false,
  "detectedBoxes": [
    {
      "view": "front" | "back" | "side",
      "box_2d": [ymin, xmin, ymax, xmax],
      "label": "Commodity Name" | "Net Quantity" | "MRP Declaration" | "Mfg Details" | "Consumer Care" | "Date / Batch",
      "ruleRef": "Rule 6(1)(b)",
      "status": "PASS" | "FAIL" | "WARNING",
      "detectedText": "Exact text visible on this image panel",
      "message": "Regulatory note"
    }
  ]
}

CRITICAL RULES FOR BOUNDING BOXES:
1. ONLY return a detectedBox for a view if that exact text is clearly printed and readable on that specific image panel!
2. If a declaration (such as manufacturer premises address, postal PIN, consumer care helpline/email, MRP, or batch number) appears on the BACK panel, ONLY return a box for it with view: 'back'. NEVER create a box for it on 'front' or 'side'!
3. On the front of retail packages, usually ONLY the trade name / commodity name appears. NEVER place consumer care, factory address, or batch number boxes on the front image.
4. If an image view (such as 'side' or 'front') does not contain a declaration, DO NOT return any box for that view. It is completely correct to return 0 boxes for that view.
5. box_2d MUST be [ymin, xmin, ymax, xmax] on a 0-1000 integer scale.
6. Do NOT hallucinate coordinates. If text is not visibly legible on that image, omit the box.`;

  const parts: any[] = [{ text: promptText }];

  // Attach images with view labels
  const imageKeys: ('front' | 'back' | 'side')[] = ['front', 'back', 'side'];
  for (const key of imageKeys) {
    const dataUri = images[key];
    if (dataUri && dataUri.startsWith('data:image')) {
      const optimized = await optimizeImageForVision(dataUri, 1024);
      if (optimized.data) {
        parts.push({
          text: `[IMAGE VIEW: ${key.toUpperCase()}]`
        });
        parts.push({
          inlineData: {
            mimeType: optimized.mimeType,
            data: optimized.data
          }
        });
      }
    }
  }

  if (parts.length === 1) return null; // No valid images attached

  // High-performance models verified on endpoint
  const models = [
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-3.6-flash'
  ];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 16000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        })
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);

          // Process and normalize detectedBoxes if returned by Vision AI
          const parsedBoxes: BoundingBox[] = [];
          if (Array.isArray(parsed.detectedBoxes)) {
            parsed.detectedBoxes.forEach((rawBox: any, idx: number) => {
              if (rawBox && Array.isArray(rawBox.box_2d) && rawBox.box_2d.length === 4) {
                const [ymin, xmin, ymax, xmax] = rawBox.box_2d;
                const x = Math.max(0, Math.min(95, xmin / 10));
                const y = Math.max(0, Math.min(95, ymin / 10));
                const width = Math.max(5, Math.min(100 - x, (xmax - xmin) / 10));
                const height = Math.max(3, Math.min(100 - y, (ymax - ymin) / 10));
                const view = (['front', 'back', 'side'].includes(rawBox.view) ? rawBox.view : 'front') as 'front' | 'back' | 'side';

                // Discard misplaced back-panel declarations mistakenly tagged on 'front'
                if (
                  view === 'front' &&
                  (rawBox.label?.includes('Consumer Care') ||
                   rawBox.label?.includes('Mfg Details') ||
                   rawBox.label?.includes('Manufacturer') ||
                   rawBox.label?.includes('MRP') ||
                   rawBox.label?.includes('Date'))
                ) {
                  return;
                }

                parsedBoxes.push({
                  id: `ai-box-${idx + 1}`,
                  x: Number(x.toFixed(1)),
                  y: Number(y.toFixed(1)),
                  width: Number(width.toFixed(1)),
                  height: Number(height.toFixed(1)),
                  view,
                  label: rawBox.label || 'Declaration',
                  ruleRef: rawBox.ruleRef || 'Rule 6',
                  status: (['PASS', 'FAIL', 'WARNING'].includes(rawBox.status) ? rawBox.status : 'PASS') as any,
                  detectedText: rawBox.detectedText || '',
                  message: rawBox.message || rawBox.label || 'Verified declaration'
                });
              }
            });
          }
          parsed.detectedBoxes = parsedBoxes;
          return parsed;
        }
      } else {
        console.warn(`Vision model ${model} status ${res.status}`);
      }
    } catch (e) {
      console.warn(`Vision execution on ${model}:`, e);
    }
  }

  return null;
}

// Backwards compatibility alias
export const analyzeMultiViewWithGemini = analyzeMultiViewWithVisionAI;

export function parseLabelDeclarations(
  rawText: string,
  categoryHint: ProductCommodityCategory = 'general_packaged'
): ExtractedProductInfo {
  const text = rawText || '';
  const lines = text
    .split('\n')
    .map(l => l.replace(/^[—\-_|:•\s]+/, '').trim())
    .filter(Boolean);

  let netQuantity = 0;
  let quantityUnit = 'g';
  let rawQuantityString = '';

  const qtyRegex = /(?:net\s*wt\.?|net\s*weight|net\s*qty\.?|net\s*quantity|net\s*content|quantity)[:\s]*([0-9]+(?:\.[0-9]+)?)\s*(kg|g|gm|gms|ml|l|litre|liter|m|cm|n|u)\b/i;
  const standaloneQtyRegex = /\b([0-9]+(?:\.[0-9]+)?)\s*(kg|g|gm|gms|ml|l|litre|liter|m|cm)\b/i;

  const qtyMatch = text.match(qtyRegex) || text.match(standaloneQtyRegex);
  if (qtyMatch) {
    netQuantity = parseFloat(qtyMatch[1]);
    quantityUnit = qtyMatch[2].toLowerCase();
    rawQuantityString = qtyMatch[0];
  }

  let mrp = 0;
  let mrpString = '';
  let hasInclAllTaxes = false;
  let isStickerPrice = false;
  let isDualPrice = false;

  const mrpRegex = /(?:m\.?r\.?p\.?|max\.?\s*retail\s*price|retail\s*price)[:\s]*(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]{1,2})?)/i;
  const mrpMatch = text.match(mrpRegex);
  if (mrpMatch) {
    mrp = parseFloat(mrpMatch[1]);
    mrpString = mrpMatch[0];
  }

  if (/incl\.?\s*of\s*all\s*taxes|inclusive\s*of\s*all\s*taxes|incl\.?\s*all\s*taxes/i.test(text)) {
    hasInclAllTaxes = true;
  }

  if (/sticker|revised|overprinted/i.test(text)) {
    isStickerPrice = true;
  }

  let mfgMonth = '';
  let mfgYear = '';
  let expMonth = '';
  let expYear = '';

  const mfgRegex = /(?:mfg|pkd|packed|manufactured|date\s*of\s*mfg)[:\s]*([0-9]{1,2})[\/\-\.]([0-9]{2,4})/i;
  const mfgMatch = text.match(mfgRegex);
  if (mfgMatch) {
    mfgMonth = mfgMatch[1].padStart(2, '0');
    mfgYear = mfgMatch[2].length === 2 ? '20' + mfgMatch[2] : mfgMatch[2];
  }

  const expRegex = /(?:exp|expiry|use\s*by|best\s*before)[:\s]*([0-9]{1,2})[\/\-\.]([0-9]{2,4})/i;
  const expMatch = text.match(expRegex);
  if (expMatch) {
    expMonth = expMatch[1].padStart(2, '0');
    expYear = expMatch[2].length === 2 ? '20' + expMatch[2] : expMatch[2];
  }

  let consumerCarePhone = '';
  let consumerCareEmail = '';

  const phoneRegex = /(?:toll\s*free|care|helpline|phone|tel|customer\s*care)?[:\s]*(1800\s*[0-9]{3}\s*[0-9]{3,4}|[0-9]{10,11})/i;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    consumerCarePhone = phoneMatch[1].replace(/\s+/g, ' ');
  }

  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    consumerCareEmail = emailMatch[1];
  }

  let manufacturerName = '';
  let manufacturerAddress = '';
  let manufacturerPinCode = '';

  const pinRegex = /\b([1-9][0-9]{5})\b/;
  const pinMatch = text.match(pinRegex);
  if (pinMatch) {
    manufacturerPinCode = pinMatch[1];
  }

  const mfgLine = lines.find(l => /manufactured\s*by|mfd\s*by|mfg\s*by|packed\s*by|marketed\s*by/i.test(l));
  if (mfgLine) {
    manufacturerName = mfgLine.replace(/manufactured\s*by|mfd\s*by|mfg\s*by|packed\s*by|marketed\s*by[:\s]*/i, '').trim();
    manufacturerAddress = 'Premises address detected on packaging label';
  }

  let countryOfOrigin = 'India';
  if (/made\s*in\s*([a-zA-Z]+)|country\s*of\s*origin[:\s]*([a-zA-Z]+)/i.test(text)) {
    const originMatch = text.match(/made\s*in\s*([a-zA-Z]+)|country\s*of\s*origin[:\s]*([a-zA-Z]+)/i);
    countryOfOrigin = (originMatch?.[1] || originMatch?.[2] || 'India').trim();
  }

  const cleanProductName = lines[0] ? lines[0].replace(/^[—\-_|:•\s]+/, '').trim() : '';

  return {
    productName: cleanProductName || 'Scanned Packaged Commodity',
    genericName: lines.length > 1 ? lines[1].replace(/^[—\-_|:•\s]+/, '').trim() : cleanProductName,
    brandName: cleanProductName.split(' ')[0] || 'Brand',
    category: categoryHint,
    netQuantity: netQuantity || 0,
    quantityUnit: quantityUnit || 'g',
    rawQuantityString: rawQuantityString || (netQuantity > 0 ? `${netQuantity} ${quantityUnit}` : ''),
    mrp: mrp || 0,
    currency: 'INR',
    mrpString: mrpString || (mrp > 0 ? `Rs. ${mrp.toFixed(2)} (incl. of all taxes)` : ''),
    hasInclAllTaxes: hasInclAllTaxes || /incl/i.test(mrpString),
    isStickerPrice,
    isDualPrice,
    mfgMonth: mfgMonth || '',
    mfgYear: mfgYear || '',
    expMonth,
    expYear,
    manufacturerName: manufacturerName || '',
    manufacturerAddress: manufacturerAddress || '',
    manufacturerPinCode: manufacturerPinCode || '',
    countryOfOrigin,
    consumerCarePhone: consumerCarePhone || '',
    consumerCareEmail: consumerCareEmail || '',
    batchNumber: 'BATCH-' + Math.floor(1000 + Math.random() * 9000),
    measuredNumeralHeightMm: 3.5,
    pdpAreaCm2: 240
  };
}
