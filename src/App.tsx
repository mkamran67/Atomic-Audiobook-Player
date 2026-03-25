import { useState } from "react";
import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { FontSizeProvider } from "./contexts/FontSizeContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { useRootDirectories } from "./hooks/useRootDirectories";
import { useScanLibrary } from "./hooks/useScanLibrary";
import { useAppSelector } from "./store";
import RootDirectoryModal from "./components/feature/RootDirectoryModal";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-16 h-16 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-amber-600 dark:text-amber-400">
            <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
            <ellipse cx="12" cy="12" rx="10" ry="4"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function AppInner() {
  const { directories, addDirectory, removeDirectory, loaded: dirsLoaded } = useRootDirectories();
  const [dismissed, setDismissed] = useState(false);
  const libraryLoaded = useAppSelector((s) => s.library.loaded);

  // This hook triggers library loading from disk on mount
  useScanLibrary();

  if (!libraryLoaded || !dirsLoaded) {
    return <LoadingScreen />;
  }

  const handleAddDirectory = async () => {
    const path = await window.electronAPI.selectDirectory();
    if (path) addDirectory(path);
  };

  return (
    <>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
      {!dismissed && directories.length === 0 && (
        <RootDirectoryModal
          directories={directories}
          onAdd={handleAddDirectory}
          onRemove={removeDirectory}
          onClose={() => setDismissed(true)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <SettingsProvider>
      <FontSizeProvider>
        <I18nextProvider i18n={i18n}>
          <AppInner />
        </I18nextProvider>
      </FontSizeProvider>
    </SettingsProvider>
  );
}

export default App;
