import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebarCollapsed } from '../../hooks/useSidebarCollapsed';
import Sidebar from '../../components/feature/Sidebar';
import ThemeToggle from '../../components/base/ThemeToggle';
import Toast from '../../components/base/Toast';
import { Toggle, Row, Card, SectionLabel, SmartSelect } from './components/SettingsUI';
import EqualiserSection from './components/EqualiserSection';
import LogsModal from './components/LogsModal';
import ConfirmDialog from './components/ConfirmDialog';
import { logsAsText } from '../../utils/logger';
import { useFontSize } from '../../contexts/FontSizeContext';

type Section = 'appearance' | 'audio' | 'accessibility' | 'notifications' | 'privacy' | 'help' | 'about';

const sections: { id: Section; icon: string; label: string }[] = [
  { id: 'appearance',    icon: 'ri-palette-line',         label: 'Appearance'    },
  { id: 'audio',         icon: 'ri-headphone-line',       label: 'Audio'         },
  { id: 'accessibility', icon: 'ri-eye-line',             label: 'Accessibility' },
  { id: 'notifications', icon: 'ri-notification-3-line',  label: 'Notifications' },
  { id: 'privacy',       icon: 'ri-shield-check-line',    label: 'Data &amp; Privacy' },
  { id: 'help',          icon: 'ri-lifebuoy-line',        label: 'Help'          },
  { id: 'about',         icon: 'ri-information-line',     label: 'About'         },
];

const APP_LANGUAGES = [
  { code: 'en',    label: 'English'       },
  { code: 'es',    label: 'Español'       },
  { code: 'fr',    label: 'Français'      },
  { code: 'de',    label: 'Deutsch'       },
  { code: 'pt',    label: 'Português'     },
  { code: 'it',    label: 'Italiano'      },
  { code: 'nl',    label: 'Nederlands'    },
  { code: 'ru',    label: 'Русский'       },
  { code: 'ar',    label: 'العربية'       },
  { code: 'hi',    label: 'हिंदी'         },
  { code: 'zh-cn', label: '中文（简体）'   },
  { code: 'zh-tw', label: '中文（繁體）'   },
  { code: 'ja',    label: '日本語'        },
  { code: 'ko',    label: '한국어'        },
  { code: 'tr',    label: 'Türkçe'       },
  { code: 'pl',    label: 'Polski'       },
  { code: 'sv',    label: 'Svenska'      },
  { code: 'no',    label: 'Norsk'        },
  { code: 'da',    label: 'Dansk'        },
  { code: 'fi',    label: 'Suomi'        },
];

const LANGUAGE_OPTIONS = APP_LANGUAGES.map((l) => ({ value: l.code, label: l.label }));

function langLabel(code: string) {
  return APP_LANGUAGES.find((l) => l.code === code)?.label ?? code;
}

// Small "Reset section" button shown at the top-right of resettable sections
function SectionResetBtn({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-end mb-1">
      <button
        onClick={onClick}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-500 transition-colors cursor-pointer whitespace-nowrap"
      >
        <div className="w-3 h-3 flex items-center justify-center">
          <i className="ri-refresh-line text-xs"></i>
        </div>
        Reset section
      </button>
    </div>
  );
}

type ConfirmType = 'history' | 'bookmarks' | 'reset' | null;

