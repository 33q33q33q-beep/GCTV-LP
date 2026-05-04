import { fallbackTokuhainPins } from "../data/fallbackTokuhainPins";
import type { TokuhainMapPinRow } from "../domain/tokuhainMapPin";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const TOKUHAIN_TABLE = "tokuhain_map_pins";

/** PostgREST がテーブルを知らないときなど、管理画面向けの補足付きメッセージ */
function formatTokuhainDbError(message: string): string {
  const missing =
    /schema cache/i.test(message) ||
    /could not find the table/i.test(message) ||
    /PGRST205/i.test(message) ||
    (/does not exist/i.test(message) && message.includes(TOKUHAIN_TABLE));

  if (missing) {
    return (
      `${message} ` +
      "→ 接続先の DB に `public.tokuhain_map_pins` がありません。Supabase Dashboard の SQL エディタで " +
      "`supabase/migrations/20260206100000_tokuhain_map_pins.sql` の内容を実行するか、CLI で " +
      "`supabase link` 後に `supabase db push` してマイグレーションを反映してください。"
    );
  }
  if (/check constraint|23514/i.test(message)) {
    return `${message} → ピン位置（X%/Y%）は 0〜100 の範囲で保存してください。`;
  }
  if (/permission denied|42501/i.test(message)) {
    return `${message} → 管理者としてログインしているか確認してください。`;
  }
  return message;
}

export async function fetchPublicTokuhainPins(): Promise<{
  rows: TokuhainMapPinRow[];
  source: "db" | "fallback";
}> {
  if (!isSupabaseConfigured || !supabase) {
    return { rows: fallbackTokuhainPins, source: "fallback" };
  }

  const { data, error } = await supabase
    .from("tokuhain_map_pins")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("[tokuhainMapService]", error.message);
    const tableMissing =
      /schema cache/i.test(error.message) ||
      /could not find the table/i.test(error.message) ||
      error.code === "PGRST205";
    if (tableMissing) {
      return { rows: fallbackTokuhainPins, source: "fallback" };
    }
    return { rows: [], source: "db" };
  }

  return { rows: (data ?? []) as TokuhainMapPinRow[], source: "db" };
}

export async function fetchTokuhainPinsAdmin(): Promise<TokuhainMapPinRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("tokuhain_map_pins")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(formatTokuhainDbError(error.message));
  return (data ?? []) as TokuhainMapPinRow[];
}

export async function fetchTokuhainPinAdmin(id: string): Promise<TokuhainMapPinRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("tokuhain_map_pins").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(formatTokuhainDbError(error.message));
  return data as TokuhainMapPinRow | null;
}

export type TokuhainPinInsert = Omit<
  TokuhainMapPinRow,
  "id" | "created_at" | "updated_at"
>;

export async function insertTokuhainPinAdmin(payload: TokuhainPinInsert) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { data, error } = await supabase.from("tokuhain_map_pins").insert(payload).select("id");
  if (error) throw new Error(formatTokuhainDbError(error.message));
  if (!data?.length) {
    throw new Error(
      "登録できませんでした。管理者権限（profiles.is_admin）を確認するか、マイグレーション " +
        "`20260211100000_tokuhain_pins_rls_security_definer.sql` を Supabase に反映してください。",
    );
  }
}

export async function updateTokuhainPinAdmin(
  id: string,
  patch: Partial<
    Omit<TokuhainMapPinRow, "id" | "created_at" | "updated_at">
  >,
) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { data, error } = await supabase
    .from("tokuhain_map_pins")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");

  if (error) throw new Error(formatTokuhainDbError(error.message));
  if (!data?.length) {
    throw new Error(
      "更新できませんでした（0件）。管理者権限を確認するか、Supabase に " +
        "`20260211100000_tokuhain_pins_rls_security_definer.sql` を実行して RLS を更新してください。",
    );
  }
}

export async function deleteTokuhainPinAdmin(id: string) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase.from("tokuhain_map_pins").delete().eq("id", id);
  if (error) throw new Error(formatTokuhainDbError(error.message));
}
