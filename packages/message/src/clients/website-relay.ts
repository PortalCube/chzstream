import { browser, ClientId, WebsiteMessage } from "@message/clients/base.ts";
import {
  isHandshakeRequest,
  isHandshakeResponse,
  isMessage,
} from "@message/messages/base.ts";

const ORIGIN = new URL(location.href).origin;
export class WebsiteRelay {
  id: ClientId;
  port: chrome.runtime.Port;

  constructor(id: ClientId, port: chrome.runtime.Port) {
    this.id = id;
    this.port = port;

    window.addEventListener("message", this.onSend.bind(this));
    port.onMessage.addListener(this.onReceive.bind(this));
  }

  // Website Client에서 Message를 수신하여 Background Client로 전달합니다.
  onSend(event: MessageEventInit<WebsiteMessage>): void {
    if (event.origin !== ORIGIN) return;
    if (event.data === undefined) return;
    if (event.data.type !== "send") return;

    const message = event.data.body;
    if (isMessage(message) === false) return;

    this.port.postMessage(message);
  }

  // Background Client에서 Message를 수신하여 Website Client로 전달합니다.
  onReceive(message: unknown, _port: chrome.runtime.Port): void {
    if (isMessage(message) === false) return;

    window.postMessage({
      type: "receive",
      body: message,
    });
  }
}

// Content Script에 Website Relay를 등록합니다.
export function createWebsiteRelay() {
  const heartbeat = () => browser.runtime.sendMessage(new Date().toISOString());
  setInterval(heartbeat, 20000);

  // Handshake를 받으면, 새로운 Website Relay를 생성합니다.
  window.addEventListener(
    "message",
    async (event: MessageEventInit<WebsiteMessage>) => {
      if (event.origin !== ORIGIN) return;
      if (event.data === undefined) return;
      if (event.data.type !== "handshake-request") return;

      const message = event.data.body;

      // 올바른 Handshake Request인지 확인
      if (isHandshakeRequest(message) === false) return;
      if (message.type !== "website") return;

      // Handshake Request를 Background Client로 전달합니다.
      const clientId: unknown = await browser.runtime.sendMessage(message);

      // 요청이 성공하여 Handshake Response를 받으면 Connection을 구성합니다.
      if (isHandshakeResponse(clientId) === false) return;
      const port = browser.runtime.connect({ name: clientId.id });

      // 전달받은 ClientId와 생성한 Connection으로 Relay 인스턴스를 생성합니다.
      new WebsiteRelay(clientId, port);

      // Handshake Response를 Website Client로 전달합니다.
      window.postMessage({ type: "handshake-response", body: clientId });
    }
  );
}
