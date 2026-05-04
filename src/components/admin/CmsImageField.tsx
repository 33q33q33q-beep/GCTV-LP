import { useId, useRef, useState } from "react";
import { isSupabaseConfigured } from "../../lib/supabase";
import { uploadCmsImage } from "../../services/cmsMediaUpload";

function firstImageFile(list: FileList | null): File | null {
  if (!list?.length) return null;
  for (let i = 0; i < list.length; i++) {
    const f = list.item(i);
    if (f && f.type.startsWith("image/")) return f;
  }
  return list[0] ?? null;
}

type Props = {
  label: string;
  value: string;
  onChange: (publicUrl: string) => void;
  /** storage 上のプレフィックス（例: news, tokuhain, shorts, contents） */
  folder: string;
  /** 空欄不可のフォーム用 */
  required?: boolean;
  /** 下に表示する補足 */
  hint?: string;
};

export default function CmsImageField({
  label,
  value,
  onChange,
  folder,
  required = false,
  hint,
}: Props) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const pickFile = () => fileRef.current?.click();

  const uploadFile = async (file: File) => {
    setErr(null);
    setBusy(true);
    try {
      const url = await uploadCmsImage(file, folder);
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "アップロードに失敗しました");
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    await uploadFile(file);
  };

  const canUpload = isSupabaseConfigured && !busy;

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.types.includes("Files")) return;
    dragDepth.current += 1;
    if (canUpload) setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragActive(false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = canUpload ? "copy" : "none";
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setDragActive(false);
    if (!canUpload) return;
    const file = firstImageFile(e.dataTransfer.files);
    if (!file) {
      setErr("画像ファイルをドロップしてください。");
      return;
    }
    await uploadFile(file);
  };

  return (
    <div>
      <label htmlFor={inputId} className="block text-xs font-bold text-gray-500 mb-1">
        {label}
      </label>

      {!isSupabaseConfigured && (
        <p className="text-xs text-amber-700 mb-2">
          Supabase 未設定のためアップロードは使えません。`.env` を設定するか、下の欄に画像URLを直接入力してください。
        </p>
      )}

      {value ? (
        <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-2 inline-block max-w-full">
          <img
            src={value}
            alt=""
            className="max-h-40 max-w-full rounded object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : null}

      <div
        className={`mb-2 rounded-xl border-2 border-dashed p-4 transition-colors ${
          dragActive && canUpload
            ? "border-red-500 bg-red-50/90"
            : "border-gray-200 bg-gray-50/50"
        } ${!isSupabaseConfigured ? "opacity-60" : ""}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={(e) => void onDrop(e)}
      >
        <div className="flex flex-wrap items-center gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => void onFile(e)} />
          <button
            type="button"
            onClick={pickFile}
            disabled={busy || !isSupabaseConfigured}
            className="text-sm font-bold rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-2 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "アップロード中…" : "画像をアップロード"}
          </button>
          <span className="text-xs text-gray-500">クリックで選択、またはここにドラッグ＆ドロップ（一般的な画像形式・最大10MB）</span>
        </div>
      </div>

      {err ? (
        <p className="text-sm text-red-600 mb-2 whitespace-pre-wrap">{err}</p>
      ) : null}

      <input
        id={inputId}
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder="アップロードで自動入力されます。外部URLを使う場合はここに貼り付け"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
      />
      {hint ? <p className="mt-1 text-xs text-gray-400">{hint}</p> : null}
    </div>
  );
}
