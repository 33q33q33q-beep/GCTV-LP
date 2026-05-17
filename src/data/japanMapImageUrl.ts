import { packageAsset } from "../lib/packageAsset";

const JAPAN_MAP_SOURCE =
  "https://readdy.ai/api/search-image?query=a%20simple%20and%20clean%20illustrated%20map%20of%20Japan%20showing%20prefecture%20boundaries%20in%20outline%20style%2C%20minimal%20vector%20art%20design%20with%20light%20pastel%20colors%20for%20each%20region%2C%20no%20text%20labels%20or%20city%20names%2C%20cartographic%20style%20illustration%20on%20pure%20white%20background%2C%20designed%20for%20interactive%20pin%20placement%2C%20high%20resolution%20flat%20design%20suitable%20for%20web%20display&width=1200&height=900&seq=japan-map-1&orientation=landscape";

/** 日本地図イラスト（既存トラベルマップと同一） */
export const JAPAN_MAP_IMAGE_URL = packageAsset(JAPAN_MAP_SOURCE);

/**
 * イラストに白余白が多いため、枠内で画像だけ拡大して陸域を大きく見せる。
 * ピン座標（%）は外側の aspect 枠基準のまま（CMS・トップで同じラッパーを使うこと）。
 */
export const JAPAN_MAP_ZOOM_WRAP_CLASS =
  "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden";
export const JAPAN_MAP_ZOOM_IMG_CLASS =
  "h-[132%] w-[132%] max-w-none shrink-0 object-contain sm:h-[128%] sm:w-[128%]";
