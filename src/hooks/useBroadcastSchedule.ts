import { useEffect, useState } from "react";
import type { BroadcastRaceVm } from "../domain/broadcastRace";
import {
  fetchPublishedRaceItems,
  splitScheduleByTokyoToday,
} from "../services/broadcastRacesService";
import { tokyoDateString } from "../lib/tokyoDate";

/** 東京の「今日」が変わると自動で終了グループへ（1分ごと／タブ復帰でも再評価） */
export function useBroadcastSchedule() {
  const [items, setItems] = useState<BroadcastRaceVm[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"db" | "fallback" | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchPublishedRaceItems();
        if (!cancelled) {
          setItems(res.items);
          setSource(res.source);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 60_000);
    const onVis = () => {
      if (document.visibilityState === "visible") setTick((t) => t + 1);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const todayTokyo = tokyoDateString();
  const { upcoming, ended } = splitScheduleByTokyoToday(items, todayTokyo);

  return { upcoming, ended, loading, source, todayTokyo };
}
