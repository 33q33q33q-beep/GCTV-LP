/** Meta + サーバー未取得時の既定スロット（9枠） */
export type ContentCategoryKey =
  | "race_interview"
  | "news_information"
  | "variety_beginner";

export interface CatalogVideoSlot {
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
}

export interface ContentCategoryDefinition {
  key: ContentCategoryKey;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  defaultVideos: [CatalogVideoSlot, CatalogVideoSlot, CatalogVideoSlot];
}

export const CONTENT_CATEGORY_ORDER: ContentCategoryDefinition[] = [
  {
    key: "race_interview",
    emoji: "🔥",
    title: "RACE & INTERVIEW",
    subtitle: "レースを観る：日本最高峰の戦いがココに!!",
    description:
      "JBCFロードシリーズのLIVE配信から、ゴール直後の選手インタビュー、次戦の予習に最適な再放送ハイライト（Repeat Broadcast）まで必見！",
    gradient: "from-red-600 to-rose-600",
    defaultVideos: [
      {
        thumbnail:
          "https://img.youtube.com/vi/MWdZ8Y1tNPA/maxresdefault.jpg",
        title: "BICYCLE RACE",
        duration: "LIVE",
        url: "https://www.youtube.com/live/MWdZ8Y1tNPA?si=thffINOJa0SQTxBi",
      },
      {
        thumbnail:
          "https://readdy.ai/api/search-image?query=cycling%20race%20interview%20studio%20setup%20with%20professional%20cyclists%20and%20hosts%2C%20sports%20broadcasting%20set%20with%20modern%20lighting%2C%20television%20production%20quality&width=640&height=360&seq=race-2&orientation=landscape",
        title: "INTERVIEW",
        duration: "45:32",
        url: "https://www.youtube.com/playlist?list=PLvEOnP8mxvn5cthZGZdDj6GmSj16mUm3Q",
      },
      {
        thumbnail:
          "https://readdy.ai/api/search-image?query=exciting%20cycling%20race%20sprint%20finish%20with%20multiple%20cyclists%20competing%20for%20victory%2C%20high%20speed%20action%20shot%2C%20professional%20sports%20photography%20with%20motion%20blur&width=640&height=360&seq=race-3&orientation=landscape",
        title: "Repeat Broadcast -再放送・ハイライト-",
        duration: "28:15",
        url: "https://www.youtube.com/playlist?list=PLvEOnP8mxvn6ohQmeyFZNH_V6kEYOQZxF",
      },
    ],
  },
  {
    key: "news_information",
    emoji: "🧠",
    title: "NEWS & INFORMATION",
    subtitle: "選手の素顔と、自転車界の\"今\"を知る",
    description:
      "チームや選手の素顔を届ける「Jプロニュース」、JBCFや自転車界の今に迫る「チャリタイムズ」、プロ機材を解剖する「Bicycle Gear」まで深掘り情報が満載！",
    gradient: "from-red-500 to-rose-500",
    defaultVideos: [
      {
        thumbnail:
          "https://readdy.ai/api/search-image?query=professional%20cyclist%20portrait%20interview%20in%20modern%20studio%2C%20athlete%20talking%20about%20career%20and%20experiences%2C%20documentary%20style%20photography%20with%20soft%20lighting&width=640&height=360&seq=interview-1&orientation=landscape",
        title: "J PRO NEWS",
        duration: "15:42",
        url: "https://www.youtube.com/playlist?list=PLvEOnP8mxvn47h3g7U5-oLLgYWT5TJXHo",
      },
      {
        thumbnail:
          "https://readdy.ai/api/search-image?query=close%20up%20of%20high%20end%20professional%20racing%20bicycle%20with%20detailed%20components%2C%20beautiful%20bike%20photography%20in%20studio%20setting%2C%20premium%20cycling%20equipment%20showcase&width=640&height=360&seq=interview-2&orientation=landscape",
        title: "チャリタイムズ",
        duration: "22:18",
        url: "https://www.youtube.com/playlist?list=PLvEOnP8mxvn78uoZjfWfgjWiZ1GzwuzUo",
      },
      {
        thumbnail:
          "https://readdy.ai/api/search-image?query=retired%20professional%20cyclist%20special%20interview%20in%20comfortable%20setting%2C%20emotional%20storytelling%20moment%2C%20documentary%20photography%20with%20warm%20atmosphere&width=640&height=360&seq=interview-3&orientation=landscape",
        title: "BicycleGear",
        duration: "38:55",
        url: "https://www.youtube.com/playlist?list=PLvEOnP8mxvn7D2G-QMrLE9eOceLNUX-IR",
      },
    ],
  },
  {
    key: "variety_beginner",
    emoji: "🚲",
    title: "VARIETY & BEGINNER",
    subtitle: "ゆるポタの癒やし。笑顔を届ける自転車便",
    description:
      "MASAYO、くみっきー、ぴの等、女性特派員たちが全国の絶景ルートやグルメ、過酷な挑戦をお届けする「笑顔を届ける自転車便☆GCTV特派員（サブチャンネル）」レース初心者の疑問を解決する『おしえて栗村さん！』も必見",
    gradient: "from-rose-500 to-red-400",
    defaultVideos: [
      {
        thumbnail:
          "https://readdy.ai/api/search-image?query=happy%20female%20cyclist%20riding%20through%20beautiful%20coastal%20scenic%20route%20with%20ocean%20view%2C%20joyful%20cycling%20adventure%2C%20bright%20sunny%20day%20with%20blue%20sky%20and%20sea&width=640&height=360&seq=variety-1&orientation=landscape",
        title: "GCTV特派員",
        duration: "25:30",
        url: "https://www.youtube.com/@GachinkoCycleTV-TOKUHAIN",
      },
      {
        thumbnail:
          "https://readdy.ai/api/search-image?query=female%20cyclist%20enjoying%20delicious%20local%20food%20at%20outdoor%20cafe%2C%20smiling%20while%20eating%20regional%20cuisine%2C%20travel%20and%20gourmet%20cycling%20content&width=640&height=360&seq=variety-2&orientation=landscape",
        title: "おしえて栗村さん！",
        duration: "18:45",
        url: "https://www.youtube.com/playlist?list=PLvEOnP8mxvn7KzHNtjoXpB-NjTvd1HOrp",
      },
      {
        thumbnail:
          "https://readdy.ai/api/search-image?query=cycling%20expert%20instructor%20teaching%20beginners%20about%20road%20cycling%20techniques%2C%20educational%20content%20in%20friendly%20atmosphere%2C%20how%20to%20guide%20photography&width=640&height=360&seq=variety-3&orientation=landscape",
        title: "GCTV特派員「TOJ開催地を走る！」",
        duration: "12:20",
        url: "https://www.youtube.com/playlist?list=PLplwFAnqJtMFOXXMO2HW9gS4ozh8umMLJ",
      },
    ],
  },
];

