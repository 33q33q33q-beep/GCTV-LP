import { useEffect, useRef } from 'react';

const FB_PAGE = 'https://www.facebook.com/GACHINKOCYCLETV';

declare global {
  interface Window {
    twttr?: { widgets?: { load: (el?: Element | null) => void } };
    tiktokEmbed?: { lib?: { render: (container: Element | null | undefined) => void } };
  }
}

/** Meta 公式ページプラグイン。タイムラインは Facebook 側が更新されます。 */
export function FacebookTimelineEmbed({ minHeight = 520 }: { minHeight?: number }) {
  const href = FB_PAGE;
  const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(href)}&tabs=timeline&width=500&height=${minHeight}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white border border-blue-100 min-h-[400px]">
      <iframe
        title="Facebook Page"
        src={src}
        width="500"
        height={minHeight}
        style={{ border: 'none', overflow: 'hidden', width: '100%', minHeight }}
        scrolling="no"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        className="max-w-full"
      />
    </div>
  );
}

/** SnapWidget・Elfsight 等が発行する「フィード iframe の src」を .env で渡すとここに表示 */
export function InstagramFeedIframe({
  iframeSrc,
  minHeight = 540,
}: {
  iframeSrc: string;
  minHeight?: number;
}) {
  return (
    <iframe
      title="Instagram feed"
      src={iframeSrc}
      className="w-full rounded-2xl border border-pink-100 bg-white block"
      style={{ minHeight, border: 0 }}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}

const TIKTOK_EMBED_SRC = 'https://www.tiktok.com/embed.js';

/** TikTok 公式 creator 埋め込み（embed.js + blockquote.tiktok-embed） */
export function TikTokCreatorEmbed({ username }: { username: string }) {
  const clean = username.replace(/^@/, '');
  const blockRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const runRender = () => {
      try {
        window.tiktokEmbed?.lib?.render(blockRef.current);
      } catch {
        /* ignore */
      }
    };

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TIKTOK_EMBED_SRC}"]`);
    if (existing) {
      if (window.tiktokEmbed?.lib) {
        runRender();
        const t = window.setTimeout(runRender, 300);
        return () => window.clearTimeout(t);
      }
      existing.addEventListener('load', runRender, { once: true });
      return undefined;
    }

    const scr = document.createElement('script');
    scr.src = TIKTOK_EMBED_SRC;
    scr.async = true;
    scr.onload = runRender;
    document.body.appendChild(scr);
    return undefined;
  }, [clean]);

  const cite = `https://www.tiktok.com/@${clean}`;
  const embedHref = `${cite}?refer=creator_embed`;

  return (
    <blockquote
      ref={blockRef}
      className="tiktok-embed mx-auto"
      cite={cite}
      data-unique-id={clean}
      data-embed-type="creator"
      style={{ maxWidth: 780, minWidth: 288 }}
    >
      <section>
        <a target="_blank" rel="noopener noreferrer" href={embedHref}>
          @{clean}
        </a>
      </section>
    </blockquote>
  );
}

const TWITTER_WIDGETS_SRC = 'https://platform.twitter.com/widgets.js';

/** 公式埋め込みジェネレーター相当（デフォルトは GachinkoCycleTV + ref_src） */
export const DEFAULT_TWITTER_TIMELINE_HREF =
  'https://twitter.com/GachinkoCycleTV?ref_src=twsrc%5Etfw';

function loadTwitterWidgets(container: HTMLElement | null) {
  if (!container) return;
  try {
    window.twttr?.widgets?.load(container);
  } catch {
    /* ignore */
  }
}

/** X（Twitter）公式タイムライン埋め込み（twitter-timeline アンカー + platform.twitter.com/widgets.js） */
export function TwitterTimelineEmbed({
  timelineHref = DEFAULT_TWITTER_TIMELINE_HREF,
  linkLabel = 'Tweets by GachinkoCycleTV',
  minHeight = 480,
}: {
  timelineHref?: string;
  linkLabel?: string;
  /** 埋め込み枠の最小高さ（px）。SNS4列表示などで小さくする */
  minHeight?: number;
}) {
  const href = timelineHref.trim();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const runLoad = () => {
      const el = containerRef.current;
      if (!el) return;
      loadTwitterWidgets(el);
      window.setTimeout(() => loadTwitterWidgets(el), 400);
    };

    if (window.twttr?.widgets) {
      runLoad();
      return undefined;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TWITTER_WIDGETS_SRC}"]`);
    if (existing) {
      if (window.twttr?.widgets) {
        runLoad();
      } else {
        existing.addEventListener('load', runLoad, { once: true });
      }
      return undefined;
    }

    const script = document.createElement('script');
    script.src = TWITTER_WIDGETS_SRC;
    script.async = true;
    script.charset = 'utf-8';
    script.onload = runLoad;
    document.body.appendChild(script);
    return undefined;
  }, [href]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-2xl bg-slate-950/50"
      style={{ minHeight }}
    >
      <a className="twitter-timeline" href={href}>
        {linkLabel}
      </a>
    </div>
  );
}
