import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { applyTheme, listenForSystemThemeChanges } from './themeManager';

export function useTheme(): void {
  const { theme, useSystemTheme, customColors, useCustomColors } = useSelector(
    (state: RootState) => state.settings
  );

  useEffect(() => {
    applyTheme(theme, useSystemTheme, useCustomColors, customColors);
  }, [theme, useSystemTheme, customColors, useCustomColors]);

  useEffect(() => {
    if (!useSystemTheme || useCustomColors) return;

    const cleanup = listenForSystemThemeChanges(() => {
      applyTheme(theme, true, false, null);
    });

    return cleanup;
  }, [theme, useSystemTheme, useCustomColors]);
}
