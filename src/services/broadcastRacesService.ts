import type { BroadcastRaceRow, BroadcastRaceVm } from "../domain/broadcastRace";
import { fallbackBroadcastRaces } from "../data/fallbackSchedule";
import { isBroadcastEndedRace, formatRaceDateBadgeJa, tokyoDateString } from "../lib/tokyoDate";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

function rowToVm(row: BroadcastRaceRow): BroadcastRaceVm {
  const d = row.race_date.slice(0, 10);
  return {
    id: row.id,
    race_date: d,
    dateLabel: formatRaceDateBadgeJa(d),
    title: row.title,
    subtitle: row.subtitle,
    note: row.note,
    live_url: row.live_url ?? "",
    archive_url: row.archive_url ?? "",
    published: row.published,
    sort_order: row.sort_order,
  };
}

export function splitScheduleByTokyoToday(
  items: BroadcastRaceVm[],
  todayTokyo = tokyoDateString(),
): { upcoming: BroadcastRaceVm[]; ended: BroadcastRaceVm[] } {
  const upcoming = items
    .filter((r) => !isBroadcastEndedRace(r.race_date, todayTokyo))
    .sort(
      (a, b) =>
        a.race_date.localeCompare(b.race_date) ||
        (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );

  const ended = items
    .filter((r) => isBroadcastEndedRace(r.race_date, todayTokyo))
    .sort(
      (a, b) =>
        b.race_date.localeCompare(a.race_date) ||
        (b.sort_order ?? 0) - (a.sort_order ?? 0),
    );

  return { upcoming, ended };
}

async function fetchPublishedRaceVms(): Promise<{
  items: BroadcastRaceVm[];
  source: "db" | "fallback";
}> {
  if (!isSupabaseConfigured || !supabase) {
    return { items: fallbackBroadcastRaces, source: "fallback" };
  }

  const { data, error } = await supabase
    .from("broadcast_races")
    .select("*")
    .eq("published", true)
    .order("race_date", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("[broadcastRacesService]", error.message);
    return { items: fallbackBroadcastRaces, source: "fallback" };
  }

  /** テーブル未作成・未シード・RLS で0件などのときもトップで同梱日程を表示 */
  if (!data?.length) {
    return { items: fallbackBroadcastRaces, source: "fallback" };
  }

  return {
    items: (data as BroadcastRaceRow[]).map(rowToVm),
    source: "db",
  };
}

export async function fetchPublishedRaceItems(): Promise<{
  items: BroadcastRaceVm[];
  source: "db" | "fallback";
}> {
  return fetchPublishedRaceVms();
}

export async function fetchAllRacesAdmin(): Promise<BroadcastRaceRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("broadcast_races")
    .select("*")
    .order("race_date", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as BroadcastRaceRow[];
}

export async function fetchRaceAdmin(id: string): Promise<BroadcastRaceRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("broadcast_races").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as BroadcastRaceRow | null;
}

export async function insertRaceAdmin(payload: {
  race_date: string;
  title: string;
  subtitle: string;
  note: string;
  live_url: string;
  archive_url: string;
  published: boolean;
  sort_order: number;
}) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase.from("broadcast_races").insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateRaceAdmin(
  id: string,
  patch: Partial<{
    race_date: string;
    title: string;
    subtitle: string;
    note: string;
    live_url: string;
    archive_url: string;
    published: boolean;
    sort_order: number;
  }>,
) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase
    .from("broadcast_races")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteRaceAdmin(id: string) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase.from("broadcast_races").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
