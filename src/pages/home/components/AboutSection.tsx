import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import GachinekoSticker from "../../../components/GachinekoSticker";

export default function AboutSection() {
  const { t } = useTranslation();

  const experiences = useMemo(
    () => [
      {
        emoji: "🔥",
        sticker: "ganbaru" as const,
        title: t("about.exp.watch.title"),
        description: t("about.exp.watch.desc"),
        gradient: "from-red-600 to-red-700",
        href: "#race-interview",
      },
      {
        emoji: "🧠",
        sticker: "nyaruhodo" as const,
        title: t("about.exp.know.title"),
        description: t("about.exp.know.desc"),
        gradient: "from-red-400 to-rose-500",
        href: "#news-information",
      },
      {
        emoji: "🚲",
        sticker: "tanoshimi" as const,
        title: t("about.exp.begin.title"),
        description: t("about.exp.begin.desc"),
        gradient: "from-rose-500 to-red-500",
        href: "#variety-beginner",
      },
    ],
    [t],
  );

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="hidden md:block absolute md:right-4 md:top-[-1.5rem] md:w-44 lg:right-12 lg:w-48 opacity-95 pointer-events-none">
            <GachinekoSticker variant="nyaruhodo" className="w-full h-auto" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {t("about.heading.before")}
            <span className="text-red-600">{t("about.heading.after")}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <a
              key={index}
              href={exp.href}
              className="relative bg-gray-50 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-200 hover:border-red-400 cursor-pointer group block no-underline"
            >
              <div className="hidden md:block absolute -top-4 -right-3 w-16 pointer-events-none opacity-95">
                <GachinekoSticker variant={exp.sticker} className="w-full h-auto" />
              </div>
              <div
                className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${exp.gradient} flex items-center justify-center text-5xl group-hover:rotate-12 transition-transform duration-300`}
              >
                {exp.emoji}
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                {exp.title}
              </h3>
              <p className="text-gray-600 text-base whitespace-nowrap md:whitespace-normal">
                {exp.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
