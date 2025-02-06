import { useEffect } from "react";
import { useLayout } from "src/librarys/layout.ts";

export function useShortcutKey() {
  const { switchLayoutMode } = useLayout();

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
