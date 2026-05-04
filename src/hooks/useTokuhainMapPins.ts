import { useEffect, useMemo, useState } from "react";
import { pinRowToTravelVm, type TravelMapLocationVm } from "../domain/tokuhainMapPin";
import { fetchPublicTokuhainPins } from "../services/tokuhainMapService";

export function useTokuhainMapPins() {
  const [locations, setLocations] = useState<TravelMapLocationVm[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"db" | "fallback" | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { rows, source: s } = await fetchPublicTokuhainPins();
        if (!cancelled) {
          setLocations(rows.map(pinRowToTravelVm));
          setSource(s);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasPins = useMemo(() => locations.length > 0, [locations.length]);

  return { locations, loading, source, hasPins };
}
