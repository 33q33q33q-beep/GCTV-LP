/**
 * ジオコーディング結果（緯度経度）を、管理画面の日本地図イラスト上のピン位置（0–100%）へ変換する。
 * - 東海〜三重〜愛知など（経度 136°E 付近）だけアフィンだと名古屋寄りに吸い寄せられるため、狭い矩形内はビリニア補間。
 * - それ以外は全国の基準点で最小二乗アフィン近似。
 */

/** 東海コア（いなべ・名古屋・四日市など）。琵琶湖以西はここに含めない（minLng で切る）。 */
const TOKAI_CORE = {
  minLng: 136.05,
  maxLng: 137.45,
  minLat: 34.4,
  maxLat: 35.65,
  /** 矩形の西南・東南・西北・東北を地図%で指定（イラスト上の陸域に合わせ東寄り） */
  sw: { x: 46, y: 56 },
  se: { x: 64, y: 52 },
  nw: { x: 48, y: 50 },
  ne: { x: 65, y: 48 },
} as const;

const CAL = [
  { lng: 134.25, lat: 34.48, x: 52, y: 56 },
  { lng: 136.95, lat: 34.65, x: 56, y: 52 },
  { lng: 135.9, lat: 35.2, x: 55, y: 50 },
  { lng: 138.55, lat: 37.37, x: 54, y: 42 },
  { lng: 140.12, lat: 35.61, x: 61, y: 53 },
  { lng: 139.75, lat: 35.69, x: 60, y: 52 },
  { lng: 135.5, lat: 34.69, x: 50, y: 54 },
  { lng: 132.46, lat: 34.39, x: 47, y: 56 },
  { lng: 130.4, lat: 33.59, x: 43, y: 60 },
  { lng: 141.35, lat: 43.06, x: 64, y: 22 },
  { lng: 140.87, lat: 38.26, x: 62, y: 38 },
  { lng: 136.66, lat: 36.56, x: 53, y: 44 },
  { lng: 133.53, lat: 33.56, x: 48, y: 58 },
  { lng: 127.68, lat: 26.21, x: 38, y: 88 },
] as const;

function solve3x3(A: number[][], b: number[]): number[] {
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < 3; col++) {
    let pivot = col;
    for (let r = col + 1; r < 3; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    [M[col], M[pivot]] = [M[pivot], M[col]];
    const div = M[col][col];
    if (Math.abs(div) < 1e-12) {
      throw new Error("japanMapGeo: singular matrix");
    }
    for (let c = col; c < 4; c++) M[col][c] /= div;
    for (let r = 0; r < 3; r++) {
      if (r === col) continue;
      const factor = M[r][col];
      for (let c = col; c < 4; c++) M[r][c] -= factor * M[col][c];
    }
  }
  return [M[0][3], M[1][3], M[2][3]];
}

function leastSquaresAffine(
  rows: [number, number, number][],
  targets: number[],
): [number, number, number] {
  const AtA: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const Atb = [0, 0, 0];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const t = targets[i];
    for (let a = 0; a < 3; a++) {
      Atb[a] += r[a] * t;
      for (let b = 0; b < 3; b++) {
        AtA[a][b] += r[a] * r[b];
      }
    }
  }
  return solve3x3(AtA, Atb) as [number, number, number];
}

const ROWS: [number, number, number][] = CAL.map((p) => [p.lng, p.lat, 1]);
const COEF_X = leastSquaresAffine(
  ROWS,
  CAL.map((p) => p.x),
);
const COEF_Y = leastSquaresAffine(
  ROWS,
  CAL.map((p) => p.y),
);

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n));
}

function bilinearMapPercent(lat: number, lng: number): { x: number; y: number } | null {
  const { minLng, maxLng, minLat, maxLat, sw, se, nw, ne } = TOKAI_CORE;
  if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) return null;
  const u = (lng - minLng) / (maxLng - minLng);
  const v = (lat - minLat) / (maxLat - minLat);
  const x =
    (1 - u) * (1 - v) * sw.x +
    u * (1 - v) * se.x +
    (1 - u) * v * nw.x +
    u * v * ne.x;
  const y =
    (1 - u) * (1 - v) * sw.y +
    u * (1 - v) * se.y +
    (1 - u) * v * nw.y +
    u * v * ne.y;
  return { x, y };
}

function affineMapPercent(lat: number, lng: number): { x: number; y: number } {
  const [ax, bx, cx] = COEF_X;
  const [ay, by, cy] = COEF_Y;
  return {
    x: ax * lng + bx * lat + cx,
    y: ay * lng + by * lat + cy,
  };
}

/**
 * アセット全体に対する緯度→% はやや西寄りになりがち。東海矩形外（全国アフィン）だけ補正する。
 * 東海矩形内は bilinear がイラスト上の陸域に合わせ済みのため二重補正しない。
 */
function fitBundledJapanIllustrationPercent(p: { x: number; y: number }): { x: number; y: number } {
  return {
    x: clampPct(9.5 + p.x * 0.92),
    y: clampPct(4 + p.y * 0.93),
  };
}

/** 日本周辺の緯度経度かざっくり判定（誤検出を減らす） */
export function isRoughlyJapanBounds(lat: number, lng: number): boolean {
  return lat >= 20 && lat <= 46 && lng >= 122 && lng <= 154;
}

export function latLngToJapanMapPinPercent(lat: number, lng: number): { x: number; y: number } {
  const local = bilinearMapPercent(lat, lng);
  if (local) {
    return { x: clampPct(local.x), y: clampPct(local.y) };
  }
  return fitBundledJapanIllustrationPercent(affineMapPercent(lat, lng));
}
