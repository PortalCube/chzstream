import { WindowRelay } from "@chzstream/message";

const relay = new WindowRelay();

export async function initializeRelayMessage() {
  console.log("[website-relay] initialize");
  await relay.listen();
}
