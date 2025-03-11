import { send } from "./message/content-client.ts";

export function initializeIframeEventCapture() {
  window.addEventListener("pointermove", async (event) => {
    send("iframe-pointer-move", {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  });

  window.addEventListener("keydown", async (event) => {
    send("iframe-key-down", {
      key: event.key,
    });

    if (event.key === "F11") {
      // prevent browser native fullscreen
      // event.preventDefault();
    }
  });
}
