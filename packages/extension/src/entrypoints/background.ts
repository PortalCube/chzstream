import { initializeCookie } from "@extension/utils/cookie.ts";
import { initializeBackgroundClient } from "@extension/utils/message/background-client.ts";

export default defineBackground({
  persistent: false,
  main() {
    initializeBackgroundClient();
    initializeCookie();
  },
});
