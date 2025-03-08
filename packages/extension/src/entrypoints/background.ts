import { initializeCookie } from "@extension/utils/cookie.ts";
import { initializeServerMessage } from "@extension/utils/message/background-client.ts";

export default defineBackground({
  persistent: false,
  main() {
    initializeServerMessage();
    initializeCookie();
  },
});
