// The First Schedule [See Rule 2(e) & Rule 22]
// Maximum Permissible Errors on Net Quantity Declared by Weight or Volume

export interface MPEResult {
  declaredQuantity: number;
  unit: string;
  maxPermissibleError: number; // in g or ml
  minAllowableActual: number;
  maxAllowableActual: number;
  ruleExplanation: string;
  isCompliant: boolean;
}

export function calculateMPE(declaredQty: number, unit: string, actualMeasuredQty?: number): MPEResult {
  let qtyInGOrMl = declaredQty;
  const u = unit.toLowerCase().trim();
  if (u === 'kg' || u === 'l' || u === 'litre' || u === 'liter') {
    qtyInGOrMl = declaredQty * 1000;
  }

  let mpeVal = 0;
  let ruleText = '';

  if (qtyInGOrMl <= 50) {
    mpeVal = qtyInGOrMl * 0.09;
    ruleText = '9% of declared quantity (Table I, Sl. No. i)';
  } else if (qtyInGOrMl <= 100) {
    mpeVal = 4.5;
    ruleText = '4.5 g/ml fixed allowance (Table I, Sl. No. ii)';
  } else if (qtyInGOrMl <= 200) {
    mpeVal = qtyInGOrMl * 0.045;
    ruleText = '4.5% of declared quantity (Table I, Sl. No. iii)';
  } else if (qtyInGOrMl <= 300) {
    mpeVal = 9.0;
    ruleText = '9.0 g/ml fixed allowance (Table I, Sl. No. iv)';
  } else if (qtyInGOrMl <= 500) {
    mpeVal = qtyInGOrMl * 0.03;
    ruleText = '3.0% of declared quantity (Table I, Sl. No. v)';
  } else if (qtyInGOrMl <= 1000) {
    mpeVal = 15.0;
    ruleText = '15.0 g/ml fixed allowance (Table I, Sl. No. vi)';
  } else if (qtyInGOrMl <= 10000) {
    mpeVal = qtyInGOrMl * 0.015;
    ruleText = '1.5% of declared quantity (Table I, Sl. No. vii)';
  } else if (qtyInGOrMl <= 15000) {
    mpeVal = 150.0;
    ruleText = '150 g/ml fixed allowance (Table I, Sl. No. viii)';
  } else {
    mpeVal = qtyInGOrMl * 0.01;
    ruleText = '1.0% of declared quantity (Table I, Sl. No. ix)';
  }

  // Rounding rules per Schedule 1 (2):
  if (qtyInGOrMl <= 1000) {
    mpeVal = Math.round(mpeVal * 10) / 10;
  } else {
    mpeVal = Math.ceil(mpeVal);
  }

  const minAllowable = qtyInGOrMl - mpeVal;
  const maxAllowable = qtyInGOrMl + mpeVal;

  let isCompliant = true;
  if (actualMeasuredQty !== undefined) {
    let actualGOrMl = actualMeasuredQty;
    if (u === 'kg' || u === 'l' || u === 'litre' || u === 'liter') {
      actualGOrMl = actualMeasuredQty * 1000;
    }
    // Rule 19(4)(b) & Rule 21(3): Deficiency greater than MPE is a violation
    isCompliant = actualGOrMl >= minAllowable;
  }

  return {
    declaredQuantity: qtyInGOrMl,
    unit: u === 'kg' ? 'g (normalized)' : (u === 'l' || u === 'litre' ? 'ml (normalized)' : unit),
    maxPermissibleError: mpeVal,
    minAllowableActual: minAllowable,
    maxAllowableActual: maxAllowable,
    ruleExplanation: `First Schedule Table-I: ${ruleText} -> Max permissible deficiency = ${mpeVal}g/ml`,
    isCompliant
  };
}
