/**
 * Маска национальной части по макету Figma InputTel (node 3392:29557): `(999) 999 99 99`.
 * Фиксированный код страны `+7` в компоненте, не входит в эти 10 цифр.
 */
export const INPUT_TEL_MASK_PLACEHOLDER = '(999) 999 99 99';

export const INPUT_TEL_NATIONAL_DIGIT_COUNT = 10;

export const INPUT_TEL_COUNTRY_PREFIX = '+7';

/**
 * Из строки ввода извлекает до 10 национальных цифр.
 * Вставки вида `+7…` / `8…` (11 цифр) нормализуются в 10 цифр после кода.
 */
export function parseNationalTelDigits(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.length >= 11 && digits.startsWith('7')) {
    digits = digits.slice(1, 11);
  } else if (digits.length >= 11 && digits.startsWith('8')) {
    digits = digits.slice(1, 11);
  }
  return digits.slice(0, INPUT_TEL_NATIONAL_DIGIT_COUNT);
}

/**
 * Форматирует национальные цифры под маску `(XXX) XXX XX XX`.
 */
export function formatNationalTelMask(digits: string): string {
  const d = digits.slice(0, INPUT_TEL_NATIONAL_DIGIT_COUNT);
  if (d.length === 0) return '';
  const a = d.slice(0, 3);
  if (d.length < 3) return `(${a}`;
  if (d.length === 3) return `(${a})`;
  const b = d.slice(3, 6);
  if (d.length <= 6) return `(${a}) ${b}`;
  const c = d.slice(6, 8);
  if (d.length <= 8) return `(${a}) ${b} ${c}`;
  const e = d.slice(8, 10);
  return `(${a}) ${b} ${c} ${e}`;
}
