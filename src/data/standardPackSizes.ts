// The Second Schedule (See Rule 5)
// Commodities to be packed in specified standard quantities

import { StandardPackSizeRule } from '../types';

export const STANDARD_PACK_RULES: StandardPackSizeRule[] = [
  {
    category: 'baby_food',
    name: 'Baby food',
    scheduleItemNo: 1,
    allowedSizes: {
      unit: 'g',
      exactValues: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 5000, 10000]
    }
  },
  {
    category: 'weaning_food',
    name: 'Weaning food',
    scheduleItemNo: 2,
    allowedSizes: {
      unit: 'g',
      exactValues: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 5000, 10000]
    }
  },
  {
    category: 'biscuits',
    name: 'Biscuits',
    scheduleItemNo: 3,
    allowedSizes: {
      unit: 'g',
      exactValues: [25, 50, 75, 100, 150, 200, 250, 300],
      multiplesAbove: 300,
      step: 100,
      maxLimit: 1000
    }
  },
  {
    category: 'bread',
    name: 'Bread including brown bread',
    scheduleItemNo: 4,
    allowedSizes: {
      unit: 'g',
      exactValues: [100],
      multiplesAbove: 100,
      step: 100
    }
  },
  {
    category: 'butter_margarine',
    name: 'Un-canned packages of butter and margarine',
    scheduleItemNo: 5,
    allowedSizes: {
      unit: 'g',
      exactValues: [25, 50, 100, 200, 500, 1000, 2000, 5000],
      multiplesAbove: 5000,
      step: 5000
    }
  },
  {
    category: 'cereals_pulses',
    name: 'Cereals and Pulses',
    scheduleItemNo: 6,
    allowedSizes: {
      unit: 'g',
      exactValues: [100, 200, 500, 1000, 2000, 5000],
      multiplesAbove: 5000,
      step: 5000
    }
  },
  {
    category: 'coffee',
    name: 'Coffee',
    scheduleItemNo: 7,
    allowedSizes: {
      unit: 'g',
      exactValues: [25, 50, 100, 200, 250, 500, 1000],
      multiplesAbove: 1000,
      step: 1000
    }
  },
  {
    category: 'tea',
    name: 'Tea',
    scheduleItemNo: 8,
    allowedSizes: {
      unit: 'g',
      exactValues: [25, 50, 100, 125, 250, 500, 1000],
      multiplesAbove: 1000,
      step: 1000
    }
  },
  {
    category: 'edible_oils',
    name: 'Edible Oils, Vanaspati, ghee, butter oil',
    scheduleItemNo: 10,
    allowedSizes: {
      unit: 'g_or_ml',
      exactValues: [50, 100, 200, 500, 1000, 2000, 3000, 5000],
      multiplesAbove: 5000,
      step: 5000,
      specialRules: 'If declared by volume, equivalent mass must be declared in brackets.'
    }
  },
  {
    category: 'milk_powder',
    name: 'Milk Powder',
    scheduleItemNo: 11,
    allowedSizes: {
      unit: 'g',
      exactValues: [50, 100, 200, 500, 1000],
      multiplesAbove: 1000,
      step: 500,
      specialRules: 'Below 50g no restriction.'
    }
  },
  {
    category: 'detergent_powder',
    name: 'Non-soapy detergents (powder)',
    scheduleItemNo: 12,
    allowedSizes: {
      unit: 'g',
      exactValues: [50, 100, 200, 500, 700, 1000, 1500, 2000],
      multiplesAbove: 2000,
      step: 1000,
      specialRules: 'Below 50g no restriction.'
    }
  },
  {
    category: 'rice_flour_atta_suji',
    name: 'Rice (powdered), flour, atta, rawa and suji',
    scheduleItemNo: 13,
    allowedSizes: {
      unit: 'g',
      exactValues: [100, 200, 500, 1000, 2000, 5000],
      multiplesAbove: 5000,
      step: 5000
    }
  },
  {
    category: 'salt',
    name: 'Salt',
    scheduleItemNo: 14,
    allowedSizes: {
      unit: 'g',
      exactValues: [50, 100, 200, 500, 750, 1000, 2000, 5000],
      multiplesAbove: 5000,
      step: 5000,
      specialRules: 'Below 50g in multiples of 10g.'
    }
  },
  {
    category: 'toilet_soap',
    name: 'Toilet Soap including bath soap cakes',
    scheduleItemNo: 15,
    allowedSizes: {
      unit: 'g',
      exactValues: [25, 50, 75, 100, 125, 150],
      multiplesAbove: 150,
      step: 50
    }
  },
  {
    category: 'aerated_soft_drinks',
    name: 'Aerated soft drinks, non-alcoholic beverages',
    scheduleItemNo: 16,
    allowedSizes: {
      unit: 'ml',
      exactValues: [65, 100, 125, 150, 200, 250, 300, 330, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000]
    }
  },
  {
    category: 'mineral_water',
    name: 'Mineral water and drinking water',
    scheduleItemNo: 17,
    allowedSizes: {
      unit: 'ml',
      exactValues: [100, 150, 200, 250, 300, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000]
    }
  }
];

