import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_TWITTER_TIMELINE_HREF,
  FacebookTimelineEmbed,
  InstagramFeedIframe,
  TikTokCreatorEmbed,
  TwitterTimelineEmbed,
} from "../../../components/social/SocialEmbeds";

const INSTAGRAM_PROFILE = "https://www.instagram.com/gachinkocycletv/";
const NOTE_MAGAZINE = "https://note.com/gctv";

function twitterProfileOpenUrl(timelineHref: string): string {
  try {
    const u = new URL(timelineHref);
    return `${u.origin}${u.pathname}`.replace(/\/+$/, "") || "https://twitter.com/GachinkoCycleTV";
  } catch {
    return "https://twitter.com/GachinkoCycleTV";
  }
}

/** ピックアップ画像（note の飾り用・キャプションは i18n） */
const notePickupImages = [
  "https://readdy.ai/api/search-image?query=beautiful%20scenic%20cycling%20route%20along%20lake%20shore%20with%20mountains%20in%20background%2C%20instagram%20worthy%20landscape%20photography%2C%20vibrant%20colors%20and%20clear%20blue%20sky&width=400&height=400&seq=insta-1&orientation=squarish",
  "https://readdy.ai/api/search-image?query=delicious%20local%20Japanese%20cuisine%20and%20cycling%20gear%20on%20wooden%20table%2C%20food%20photography%20for%20cyclists%2C%20appetizing%20meal%20presentation&width=400&height=400&seq=insta-2&orientation=squarish",
  "https://readdy.ai/api/search-image?query=beautiful%20high%20end%20road%20bicycle%20leaning%20against%20scenic%20background%2C%20bike%20photography%20showcase%2C%20professional%20cycling%20equipment%20display&width=400&height=400&seq=insta-3&orientation=squarish",
  "https://readdy.ai/api/search-image?query=female%20cyclist%20taking%20selfie%20with%20beautiful%20mountain%20landscape%20background%2C%20happy%20cycling%20adventure%20moment%2C%20social%20media%20style%20photo&width=400&height=400&seq=insta-4&orientation=squarish",
];

type TabId = "x" | "instagram" | "facebook" | "tiktok" | "note";

