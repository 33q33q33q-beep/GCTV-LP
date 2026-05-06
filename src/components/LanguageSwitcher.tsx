import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const lang = i18n.language?.startsWith("en") ? "en" : "ja";

  return (
    <div
      className="fixed right-4 top-4 z-[200] flex select-none rounded-full bg-black/45 px-1 py-1 text-xs font-black text-white backdrop-blur-sm shadow-lg"
      role="group"
      aria-label={t("langSwitcher.aria")}
    >
      <button
        type="button"
        onClick={() => void i18n.changeLanguage("ja")}
        className={`cursor-pointer rounded-full px-3 py-1.5 transition-colors ${
          lang === "ja" ? "bg-white text-gray-900" : "bg-transparent text-white/80 hover:text-white"
        }`}
      >
        {t("langSwitcher.ja")}
      </button>
      <button
        type="button"
        onClick={() => void i18n.changeLanguage("en")}
        className={`cursor-pointer rounded-full px-3 py-1.5 transition-colors ${
          lang === "en" ? "bg-white text-gray-900" : "bg-transparent text-white/80 hover:text-white"
        }`}
      >
        {t("langSwitcher.en")}
      </button>
    </div>
  );
}
