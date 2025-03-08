import { WebsiteRelay } from "@chzstream/message";

const relay = new WebsiteRelay();

export async function initializeRelayMessage() {
  console.log("[website-relay] initialize");
  await relay.listen();
}
