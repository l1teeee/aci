"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const WALL_FADE_SECONDS = 1.4;
const ARTWORK_RISE_SECONDS = 1.2;
// The artwork starts just before the wall settles so both moves read as one gesture.
const ARTWORK_OVERLAP_SECONDS = 0.25;

type EntranceSequenceProps = {
  wall: ReactNode;
  artwork: ReactNode;
};

export function EntranceSequence({ wall, artwork }: EntranceSequenceProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scene = sceneRef.current;
      const wallLayer = wallRef.current;
      const artworkLayer = artworkRef.current;
      if (!scene || !wallLayer || !artworkLayer) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([wallLayer, artworkLayer], { autoAlpha: 1 });
        return;
      }

      const timeline = gsap
        .timeline({ paused: true })
        .fromTo(
          wallLayer,
          { autoAlpha: 0, scale: 1.04 },
          { autoAlpha: 1, scale: 1, duration: WALL_FADE_SECONDS, ease: "power2.out", clearProps: "transform" },
        )
        .fromTo(
          artworkLayer,
          { autoAlpha: 0, y: 32, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: ARTWORK_RISE_SECONDS, ease: "power3.out", clearProps: "transform" },
          `-=${ARTWORK_OVERLAP_SECONDS}`,
        );

      // Start only when both photos can paint; a failed image must not leave the page hidden.
      let isCancelled = false;
      const images = Array.from(scene.querySelectorAll("img"));
      void Promise.allSettled(images.map((image) => image.decode())).then(() => {
        if (!isCancelled) timeline.play();
      });

      return () => {
        isCancelled = true;
      };
    },
    { scope: sceneRef },
  );

  return (
    <main ref={sceneRef} className="relative grid min-h-svh place-items-center overflow-hidden">
      <div ref={wallRef} className="invisible absolute inset-0 opacity-0">
        {wall}
      </div>
      <div ref={artworkRef} className="invisible relative opacity-0">
        {artwork}
      </div>
    </main>
  );
}
