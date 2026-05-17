import { STANDALONE_ASSETS } from "../generated/standaloneAssets";
import { IS_STANDALONE } from "./standalone";

function withBase(relativePath: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}${relativePath.replace(/^\//, "")}`;
}

/** スタンドアロン時のみ、同梱したローカル画像パスへ差し替え */
export function packageAsset(url: string | undefined | null): string {
  if (!url || !IS_STANDALONE) return url ?? "";
  const local = STANDALONE_ASSETS[url];
  return local ? withBase(local) : url;
}
