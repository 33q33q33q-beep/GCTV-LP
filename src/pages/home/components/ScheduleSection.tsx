import { useTranslation } from "react-i18next";
import { useBroadcastSchedule } from "../../../hooks/useBroadcastSchedule";

export default function ScheduleSection() {
  const { t } = useTranslation();
  const { upcoming, ended, loading } = useBroadcastSchedule();

  return (
    <section id="schedule" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="text-red-600">Schedule</span>
          </h2>
          <p className="text-gray-500 text-lg">{t("schedule.subtitle")}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4"></div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-16">{t("common.loading")}</p>
        ) : (
          <div className="space-y-16">
            <div className="bg-red-50 rounded-3xl p-8 md:p-12 border border-red-100">
              <h3 id="schedule-upcoming" className="scroll-mt-24 text-2xl md:text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                {t("schedule.section.upcoming")}
              </h3>
              {upcoming.length === 0 ? (
                <p className="text-gray-500 text-sm">{t("schedule.noUpcoming")}</p>
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
                              {t("schedule.badge.live")}
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
                              {t("schedule.link.live")} <i className="ri-external-link-line ml-1"></i>
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
              <h3 id="schedule-ended" className="scroll-mt-24 text-2xl md:text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <i className="ri-check-double-line text-green-600 text-2xl"></i>
                {t("schedule.section.ended")}
              </h3>
              <p className="text-xs text-gray-500 mb-4">{t("schedule.sortHint")}</p>
              {ended.length === 0 ? (
                <p className="text-gray-500 text-sm">{t("schedule.noEnded")}</p>
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
                              {t("schedule.archiveWatch")}
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">{t("schedule.archiveUnset")}</span>
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
