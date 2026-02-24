import { CustomThemeColors } from '../../../shared/types';

const CUSTOM_STYLE_ID = 'custom-theme';

const CSS_VAR_MAP: Record<keyof CustomThemeColors, string> = {
  primary: '--primary',
  secondary: '--secondary',
  accent: '--accent',
  neutral: '--neutral',
  'base-100': '--base-100',
  'base-200': '--base-200',
  'base-300': '--base-300',
  'base-content': '--base-content',
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
      return `  ${cssVar}: ${hex};`;
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
