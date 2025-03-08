import { createNanoEvents } from "nanoevents";

const INTERCEPT_LIST = {
  "live-info": {
    method: "GET",
    pattern: /^\/service\/v3\/channels\/([0-9a-fA-F]{32,32})\/live-detail$/g,
  },
  "live-status": {
    method: "GET",
    pattern: /^\/polling\/v3\/channels\/([0-9a-fA-F]{32,32})\/live-status$/g,
  },
  "channel-info": {
    method: "GET",
    pattern: /^\/service\/v1\/channels\/([0-9a-fA-F]{32,32})$/g,
  },
};

type InterceptorKey = keyof typeof INTERCEPT_LIST;
type InterceptorEvent = {
  [K in InterceptorKey]: (data: Record<string, unknown>) => void;
};

export const InterceptEmitter = createNanoEvents<InterceptorEvent>();

export async function initializeInterceptor() {
  await injectScript("/chzzk-xhr.js", {
    keepInDom: false,
  });

  document.addEventListener("chzstream-xhr", (event) => {
    const { detail: body } = event as CustomEvent;

    const url = new URL(body.url);

    for (const [key, item] of Object.entries(INTERCEPT_LIST)) {
      const matchMethod = body.method === item.method;
      const matchUrl = item.pattern.test(url.pathname);

      item.pattern.lastIndex = 0;

      if (matchMethod && matchUrl) {
        const data = JSON.parse(body.response) as Record<string, unknown>;
        InterceptEmitter.emit(key as InterceptorKey, data);
        return;
      }
    }
  });
}
