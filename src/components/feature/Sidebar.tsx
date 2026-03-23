import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onCollapsedChange: (v: boolean) => void;
  playerBarVisible?: boolean;
}

const menuItems = [
  { id: 'home',        icon: 'ri-home-5-line',       label: 'Home'        },
  { id: 'library',     icon: 'ri-book-2-line',        label: 'Library'     },
  { id: 'collections', icon: 'ri-headphone-line',     label: 'Collections' },
  { id: 'bookmarks',   icon: 'ri-bookmark-line',      label: 'Bookmarks'   },
  { id: 'settings',    icon: 'ri-settings-3-line',    label: 'Settings'    },
];

export default function Sidebar({ activeTab, onTabChange, isCollapsed, onCollapsedChange, playerBarVisible = false }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (id: string, closeMobile = false) => {
    onTabChange(id);
    if (closeMobile) setMobileOpen(false);
  };

  const itemClass = (id: string, collapsed: boolean) =>
    `w-full h-12 flex items-center rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
      collapsed ? 'justify-center px-0' : 'justify-start gap-3 px-3'
    } ${
      activeTab === id
        ? 'bg-white/30 dark:bg-white/20 text-white'
        : 'text-white/70 hover:bg-white/10 dark:hover:bg-white/10'
    }`;

  return (
    <>
      {/* ── Mobile hamburger button ─────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] w-10 h-10 flex items-center justify-center rounded-xl bg-purple-500 text-white shadow-md"
        aria-label="Open menu"
      >
        <i className="ri-menu-line text-xl"></i>
      </button>

      {/* ── Mobile full-screen overlay ─────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 z-[70] bg-gradient-to-b from-purple-400 to-purple-600 dark:from-purple-900 dark:to-purple-950 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-6 pt-8 pb-6">
          <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
              <ellipse cx="12" cy="12" rx="10" ry="4"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
            </svg>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close menu"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id, true)}
              className={`w-full h-14 flex items-center gap-4 px-4 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === item.id
                  ? 'bg-white/30 text-white'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <i className={`${item.icon} text-2xl flex-shrink-0`}></i>
              <span className="text-base font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Desktop sidebar ──────────────────────────────────────── */}
      <aside
        className={`hidden md:flex ${
          isCollapsed ? 'w-20' : 'w-52'
        } bg-gradient-to-b from-purple-400 to-purple-500 dark:from-purple-900 dark:to-purple-950 fixed left-0 top-0 flex-col items-center transition-all duration-300 z-50 pt-5 ${
          playerBarVisible
            ? 'h-[calc(100vh-10rem)] pb-5'
            : 'h-screen pb-5'
        }`}
      >
        {/* Logo */}
        <div
          className={`flex items-center mb-8 transition-all duration-300 ${
            isCollapsed
              ? 'w-12 h-12 justify-center bg-white/20 dark:bg-white/10 rounded-2xl'
              : 'gap-3 px-3 w-full'
          }`}
        >
          <div className={`flex-shrink-0 flex items-center justify-center bg-white/20 dark:bg-white/10 rounded-2xl overflow-hidden ${isCollapsed ? 'w-12 h-12' : 'w-11 h-11'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
              <ellipse cx="12" cy="12" rx="10" ry="4"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
            </svg>
          </div>
          {!isCollapsed && (
            <span className="text-white font-bold text-lg tracking-wide whitespace-nowrap">Atomic</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-2 w-full px-4">
          {menuItems.map((item) => (
            <div key={item.id} className="relative group flex items-center">
              <button
                onClick={() => handleTabChange(item.id)}
                className={itemClass(item.id, isCollapsed)}
              >
                <i className={`${item.icon} text-xl flex-shrink-0`}></i>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>

              {/* Tooltip — only visible when collapsed */}
              {isCollapsed && (
                <div
                  className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-gray-900/90 text-white text-sm font-medium whitespace-nowrap
                    opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0
                    transition-all duration-150 z-50 shadow-lg"
                >
                  {item.label}
                  {/* little arrow */}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900/90" />
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => onCollapsedChange(!isCollapsed)}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-white transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i className={`ri-arrow-${isCollapsed ? 'right' : 'left'}-s-line text-xl`}></i>
        </button>
      </aside>
    </>
  );
}
