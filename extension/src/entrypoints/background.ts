import { initializeCookie } from "../utils/cookie.ts";
import { initializeServerMessage } from "../utils/message/server.ts";

export default defineBackground({
  persistent: false,
  main() {
    initializeServerMessage();
    initializeCookie();
  },
});
