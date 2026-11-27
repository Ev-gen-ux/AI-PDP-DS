import { describe, expect, it } from 'vitest';
import {
  formatNationalTelMask,
  INPUT_TEL_MASK_PLACEHOLDER,
  parseNationalTelDigits,
} from './inputTelMask';

describe('inputTelMask', () => {
  it('uses Figma mask placeholder', () => {
    expect(INPUT_TEL_MASK_PLACEHOLDER).toBe('(999) 999 99 99');
  });

  it('parseNationalTelDigits caps at 10 digits', () => {
    expect(parseNationalTelDigits('912345678999')).toBe('9123456789');
  });

  it('parseNationalTelDigits strips +7 prefix from paste', () => {
    expect(parseNationalTelDigits('+7 (912) 345-67-89')).toBe('9123456789');
  });

  it('parseNationalTelDigits strips leading 8 from 11-digit paste', () => {
    expect(parseNationalTelDigits('89123456789')).toBe('9123456789');
  });

  it('formatNationalTelMask matches Figma grouping with spaces', () => {
    expect(formatNationalTelMask('9123456789')).toBe('(912) 345 67 89');
    expect(formatNationalTelMask('91')).toBe('(91');
    expect(formatNationalTelMask('912')).toBe('(912)');
    expect(formatNationalTelMask('9123')).toBe('(912) 3');
  });
});
