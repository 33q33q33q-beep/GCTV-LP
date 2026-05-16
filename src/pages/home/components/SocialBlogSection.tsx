import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_TWITTER_TIMELINE_HREF,
  FacebookTimelineEmbed,
  InstagramFeedIframe,
  TikTokCreatorEmbed,
  TwitterTimelineEmbed,
} from "../../../components/social/SocialEmbeds";
import { packageAsset } from "../../../lib/packageAsset";
import { IS_STANDALONE } from "../../../lib/standalone";

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

const EMBED_COL_CLASS =
  "flex min-h-[28vh] max-h-[38vh] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

function StandaloneSocialCard({
  label,
  icon,
  href,
  headerClass,
  bodyClass,
  buttonClass,
  buttonLabel,
}: {
  label: string;
  icon: string;
  href: string;
  headerClass: string;
  bodyClass: string;
  buttonClass: string;
  buttonLabel: string;
}) {
  return (
    <div className={EMBED_COL_CLASS}>
      <div className={`flex shrink-0 items-center gap-2 border-b px-3 py-2 ${headerClass}`}>
        <i className={`${icon} text-lg`} />
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className={`flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center ${bodyClass}`}>
        <i className={`${icon} text-4xl opacity-80`} />
        <p className="text-xs leading-relaxed text-gray-500">
          静的パッケージ版のため、タイムライン埋め込みは含みません。公式ページへお進みください。
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-lg px-4 py-2 text-xs font-bold ${buttonClass}`}
        >
          {buttonLabel}
        </a>
      </div>
    </div>
  );
}

export default function SocialBlogSection() {
  const { t } = useTranslation();

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

  return (
    <section id="sns-blog" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="text-red-600">SNS & Blog</span>
          </h2>
          <p className="text-gray-500 text-lg">{t("social.sectionSub")}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4"></div>
        </div>

        <p className="mb-4 text-center text-sm text-gray-500">
          {IS_STANDALONE
            ? "X / Instagram / Facebook / TikTok の公式リンク（静的パッケージ版）"
            : "X / Instagram / Facebook / TikTok を横並びで常時表示しています（各枠内でスクロールできます）。"}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IS_STANDALONE ? (
            <>
              <StandaloneSocialCard
                label="X"
                icon="ri-twitter-x-fill"
                href={xOpenUrl}
                headerClass="border-slate-800 bg-slate-900 text-white"
                bodyClass="bg-slate-50"
                buttonClass="bg-slate-900 text-white hover:bg-slate-800"
                buttonLabel={t("social.openXProfile")}
              />
              <StandaloneSocialCard
                label="Instagram"
                icon="ri-instagram-fill"
                href={INSTAGRAM_PROFILE}
                headerClass="border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50 text-gray-800"
                bodyClass="bg-white"
                buttonClass="bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                buttonLabel={t("social.ig.open")}
              />
              <StandaloneSocialCard
                label="Facebook"
                icon="ri-facebook-fill"
                href="https://www.facebook.com/GACHINKOCYCLETV"
                headerClass="border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800"
                bodyClass="bg-white"
                buttonClass="bg-blue-600 text-white hover:bg-blue-700"
                buttonLabel={t("social.fb.open")}
              />
              <StandaloneSocialCard
                label="TikTok"
                icon="ri-video-chat-line"
                href={`https://www.tiktok.com/@${tiktokUser}`}
                headerClass="border-neutral-800 bg-neutral-950 text-white"
                bodyClass="bg-neutral-50"
                buttonClass="bg-neutral-950 text-white hover:bg-neutral-800"
                buttonLabel={t("social.tt.open")}
              />
            </>
          ) : (
            <>
          <div className={EMBED_COL_CLASS}>
            <div className="flex shrink-0 items-center gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2">
              <i className="ri-twitter-x-fill text-lg text-white" />
              <span className="text-sm font-bold text-white">X</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-900 p-3">
              <TwitterTimelineEmbed timelineHref={xTimelineHref} minHeight={280} />
              <a
                href={xOpenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block rounded-lg bg-slate-800 py-2 text-center text-xs font-bold text-white hover:bg-slate-700"
              >
                {t("social.openXProfile")}
              </a>
            </div>
          </div>

          <div className={EMBED_COL_CLASS}>
            <div className="flex shrink-0 items-center gap-2 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50 px-3 py-2">
              <i className="ri-instagram-fill text-lg text-pink-500" />
              <span className="text-sm font-bold text-gray-800">Instagram</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-pink-50/80 to-white p-3">
              {!igIframeSrc && (
                <p className="mb-2 rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
                  {t("social.ig.envHint")}
                </p>
              )}
              {igIframeSrc ? (
                <InstagramFeedIframe iframeSrc={igIframeSrc} minHeight={300} />
              ) : (
                <div className="rounded-xl border border-pink-100 bg-white/70 py-8 text-center text-sm text-gray-600">
                  <p className="mb-4">{t("social.ig.placeholder")}</p>
                  <a
                    href={INSTAGRAM_PROFILE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-bold text-white"
                  >
                    {t("social.ig.open")}
                  </a>
                </div>
              )}
              <a
                href={INSTAGRAM_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-center text-xs font-bold text-pink-600 hover:underline"
              >
                {t("social.ig.openProfileTab")}
              </a>
            </div>
          </div>

          <div className={EMBED_COL_CLASS}>
            <div className="flex shrink-0 items-center gap-2 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2">
              <i className="ri-facebook-fill text-lg text-blue-600" />
              <span className="text-sm font-bold text-gray-800">Facebook</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/80 to-white p-3">
              <FacebookTimelineEmbed minHeight={320} />
              <a
                href="https://www.facebook.com/GACHINKOCYCLETV"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                <i className="ri-facebook-fill" />
                {t("social.fb.open")}
              </a>
            </div>
          </div>

          <div className={EMBED_COL_CLASS}>
            <div className="flex shrink-0 items-center gap-2 border-b border-neutral-800 bg-neutral-950 px-3 py-2">
              <i className="ri-video-chat-line text-lg text-white" />
              <span className="text-sm font-bold text-white">TikTok</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-neutral-950 p-3">
              <p className="mb-2 text-xs text-gray-400">{t("social.tt.intro1")}</p>
              <div className="flex justify-center overflow-x-auto">
                <TikTokCreatorEmbed username={tiktokUser} />
              </div>
              <a
                href={`https://www.tiktok.com/@${tiktokUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-white py-2 text-xs font-black text-neutral-950 hover:bg-neutral-100"
              >
                <i className="ri-video-chat-line" />
                {t("social.tt.open")}
              </a>
            </div>
          </div>
            </>
          )}
        </div>

        <div className="mt-10 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <i className="ri-quill-pen-fill text-xl" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    {t("social.note.sectionLabel")}
                  </p>
                  <h3 className="text-lg font-black text-gray-900">{t("social.note.sectionTitle")}</h3>
                </div>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">
                {t("social.note.lead.before")}
                <strong className="text-emerald-800">{t("social.note.lead.em")}</strong>
                {t("social.note.lead.after")}
              </p>
            </div>
            <a
              href={NOTE_MAGAZINE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gray-900 px-6 py-4 font-black text-white hover:bg-gray-800"
            >
              <span className="font-black text-green-400">{t("social.note.ctaHighlight")}</span>
              {t("social.note.ctaAfter")}
              <i className="ri-external-link-line" />
            </a>
          </div>

          <p className="mb-4 mt-8 text-xs text-gray-500">{t("social.note.pickups")}</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {notePickupImages.map((image, index) => {
              const caption = t(`social.pickup.${index + 1}.caption`);
              return (
                <a key={image} href={NOTE_MAGAZINE} target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-xl ring-2 ring-transparent transition-all group-hover:ring-emerald-400">
                    <img
                      src={packageAsset(image)}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/55 px-2 py-1.5 backdrop-blur-sm">
                      <p className="truncate text-center text-xs font-bold text-white">{caption}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
