import { initializeCookie } from "@extension/utils/cookie.ts";
import { initializeServerMessage } from "@extension/utils/message/server.ts";

export default defineBackground({
  persistent: false,
  main() {
    initializeServerMessage();
    initializeCookie();
  },
});
