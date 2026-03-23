import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

function applyTheme(mode: ThemeMode) {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (mode === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

const options: { value: ThemeMode; icon: string; label: string }[] = [
  { value: 'light',  icon: 'ri-sun-line',      label: 'Light'  },
  { value: 'system', icon: 'ri-computer-line',  label: 'System' },
  { value: 'dark',   icon: 'ri-moon-line',      label: 'Dark'   },
];

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const saved = (localStorage.getItem('themeMode') as ThemeMode) || 'system';
    setMode(saved);
    applyTheme(saved);
  }, []);

  const handleSelect = (value: ThemeMode) => {
    setMode(value);
    localStorage.setItem('themeMode', value);
    applyTheme(value);
  };

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleSelect(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
            mode === opt.value
              ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          aria-pressed={mode === opt.value}
        >
          <div className="w-3.5 h-3.5 flex items-center justify-center">
            <i className={`${opt.icon} text-sm`}></i>
          </div>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
