import { contentClient } from "./message/iframe-client.ts";

export function initializeIframeEventCapture() {
  window.addEventListener("pointermove", async (event) => {
    contentClient.send("iframe-pointer-move", {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  });
}