export function isStandardPackSize(category: string, quantity: number, unit: string): { isCompliant: boolean; standardNote: string; allowedSizesList: string } {
  const rule = STANDARD_PACK_RULES.find(r => r.category === category);
  if (!rule) {
    return {
      isCompliant: true,
      standardNote: 'Commodity not restricted under Second Schedule mandatory standard sizes.',
      allowedSizesList: 'General packaged commodity'
    };
  }

  // Normalize unit to grams or ml
  let normalizedQty = quantity;
  const lowerUnit = unit.toLowerCase().trim();
  if (lowerUnit === 'kg' || lowerUnit === 'kilogram' || lowerUnit === 'l' || lowerUnit === 'litre' || lowerUnit === 'liter') {
    normalizedQty = quantity * 1000;
  }

  const { exactValues, multiplesAbove, step, maxLimit, specialRules } = rule.allowedSizes;

  // Check below threshold exemptions
  if (specialRules && specialRules.includes('Below 50g no restriction') && normalizedQty < 50) {
    return { isCompliant: true, standardNote: 'Compliant: Exempt below 50g per Second Schedule.', allowedSizesList: '< 50g exempt' };
  }

  // Check exact values
  if (exactValues && exactValues.includes(normalizedQty)) {
    return { isCompliant: true, standardNote: `Compliant: ${normalizedQty}g/ml is an exact prescribed size under Item #${rule.scheduleItemNo}.`, allowedSizesList: exactValues.join(', ') + ' g/ml' };
  }

  // Check multiples above threshold
  if (multiplesAbove && step && normalizedQty > multiplesAbove) {
    if (maxLimit && normalizedQty > maxLimit) {
      return {
        isCompliant: false,
        standardNote: `Non-compliant: Exceeds max standard pack limit of ${maxLimit}g under Item #${rule.scheduleItemNo}.`,
        allowedSizesList: (exactValues ? exactValues.join(', ') : '') + ` and multiples of ${step} up to ${maxLimit}g`
      };
    }
    const diff = normalizedQty - multiplesAbove;
    if (diff % step === 0) {
      return {
        isCompliant: true,
        standardNote: `Compliant: ${normalizedQty}g/ml is a valid multiple of ${step} above ${multiplesAbove}g/ml under Item #${rule.scheduleItemNo}.`,
        allowedSizesList: `Multiples of ${step} above ${multiplesAbove}g/ml`
      };
    }
  }

  const allowedText = exactValues ? exactValues.join(', ') + (multiplesAbove && step ? ` (then multiples of ${step})` : '') : '';
  return {
    isCompliant: false,
    standardNote: `Non-compliant: ${quantity}${unit} (${normalizedQty}g/ml) is NOT a prescribed standard pack size under Second Schedule Item #${rule.scheduleItemNo}.`,
    allowedSizesList: allowedText + ' g/ml'
  };
}
