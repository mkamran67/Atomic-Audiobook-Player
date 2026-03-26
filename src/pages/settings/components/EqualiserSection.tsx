import { useState } from 'react';
import { Toggle, Row, Card, SectionLabel } from './SettingsUI';

type EQBands = [number, number, number, number, number];

interface EQPreset {
  id: string;
  name: string;
  bands: EQBands;
  isCustom?: boolean;
}

const BUILTIN_PRESETS: EQPreset[] = [
  { id: 'flat',         name: 'Flat',         bands: [0,  0,  0,  0,  0]  },
  { id: 'bass-boost',   name: 'Bass Boost',   bands: [8,  5,  0, -2, -3]  },
  { id: 'treble-boost', name: 'Treble Boost', bands: [-3, -1,  1,  5,  8]  },
  { id: 'podcast',      name: 'Podcast',      bands: [-2,  3,  6,  4,  2]  },
  { id: 'voice',        name: 'Voice',        bands: [-4,  2,  7,  4,  1]  },
  { id: 'sleep',        name: 'Sleep',        bands: [-6, -3, -1, -2, -4]  },
];

const BANDS = [
  { freq: '60 Hz',   label: 'Sub Bass'   },
  { freq: '250 Hz',  label: 'Bass'       },
  { freq: '1 kHz',   label: 'Mid'        },
  { freq: '4 kHz',   label: 'Presence'   },
  { freq: '16 kHz',  label: 'Brilliance' },
];

const EQ_STORAGE_KEY  = 'readit-eq-presets';
const EQ_ACTIVE_KEY   = 'readit-eq-active';
const EQ_BANDS_KEY    = 'readit-eq-bands';

