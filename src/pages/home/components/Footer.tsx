import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import GachinekoSticker from "../../../components/GachinekoSticker";

export default function Footer() {
  const { t } = useTranslation();

  const socialLinks = useMemo(
    () => [
      {
        name: t("footer.youtubeMain"),
        icon: "ri-youtube-fill",
        url: "https://www.youtube.com/@GachinkoCycleTV",
        color: "hover:text-red-600",
      },
      {
        name: t("footer.youtubeTokuhain"),
        icon: "ri-youtube-fill",
        url: "https://www.youtube.com/@GCTVtokuhain",
        color: "hover:text-red-600",
      },
      {
        name: t("footer.x"),
        icon: "ri-twitter-x-fill",
        url: "https://twitter.com/GachinkoCycleTV",
        color: "hover:text-gray-900",
      },
      {
        name: t("footer.instagram"),
        icon: "ri-instagram-fill",
        url: "https://www.instagram.com/gachinkocycletv/",
        color: "hover:text-pink-500",
      },
      {
        name: t("footer.facebook"),
        icon: "ri-facebook-fill",
        url: "https://www.facebook.com/GachinkoCycleTV",
        color: "hover:text-blue-600",
      },
    ],
    [t],
  );

  const quickLinks = useMemo(
    () =>
      [
        { name: "Latest News", url: "#latest-news" },
        { name: "Race & Interview", url: "#race-interview" },
        { name: "NEWS & INFORMATION", url: "#news-information" },
        { name: "VARIETY BEGINNER", url: "#variety-beginner" },
        { name: "配信予定レース", url: "#schedule-upcoming" },
        { name: "配信終了レース", url: "#schedule-ended" },
        { name: "SNS&Blog", url: "#sns-blog" },
        { name: "Community", url: "#community" },
        { name: "GCTV特派員MAP", url: "#tokuhain-map" },
      ] as const,
    [t],
  );

  return (
    <footer className="bg-rose-50 text-gray-700 py-16 px-4 border-t border-red-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex flex-wrap items-end gap-4 mb-4">
              <img
                src="https://static.readdy.ai/image/7c6e09d6014ba4e8528d2ee81745709e/757effa5c29c28ccf2ee64f4af8f45ca.png"
                alt={t("hero.logoAlt")}
                className="h-16 w-auto"
              />
              <div className="hidden md:block md:w-32 shrink-0 -mb-1">
                <GachinekoSticker variant="ganbaru" className="w-full h-auto" />
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t("footer.intro.line1")}
              <br />
              {t("footer.intro.line2")}
              <br />
              {t("footer.intro.line3")}
            </p>
          </div>

          <div>
            <h4 className="text-xl font-black text-red-600 mb-4">{t("footer.quickTitle")}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-gray-500 hover:text-red-600 transition-colors text-sm cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line mr-1"></i>
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://jbcf.or.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-red-600 transition-colors text-sm cursor-pointer"
                >
                  <i className="ri-external-link-line mr-1"></i>
                  {t("footer.jbcf")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-black text-red-600 mb-4">{t("footer.followTitle")}</h4>
            <div className="space-y-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 text-gray-500 ${social.color} transition-colors text-sm cursor-pointer group`}
                >
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:border-red-300 transition-colors shadow-sm">
                    <i className={`${social.icon} text-xl`}></i>
                  </div>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-red-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm text-center md:text-left">
              <p className="mb-1">
                {t("footer.companyLabel")}
                <strong className="text-gray-800">{t("footer.companyName")}</strong>
              </p>
              <p>{t("footer.addressLine")}</p>
              <p>info@cycle-net.jp</p>
            </div>
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>&copy; 2024 Gachinko Cycle TV. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
