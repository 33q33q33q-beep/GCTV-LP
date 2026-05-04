import { useMergedContents } from "../../../hooks/useMergedContents";

export default function ContentsSection() {
  const { categories, loading } = useMergedContents();

  if (loading || !categories) {
    return (
      <section className="py-20 px-4 bg-red-50/50">
        <div className="max-w-7xl mx-auto text-center text-gray-400 py-24">Loading…</div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-red-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            <span className="text-red-600">Contents</span>
          </h2>
          <p className="text-gray-500 text-base">YouTubeカテゴリー完全網羅</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-3"></div>
        </div>

        <div className="space-y-16">
          {categories.map((category) => (
            <div
              key={category.key}
              id={category.anchorId}
              className="bg-white rounded-3xl p-8 md:p-12 border border-red-100 shadow-sm"
            >
              <div className="mb-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-5xl">{category.emoji}</span>
                  <div>
                    <h3
                      className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}
                    >
                      {category.sectionTitle}
                    </h3>
                    <p className="text-gray-900 text-base md:text-lg font-bold">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.videos.map((video, vIndex) => (
                  <a
                    key={vIndex}
                    href={video.url || "https://www.youtube.com/@GachinkoCycleTV"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl mb-3 aspect-video">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <i className="ri-play-fill text-white text-3xl ml-1"></i>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <h4 className="text-gray-900 font-bold text-base group-hover:text-red-600 transition-colors line-clamp-2">
                      {video.title}
                    </h4>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