function loadCustomPresets(): EQPreset[] {
  try {
    const raw = localStorage.getItem(EQ_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistCustomPresets(presets: EQPreset[]): void {
  localStorage.setItem(EQ_STORAGE_KEY, JSON.stringify(presets));
}

function loadBands(): EQBands {
  try {
    const raw = localStorage.getItem(EQ_BANDS_KEY);
    return raw ? JSON.parse(raw) : [0, 0, 0, 0, 0];
  } catch { return [0, 0, 0, 0, 0]; }
}

// ─── Vertical slider band ─────────────────────────────────────────────────────
function BandSlider({
  value,
  onChange,
  freq,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  freq: string;
  label: string;
}) {
  const color =
    value > 0 ? 'text-amber-500' : value < 0 ? 'text-rose-400' : 'text-gray-400 dark:text-gray-500';

  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <span className={`text-xs font-mono font-semibold ${color}`}>
        {value > 0 ? `+${value}` : value}
        <span className="text-gray-400 dark:text-gray-600"> dB</span>
      </span>

      {/* Rotated range input */}
      <div className="relative flex-shrink-0" style={{ width: '32px', height: '128px' }}>
        <input
          type="range"
          min={-12}
          max={12}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute cursor-pointer accent-amber-500"
          style={{
            width: '128px',
            transformOrigin: 'center',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
            top: '50%',
            left: '50%',
          }}
        />
      </div>

      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center whitespace-nowrap leading-tight">
        {freq}
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-500 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── dB scale labels ──────────────────────────────────────────────────────────
function DBScale() {
  return (
    <div
      className="flex flex-col justify-between text-right pr-2 flex-shrink-0"
      style={{ height: '128px' }}
    >
      {['+12', '+6', '0', '-6', '-12'].map((v) => (
        <span key={v} className="text-xs text-gray-300 dark:text-gray-600 font-mono leading-none">
          {v}
        </span>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function EqualiserSection({
  loudnessEq,
  setLoudnessEq,
}: {
  loudnessEq: boolean;
  setLoudnessEq: (v: boolean) => void;
}) {
  const [customPresets, setCustomPresets] = useState<EQPreset[]>(loadCustomPresets);
  const [activePresetId, setActivePresetId] = useState<string>(
    () => localStorage.getItem(EQ_ACTIVE_KEY) ?? 'flat',
  );
  const [bands, setBands] = useState<EQBands>(loadBands);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveError, setSaveError] = useState('');

  const allPresets = [...BUILTIN_PRESETS, ...customPresets];

  const applyPreset = (preset: EQPreset) => {
    const b = [...preset.bands] as EQBands;
    setActivePresetId(preset.id);
    setBands(b);
    localStorage.setItem(EQ_ACTIVE_KEY, preset.id);
    localStorage.setItem(EQ_BANDS_KEY, JSON.stringify(b));
    window.dispatchEvent(new CustomEvent('eq-bands-changed'));
  };

  const handleBandChange = (index: number, value: number) => {
    const next = [...bands] as EQBands;
    next[index] = value;
    setBands(next);
    localStorage.setItem(EQ_BANDS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('eq-bands-changed'));
    const active = allPresets.find((p) => p.id === activePresetId);
    if (active && JSON.stringify(active.bands) !== JSON.stringify(next)) {
      setActivePresetId('custom-unsaved');
    }
  };

  const handleSave = () => {
    const trimmed = saveName.trim();
    if (!trimmed) { setSaveError('Please enter a name.'); return; }
    if (customPresets.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setSaveError('A preset with that name already exists.'); return;
    }
    const newPreset: EQPreset = {
      id: `custom-${Date.now()}`,
      name: trimmed,
      bands: [...bands] as EQBands,
      isCustom: true,
    };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    persistCustomPresets(updated);
    setActivePresetId(newPreset.id);
    localStorage.setItem(EQ_ACTIVE_KEY, newPreset.id);
    setSaveName('');
    setSaveError('');
    setShowSaveInput(false);
  };

  const handleDelete = (id: string) => {
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    persistCustomPresets(updated);
    if (activePresetId === id) applyPreset(BUILTIN_PRESETS[0]);
  };

  const resetBands = () => applyPreset(BUILTIN_PRESETS[0]);

  return (
    <>
      <SectionLabel label="Equaliser" />
      <Card>
        <Row label="Loudness Equalisation" description="Normalise volume across chapters">
          <Toggle value={loudnessEq} onChange={setLoudnessEq} />
        </Row>
      </Card>

      <SectionLabel label="Custom Equaliser" />
      <Card>
        <div className="py-4">

          {/* ── Preset pills ── */}
          <div className="mb-5">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">
              Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {allPresets.map((preset) => (
                <div key={preset.id} className="flex items-center gap-1">
                  <button
                    onClick={() => applyPreset(preset)}
                    className={`h-7 px-3 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activePresetId === preset.id
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {preset.name}
                  </button>
                  {preset.isCustom && (
                    <button
                      onClick={() => handleDelete(preset.id)}
                      title="Delete preset"
                      className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-rose-400 cursor-pointer transition-colors"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Band sliders ── */}
          <div className="flex items-center gap-2 py-3 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <DBScale />
            {BANDS.map((band, i) => (
              <BandSlider
                key={band.freq}
                value={bands[i]}
                onChange={(v) => handleBandChange(i, v)}
                freq={band.freq}
                label={band.label}
              />
            ))}
          </div>

          {/* ── Footer actions ── */}
          <div className="mt-4 flex items-start justify-between gap-4">

            {/* Save as preset */}
            <div className="flex-1">
              {!showSaveInput ? (
                <button
                  onClick={() => setShowSaveInput(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-amber-500 hover:text-amber-600 cursor-pointer transition-colors"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-save-line text-sm"></i>
                  </div>
                  Save as Preset
                </button>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={saveName}
                      onChange={(e) => { setSaveName(e.target.value); setSaveError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                      placeholder="Preset name…"
                      maxLength={30}
                      autoFocus
                      className="flex-1 h-8 px-3 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 border-0 outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <button
                      onClick={handleSave}
                      className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-xl cursor-pointer whitespace-nowrap transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setShowSaveInput(false); setSaveName(''); setSaveError(''); }}
                      className="h-8 px-3 text-xs text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {saveError && <p className="text-xs text-rose-400 mt-1">{saveError}</p>}
                </div>
              )}
            </div>

            {/* Reset */}
            <button
              onClick={resetBands}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-refresh-line text-sm"></i>
              </div>
              Reset
            </button>
          </div>

        </div>
      </Card>
    </>
  );
}
