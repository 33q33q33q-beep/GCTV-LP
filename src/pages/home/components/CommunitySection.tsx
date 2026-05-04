import { useShortsGallery } from "../../../hooks/useShortsGallery";

const communities = [
  {
    title: "🚴私の愛車紹介～my favorite bicycle~🚵",
    description: "自慢の愛車を投稿して、サイクリスト仲間と交流しよう！",
    members: "2,345",
    icon: "ri-facebook-fill",
    color: "from-red-500 to-rose-600",
    url: "https://www.facebook.com/groups/1175034630811288/",
    thumbSrc: `${import.meta.env.BASE_URL}community/my-favorite-bicycle.png`,
  },
  {
    title: "🚴サイクリングルート共有コミュニティ🚵",
    description: "おすすめのルートやグルメスポットを共有しよう！",
    members: "1,892",
    icon: "ri-facebook-fill",
    color: "from-red-600 to-red-700",
    url: "https://www.facebook.com/groups/678442815124783/",
    thumbSrc: `${import.meta.env.BASE_URL}community/cycling-route-sharing.png`,
  },
];

function CardThumb({ src, title }: { src: string; title: string }) {
  if (src.trim()) {
    return (
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
    );
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
      <i className="ri-video-chat-line text-white text-4xl opacity-80" />
    </div>
  );
}

export default function CommunitySection() {
  const { items: shortsVideos, settings, loading, source } = useShortsGallery();

  const tiktokMore = settings?.footer_tiktok_url ?? "https://www.tiktok.com/@gachinkocycletv_gctv";
  const ytShortsMore =
    settings?.footer_youtube_shorts_url ?? "https://www.youtube.com/@GachinkoCycleTV/shorts";

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="text-red-600">Community</span>
          </h2>
          <p className="text-gray-500 text-lg">ファンコミュニティに参加しよう</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4"></div>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 text-center">
            Facebookコミュニティ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communities.map((community, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-red-400 transition-all duration-300 group hover:shadow-md flex flex-col"
              >
                <a
                  href={community.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[21/9] min-h-[140px] overflow-hidden bg-neutral-100"
                >
                  <img
                    src={community.thumbSrc}
                    alt={community.title}
                    className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 w-10 h-10 bg-white/95 rounded-lg shadow flex items-center justify-center">
                    <i className={`${community.icon} text-blue-600 text-xl`} />
                  </div>
                </a>
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <h4 className="text-gray-900 font-black text-xl mb-3 group-hover:text-red-600 transition-colors">
                    {community.title}
                  </h4>
                  <p className="text-gray-500 mb-4 flex-1">{community.description}</p>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-gray-400 text-sm">
                      <i className="ri-group-fill mr-1"></i>
                      {community.members} メンバー
                    </span>
                    <a
                      href={community.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
                    >
                      参加する
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 text-center">
            TikTok &amp; Shorts ギャラリー
          </h3>
          <p className="text-center text-sm text-gray-500 mb-6">
            表示内容は管理画面でURL・サムネ・タイトルを編集できます。
            {source === "fallback" && (
              <span className="block mt-1 text-amber-700">
                デモ表示中（Supabase に `shorts_gallery_items` があると本番データになります）
              </span>
            )}
          </p>
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            {loading ? (
              <p className="text-center text-gray-400 py-12">読み込み中…</p>
            ) : shortsVideos.length === 0 ? (
              <p className="text-center text-gray-500 py-12 text-sm">
                まだカードがありません。管理画面の「TikTok &amp; Shorts」から動画URLを登録してください。
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {shortsVideos.map((video) => (
                  <a
                    key={video.id}
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl aspect-[9/16]">
                      <CardThumb src={video.thumbnail_url} title={video.title} />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                          <i className="ri-play-fill text-white text-2xl ml-1"></i>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-sm font-bold line-clamp-2 mb-1">{video.title}</p>
                        {video.views_label.trim() ? (
                          <p className="text-gray-300 text-xs">
                            <i className="ri-eye-fill mr-1"></i>
                            {video.views_label}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={tiktokMore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-black py-3 px-7 rounded-xl transition-colors whitespace-nowrap"
              >
                <i className="ri-video-chat-line text-lg" />
                TikTok でもっと見る
              </a>
              <a
                href={ytShortsMore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black py-3 px-7 rounded-xl transition-colors whitespace-nowrap"
              >
                <i className="ri-youtube-fill text-lg" />
                Shortsでもっと見る
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