export default function SocialBlogSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("x");

  const igIframeSrc = useMemo(() => {
    const raw = import.meta.env.VITE_INSTAGRAM_FEED_IFRAME_URL ?? "";
    if (!raw.trim()) return "";
    return raw.startsWith("//") ? `https:${raw}` : raw;
  }, []);

  const xTimelineHref =
    import.meta.env.VITE_TWITTER_TIMELINE_HREF?.trim() || DEFAULT_TWITTER_TIMELINE_HREF;
  const xOpenUrl = twitterProfileOpenUrl(xTimelineHref);

  const tiktokUser = (import.meta.env.VITE_TIKTOK_USERNAME ?? "gachinkocycletv_gctv")
    .toString()
    .replace(/^@/, "");

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "x", label: "X", icon: "ri-twitter-x-fill" },
    { id: "instagram", label: "Instagram", icon: "ri-instagram-fill" },
    { id: "facebook", label: "Facebook", icon: "ri-facebook-fill" },
    { id: "tiktok", label: "TikTok", icon: "ri-video-chat-line" },
    { id: "note", label: "note", icon: "ri-quill-pen-fill" },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="text-red-600">SNS & Blog</span>
          </h2>
          <p className="text-gray-500 text-lg">{t("social.sectionSub")}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-bold text-base transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id ? "bg-red-600 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <i className={`${tab.icon} text-xl`} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[520px]">
          {activeTab === "x" && (
            <div className="animate-fadeIn bg-slate-900 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <i className="ri-twitter-x-fill text-white text-2xl" />
                <p className="text-gray-400 text-sm">{t("social.x.widgetNote")}</p>
              </div>
              <TwitterTimelineEmbed timelineHref={xTimelineHref} />
              <a
                href={xOpenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl mt-6"
              >
                {t("social.openXProfile")} <i className="ri-arrow-right-line ml-2" />
              </a>
            </div>
          )}

          {activeTab === "instagram" && (
            <div className="animate-fadeIn bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-3xl p-8">
              <div className="flex items-start gap-3 mb-6">
                <i className="ri-instagram-fill text-pink-500 text-2xl mt-1 shrink-0" />
                <div className="text-sm text-gray-600 space-y-2">
                  <p>{t("social.ig.intro1")}</p>
                  {!igIframeSrc && (
                    <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      {t("social.ig.envHint")}
                    </p>
                  )}
                </div>
              </div>
              {igIframeSrc ? (
                <InstagramFeedIframe iframeSrc={igIframeSrc} />
              ) : (
                <div className="text-center py-12 bg-white/60 rounded-2xl border border-pink-100">
                  <p className="text-gray-600 mb-6">{t("social.ig.placeholder")}</p>
                  <a
                    href={INSTAGRAM_PROFILE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 px-8 rounded-xl"
                  >
                    <i className="ri-instagram-fill text-xl mr-2 inline" />
                    {t("social.ig.open")}
                  </a>
                </div>
              )}
              <div className="mt-8 text-center">
                <a
                  href={INSTAGRAM_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-pink-600 hover:underline"
                >
                  {t("social.ig.openProfileTab")}
                </a>
              </div>
            </div>
          )}

          {activeTab === "facebook" && (
            <div className="animate-fadeIn bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
              <div className="flex items-start gap-3 mb-6">
                <i className="ri-facebook-fill text-blue-600 text-2xl shrink-0" />
                <p className="text-gray-600 text-sm">{t("social.fb.intro")}</p>
              </div>
              <FacebookTimelineEmbed minHeight={640} />
              <div className="mt-8 text-center">
                <a
                  href="https://www.facebook.com/GACHINKOCYCLETV"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl"
                >
                  <i className="ri-facebook-fill text-xl" />
                  {t("social.fb.open")}
                </a>
              </div>
            </div>
          )}

          {activeTab === "tiktok" && (
            <div className="animate-fadeIn bg-neutral-950 rounded-3xl p-8 border border-neutral-800">
              <div className="flex items-start gap-3 mb-6">
                <i className="ri-video-chat-line text-white text-2xl shrink-0" />
                <div className="text-sm text-gray-400 space-y-1">
                  <p>{t("social.tt.intro1")}</p>
                  <p>
                    {t("social.tt.intro2.prefix")}{" "}
                    <code className="text-gray-300">{t("social.tt.intro2.var")}</code>
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <TikTokCreatorEmbed username={tiktokUser} />
              </div>
              <div className="mt-8 text-center">
                <a
                  href={`https://www.tiktok.com/@${tiktokUser}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-950 font-black py-3 px-8 rounded-xl"
                >
                  <i className="ri-video-chat-line" />
                  {t("social.tt.open")}
                </a>
              </div>
            </div>
          )}

          {activeTab === "note" && (
            <div className="animate-fadeIn rounded-3xl p-8 border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white">
                      <i className="ri-quill-pen-fill text-xl" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-emerald-700 tracking-wide uppercase">{t("social.note.sectionLabel")}</p>
                      <h3 className="text-gray-900 font-black text-lg">{t("social.note.sectionTitle")}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm md:text-base max-w-xl leading-relaxed">
                    {t("social.note.lead.before")}
                    <strong className="text-emerald-800">{t("social.note.lead.em")}</strong>
                    {t("social.note.lead.after")}
                  </p>
                </div>
                <a
                  href={NOTE_MAGAZINE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-black py-4 px-6 rounded-xl whitespace-nowrap"
                >
                  <span className="text-green-400 font-black">{t("social.note.ctaHighlight")}</span>
                  {t("social.note.ctaAfter")}
                  <i className="ri-external-link-line" />
                </a>
              </div>

              <p className="text-gray-500 text-xs mb-4">{t("social.note.pickups")}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {notePickupImages.map((image, index) => {
                  const caption = t(`social.pickup.${index + 1}.caption`);
                  return (
                    <a key={image} href={NOTE_MAGAZINE} target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-xl aspect-square ring-2 ring-transparent group-hover:ring-emerald-400 transition-all">
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2 left-2 right-2 bg-black/55 backdrop-blur-sm rounded-lg px-2 py-1.5">
                          <p className="text-white text-xs font-bold text-center truncate">{caption}</p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
