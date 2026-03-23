import { ReactNode, useState, useRef, useEffect } from 'react';

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${value ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`}
      aria-checked={value}
      role="switch"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

export function Row({ label, description, children }: { label: string; description?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{label}</p>
        {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl px-6 py-2 mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 mt-6 first:mt-0 px-1">
      {label}
    </p>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export function SmartSelect({
  value,
  onChange,
  options,
  minWidth = 160,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  minWidth?: number;
}) {
  const [open, setOpen]     = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const triggerRef          = useRef<HTMLButtonElement>(null);
  const listRef             = useRef<HTMLDivElement>(null);

  const LIST_MAX_H = 240; // px — matches max-h-60

  function handleToggle() {
    if (open) { setOpen(false); return; }
    if (triggerRef.current) {
      const rect       = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < LIST_MAX_H && spaceAbove > spaceBelow);
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  return (
    <div className="relative flex-shrink-0" style={{ minWidth }}>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className="w-full h-9 pl-3 pr-8 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-left flex items-center cursor-pointer relative transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
          <i className={`ri-arrow-${open && openUp ? 'up' : 'down'}-s-line text-sm transition-transform`}></i>
        </span>
      </button>

      {open && (
        <div
          ref={listRef}
          className={`absolute left-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-xl overflow-y-auto py-1 ${
            openUp ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          style={{
            maxHeight: LIST_MAX_H,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full px-3 py-2 text-sm text-left cursor-pointer transition-colors whitespace-nowrap ${
                opt.value === value
                  ? 'text-amber-500 font-semibold bg-amber-50 dark:bg-amber-900/20'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
