import { BrowserRouter } from "react-router-dom";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";


const routerBasename =
  __BASE_PATH__ === "./" || __BASE_PATH__ === "." ? "" : __BASE_PATH__.replace(/\/$/, "");

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={routerBasename}>
        <LanguageSwitcher />
        <AppRoutes />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
