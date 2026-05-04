import { useState, useRef, useCallback, useEffect } from 'react';
import GachinekoSticker from "../../../components/GachinekoSticker";
import {
  JAPAN_MAP_IMAGE_URL,
  JAPAN_MAP_ZOOM_IMG_CLASS,
  JAPAN_MAP_ZOOM_WRAP_CLASS,
} from '../../../data/japanMapImageUrl';
import { useTokuhainMapPins } from '../../../hooks/useTokuhainMapPins';

const PIN_IMG_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect fill="%23fca5a5" width="64" height="64"/><text x="32" y="38" font-size="24" text-anchor="middle" fill="white">G</text></svg>',
  );

interface Transform {
  scale: number;
  x: number;
  y: number;
}

export default function TravelMapSection() {
  const { locations, loading, source, hasPins } = useTokuhainMapPins();
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, transformX: 0, transformY: 0 });
  const hasDragged = useRef(false);
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 4;

  const clampPosition = useCallback((scale: number, x: number, y: number): { x: number; y: number } => {
    const container = containerRef.current;
    if (!container) return { x, y };
    const rect = container.getBoundingClientRect();
    const maxX = Math.max(0, rect.width * (scale - 1));
    const maxY = Math.max(0, rect.height * (scale - 1));
    return {
      x: Math.min(0, Math.max(-maxX, x)),
      y: Math.min(0, Math.max(-maxY, y))
    };
  }, []);

  const getContainerPoint = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const updateTransform = useCallback((updater: (prev: Transform) => Transform) => {
    setTransform(prev => {
      const next = updater(prev);
      const clamped = clampPosition(next.scale, next.x, next.y);
      return { scale: next.scale, ...clamped };
    });
  }, [clampPosition]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const { x, y } = getContainerPoint(e.clientX, e.clientY);
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    updateTransform(prev => {
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * delta));
      const scaleRatio = newScale / prev.scale;
      return {
        scale: newScale,
        x: x - (x - prev.x) * scaleRatio,
        y: y - (y - prev.y) * scaleRatio
      };
    });
  }, [getContainerPoint, updateTransform]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (transform.scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    hasDragged.current = false;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      transformX: transform.x,
      transformY: transform.y
    };
  }, [transform.scale, transform.x, transform.y]);

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDragged.current = true;
    }
    updateTransform(() => ({
      scale: transform.scale,
      x: dragStart.current.transformX + dx,
      y: dragStart.current.transformY + dy
    }));
  }, [isDragging, transform.scale, updateTransform]);

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      lastTouchDistance.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastTouchCenter.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };
    } else if (e.touches.length === 1 && transform.scale > 1) {
      setIsDragging(true);
      hasDragged.current = false;
      dragStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        transformX: transform.x,
        transformY: transform.y
      };
    }
  }, [transform.scale, transform.x, transform.y]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null && lastTouchCenter.current !== null) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scaleDelta = distance / lastTouchDistance.current;
      const center = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };
      const { x: containerX, y: containerY } = getContainerPoint(center.x, center.y);

      updateTransform(prev => {
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * scaleDelta));
        const scaleRatio = newScale / prev.scale;
        return {
          scale: newScale,
          x: containerX - (containerX - prev.x) * scaleRatio,
          y: containerY - (containerY - prev.y) * scaleRatio
        };
      });

      lastTouchDistance.current = distance;
      lastTouchCenter.current = center;
    } else if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasDragged.current = true;
      }
      updateTransform(() => ({
        scale: transform.scale,
        x: dragStart.current.transformX + dx,
        y: dragStart.current.transformY + dy
      }));
    }
  }, [isDragging, transform.scale, getContainerPoint, updateTransform]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    lastTouchDistance.current = null;
    lastTouchCenter.current = null;
  }, []);

  const zoomIn = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    updateTransform(prev => {
      const newScale = Math.min(MAX_SCALE, prev.scale * 1.3);
      const scaleRatio = newScale / prev.scale;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      return {
        scale: newScale,
        x: cx - (cx - prev.x) * scaleRatio,
        y: cy - (cy - prev.y) * scaleRatio
      };
    });
  }, [updateTransform]);

  const zoomOut = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    updateTransform(prev => {
      const newScale = Math.max(MIN_SCALE, prev.scale * 0.7);
      const scaleRatio = newScale / prev.scale;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      return {
        scale: newScale,
        x: cx - (cx - prev.x) * scaleRatio,
        y: cy - (cy - prev.y) * scaleRatio
      };
    });
  }, [updateTransform]);

  const resetZoom = useCallback(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const preventScroll = (e: Event) => e.preventDefault();
    el.addEventListener('touchmove', preventScroll, { passive: false });
    return () => el.removeEventListener('touchmove', preventScroll);
  }, []);

  const handlePinClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const showEmptyHint = !loading && !hasPins && source === 'db';

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:top-0 md:right-0 lg:right-2 w-32 md:w-40 lg:w-44 pointer-events-none">
            <GachinekoSticker variant="tanoshimi" className="w-full h-auto" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 pt-14 md:pt-2">
            <span className="text-red-600">GCTV特派員</span><br />
            トラベルマップ & ご当地グルメガイド
          </h2>
          <p className="text-gray-500 text-lg">全国の絶景ルートとグルメスポットを巡る</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4" />
        </div>

        {source === 'fallback' && !loading && (
          <p className="text-center text-xs text-amber-700 mb-4 max-w-3xl mx-auto">
            Supabase が未設定のため、サンプルのピンを表示しています。接続すると管理画面から内容を変更できます。
          </p>
        )}

        {showEmptyHint && (
          <p className="text-center text-sm text-gray-600 mb-4 max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            公開中のピンがまだありません。
            <a href="/admin/tokuhain-map" className="text-red-600 font-bold ml-1 underline">
              管理画面 → 特派員マップ
            </a>
            からピンを追加すると、ここに表示されます。
          </p>
        )}

        <div className="flex items-center justify-between mb-4 max-w-5xl mx-auto">
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <i className="ri-mouse-line w-4 h-4 flex items-center justify-center" />
            マウスホイールで拡大縮小 / ドラッグで移動
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={zoomOut}
              className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="縮小"
            >
              <i className="ri-subtract-line text-gray-700 w-4 h-4 flex items-center justify-center" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="px-3 h-10 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              リセット
            </button>
            <button
              type="button"
              onClick={zoomIn}
              className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="拡大"
            >
              <i className="ri-add-line text-gray-700 w-4 h-4 flex items-center justify-center" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className={`relative w-full max-w-5xl mx-auto overflow-hidden select-none ${transform.scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`relative aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-gray-200 ${loading ? 'opacity-60 pointer-events-none' : ''}`}
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transformOrigin: '0 0',
              willChange: 'transform',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <div className={JAPAN_MAP_ZOOM_WRAP_CLASS}>
              <img src={JAPAN_MAP_IMAGE_URL} alt="日本地図" className={JAPAN_MAP_ZOOM_IMG_CLASS} />
            </div>

            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <p className="text-gray-500 text-sm font-bold">マップ読み込み中…</p>
              </div>
            ) : (
              locations.map((location) => (
                <a
                  key={location.id}
                  href={location.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{ top: location.position.top, left: location.position.left }}
                  onClick={handlePinClick}
                >
                  <div className="relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-3 md:border-4 border-red-500 shadow-lg bg-white transform group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={location.image || PIN_IMG_PLACEHOLDER}
                        alt={location.reporter}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500" />
                    <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-30" />

                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                      <div className="bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                        <span className="text-red-400">{location.name}</span>
                        <span className="mx-1">-</span>
                        <span>{location.reporter}</span>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {loading ? (
          <p className="mt-12 text-center text-gray-400 text-sm">カード一覧を読み込み中…</p>
        ) : hasPins ? (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {locations.map((location) => (
              <a
                key={location.id}
                href={location.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-red-400 hover:shadow-md transition-all duration-300 group cursor-pointer flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-red-500">
                    <img
                      src={location.image || PIN_IMG_PLACEHOLDER}
                      alt={location.reporter}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 font-black text-base group-hover:text-red-600 transition-colors mb-1">
                    {location.name}
                  </h4>
                  <p className="text-gray-500 text-sm mb-1">
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{location.reporter}</span>
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {location.description}
                  </p>
                </div>
                <div className="flex-shrink-0 self-center">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors">
                    <i className="ri-play-fill text-white text-lg w-4 h-4 flex items-center justify-center" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          !showEmptyHint && (
            <p className="mt-12 text-center text-gray-400 text-sm">このセクションには表示するピンがありません。</p>
          )
        )}
      </div>
    </section>
  );
}
