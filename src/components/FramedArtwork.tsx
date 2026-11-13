import Image from "next/image";
import frame from "@/assets/frame.png";
import { DitherShapesCanvas } from "@/components/dither-shapes/DitherShapesCanvas";

// Where the blank paper sits inside src/assets/frame.png, in source pixels from each edge.
const PAPER_INSET_PX = { top: 42, right: 44, bottom: 44, left: 43 };

const paperInset = {
  top: `${(PAPER_INSET_PX.top / frame.height) * 100}%`,
  right: `${(PAPER_INSET_PX.right / frame.width) * 100}%`,
  bottom: `${(PAPER_INSET_PX.bottom / frame.height) * 100}%`,
  left: `${(PAPER_INSET_PX.left / frame.width) * 100}%`,
};

// A small picture on a large wall: the frame may use at most this share of the viewport on each axis.
const MAX_VIEWPORT_WIDTH_SHARE = 52;
const MAX_VIEWPORT_HEIGHT_SHARE = 44;

// Frame width, in viewport-height units, when the height share is the limit.
const widthAtMaxHeight = (MAX_VIEWPORT_HEIGHT_SHARE * frame.width) / frame.height;

const frameWidth = `min(${MAX_VIEWPORT_WIDTH_SHARE}vw, ${widthAtMaxHeight}svh)`;
const frameAspectRatio = `${frame.width} / ${frame.height}`;
const frameSizes = `(orientation: landscape) ${Math.ceil(widthAtMaxHeight)}vh, ${MAX_VIEWPORT_WIDTH_SHARE}vw`;

// The outer div is a size container so the frame's shadow, written in cqw, scales with the frame.
export function FramedArtwork() {
  return (
    <div className="@container" style={{ width: frameWidth }}>
      <figure className="relative w-full shadow-frame" style={{ aspectRatio: frameAspectRatio }}>
        <Image src={frame} alt="" loading="eager" sizes={frameSizes} className="block size-full" />
        <div className="@container absolute" style={paperInset}>
          <div className="flex h-full flex-col px-[5.7cqw] pt-[5.7cqw] pb-[8.6cqw]">
            <div className="aspect-square min-h-0 w-full">
              <DitherShapesCanvas className="block size-full text-ink [image-rendering:pixelated]" />
            </div>
            <div className="mt-auto flex shrink-0 items-start justify-between font-mono leading-none">
              <div>
                <p className="text-[length:max(2.2cqw,9px)] font-medium text-caption">what is not</p>
                <p className="mt-[1.65cqw] text-[length:max(1.9cqw,8px)] text-caption-muted">291 &middot; 06</p>
              </div>
              <p className="text-[length:max(2.2cqw,9px)] text-caption-muted">otras.formas</p>
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
}
