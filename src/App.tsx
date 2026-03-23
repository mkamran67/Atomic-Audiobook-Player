import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { FontSizeProvider } from "./contexts/FontSizeContext";

function App() {
  return (
    <FontSizeProvider>
      <I18nextProvider i18n={i18n}>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </I18nextProvider>
    </FontSizeProvider>
  );
}

export default App;
