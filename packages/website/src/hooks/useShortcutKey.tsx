import { switchLayoutModeAtom } from "@web/librarys/layout.ts";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export function useShortcutKey() {
  const switchLayoutMode = useSetAtom(switchLayoutModeAtom);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F9") {
        switchLayoutMode();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [switchLayoutMode]);
}