export interface MergedCategory {
  key: ContentCategoryKey;
  emoji: string;
  sectionTitle: string;
  subtitle: string;
  description: string;
  gradient: string;
  anchorId: string;
  videos: CatalogVideoSlot[];
}

function anchorIdFor(key: ContentCategoryKey): string {
  if (key === "race_interview") return "race-interview";
  if (key === "news_information") return "news-information";
  return "variety-beginner";
}

/** DB行でカタログのデフォルトを上書き */
export function mergeContentCategories(rows: ContentSpotRowDb[]): MergedCategory[] {
  return CONTENT_CATEGORY_ORDER.map((def): MergedCategory => {
    const videos = ([0, 1, 2] as const).map((position) => {
      const spot = rows.find(
        (r) => r.category_key === def.key && r.position === position,
      );
      const dv = def.defaultVideos[position];
      if (spot) {
        return {
          title: spot.title,
          url: spot.url,
          thumbnail: spot.thumbnail_url,
          duration: spot.duration ?? "",
        };
      }
      return { ...dv };
    });
    return {
      key: def.key,
      emoji: def.emoji,
      sectionTitle: def.title,
      subtitle: def.subtitle,
      description: def.description,
      gradient: def.gradient,
      anchorId: anchorIdFor(def.key),
      videos,
    };
  });
}

export interface ContentSpotRowDb {
  id: string;
  category_key: string;
  position: number;
  title: string;
  url: string;
  thumbnail_url: string;
  duration: string;
}
