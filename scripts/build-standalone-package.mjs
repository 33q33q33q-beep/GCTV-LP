#!/usr/bin/env node
/**
 * 完全独立の静的HTMLパッケージを生成（Supabase・外部CDN画像なし）
 * 出力: gctv-public-package.zip（gctv-html-package.zip も同内容で生成）
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PKG_MEDIA = path.join(ROOT, "public", "pkg-media");
const GENERATED = path.join(ROOT, "src", "generated", "standaloneAssets.ts");
const OUTPUT_ZIPS = [
  path.join(ROOT, "gctv-public-package.zip"),
  path.join(ROOT, "gctv-html-package.zip"),
];
const REMIXICON_DIR = path.join(ROOT, "public", "vendor", "remixicon");
const REMIXICON_CDN =
  "https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.min.css";

const SKIP_FILES = new Set([
  "llms.txt",
  "_redirects",
  "vercel.json",
  "PUBLIC_PACKAGE.md",
]);

function loadDotEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}
const SKIP_EXT = new Set([".json", ".map"]);

const URL_RE =
  /https:\/\/(?:readdy\.ai|static\.readdy\.ai|img\.youtube\.com)[^\s"'`)\\]+/g;

const SCAN_PATHS = [
  path.join(ROOT, "src"),
  path.join(ROOT, "index.html"),
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    files.push(dir);
    return files;
  }
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === "generated") continue;
    walk(path.join(dir, name), files);
  }
  return files;
}

function collectUrls() {
  const urls = new Set();
  for (const p of SCAN_PATHS) {
    const list = fs.statSync(p).isDirectory() ? walk(p) : [p];
    for (const file of list) {
      if (!/\.(tsx?|html)$/.test(file)) continue;
      const text = fs.readFileSync(file, "utf8");
      for (const m of text.matchAll(URL_RE)) urls.add(m[0]);
    }
  }
  return [...urls];
}

function extFromUrl(url, contentType) {
  if (contentType?.includes("png")) return ".png";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return ".jpg";
  if (contentType?.includes("webp")) return ".webp";
  if (url.includes(".png")) return ".png";
  if (url.includes(".jpg") || url.includes(".jpeg")) return ".jpg";
  return ".jpg";
}

async function downloadAll(urls) {
  fs.mkdirSync(PKG_MEDIA, { recursive: true });
  const map = {};
  let i = 0;
  for (const url of urls) {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      console.warn(`skip (${res.status}): ${url.slice(0, 80)}...`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = extFromUrl(url, res.headers.get("content-type") ?? "");
    const name = `m${String(i).padStart(3, "0")}${ext}`;
    i += 1;
    fs.writeFileSync(path.join(PKG_MEDIA, name), buf);
    map[url] = `pkg-media/${name}`;
    process.stdout.write(`  ${name}\n`);
  }
  return map;
}

function writeAssetMap(map) {
  const lines = Object.entries(map)
    .map(([url, rel]) => `  ${JSON.stringify(url)}: ${JSON.stringify(rel)},`)
    .join("\n");
  fs.mkdirSync(path.dirname(GENERATED), { recursive: true });
  fs.writeFileSync(
    GENERATED,
    `/** 自動生成 — scripts/build-standalone-package.mjs */\nexport const STANDALONE_ASSETS: Record<string, string> = {\n${lines}\n};\n`,
  );
}

async function ensureRemixicon() {
  fs.mkdirSync(path.join(REMIXICON_DIR, "fonts"), { recursive: true });
  const cssPath = path.join(REMIXICON_DIR, "remixicon.min.css");
  if (!fs.existsSync(cssPath)) {
    const res = await fetch(REMIXICON_CDN);
    if (!res.ok) throw new Error(`remixicon CSS: ${res.status}`);
    fs.writeFileSync(cssPath, Buffer.from(await res.arrayBuffer()));
  }
  const css = fs.readFileSync(cssPath, "utf8");
  const fontUrls = [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)]
    .map((m) => m[1])
    .filter((u) => !u.startsWith("data:"));
  for (const rel of fontUrls) {
    const file = rel.replace(/^\.\//, "");
    const dest = path.join(REMIXICON_DIR, file);
    if (fs.existsSync(dest)) continue;
    const url = `https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/${path.basename(file)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`remixicon font ${file}: ${res.status}`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  }
}

function shouldSkipFile(name) {
  if (SKIP_FILES.has(name)) return true;
  const ext = path.extname(name).toLowerCase();
  return SKIP_EXT.has(ext);
}

function firstPkgMediaRel(staging) {
  const dir = path.join(staging, "pkg-media");
  if (!fs.existsSync(dir)) return "./gachineko/iine.png";
  const file = fs
    .readdirSync(dir)
    .find((n) => /\.(png|jpe?g|webp)$/i.test(n));
  return file ? `./pkg-media/${file}` : "./gachineko/iine.png";
}

