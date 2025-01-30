import { sendPointerMove } from "./message/iframe-client.ts";

export function initializeIframeEventCapture() {
  window.addEventListener("pointermove", async (event) => {
    await sendPointerMove(event.clientX, event.clientY);
  });
}
