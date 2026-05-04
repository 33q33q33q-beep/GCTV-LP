import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

async function validateAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return false;
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .maybeSingle();
  if (data?.is_admin) return true;
  await supabase.auth.signOut();
  return false;
}

export default function RequireAdmin() {
  const [status, setStatus] = useState<"check" | "ok" | "no">("check");
  const location = useLocation();

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setStatus("no");
      return undefined;
    }

    let unsub: { unsubscribe: () => void } | undefined;

    (async () => {
      const run = async () => {
        const ok = await validateAdmin();
        setStatus(ok ? "ok" : "no");
      };
      await run();
      const { data } = supabase.auth.onAuthStateChange(() => {
        void run();
      });
      unsub = data.subscription as { unsubscribe: () => void };
    })();

    return () => unsub?.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="max-w-lg bg-white rounded-2xl p-8 shadow">
          <h1 className="text-xl font-black text-gray-900 mb-2">Supabase 未設定</h1>
          <p className="text-gray-600 text-sm mb-6">
            プロジェクトルートに `.env` を用意し、`VITE_SUPABASE_URL` と{' '}
            <code className="bg-gray-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>{' '}
            を設定してから開発サーバーを再起動してください。
          </p>
          <Link to="/" className="text-red-600 font-bold text-sm underline">
            トップへ戻る
          </Link>
        </div>
      </div>
    );
  }

  if (status === "check") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        確認中…
      </div>
    );
  }

  if (status === "no") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
