import { useBroadcastSchedule } from "../../../hooks/useBroadcastSchedule";

export default function ScheduleSection() {
  const { upcoming, ended, loading, source } = useBroadcastSchedule();

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="text-red-600">Schedule</span>
          </h2>
          <p className="text-gray-500 text-lg">年間レース &amp; 配信カレンダー</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4"></div>
          <p className="text-xs text-gray-400 mt-3">
            終了グループへの移動・並び順は東京のカレンダー日付から自動算出（当日はまだ「配信予定」）。
          </p>
        </div>

        {source === "fallback" && (
          <p className="max-w-2xl mx-auto mb-10 text-center text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            いまは<strong className="mx-0.5">同梱の配信カレンダー</strong>を表示しています（Supabase 未設定、
            <code className="text-xs">broadcast_races</code> が空、または読み込みエラー時）。
            DB に行が入るとその内容が優先されます。
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-400 py-16">読み込み中…</p>
        ) : (
          <div className="space-y-16">
            <div className="bg-red-50 rounded-3xl p-8 md:p-12 border border-red-100">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                配信予定レース
              </h3>
              {upcoming.length === 0 ? (
                <p className="text-gray-500 text-sm">現在、配信予定のレースはありません。</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((item) => (
                    <div
                      key={item.id ?? `${item.race_date}-${item.title}-${item.sort_order ?? 0}`}
                      className="bg-white rounded-xl p-5 transition-all duration-300 border border-gray-200 hover:border-red-400 hover:shadow-md group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-shrink-0">
                          <span className="inline-block bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                            {item.dateLabel}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-gray-900 font-black text-lg group-hover:text-red-600 transition-colors">
                              {item.title}
                            </h4>
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap animate-pulse">
                              <i className="ri-live-fill"></i>
                              LIVE配信予定
                            </span>
                          </div>
                          <p className="text-gray-700 font-semibold text-base mt-1">
                            {item.subtitle}
                            {item.note ? (
                              <span className="text-red-600 font-bold ml-2">{item.note}</span>
                            ) : null}
                          </p>
                          {item.live_url ? (
                            <a
                              href={item.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex mt-3 text-sm font-bold text-red-600 hover:underline"
                            >
                              配信ページを開く <i className="ri-external-link-line ml-1"></i>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <i className="ri-check-double-line text-green-600 text-2xl"></i>
                配信終了レース
              </h3>
              <p className="text-xs text-gray-500 mb-4">新しい順（日程の新しいものが上）</p>
              {ended.length === 0 ? (
                <p className="text-gray-500 text-sm">配信終了のレースはまだありません。</p>
              ) : (
                <div className="space-y-3">
                  {ended.map((item) => (
                    <div
                      key={item.id ?? `${item.race_date}-${item.title}-${item.sort_order ?? 0}-end`}
                      className="bg-white rounded-xl p-5 transition-all duration-300 border border-gray-200 hover:border-green-400 hover:shadow-md group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-shrink-0">
                          <span className="inline-block bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                            {item.dateLabel}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 font-black text-lg">{item.title}</h4>
                          <p className="text-gray-600 text-base mt-1">{item.subtitle}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {item.archive_url ? (
                            <a
                              href={item.archive_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap text-sm"
                            >
                              <i className="ri-play-fill text-lg"></i>
                              アーカイブ視聴
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">アーカイブURL未設定</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
