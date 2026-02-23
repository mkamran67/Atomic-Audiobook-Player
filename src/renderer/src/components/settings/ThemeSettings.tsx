import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { setThemeMode, setCustomColors, setUseCustomColors } from './settingsSlice';
import { REQUEST_TO_ELECTRON, WRITE_SETTINGS_FILE } from '../../../../../src/shared/constants';
import { CustomThemeColors } from '../../../../shared/types';

const THEME_MODES = [
  { value: 'light' as const, label: 'Light' },
  { value: 'dark' as const, label: 'Dark' },
  { value: 'system' as const, label: 'System' },
];

const DEFAULT_DARK_COLORS: CustomThemeColors = {
  primary: '#8B7EC8',
  secondary: '#5EADAD',
  accent: '#D4A574',
  neutral: '#1E1B2E',
  'base-100': '#13111C',
  'base-200': '#1A1726',
  'base-300': '#252136',
  'base-content': '#E2DFF0',
};

const COLOR_LABELS: { key: keyof CustomThemeColors; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'base-100', label: 'Background' },
  { key: 'base-200', label: 'Surface' },
  { key: 'base-300', label: 'Border' },
  { key: 'base-content', label: 'Text' },
];

function persistSettings(settings: Record<string, unknown>) {
  window.api.send(REQUEST_TO_ELECTRON, {
    type: WRITE_SETTINGS_FILE,
    data: { action: 'update', payload: settings },
  });
}

export default function ThemeSettings() {
  const dispatch = useDispatch();
  const { themeMode, customColors, useCustomColors } = useSelector(
    (state: RootState) => state.settings
  );

  const handleThemeMode = (mode: 'dark' | 'light' | 'system') => {
    dispatch(setThemeMode(mode));
    persistSettings({ themeMode: mode });
  };

  const handleToggleCustomColors = () => {
    const newValue = !useCustomColors;
    dispatch(setUseCustomColors(newValue));
    if (newValue && !customColors) {
      dispatch(setCustomColors(DEFAULT_DARK_COLORS));
      persistSettings({ useCustomColors: newValue, customColors: DEFAULT_DARK_COLORS });
    } else {
      persistSettings({ useCustomColors: newValue });
    }
  };

  const handleColorChange = (key: keyof CustomThemeColors, value: string) => {
    const updated = { ...(customColors || DEFAULT_DARK_COLORS), [key]: value };
    dispatch(setCustomColors(updated));
    persistSettings({ customColors: updated });
  };

  const handleReset = () => {
    dispatch(setCustomColors(null));
    dispatch(setUseCustomColors(false));
    persistSettings({ customColors: null, useCustomColors: false });
  };

  const currentColors = customColors || DEFAULT_DARK_COLORS;

  return (
    <section>
      <h2 className="text-base font-semibold leading-7 text-base-content/70">Theme</h2>

      {/* Theme Mode Selector */}
      <div className="mt-4">
        <p className="text-sm text-base-content/60 mb-2">Appearance</p>
        <div className="join">
          {THEME_MODES.map(({ value, label }) => (
            <button
              key={value}
              className={`join-item btn btn-sm ${
                themeMode === value ? 'btn-primary' : 'btn-ghost'
              }`}
              onClick={() => handleThemeMode(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="mt-6 border-t border-base-300 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-base-content">Use Custom Colors</p>
            <p className="text-xs text-base-content/50">Override theme with your own palette</p>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={useCustomColors || false}
            onChange={handleToggleCustomColors}
          />
        </div>

        {useCustomColors && (
          <div className="space-y-3">
            {COLOR_LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={currentColors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-base-300 bg-transparent"
                />
                <span className="text-sm text-base-content/70 w-24">{label}</span>
                <span className="text-xs font-mono text-base-content/50">
                  {currentColors[key]}
                </span>
              </div>
            ))}
            <button
              className="btn btn-ghost btn-sm mt-2 text-error"
              onClick={handleReset}
            >
              Reset to Default
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
