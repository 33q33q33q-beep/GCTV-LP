import { useMemo } from "react";

type Item = { label: string; href: string };

export default function HomeJumpMenu() {
  const items = useMemo<Item[]>(
    () => [
      { label: "Latest News", href: "#latest-news" },
      { label: "Race & Interview", href: "#race-interview" },
      { label: "NEWS & INFORMATION", href: "#news-information" },
      { label: "VARIETY BEGINNER", href: "#variety-beginner" },
      { label: "配信予定レース", href: "#schedule-upcoming" },
      { label: "配信終了レース", href: "#schedule-ended" },
      { label: "SNS&Blog", href: "#sns-blog" },
      { label: "Community", href: "#community" },
      { label: "GCTV特派員 トラベルマップ＆ご当地グルメガイド", href: "#tokuhain-map" },
    ],
    [],
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[180] border-b border-white/10 bg-black/45 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-3 py-2">
        <ul className="flex gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-flex items-center rounded-full bg-white/10 px-3 py-2 text-xs font-black text-white/90 hover:bg-white/20 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

