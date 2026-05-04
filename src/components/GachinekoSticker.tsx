import type { GachinekoVariant } from "../data/gachinekoImg";
import { gachinekoImg } from "../data/gachinekoImg";

type Props = {
  variant: GachinekoVariant;
  className?: string;
  /** 装飾用のときは true（スクリーンリーダーから隠す） */
  decorative?: boolean;
};

export default function GachinekoSticker({ variant, className = "", decorative = true }: Props) {
  return (
    <img
      src={gachinekoImg[variant]}
      alt={decorative ? "" : "ガチネコ"}
      role={decorative ? "presentation" : undefined}
      aria-hidden={decorative ? true : undefined}
      className={`object-contain select-none pointer-events-none ${className}`}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}
