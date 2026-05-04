import GachinekoSticker from "../../../components/GachinekoSticker";
import type { GachinekoVariant } from "../../../data/gachinekoImg";

const SHOWCASE: { variant: GachinekoVariant; caption: string }[] = [
  { variant: "gorogoro", caption: "ゴロゴロ！" },
  { variant: "onigiri", caption: "補給タイム" },
  { variant: "ganbaru", caption: "がんばるニャ" },
  { variant: "tanoshimi", caption: "たのしみニャ！" },
];

export default function GachinekoIntroSection() {
  return (
    <section className="border-b border-rose-100 bg-gradient-to-b from-white via-rose-50/70 to-white px-4 pt-8 pb-14">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <p className="text-xs font-black tracking-[0.2em] text-red-600 uppercase mb-2">Mascot</p>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto font-bold">
          公式マスコット「ガチネコ」
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-end justify-items-center">
        {SHOWCASE.map(({ variant, caption }) => (
          <figure key={variant} className="flex flex-col items-center gap-3 w-full max-w-[15rem] sm:max-w-xs">
            <div className="w-full drop-shadow-lg">
              <GachinekoSticker variant={variant} className="w-full h-auto" />
            </div>
            <figcaption className="text-xs md:text-sm font-bold text-gray-400">{caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
