import { NavLink, Outlet, useNavigate } from "react-router-dom";
import GachinekoSticker from "../../components/GachinekoSticker";
import { supabase } from "../../lib/supabase";

export default function AdminLayout() {
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase?.auth.signOut();
    navigate("/admin/login");
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-lg text-sm font-bold ${isActive ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100"}`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <aside className="md:w-56 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4 md:min-h-screen shrink-0">
        <div className="font-black text-gray-900 mb-6 px-2">GCTV CMS</div>
        <nav className="flex flex-wrap md:flex-col gap-1">
          <NavLink to="/admin/news" end className={linkCls}>
            NEWS 記事
          </NavLink>
          <NavLink to="/admin/contents" className={linkCls}>
            Contents URL
          </NavLink>
          <NavLink to="/admin/schedule" end className={linkCls}>
            配信スケジュール
          </NavLink>
          <NavLink to="/admin/shorts" end className={linkCls}>
            TikTok / Shorts
          </NavLink>
          <NavLink to="/admin/tokuhain-map" end className={linkCls}>
            特派員マップ
          </NavLink>
        </nav>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-6 w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-red-600 font-semibold"
        >
          ログアウト
        </button>
        <NavLink to="/" className="block mt-4 px-4 text-xs text-gray-400 hover:text-red-600">
          公開サイトへ
        </NavLink>
        <div className="mt-8 px-2 hidden md:block">
          <div className="w-36 mx-auto opacity-90">
            <GachinekoSticker variant="nyaruhodo" className="w-full h-auto" />
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2 leading-tight">ガチネコも応援中</p>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
