/** 公開フォルダ `public/gachineko/` のマスコット画像（BASE_URL 対応） */
function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}${path.replace(/^\//, "")}`;
}

export const gachinekoImg = {
  /** 「よろしくニャ〜！」 */
  yoroshiku: publicAsset("gachineko/yoroshiku.png"),
  /** 「にゃるほど」 */
  nyaruhodo: publicAsset("gachineko/nyaruhodo.png"),
  /** 「おはよん」 */
  ohayon: publicAsset("gachineko/ohayon.png"),
  /** ゴロゴロ笑い */
  gorogoro: publicAsset("gachineko/gorogoro.png"),
  /** おにぎり休憩 */
  onigiri: publicAsset("gachineko/onigiri.png"),
  /** がんばるニャ（応援） */
  ganbaru: publicAsset("gachineko/ganbaru.png"),
  /** たのしみニャ！ */
  tanoshimi: publicAsset("gachineko/tanoshimi.png"),
} as const;

export type GachinekoVariant = keyof typeof gachinekoImg;
