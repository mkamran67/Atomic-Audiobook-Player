import { useState } from "react";
import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { FontSizeProvider } from "./contexts/FontSizeContext";
import { useRootDirectories } from "./hooks/useRootDirectories";
import RootDirectoryModal from "./components/feature/RootDirectoryModal";

function AppInner() {
  const { directories, addDirectory, removeDirectory } = useRootDirectories();
  const [showDirModal, setShowDirModal] = useState(directories.length === 0);

  const handleAddDirectory = async () => {
    const path = await window.electronAPI.selectDirectory();
    if (path) addDirectory(path);
  };

  return (
    <>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
      {showDirModal && (
        <RootDirectoryModal
          directories={directories}
          onAdd={handleAddDirectory}
          onRemove={removeDirectory}
          onClose={() => setShowDirModal(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <FontSizeProvider>
      <I18nextProvider i18n={i18n}>
        <AppInner />
      </I18nextProvider>
    </FontSizeProvider>
  );
}

export default App;
