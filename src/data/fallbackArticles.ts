import type { Article } from "../domain/article";

/** Supabase 未設定時のみ表示 */
export const fallbackArticles: Article[] = [
  {
    slug: "jbcf-2024-opening-report",
    title: "JBCF 2024 開幕戦レポート：激戦のゴールスプリントを完全解説",
    excerpt:
      "今年のJBCFロードシリーズがついに開幕。開幕戦では新人選手の活躍が目立ち、最終ラップの攻防は今シーズンの展望を大きく変える結果となった。",
    category: "レースレポート",
    date: "2024年3月15日",
    publishedAt: "2024-03-15",
    image:
      "https://readdy.ai/api/search-image?query=professional%20cycling%20race%20finish%20line%20with%20cyclists%20sprinting%20at%20high%20speed%2C%20dramatic%20sports%20photography%2C%20crowd%20cheering%20in%20background%2C%20clear%20blue%20sky%2C%20road%20bicycle%20racing%20competition&width=640&height=360&seq=news-1&orientation=landscape",
    body: `開幕戦は例年通りの激戦でしたが、今年は特に若手が積極的に仕掛ける展開が印象的でした。中盤の逃げ集団と本隊のタイム差が詰まったまま最終周回に入り、狭いコーナーでのポジション争いが勝敗を分けました。

ゴール前の直線では、早めにペースを落とさせたキューレーラーたちを抜け出す形で総合力の証明となったスプリント劇となりました。今後のグランツールを見据えるチーム構成の変化も見え始めているため、続報もお見逃しなく。`,
  },
  {
    slug: "spring-scenic-spots-special",
    title: "特派員おすすめ！春の絶景サイクリングスポット7選",
    excerpt:
      "全国を飛び回るGCTV特派員たちが、春先にぜひ訪れたい絶景ルートを厳選。桜並木から海沿いコースまで、初心者から上級者まで楽しめるコースを紹介。",
    category: "特派員レポート",
    date: "2024年3月10日",
    publishedAt: "2024-03-10",
    image:
      "https://readdy.ai/api/search-image?query=beautiful%20cherry%20blossom%20cycling%20path%20with%20cyclist%20riding%20along%20riverbank%20in%20spring%2C%20scenic%20Japanese%20landscape%20with%20pink%20sakura%20trees%2C%20peaceful%20rural%20road%20photography&width=640&height=360&seq=news-2&orientation=landscape",
    body: `春のライドは気温と景色のバランスが絶好です。特派員各員から寄せられたルートでは、河岸の一本桜、湖岸のフラットセクション、アップダウンの少ないグルメサイコロジーなどバリエーション豊かでした。

安全面では週末の交通量ピークを避ける時間帯、補給できる拠点の事前確認を推奨します。詳細マップや標高グラフが必要な場合は、コミュニティ欄でのリクエストもお待ちしています。

選出ルートは今後動画コンテンツでも随時公開予定です。`,
  },
  {
    slug: "first-road-bike-guide",
    title: "初心者必見！はじめてのロードバイク選び完全ガイド",
    excerpt:
      "初めてロードバイクを買うときに迷うポイントを総まとめ。フレーム素材、コンポーネント、サイズ選びから予算別おすすめモデルまで徹底解説。",
    category: "初心者向け",
    date: "2024年3月5日",
    publishedAt: "2024-03-05",
    image:
      "https://readdy.ai/api/search-image?query=beginner%20cyclist%20with%20brand%20new%20road%20bicycle%20in%20front%20of%20bike%20shop%2C%20happy%20person%20holding%20modern%20racing%20bike%2C%20bright%20cheerful%20atmosphere%2C%20cycling%20lifestyle%20photography&width=640&height=360&seq=news-3&orientation=landscape",
    body: `予算レンジによって最適なフレーム材とグループセットの組み合わせが変わります。まず試乗できる店舗を確保し、サドル高とリーチのフィッティング感覚を掴んでからモデル検討に入ることをおすすめします。

メンテナンスのしやすさを重視するならキャリパーブレーキ＋リムブレーキモデル、アップデート耐性を優先するなら油圧ディスクとスルーアクスル構成が現実的です。

サイズ選択ではメーカーのジオメトリ表と実測ステム長を見比べ、「すぐハンドルが遠く感じないか」を優先しましょう。`,
  },
];
