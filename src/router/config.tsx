import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { IS_STANDALONE } from "../lib/standalone";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ArticlesListPage from "../pages/articles/ArticlesListPage";
import ArticleDetailPage from "../pages/articles/ArticleDetailPage";
import AdminLogin from "../pages/admin/AdminLogin";
import RequireAdmin from "../pages/admin/RequireAdmin";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminNewsPage from "../pages/admin/AdminNewsPage";
import AdminArticleForm from "../pages/admin/AdminArticleForm";
import AdminContentsPage from "../pages/admin/AdminContentsPage";
import AdminSchedulePage from "../pages/admin/AdminSchedulePage";
import AdminRaceForm from "../pages/admin/AdminRaceForm";
import AdminShortsGalleryPage from "../pages/admin/AdminShortsGalleryPage";
import AdminShortsItemForm from "../pages/admin/AdminShortsItemForm";
import AdminTokuhainMapPage from "../pages/admin/AdminTokuhainMapPage";
import AdminTokuhainPinForm from "../pages/admin/AdminTokuhainPinForm";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/articles",
    element: <ArticlesListPage />,
  },
  {
    path: "/articles/:slug",
    element: <ArticleDetailPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const adminRoutes: RouteObject[] = [
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <RequireAdmin />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="news" replace /> },
          { path: "news", element: <AdminNewsPage /> },
          { path: "news/new", element: <AdminArticleForm /> },
          { path: "news/:id", element: <AdminArticleForm /> },
          { path: "contents", element: <AdminContentsPage /> },
          { path: "schedule", element: <AdminSchedulePage /> },
          { path: "schedule/new", element: <AdminRaceForm /> },
          { path: "schedule/:id", element: <AdminRaceForm /> },
          { path: "shorts", element: <AdminShortsGalleryPage /> },
          { path: "shorts/new", element: <AdminShortsItemForm /> },
          { path: "shorts/:id", element: <AdminShortsItemForm /> },
          { path: "tokuhain-map", element: <AdminTokuhainMapPage /> },
          { path: "tokuhain-map/:id", element: <AdminTokuhainPinForm /> },
        ],
      },
    ],
  },
];

const routes: RouteObject[] = IS_STANDALONE
  ? publicRoutes
  : [...publicRoutes.slice(0, -1), ...adminRoutes, publicRoutes[publicRoutes.length - 1]!];

export default routes;
