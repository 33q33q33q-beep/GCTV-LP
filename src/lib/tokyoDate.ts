/** Asia/Tokyo の「今日」の日付だけ YYYY-MM-DD */
export function tokyoDateString(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** 例: race_date が「今日」の前日までなら過去終了済み。
 * 「今日」をまだ「配信予定」に含める（当日は終了に落とさない） */
export function isBroadcastEndedRace(raceDateISO: string, todayTokyo = tokyoDateString()): boolean {
  return raceDateISO.slice(0, 10) < todayTokyo;
}

/** 例: 2026-05-24 → 5月24日（土） */
export function formatRaceDateBadgeJa(isoYYYYMMDD: string): string {
  const d = new Date(`${isoYYYYMMDD.slice(0, 10)}T12:00:00+09:00`);
  const md = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "long",
    day: "numeric",
  }).format(d);
  const wk = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
  }).format(d);
  return `${md}（${wk}）`;
}
