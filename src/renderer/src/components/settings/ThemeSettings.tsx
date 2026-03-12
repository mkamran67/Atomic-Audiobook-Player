import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { setTheme, setUseSystemTheme, setCustomColors, setUseCustomColors } from './settingsSlice';
import { REQUEST_TO_ELECTRON, WRITE_SETTINGS_FILE } from '../../../../../src/shared/constants';
import { CustomThemeColors } from '../../../../shared/types';
import { DARK_THEMES, LIGHT_THEMES, ThemePreset, resolveSystemTheme } from '../../utils/themes';

const DEFAULT_DARK_COLORS: CustomThemeColors = {
  primary: '#A78BFA',
  secondary: '#34D399',
  accent: '#FB923C',
  neutral: '#1A1A2E',
  'base-100': '#0F0F1A',
  'base-200': '#161625',
  'base-300': '#1F1F35',
  'base-content': '#E8E6F0',
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

function ThemeCard({
  preset,
  isActive,
  onSelect,
}: {
  preset: ThemePreset;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { colors } = preset;
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-start gap-1.5 rounded-lg p-3 text-left transition-all border-2 ${
        isActive
          ? 'border-primary ring-1 ring-primary/30'
          : 'border-base-300 hover:border-base-content/20'
      }`}
      style={{ backgroundColor: colors['base-100'] }}
    >
      <span
        className="text-xs font-medium"
        style={{ color: colors['base-content'] }}
      >
        {preset.label}
      </span>
      <div className="flex gap-1.5">
        <span
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
        <span
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: colors.secondary }}
        />
        <span
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: colors.accent }}
        />
      </div>
    </button>
  );
}

export default function ThemeSettings() {
  const dispatch = useDispatch();
  const { theme, useSystemTheme, customColors, useCustomColors } = useSelector(
    (state: RootState) => state.settings
  );

  const activeThemeId = useSystemTheme ? resolveSystemTheme(theme) : theme;

  const handleSelectTheme = (id: string) => {
    dispatch(setTheme(id));
    persistSettings({ theme: id });
  };

  const handleToggleSystem = () => {
    const newValue = !useSystemTheme;
    dispatch(setUseSystemTheme(newValue));
    persistSettings({ useSystemTheme: newValue });
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

      {/* System Theme Toggle */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-base-content">Follow System</p>
          <p className="text-xs text-base-content/50">Automatically switch between dark and light</p>
        </div>
        <button
          type="button"
          className={`toggle-switch ${useSystemTheme ? 'active' : ''}`}
          onClick={handleToggleSystem}
          role="switch"
          aria-checked={useSystemTheme}
        />
      </div>

      {/* Dark Themes */}
      <div className="mt-6">
        <p className="text-sm text-base-content/60 mb-2">Dark</p>
        <div className="grid grid-cols-3 gap-2">
          {DARK_THEMES.map((preset) => (
            <ThemeCard
              key={preset.id}
              preset={preset}
              isActive={activeThemeId === preset.id}
              onSelect={() => handleSelectTheme(preset.id)}
            />
          ))}
        </div>
      </div>

      {/* Light Themes */}
      <div className="mt-4">
        <p className="text-sm text-base-content/60 mb-2">Light</p>
        <div className="grid grid-cols-3 gap-2">
          {LIGHT_THEMES.map((preset) => (
            <ThemeCard
              key={preset.id}
              preset={preset}
              isActive={activeThemeId === preset.id}
              onSelect={() => handleSelectTheme(preset.id)}
            />
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
          <button
            type="button"
            className={`toggle-switch ${useCustomColors ? 'active' : ''}`}
            onClick={handleToggleCustomColors}
            role="switch"
            aria-checked={useCustomColors || false}
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
              className="px-3 py-1.5 text-sm rounded-md text-error hover:bg-error/10 transition-colors mt-2"
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