export default function SettingsPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsed();
  const [activeSection, setActiveSection] = useState<Section>('appearance');
  const [confirmOpen, setConfirmOpen] = useState<ConfirmType>(null);

  // ── Toast ────────────────────────────────────────────────────────────────────
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = useCallback((msg: string) => {
    setToastMsg(null);
    // Tiny delay ensures the component remounts cleanly if triggered twice quickly
    setTimeout(() => setToastMsg(msg), 30);
  }, []);

  // ── Appearance ──────────────────────────────────────────────────────────────
  const { fontSize, setFontSize } = useFontSize();
  const [compactCards, setCompactCards] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [showBadges, setShowBadges]     = useState(true);

  // ── Audio ───────────────────────────────────────────────────────────────────
  const [defaultSpeed, setDefaultSpeed] = useState(1.0);
  const [sleepTimer, setSleepTimer]     = useState(30);
  const [autoNextChapter, setAutoNext]  = useState(true);
  const [loudnessEq, setLoudnessEq]     = useState(true);

  // ── Accessibility ───────────────────────────────────────────────────────────
  const [appLanguage, setAppLanguage]             = useState('en');
  const [autoTranslate, setAutoTranslate]         = useState(false);
  const [translateTargetLang, setTranslateTarget] = useState('en');
  const [highContrast, setHighContrast]           = useState(false);
  const [reduceMotion, setReduceMotion]           = useState(false);
  const [largerTargets, setLargerTargets]         = useState(false);
  const [dyslexicFont, setDyslexicFont]           = useState(false);
  const [screenReaderHints, setScreenReaderHints] = useState(false);

  // ── Notifications ───────────────────────────────────────────────────────────
  const [readingGoals, setReadingGoals]           = useState(true);
  const [weeklyDigest, setWeeklyDigest]           = useState(false);
  const [bookmarkReminders, setBookmarkReminders] = useState(true);

  // ── Diagnostics ─────────────────────────────────────────────────────────────
  const [showLogs, setShowLogs] = useState(false);

  // ── Per-section resets ───────────────────────────────────────────────────────
  function resetAppearance() {
    setFontSize('md');
    setCompactCards(false);
    setShowProgress(true);
    setShowBadges(true);
    triggerToast('Appearance reset to defaults');
  }

  function resetAudio() {
    setDefaultSpeed(1.0);
    setSleepTimer(30);
    setAutoNext(true);
    setLoudnessEq(true);
    triggerToast('Audio reset to defaults');
  }

  function resetAccessibility() {
    setAppLanguage('en');
    setAutoTranslate(false);
    setTranslateTarget('en');
    setHighContrast(false);
    setReduceMotion(false);
    setLargerTargets(false);
    setDyslexicFont(false);
    setScreenReaderHints(false);
    triggerToast('Accessibility reset to defaults');
  }

  function resetNotifications() {
    setReadingGoals(true);
    setWeeklyDigest(false);
    setBookmarkReminders(true);
    triggerToast('Notifications reset to defaults');
  }

  const handleTabChange = (tab: string) => {
    if (tab === 'home')        { navigate('/');            return; }
    if (tab === 'library')     { navigate('/library');     return; }
    if (tab === 'bookmarks')   { navigate('/bookmarks');   return; }
    if (tab === 'collections') { navigate('/collections'); return; }
    if (tab !== 'settings')    navigate('/');
  };

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  const sleepOptions = [10, 15, 20, 30, 45, 60, 90];

  const CONFIRM_CONFIG: Record<
    Exclude<ConfirmType, null>,
    { title: string; description: string; confirmLabel: string; onConfirm: () => void }
  > = {
    history: {
      title: 'Clear Listening History?',
      description: 'All local playback data will be permanently removed. This cannot be undone.',
      confirmLabel: 'Clear History',
      onConfirm: () => {
        setConfirmOpen(null);
        triggerToast('Listening history cleared');
      },
    },
    bookmarks: {
      title: 'Clear Bookmarks?',
      description: 'All saved bookmarks and highlights will be permanently removed. This cannot be undone.',
      confirmLabel: 'Clear Bookmarks',
      onConfirm: () => {
        setConfirmOpen(null);
        triggerToast('Bookmarks cleared');
      },
    },
    reset: {
      title: 'Reset All Settings?',
      description: 'Every setting will be restored to its default value. Your library and bookmarks are unaffected.',
      confirmLabel: 'Reset Settings',
      onConfirm: () => {
        setFontSize('md');
        setCompactCards(false);
        setShowProgress(true);
        setShowBadges(true);
        setDefaultSpeed(1.0);
        setSleepTimer(30);
        setAutoNext(true);
        setLoudnessEq(true);
        setAppLanguage('en');
        setAutoTranslate(false);
        setTranslateTarget('en');
        setHighContrast(false);
        setReduceMotion(false);
        setLargerTargets(false);
        setDyslexicFont(false);
        setScreenReaderHints(false);
        setReadingGoals(true);
        setWeeklyDigest(false);
        setBookmarkReminders(true);
        setConfirmOpen(null);
        triggerToast('All settings reset to defaults');
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Sidebar
        activeTab="settings"
        onTabChange={handleTabChange}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <main
        className={`flex-1 transition-all duration-300 p-4 md:p-8 pt-20 md:pt-8 min-w-0 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-52'
        }`}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your app preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Section nav ─────────────────────────────────────────────────── */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <nav className="bg-white dark:bg-gray-900 rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible scrollbar-hide">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                    activeSection === s.id
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`${s.icon} text-base`}></i>
                  </div>
                  <span dangerouslySetInnerHTML={{ __html: s.label }} />
                </button>
              ))}
            </nav>
          </div>

          {/* ── Content panel ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* ── Appearance ── */}
            {activeSection === 'appearance' && (
              <div>
                <SectionResetBtn onClick={resetAppearance} />

                <SectionLabel label="Theme" />
                <Card>
                  <Row label="Color Scheme" description="Choose light, dark, or follow your system setting">
                    <ThemeToggle />
                  </Row>
                </Card>

                <SectionLabel label="Font Size" />
                <Card>
                  <div className="py-4">
                    <div className="flex items-center gap-2">
                      {(['sm', 'md', 'lg'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                            fontSize === size
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>

                <SectionLabel label="Display" />
                <Card>
                  <Row
                    label="Compact Cards"
                    description={compactCards ? 'Cards shown in compact size' : 'Cards shown at standard size'}
                  >
                    <Toggle value={compactCards} onChange={setCompactCards} />
                  </Row>
                  <Row
                    label="Show Progress Bars"
                    description={showProgress ? 'Progress bars visible on book cards' : 'Progress bars hidden'}
                  >
                    <Toggle value={showProgress} onChange={setShowProgress} />
                  </Row>
                  <Row
                    label="Show Status Badges"
                    description={showBadges ? 'Status badges visible on covers' : 'Status badges hidden'}
                  >
                    <Toggle value={showBadges} onChange={setShowBadges} />
                  </Row>
                </Card>
              </div>
            )}

            {/* ── Audio ── */}
            {activeSection === 'audio' && (
              <div>
                <SectionResetBtn onClick={resetAudio} />

                <SectionLabel label="Playback" />
                <Card>
                  <Row
                    label="Default Playback Speed"
                    description={`Currently set to ${defaultSpeed}× — applied when opening a new book`}
                  >
                    <div className="flex items-center gap-1 flex-wrap justify-end">
                      {speedOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setDefaultSpeed(s)}
                          className={`h-7 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                            defaultSpeed === s
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {s}&times;
                        </button>
                      ))}
                    </div>
                  </Row>
                  <Row
                    label="Auto-advance Chapters"
                    description={autoNextChapter ? 'Next chapter plays automatically' : 'Pauses at end of each chapter'}
                  >
                    <Toggle value={autoNextChapter} onChange={setAutoNext} />
                  </Row>
                </Card>

                <SectionLabel label="Sleep Timer Default" />
                <Card>
                  <div className="py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Stop playback after{' '}
                      <span className="font-semibold text-amber-500">{sleepTimer} min</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sleepOptions.map((m) => (
                        <button
                          key={m}
                          onClick={() => setSleepTimer(m)}
                          className={`h-8 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                            sleepTimer === m
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {m} min
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>

                <EqualiserSection
                  loudnessEq={loudnessEq}
                  setLoudnessEq={setLoudnessEq}
                />
              </div>
            )}

            {/* ── Accessibility ── */}
            {activeSection === 'accessibility' && (
              <div>
                <SectionResetBtn onClick={resetAccessibility} />

                <SectionLabel label="Language" />
                <Card>
                  <Row
                    label="App Language"
                    description={`Interface set to: ${langLabel(appLanguage)}`}
                  >
                    <SmartSelect
                      value={appLanguage}
                      onChange={setAppLanguage}
                      options={LANGUAGE_OPTIONS}
                      minWidth={160}
                    />
                  </Row>
                </Card>

                <SectionLabel label="Translation" />
                <Card>
                  <Row
                    label="Auto-Translate Content"
                    description={autoTranslate ? 'Translating book synopses and UI text on the fly' : 'Showing content in its original language'}
                  >
                    <Toggle value={autoTranslate} onChange={setAutoTranslate} />
                  </Row>
                  {autoTranslate && (
                    <Row
                      label="Translate Into"
                      description={`Translating into: ${langLabel(translateTargetLang)}`}
                    >
                      <SmartSelect
                        value={translateTargetLang}
                        onChange={setTranslateTarget}
                        options={LANGUAGE_OPTIONS}
                        minWidth={160}
                      />
                    </Row>
                  )}
                </Card>

                <SectionLabel label="Visual" />
                <Card>
                  <Row
                    label="High Contrast Mode"
                    description={highContrast ? 'High contrast active' : 'Standard contrast'}
                  >
                    <Toggle value={highContrast} onChange={setHighContrast} />
                  </Row>
                  <Row
                    label="Reduce Motion"
                    description={reduceMotion ? 'Animations minimised' : 'Full animations enabled'}
                  >
                    <Toggle value={reduceMotion} onChange={setReduceMotion} />
                  </Row>
                  <Row
                    label="Dyslexia-Friendly Font"
                    description={dyslexicFont ? 'OpenDyslexic typeface active' : 'Standard typeface'}
                  >
                    <Toggle value={dyslexicFont} onChange={setDyslexicFont} />
                  </Row>
                </Card>

                <SectionLabel label="Interaction" />
                <Card>
                  <Row
                    label="Larger Touch Targets"
                    description={largerTargets ? 'Bigger tap areas active' : 'Standard touch targets'}
                  >
                    <Toggle value={largerTargets} onChange={setLargerTargets} />
                  </Row>
                  <Row
                    label="Screen Reader Hints"
                    description={screenReaderHints ? 'Extra ARIA labels active throughout the app' : 'Standard accessibility markup'}
                  >
                    <Toggle value={screenReaderHints} onChange={setScreenReaderHints} />
                  </Row>
                </Card>
              </div>
            )}

            {/* ── Notifications ── */}
            {activeSection === 'notifications' && (
              <div>
                <SectionResetBtn onClick={resetNotifications} />

                <SectionLabel label="In-App Reminders" />
                <Card>
                  <Row
                    label="Listening Goals"
                    description={readingGoals ? 'Goal reminders and streaks are on' : 'Goal reminders are off'}
                  >
                    <Toggle value={readingGoals} onChange={setReadingGoals} />
                  </Row>
                  <Row
                    label="Weekly Digest"
                    description={weeklyDigest ? 'A weekly summary will appear each Monday' : 'Weekly summary is off'}
                  >
                    <Toggle value={weeklyDigest} onChange={setWeeklyDigest} />
                  </Row>
                  <Row
                    label="Bookmark Reminders"
                    description={bookmarkReminders ? 'Nudges about saved highlights are on' : 'Bookmark nudges are off'}
                  >
                    <Toggle value={bookmarkReminders} onChange={setBookmarkReminders} />
                  </Row>
                </Card>
              </div>
            )}

            {/* ── Data & Privacy ── */}
            {activeSection === 'privacy' && (
              <div>
                <Card>
                  <p className="text-xs text-gray-400 dark:text-gray-500 py-4">
                    No data is collected automatically. Logs are stored only on this device and shared only when you choose to.
                  </p>
                </Card>

                <SectionLabel label="Local Data" />
                <Card>
                  <Row label="Clear Listening History" description="Remove all local playback data">
                    <button
                      onClick={() => setConfirmOpen('history')}
                      className="text-xs font-medium text-red-400 hover:text-red-500 cursor-pointer whitespace-nowrap"
                    >
                      Clear
                    </button>
                  </Row>
                  <Row label="Clear Bookmarks" description="Remove all saved bookmarks and highlights">
                    <button
                      onClick={() => setConfirmOpen('bookmarks')}
                      className="text-xs font-medium text-red-400 hover:text-red-500 cursor-pointer whitespace-nowrap"
                    >
                      Clear
                    </button>
                  </Row>
                  <Row label="Reset All Settings" description="Restore everything to default values">
                    <button
                      onClick={() => setConfirmOpen('reset')}
                      className="text-xs font-medium text-red-400 hover:text-red-500 cursor-pointer whitespace-nowrap"
                    >
                      Reset
                    </button>
                  </Row>
                </Card>

                {confirmOpen && (
                  <ConfirmDialog
                    {...CONFIRM_CONFIG[confirmOpen]}
                    onCancel={() => setConfirmOpen(null)}
                  />
                )}
              </div>
            )}

            {/* ── Help ── */}
            {activeSection === 'help' && (
              <div>
                <SectionLabel label="Support" />
                <Card>
                  <Row label="Contact Support" description="Need help? You can email me ->">
                    <a
                      href="mailto:me@mkamran.us?subject=Atomic%20%E2%80%93%20Support%20Request"
                      className="text-xs font-medium text-amber-500 hover:text-amber-600 cursor-pointer whitespace-nowrap"
                    >
                      me@mkamran.us
                    </a>
                  </Row>
                </Card>

                <SectionLabel label="Diagnostics" />
                <Card>
                  <p className="text-xs text-gray-400 dark:text-gray-500 pt-4 pb-2">
                    No data is collected automatically. Logs are stored only on this device and shared only when you choose to.
                  </p>
                  <Row label="App Logs" description="View local debug logs stored on this device">
                    <button
                      onClick={() => setShowLogs(true)}
                      className="h-8 px-3 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Show Logs
                    </button>
                  </Row>
                  <Row label="Send Logs via Email" description="Email logs to the developer for debugging">
                    <a
                      href={`mailto:me@mkamran.us?subject=Atomic%20Debug%20Logs&body=${encodeURIComponent(logsAsText())}`}
                      className="h-8 px-3 rounded-xl text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                    >
                      <div className="w-3.5 h-3.5 flex items-center justify-center">
                        <i className="ri-mail-send-line text-xs"></i>
                      </div>
                      Send
                    </a>
                  </Row>
                </Card>

                {showLogs && <LogsModal onClose={() => setShowLogs(false)} />}
              </div>
            )}

            {/* ── About ── */}
            {activeSection === 'about' && (
              <div>
                <Card className="py-4">
                  <div className="flex items-center gap-4 py-2">
                    <div className="w-14 h-14 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-amber-600 dark:text-amber-400">
                        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
                        <ellipse cx="12" cy="12" rx="10" ry="4"/>
                        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
                        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-800 dark:text-white">Atomic Audiobook Player</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Version 1.0 (build 100)</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Made with ❤️ for all those who listen</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toastMsg && (
        <Toast key={toastMsg + Date.now()} message={toastMsg} onDismiss={() => setToastMsg(null)} />
      )}
    </div>
  );
}
