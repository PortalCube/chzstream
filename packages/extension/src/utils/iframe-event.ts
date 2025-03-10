import { send } from "./message/content-client.ts";

export function initializeIframeEventCapture() {
  window.addEventListener("pointermove", async (event) => {
    send("iframe-pointer-move", {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  });
}
