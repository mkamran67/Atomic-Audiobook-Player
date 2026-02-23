import { CustomThemeColors } from '../../../shared/types';

const CUSTOM_STYLE_ID = 'custom-theme';

/**
 * Convert hex color to oklch CSS string for DaisyUI compatibility.
 * Uses a simple sRGB->oklch approximation via linear RGB intermediate.
 */
export function hexToOklch(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // sRGB to linear
  const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  // Linear RGB to OKLab
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_cbrt = Math.cbrt(l_);
  const m_cbrt = Math.cbrt(m_);
  const s_cbrt = Math.cbrt(s_);

  const L = 0.2104542553 * l_cbrt + 0.7936177850 * m_cbrt - 0.0040720468 * s_cbrt;
  const a = 1.9779984951 * l_cbrt - 2.4285922050 * m_cbrt + 0.4505937099 * s_cbrt;
  const bOk = 0.0259040371 * l_cbrt + 0.7827717662 * m_cbrt - 0.8086757660 * s_cbrt;

  const C = Math.sqrt(a * a + bOk * bOk);
  let H = (Math.atan2(bOk, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return `${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${H.toFixed(2)}`;
}

const CSS_VAR_MAP: Record<keyof CustomThemeColors, string> = {
  primary: '--p',
  secondary: '--s',
  accent: '--a',
  neutral: '--n',
  'base-100': '--b1',
  'base-200': '--b2',
  'base-300': '--b3',
  'base-content': '--bc',
};

/**
 * Inject or update a <style> element with custom theme CSS variables.
 */
export function applyCustomThemeVars(colors: CustomThemeColors): void {
  let style = document.getElementById(CUSTOM_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = CUSTOM_STYLE_ID;
    document.head.appendChild(style);
  }

  const vars = Object.entries(CSS_VAR_MAP)
    .map(([key, cssVar]) => {
      const hex = colors[key as keyof CustomThemeColors];
      if (!hex) return '';
      return `  ${cssVar}: ${hexToOklch(hex)};`;
    })
    .filter(Boolean)
    .join('\n');

  style.textContent = `[data-theme="custom"] {\n${vars}\n}`;
}

/**
 * Remove the custom theme style element.
 */
export function removeCustomThemeVars(): void {
  const style = document.getElementById(CUSTOM_STYLE_ID);
  if (style) style.remove();
}

/**
 * Get the system (OS) preferred theme.
 */
export function getSystemTheme(): 'atomicDark' | 'atomicLight' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'atomicDark' : 'atomicLight';
}

/**
 * Apply theme to the document.
 */
export function applyTheme(
  mode: 'dark' | 'light' | 'system',
  useCustomColors?: boolean,
  customColors?: CustomThemeColors | null
): void {
  if (useCustomColors && customColors) {
    applyCustomThemeVars(customColors);
    document.documentElement.setAttribute('data-theme', 'custom');
    return;
  }

  removeCustomThemeVars();

  let theme: string;
  switch (mode) {
    case 'dark':
      theme = 'atomicDark';
      break;
    case 'light':
      theme = 'atomicLight';
      break;
    case 'system':
      theme = getSystemTheme();
      break;
  }

  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Listen for OS theme changes. Returns a cleanup function.
 */
export function listenForSystemThemeChanges(cb: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
