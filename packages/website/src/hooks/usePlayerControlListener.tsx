import { ClientMessageEvent, PlayerControlMessage } from "@chzstream/message";
import { useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { updatePlayerControlAtom } from "@web/librarys/mixer.ts";
import { getIframeId, MessageClient } from "@web/scripts/message.ts";

export function usePlayerControlListener() {
  const updatePlayerControl = useSetAtom(updatePlayerControlAtom);

  const onMessage = useCallback(
    ({ detail: message }: ClientMessageEvent<PlayerControlMessage>) => {
      if (message.sender === null) return;

      const id = getIframeId(message.sender);
      if (id === null) return;

      updatePlayerControl(id, message.data);
    },
    [updatePlayerControl]
  );

  useEffect(() => {
    MessageClient.addEventListener("player-control", onMessage);

    return () => {
      MessageClient.removeEventListener("player-control", onMessage);
    };
  }, [onMessage]);
}
