import Image from "next/image";
import paperWall from "@/assets/paper-wall.jpg";
import { EntranceSequence } from "@/components/EntranceSequence";
import { FramedArtwork } from "@/components/FramedArtwork";

export default function Home() {
  return (
    <EntranceSequence
      wall={
        <>
          <Image
            src={paperWall}
            alt=""
            fill
            preload
            sizes="100vw"
            placeholder="blur"
            className="object-cover"
          />
          <div aria-hidden className="wall-light pointer-events-none absolute inset-0" />
        </>
      }
      artwork={<FramedArtwork />}
    />
  );
}
