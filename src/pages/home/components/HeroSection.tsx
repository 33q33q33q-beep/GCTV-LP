import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();
  const headlineMid = t("hero.headline.mid").trim();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <iframe
          src="https://www.youtube.com/embed/VAW_xQtJQsA?autoplay=1&mute=1&controls=0&loop=1&playlist=VAW_xQtJQsA&start=0&rel=0&showinfo=0&modestbranding=1"
          title={t("hero.iframeTitle")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          style={{ border: "none" }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-14 text-center sm:pt-16 md:pt-0">
        <div className="mb-8">
          <img
            src="https://static.readdy.ai/image/7c6e09d6014ba4e8528d2ee81745709e/757effa5c29c28ccf2ee64f4af8f45ca.png"
            alt={t("hero.logoAlt")}
            className="mx-auto h-24 w-auto md:h-32"
          />
        </div>

        <h1 className="mb-4 text-3xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
          {t("hero.headline.before")}
          <span className="text-red-400">{t("hero.headline.em1")}</span>
          {headlineMid ? <span>{headlineMid}</span> : null}
          <br />
          <span className="text-red-400">{t("hero.headline.em2")}</span>
        </h1>

        <p className="mb-6 text-lg font-bold text-red-400 md:text-xl lg:text-2xl">{t("hero.brand")}</p>

        <p className="mb-12 max-w-3xl text-base leading-relaxed text-gray-200 md:text-lg lg:text-xl">
          {t("hero.lead.line1")}
          <br />
          {t("hero.lead.line2")}
          <br />
          {t("hero.lead.line3")}
        </p>

        <div className="flex w-full max-w-2xl flex-col gap-4 px-4 sm:flex-row">
          <a
            href="https://www.youtube.com/@GachinkoCycleTV"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 transform cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-2xl"
          >
            <i className="ri-youtube-fill text-2xl" />
            {t("hero.ctaMain")}
          </a>
          <a
            href="https://www.youtube.com/@GachinkoCycleTV-TOKUHAIN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 transform cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-full bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-2xl"
          >
            <i className="ri-youtube-fill text-2xl text-red-600" />
            {t("hero.ctaTokuhain")}
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <i className="ri-arrow-down-line text-3xl text-red-400" />
        </div>
      </div>
    </section>
  );
}
