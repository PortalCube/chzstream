import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

const media = window.matchMedia("(display-mode: fullscreen)");

const initialValue = media.matches;
export const isFullscreenAtom = atom(initialValue);

export function useFullscreenDetect() {
  const [_, setFullscreenAtom] = useAtom(isFullscreenAtom);

  useEffect(() => {
    const listener = ({ matches }: { matches: boolean }) => {
      setFullscreenAtom(matches);
    };

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, []);
}
