import { RequestMessage } from "@chzstream/message";
import { updatePlayerControlAtom } from "@web/librarys/mixer.ts";
import { MessageClient } from "@web/scripts/message.ts";
import { useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";

export function usePlayerControlListener() {
  const updatePlayerControl = useSetAtom(updatePlayerControlAtom);

  const onMessage = useCallback(
    (message: RequestMessage<"video-status">) => {
      if (MessageClient === null) return;

      if (message.sender.type !== "content") return;
      if (message.sender.websiteId !== MessageClient.id.id) return;

      updatePlayerControl(message.sender.blockId, message.data);
    },
    [updatePlayerControl]
  );

  useEffect(() => {
    if (MessageClient !== null) {
      MessageClient.on("video-status", onMessage);
    }

    return () => {
      if (MessageClient !== null) {
        MessageClient.remove("video-status", onMessage);
      }
    };
  }, [onMessage]);
}
