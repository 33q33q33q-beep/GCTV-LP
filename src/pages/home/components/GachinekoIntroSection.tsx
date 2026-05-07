import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import GachinekoSticker from "../../../components/GachinekoSticker";
import type { GachinekoVariant } from "../../../data/gachinekoImg";

export default function GachinekoIntroSection() {
  const { t } = useTranslation();

  const showcase = useMemo(
    () =>
      (
        ["iine", "omedeto", "onigiri", "gorogoro"] as const
      ).map((variant) => ({
        variant,
        caption: t(`mascot.caption.${variant}`),
      })),
    [t],
  );

  return (
    <section id="mascot" className="border-b border-rose-100 bg-gradient-to-b from-white via-rose-50/70 to-white px-4 pt-8 pb-14">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <p className="text-xs font-black tracking-[0.2em] text-red-600 uppercase mb-2">
          {t("mascot.sectionLabel")}
        </p>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto font-bold">
          {t("mascot.intro")}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-end justify-items-center">
        {showcase.map(({ variant, caption }) => (
          <figure key={variant} className="flex flex-col items-center gap-3 w-full max-w-[15rem] sm:max-w-xs">
            <div className="w-full drop-shadow-lg">
              <GachinekoSticker variant={variant as GachinekoVariant} className="w-full h-auto" />
            </div>
            <figcaption className="text-xs md:text-sm font-bold text-gray-400">{caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
