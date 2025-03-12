import { useEffect } from "react";

// iOS Safari prevent scrolling
export function useSafariScrollPrevent() {
  useEffect(() => {
    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };

    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);
}
