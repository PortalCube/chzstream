import { send } from "./message/content-client.ts";

export function initializeIframeEventCapture() {
  window.addEventListener("pointerdown", async (event) => {
    send("iframe-pointer-down", {
      button: event.button,
      clientX: event.clientX,
      clientY: event.clientY,
    });
  });

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

  window.addEventListener(
    "contextmenu",
    async (event) => {
      // Ctrl키를 누른 경우, 원래 메뉴를 표시
      if (event.ctrlKey === true) return;

      event.preventDefault();
      event.stopPropagation();

      send("iframe-contextmenu", {
        button: event.button,
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    { capture: true }
  );
}
