import { RequestMessage } from "@chzstream/message";
import { messageClientAtom } from "@web/hooks/useMessageClient";
import { updatePlayerControlAtom } from "@web/librarys/mixer.ts";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export function usePlayerControlListener() {
  const updatePlayerControl = useSetAtom(updatePlayerControlAtom);
  const messageClient = useAtomValue(messageClientAtom);

  useEffect(() => {
    if (messageClient === null) return;

    const onMessage = (message: RequestMessage<"video-status">) => {
      if (message.sender.type !== "content") return;
      if (message.sender.websiteId !== messageClient.id.id) return;

      updatePlayerControl(message.sender.blockId, message.data);
    };

    messageClient.on("video-status", onMessage);

    return () => {
      messageClient.remove("video-status", onMessage);
    };
  }, [messageClient]);
}
