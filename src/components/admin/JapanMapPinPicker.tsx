import { useState } from "react";
import GachinekoSticker from "../GachinekoSticker";
import {
  JAPAN_MAP_IMAGE_URL,
  JAPAN_MAP_ZOOM_IMG_CLASS,
  JAPAN_MAP_ZOOM_WRAP_CLASS,
} from "../../data/japanMapImageUrl";
import { latLngToJapanMapPinPercent } from "../../lib/japanMapGeo";
import { geocodeAddressJa } from "../../services/addressGeocode";

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n));
}

type Props = {
  pinX: number;
  pinY: number;
  onChange: (x: number, y: number) => void;
  /** 他ピン位置の参考（薄く表示） */
  otherPins?: { x: number; y: number; label?: string }[];
  /** 住所・地名からピン位置を推定（Photon 検索） */
  enableAddressLookup?: boolean;
};

/** 地図をクリックするか、住所入力で PIN 座標（0–100%）を指定 */
export default function JapanMapPinPicker({
  pinX,
  pinY,
  onChange,
  otherPins = [],
  enableAddressLookup = true,
}: Props) {
  const [addr, setAddr] = useState("");
  const [geoBusy, setGeoBusy] = useState(false);
  const [geoNote, setGeoNote] = useState<string | null>(null);

  const applyAddressToPin = async () => {
    setGeoNote(null);
    setGeoBusy(true);
    try {
      const hit = await geocodeAddressJa(addr);
      if (!hit) {
        setGeoNote(
          "該当する場所が見つかりませんでした。別の表記で試すか、地図をクリックして位置を指定してください。",
        );
        return;
      }
      const { x, y } = latLngToJapanMapPinPercent(hit.lat, hit.lng);
      onChange(x, y);
      setGeoNote(`「${hit.label}」付近に配置しました（イラスト地図との誤差があるため、必要ならクリックで微調整してください）`);
    } catch (e) {
      setGeoNote(e instanceof Error ? e.message : "検索に失敗しました");
    } finally {
      setGeoBusy(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = clampPct(((e.clientX - r.left) / r.width) * 100);
    const y = clampPct(((e.clientY - r.top) / r.height) * 100);
    onChange(x, y);
  };

  return (
    <div className="space-y-2">
      {enableAddressLookup ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4 mb-3 space-y-2 relative overflow-hidden">
          <div className="absolute -right-1 -bottom-1 w-24 sm:w-28 opacity-90">
            <GachinekoSticker variant="nyaruhodo" className="w-full h-auto" />
          </div>
          <p className="text-xs font-bold text-gray-600 pr-20 sm:pr-24">住所・地名で位置を決める</p>
          <p className="text-xs text-gray-500 pr-20 sm:pr-28 relative z-[1]">
            郵便番号・市区町村・番地・施設名などを入力して検索できます。地図は枠内で拡大表示しています。住所からの位置はイラストに合わせて推定しますが誤差は出ます。
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void applyAddressToPin();
                }
              }}
              placeholder="例: 香川県小豆島町 または 東京都千代田区丸の内1丁目"
              className="flex-1 min-w-0 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              disabled={geoBusy}
            />
            <button
              type="button"
              onClick={() => void applyAddressToPin()}
              disabled={geoBusy || !addr.trim()}
              className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {geoBusy ? "検索中…" : "地図に反映"}
            </button>
          </div>
          {geoNote ? <p className="text-xs text-gray-700 whitespace-pre-wrap">{geoNote}</p> : null}
        </div>
      ) : null}

      <p className="text-xs text-gray-600">
        地図をクリックしてピンの位置を決めることもできます（左=西・右=東、上=北・下=南の割合）。
      </p>
      <div className="mx-auto w-full max-w-[min(100%,60rem)]">
        <div
          onClick={handleClick}
          className="relative aspect-[4/3] w-full cursor-crosshair select-none overflow-hidden rounded-xl border-2 border-dashed border-red-300 bg-gray-50"
        >
          <div className={JAPAN_MAP_ZOOM_WRAP_CLASS}>
            <img src={JAPAN_MAP_IMAGE_URL} alt="" className={JAPAN_MAP_ZOOM_IMG_CLASS} />
          </div>
          {otherPins.map((p, i) => (
            <div
              key={i}
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-600 bg-blue-400/50 pointer-events-none md:h-3.5 md:w-3.5"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              title={p.label}
            />
          ))}
          <div
            className="absolute z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red-600 shadow-lg pointer-events-none md:h-6 md:w-6"
            style={{ left: `${pinX}%`, top: `${pinY}%` }}
          />
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          左右 X%
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={Math.round(pinX * 100) / 100}
            onChange={(e) => onChange(clampPct(Number(e.target.value) || 0), pinY)}
            className="w-24 border rounded px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2">
          上下 Y%
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={Math.round(pinY * 100) / 100}
            onChange={(e) => onChange(pinX, clampPct(Number(e.target.value) || 0))}
            className="w-24 border rounded px-2 py-1"
          />
        </label>
      </div>
    </div>
  );
}
