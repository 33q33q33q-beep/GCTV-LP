#!/usr/bin/env node
/**
 * 完全独立の静的HTMLパッケージを生成（Supabase・外部CDN画像なし）
 * 出力: gctv-standalone-html.zip
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PKG_MEDIA = path.join(ROOT, "public", "pkg-media");
const GENERATED = path.join(ROOT, "src", "generated", "standaloneAssets.ts");
const OUT_ZIP = path.join(ROOT, "gctv-html-package.zip");
const REMIXICON_DIR = path.join(ROOT, "public", "vendor", "remixicon");
const REMIXICON_CDN =
  "https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.min.css";

const SKIP_FILES = new Set(["llms.txt", "_redirects"]);
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

function finalizePackage(staging) {
  const indexPath = path.join(staging, "index.html");
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, "utf8");
    fs.writeFileSync(
      indexPath,
      sanitizeIndexHtml(html, firstPkgMediaRel(staging)),
      "utf8",
    );
  }

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

  const standaloneNote = `GCTV 静的HTMLパッケージ（サーバーアップロード用）
==========================================

■ 含まれるもの
  index.html … サイトの入口（HTML）
  assets/ … 表示に必要な JS・CSS
  pkg-media/ … ニュース・ヒーロー等の画像
  gachineko/ … マスコット画像
  vendor/remixicon/ … アイコン用フォント（外部CDNなし）

■ 含まれないもの
  .json ファイル、JSON-LD、Supabase、管理画面（/admin）

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

  if (fs.existsSync(OUT_ZIP)) fs.unlinkSync(OUT_ZIP);
  execSync(`cd "${staging}" && zip -r "${OUT_ZIP}" .`, { stdio: "inherit" });
  fs.rmSync(staging, { recursive: true });
}

async function main() {
  console.log("1/5 Remix Icon を同梱用に取得...");
  await ensureRemixicon();

  console.log("2/5 外部画像を収集・ダウンロード...");
  const urls = collectUrls();
  console.log(`  ${urls.length} 件`);
  const map = await downloadAll(urls);
  writeAssetMap(map);

  console.log("3/5 Vite ビルド（相対パス・スタンドアロン）...");
  execSync("npm run build", {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      BASE_PATH: "./",
      VITE_STANDALONE: "true",
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: "",
      VITE_INSTAGRAM_FEED_IFRAME_URL: "",
    },
  });

  console.log("4/5 ZIP 作成（JSON 除外・HTML 整形）...");
  zipOut();

  const stat = fs.statSync(OUT_ZIP);
  console.log(`\n完了: ${OUT_ZIP} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