function sanitizeIndexHtml(html, ogImageRel) {
  let out = html;
  out = out.replace(
    /<!-- Structured Data \(JSON-LD\) -->[\s\S]*?<\/script>\s*/i,
    "",
  );
  out = out.replace(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
    "",
  );
  out = out.replace(REMIXICON_CDN, "./vendor/remixicon/remixicon.min.css");
  out = out.replace(/href="\/vite\.svg"/, 'href="./gachineko/iine.png"');
  out = out.replace(
    /https:\/\/static\.readdy\.ai\/[^\s"']+/g,
    ogImageRel,
  );
  return out;
}

function purgeJsonArtifacts(staging) {
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (shouldSkipFile(name)) fs.unlinkSync(p);
    }
  };
  walk(staging);

  const indexPath = path.join(staging, "index.html");
  if (!fs.existsSync(indexPath)) return;
  const html = fs.readFileSync(indexPath, "utf8");
  const cleaned = sanitizeIndexHtml(html, firstPkgMediaRel(staging));
  if (/application\/ld\+json/i.test(cleaned)) {
    throw new Error("index.html に JSON-LD が残っています");
  }
  fs.writeFileSync(indexPath, cleaned, "utf8");
}

function finalizePackage(staging) {
  purgeJsonArtifacts(staging);

  const htaccess = path.join(staging, ".htaccess");
  if (fs.existsSync(htaccess)) {
    fs.copyFileSync(htaccess, path.join(staging, "htaccess.txt"));
  }
}

function zipOut() {
  const staging = path.join(ROOT, ".standalone-staging");
  if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true });
  fs.mkdirSync(staging, { recursive: true });

  const copyRecursive = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      if (shouldSkipFile(name)) continue;
      const s = path.join(src, name);
      const d = path.join(dest, name);
      if (fs.statSync(s).isDirectory()) copyRecursive(s, d);
      else if (!shouldSkipFile(path.basename(s))) fs.copyFileSync(s, d);
    }
  };
  copyRecursive(path.join(ROOT, "out"), staging);
  finalizePackage(staging);

  const readmeDeploy = path.join(ROOT, "deploy", "SERVER_UPLOAD_README.txt");
  const cmsReadme = path.join(ROOT, "deploy", "CMS_README.txt");
  if (fs.existsSync(readmeDeploy)) {
    fs.copyFileSync(readmeDeploy, path.join(staging, "SERVER_UPLOAD_README.txt"));
  }
  if (fs.existsSync(cmsReadme)) {
    fs.copyFileSync(cmsReadme, path.join(staging, "CMS_README.txt"));
  }

  const standaloneNote = `GCTV 静的HTMLパッケージ（サーバーアップロード用）
==========================================

■ 含まれるもの
  index.html … サイトの入口（HTML）
  assets/ … 公開ページ＋管理画面 CMS（/admin）の JS・CSS
  pkg-media/ … ニュース・ヒーロー等の画像
  gachineko/ … マスコット画像
  vendor/remixicon/ … アイコン用フォント（外部CDNなし）
  CMS_README.txt … 管理画面の使い方

■ 管理画面
  /admin/login からログイン（Supabase 設定済みビルドのみ）

■ 含まれないもの
  .json ファイル、JSON-LD

■ アップロード手順
  1. この ZIP を解凍する（ZIP そのものを置かない）
  2. 解凍して出たファイル・フォルダをすべて、公開フォルダ
     （public_html / www / htdocs など）にアップロードする
  3. index.html と同じ階層に assets フォルダがあることを確認する
  4. ブラウザで https://あなたのドメイン/ を開く

■ Apache でトップ以外のURLが 404 になる場合
  htaccess.txt を .htaccess にリネームして同じ場所に置く

■ 動作確認
  file:// で開くと動かないことがあります。必ず Web サーバー経由で確認してください。

`;
  fs.writeFileSync(path.join(staging, "README.txt"), standaloneNote, "utf8");

  for (const zipPath of OUTPUT_ZIPS) {
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    execSync(`cd "${staging}" && zip -r "${zipPath}" .`, { stdio: "inherit" });
  }
  fs.rmSync(staging, { recursive: true });
  return OUTPUT_ZIPS;
}

async function main() {
  console.log("1/5 Remix Icon を同梱用に取得...");
  await ensureRemixicon();

  console.log("2/5 外部画像を収集・ダウンロード...");
  const urls = collectUrls();
  console.log(`  ${urls.length} 件`);
  const map = await downloadAll(urls);
  writeAssetMap(map);

  const dotenv = loadDotEnv(path.join(ROOT, ".env"));
  const supabaseUrl =
    dotenv.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const supabaseKey =
    dotenv.VITE_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";
  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      "⚠ .env に VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY がありません。",
    );
    console.warn("  公開サイトはデモデータ、管理画面 CMS はログインできません。");
  } else {
    console.log("  Supabase 設定をビルドに埋め込みます（管理画面 CMS 用）");
  }

  console.log("3/5 Vite ビルド（相対パス・CMS同梱）...");
  execSync("npm run build", {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      BASE_PATH: "./",
      VITE_STANDALONE: "true",
      VITE_SUPABASE_URL: supabaseUrl,
      VITE_SUPABASE_ANON_KEY: supabaseKey,
      VITE_INSTAGRAM_FEED_IFRAME_URL:
        dotenv.VITE_INSTAGRAM_FEED_IFRAME_URL ??
        process.env.VITE_INSTAGRAM_FEED_IFRAME_URL ??
        "",
    },
  });

  console.log("4/5 ZIP 作成（JSON 除外・HTML 整形）...");
  zipOut();

  for (const zipPath of zipOut()) {
    const stat = fs.statSync(zipPath);
    console.log(`\n完了: ${zipPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
