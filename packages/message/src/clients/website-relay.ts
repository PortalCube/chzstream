import {
  isHandshakeRequest,
  isHandshakeResponse,
  isMessage,
} from "@message/messages/base.ts";
import { ClientId } from "./base.ts";

class WebsiteRelay {
  id: ClientId;
  port: chrome.runtime.Port;

  constructor(id: ClientId, port: chrome.runtime.Port) {
    this.id = id;
    this.port = port;

    window.addEventListener("@chzstream/send", this.onSend.bind(this));
    port.onMessage.addListener(this.onReceive.bind(this));
  }

  /**
   * Website Client에서 Message를 수신하여 Background Client로 전달합니다.
   * @param event Message가 담긴 Custom Event
   */
  onSend(event: CustomEventInit<unknown>): void {
    const { detail: message } = event;

    if (isMessage(message) === false) return;

    // 다른 Website Client가 보낸 Message
    if (message.sender.index !== this.id.index) return;

    this.port.postMessage(message);
  }

  /**
   * Background Client에서 Message를 수신하여 Website Client로 전달합니다.
   * @param message chrome.runtime.Port를 통해서 전달받은 Message
   * @param port chrome.runtime.Port
   */
  onReceive(message: unknown, port: chrome.runtime.Port): void {
    if (isMessage(message) === false) return;

    window.dispatchEvent(
      new CustomEvent("@chzstream/receive", {
        detail: message,
      })
    );
  }
}

/**
 * Content Script에 Website Relay를 등록합니다.
 */
export async function createWebsiteRelay() {
  // Handshake를 받으면, 새로운 Website Relay를 생성합니다.
  window.addEventListener(
    "@chzstream/handshake-request",
    async (event: CustomEventInit<unknown>) => {
      const message = event.detail;

      // Handshake Request를 Background Client로 전달합니다.
      if (isHandshakeRequest(message) === false) return;
      if (message.type !== "website") return;
      const clientId: unknown = await chrome.runtime.sendMessage(message);

      // 요청이 성공하여 Handshake Response를 받으면 Connection을 구성합니다.
      if (isHandshakeResponse(clientId) === false) return;
      const port = chrome.runtime.connect({ name: "website-client" });

      // 전달받은 ClientId와 생성한 Connection으로 Relay 인스턴스를 생성합니다.
      new WebsiteRelay(clientId, port);

      // Handshake Response를 Website Client로 전달합니다.
      window.dispatchEvent(
        new CustomEvent("@chzstream/handshake-response", {
          detail: clientId,
        })
      );
    }
  );
}
