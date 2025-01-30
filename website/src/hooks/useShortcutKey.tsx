import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { isFullscreenAtom } from "./useFullscreenDetect.tsx";
import {
  activateBlockStatus,
  ApplicationMode,
  applicationModeAtom,
  blockListAtom,
} from "src/librarys/grid.ts";

export function useShortcutKey() {
  const [isFullscreen] = useAtom(isFullscreenAtom);
  const [mode, setMode] = useAtom(applicationModeAtom);
  const [blockList, setBlockList] = useAtom(blockListAtom);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F9") {
        if (mode === ApplicationMode.View) {
          setMode(ApplicationMode.Modify);
        } else if (mode === ApplicationMode.Modify) {
          setMode(ApplicationMode.View);
          setBlockList(activateBlockStatus());
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mode]);
}
