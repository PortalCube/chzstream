import { atom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

const initialValue = window.devicePixelRatio || 1;
export const displayPixelRatioAtom = atom(initialValue);

export function useDisplayPixelRatio() {
  const setDisplayPixelRatio = useSetAtom(displayPixelRatioAtom);
  const [media, setMedia] = useState(
    window.matchMedia(`(resolution: ${initialValue}dppx)`)
  );

  useEffect(() => {
    const listener = () => {
      const newValue = window.devicePixelRatio || 1;

      setDisplayPixelRatio(newValue);
      setMedia(window.matchMedia(`(resolution: ${newValue}dppx)`));
    };

    media.addEventListener("change", listener, { once: true });

    return () => {
      media.removeEventListener("change", listener);
    };
  }, [media, setDisplayPixelRatio]);
}
