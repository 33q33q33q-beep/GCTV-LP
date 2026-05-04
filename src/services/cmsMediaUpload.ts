import { isSupabaseConfigured, supabase } from "../lib/supabase";

export const CMS_MEDIA_BUCKET = "cms-media";

const MAX_BYTES = 10 * 1024 * 1024;

/** ブラウザが file.type を空にすることがあるため拡張子から推測する */
function inferImageMimeAndExt(file: File): { mime: string; ext: string } {
  const name = file.name.toLowerCase();
  const extFromName = name.includes(".") ? (name.split(".").pop() ?? "") : "";

  const byExt: Record<string, { mime: string; ext: string }> = {
    jpg: { mime: "image/jpeg", ext: "jpg" },
    jpeg: { mime: "image/jpeg", ext: "jpg" },
    png: { mime: "image/png", ext: "png" },
    webp: { mime: "image/webp", ext: "webp" },
    gif: { mime: "image/gif", ext: "gif" },
    heic: { mime: "image/heic", ext: "heic" },
    heif: { mime: "image/heif", ext: "heif" },
    avif: { mime: "image/avif", ext: "avif" },
    bmp: { mime: "image/bmp", ext: "bmp" },
    svg: { mime: "image/svg+xml", ext: "svg" },
  };

  if (extFromName && byExt[extFromName]) {
    return byExt[extFromName];
  }

  if (file.type.startsWith("image/")) {
    const mime = file.type;
    const sub = mime.slice("image/".length).split(";")[0]?.trim() ?? "";
    const ext =
      sub === "jpeg" || sub === "jpg"
        ? "jpg"
        : sub === "svg+xml"
          ? "svg"
          : sub.replace(/[^a-z0-9]/gi, "") || "jpg";
    return { mime, ext };
  }

  return { mime: "image/jpeg", ext: "jpg" };
}

function explainStorageError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("bucket") && (m.includes("not found") || m.includes("does not exist"))) {
    return `${raw}\n（ヒント: Supabase の SQL で cms-media バケット作成マイグレーションを実行しましたか？）`;
  }
  if (m.includes("row-level security") || m.includes("violates row-level security") || m.includes("rls")) {
    return `${raw}\n（ヒント: 管理者でログインしているか、SQL「cms_storage_fix」でストレージ用ポリシーを更新しましたか？）`;
  }
  if (m.includes("jwt") || m.includes("expired") || m.includes("invalid token")) {
    return `${raw}\n（ヒント: 一度ログアウトして管理画面に再ログインしてください。）`;
  }
  if (m.includes("mime") || m.includes("mime type")) {
    return `${raw}\n（ヒント: 別の画像形式か、バケットの allowed_mime_types を緩めるマイグレーションを実行してください。）`;
  }
  return raw;
}

/**
 * Supabase Storage（cms-media バケット）に画像を上げ、公開 URL を返す。
 */
export async function uploadCmsImage(file: File, folder: string): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase が未設定です。`.env` を確認してください。");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("ログインセッションがありません。管理画面からログインし直してください。");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("画像は 10MB 以下にしてください。");
  }

  const { mime, ext } = inferImageMimeAndExt(file);
  if (!mime.startsWith("image/")) {
    throw new Error("画像ファイルを選んでください。");
  }

  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+/, "") || "misc";
  const path = `${safeFolder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(CMS_MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: mime,
  });

  if (error) {
    console.warn("[cmsMediaUpload]", error);
    throw new Error(explainStorageError(error.message));
  }

  const { data } = supabase.storage.from(CMS_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
