import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { refreshChannelAtom } from "@web/librarys/layout.ts";

export function useRefreshChannel() {
  const refreshChannel = useSetAtom(refreshChannelAtom);

  useEffect(() => {
    const interval = setInterval(refreshChannel, 100);
    return () => clearInterval(interval);
  }, []);
}
