import { useState, useEffect, useCallback } from 'react';
import { getLogs, clearLogs, logsAsText, LogEntry } from '../../../utils/logger';

interface Props {
  onClose: () => void;
}

const LEVEL_STYLE: Record<LogEntry['level'], string> = {
  info:  'text-sky-500 dark:text-sky-400',
  warn:  'text-amber-500',
  error: 'text-red-500',
  debug: 'text-gray-400 dark:text-gray-500',
};

const LEVEL_BADGE: Record<LogEntry['level'], string> = {
  info:  'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
  warn:  'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  error: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  debug: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
};

export default function LogsModal({ onClose }: Props) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [filter, setFilter]   = useState<'all' | LogEntry['level']>('all');
  const [copied, setCopied]   = useState(false);

  const reload = useCallback(() => setEntries(getLogs()), []);

  useEffect(() => {
    reload();
  }, [reload]);

  const visible = filter === 'all' ? entries : entries.filter((e) => e.level === filter);

  function handleClear() {
    clearLogs();
    reload();
  }

  function handleCopy() {
    navigator.clipboard.writeText(logsAsText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function formatTs(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
      });
    } catch {
      return iso;
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col max-h-[80vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center text-amber-500">
              <i className="ri-terminal-box-line text-lg"></i>
            </div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">App Logs</h2>
            <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">({entries.length} entries)</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-400">
            <i className="ri-close-line text-base"></i>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
          {(['all', 'info', 'warn', 'error', 'debug'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`h-7 px-3 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === lvl
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {lvl === 'all' ? 'All' : lvl.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Log list */}
        <div className="flex-1 overflow-y-auto font-mono text-xs">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-file-list-3-line text-2xl"></i>
              </div>
              <p>No log entries</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
              {visible.slice().reverse().map((e, idx) => (
                <div key={idx} className="flex gap-3 px-6 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <span className="text-gray-300 dark:text-gray-600 flex-shrink-0 pt-px">{formatTs(e.ts)}</span>
                  <span className={`flex-shrink-0 pt-px font-semibold ${LEVEL_STYLE[e.level]}`}>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${LEVEL_BADGE[e.level]}`}>
                      {e.level.toUpperCase()}
                    </span>
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 break-all">{e.msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleClear}
            className="h-9 px-4 rounded-xl text-xs font-medium text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer whitespace-nowrap"
          >
            Clear Logs
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="h-9 px-4 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy All'}
            </button>
            <a
              href={`mailto:me@mkamran.us?subject=Readit%20Debug%20Logs&body=${encodeURIComponent(logsAsText())}`}
              className="h-9 px-4 rounded-xl text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-mail-send-line text-xs"></i>
              </div>
              Send via Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
