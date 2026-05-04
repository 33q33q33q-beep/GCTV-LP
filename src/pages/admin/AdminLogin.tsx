import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import GachinekoSticker from "../../components/GachinekoSticker";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export default function AdminLogin() {
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin/news";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadyAdmin, setAlreadyAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) {
        setChecking(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        if (!cancelled) setChecking(false);
        return;
      }
      const { data } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).maybeSingle();
      if (!cancelled) {
        setAlreadyAdmin(data?.is_admin === true);
        setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <p className="text-white text-sm">Supabase が未設定です。`.env` を確認してください。</p>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-gray-400">
        確認中…
      </div>
    );
  }

  if (alreadyAdmin) {
    return <Navigate to={from.startsWith("/admin") ? from : "/admin/news"} replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { data } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).maybeSingle();
    setAlreadyAdmin(data?.is_admin === true);
    if (!data?.is_admin) {
      setMsg("管理者権限がありません。Supabase の profiles.is_admin を確認してください。");
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col md:flex-row items-center justify-center gap-8 px-4 py-10">
      <div className="hidden md:block w-52 lg:w-64 shrink-0 drop-shadow-xl">
        <GachinekoSticker variant="yoroshiku" className="w-full h-auto" />
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <p className="text-xs font-bold text-red-600 tracking-wider uppercase mb-1">Admin</p>
        <h1 className="text-2xl font-black text-gray-900 mb-6">GCTV 管理ログイン</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">メール</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">パスワード</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
              autoComplete="current-password"
            />
          </div>
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl disabled:opacity-50"
          >
            {busy ? "ログイン中…" : "ログイン"}
          </button>
        </form>
        <p className="mt-8 text-xs text-gray-400 leading-relaxed">
          初めてのアカウントは Supabase Dashboard → Authentication でユーザーを作成し、SQL で{" "}
          <code className="text-gray-700">profiles.is_admin = true</code> を付与してください。
        </p>
        <Link to="/" className="inline-block mt-6 text-sm text-gray-600 hover:text-red-600 font-semibold">
          ← サイトへ戻る
        </Link>
      </div>
      <div className="md:hidden w-40 shrink-0 opacity-95">
        <GachinekoSticker variant="yoroshiku" className="w-full h-auto" />
      </div>
    </div>
  );
}
