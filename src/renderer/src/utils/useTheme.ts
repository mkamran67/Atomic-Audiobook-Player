import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { applyTheme, listenForSystemThemeChanges } from './themeManager';

export function useTheme(): void {
  const { themeMode, customColors, useCustomColors } = useSelector(
    (state: RootState) => state.settings
  );

  useEffect(() => {
    applyTheme(themeMode, useCustomColors, customColors);
  }, [themeMode, customColors, useCustomColors]);

  useEffect(() => {
    if (themeMode !== 'system' || useCustomColors) return;

    const cleanup = listenForSystemThemeChanges(() => {
      applyTheme('system', false, null);
    });

    return cleanup;
  }, [themeMode, useCustomColors]);
}
