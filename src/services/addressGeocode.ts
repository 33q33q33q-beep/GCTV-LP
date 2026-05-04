import { isRoughlyJapanBounds } from "../lib/japanMapGeo";

type PhotonFeature = {
  geometry: { type: string; coordinates: [number, number] };
  properties?: {
    name?: string;
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    countrycode?: string;
  };
};

type PhotonResponse = { features?: PhotonFeature[] };

/**
 * Photon（OpenStreetMap 由来）で住所・地名を検索。API キー不要。
 * @see https://photon.komoot.io/
 */
export async function geocodeAddressJa(query: string): Promise<{ lat: number; lng: number; label: string } | null> {
  const q = query.trim();
  if (!q) return null;

  // Photon は lang=ja 非対応。クエリは日本語のまま UTF-8 で送る。
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=10`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`住所の検索に失敗しました（${res.status}）`);
  }

  const data = (await res.json()) as PhotonResponse;
  const features = data.features ?? [];

  const labelOf = (f: PhotonFeature): string => {
    const p = f.properties;
    if (!p) return q;
    const parts = [p.country, p.state, p.city, p.street, p.name].filter(Boolean);
    return parts.length ? parts.join(" ") : q;
  };

  const jpFirst = features.find((f) => {
    const cc = f.properties?.countrycode?.toUpperCase();
    const [lng, lat] = f.geometry.coordinates;
    return cc === "JP" && Number.isFinite(lat) && Number.isFinite(lng) && isRoughlyJapanBounds(lat, lng);
  });
  if (jpFirst) {
    const [lng, lat] = jpFirst.geometry.coordinates;
    return { lat, lng, label: labelOf(jpFirst) };
  }

  for (const f of features) {
    const [lng, lat] = f.geometry.coordinates;
    if (Number.isFinite(lat) && Number.isFinite(lng) && isRoughlyJapanBounds(lat, lng)) {
      return { lat, lng, label: labelOf(f) };
    }
  }

  const first = features[0];
  if (first) {
    const [lng, lat] = first.geometry.coordinates;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng, label: labelOf(first) };
    }
  }

  return null;
}
