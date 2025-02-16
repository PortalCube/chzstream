import { createNanoEvents } from "nanoevents";
import { ChzzkResponse } from "@extension/utils/api/chzzk/chzzk.js";
import { convertLiveInfo } from "@extension/utils/api/chzzk/live-info.js";
import { convertLiveStatus } from "@extension/utils/api/chzzk/live-status.js";
import { convertChannelInfo } from "@extension/utils/api/chzzk/channel-info.js";

type Intercept = {
  event: string;
  method: string;
  pattern: RegExp;
  convert: (response: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

const INTERCEPT_LIST: Intercept[] = [
  {
    event: "live-info",
    method: "GET",
    pattern: /^\/service\/v3\/channels\/([0-9a-fA-F]{32,32})\/live-detail$/g,
    convert: convertLiveInfo,
  },
  {
    event: "live-status",
    method: "GET",
    pattern: /^\/polling\/v3\/channels\/([0-9a-fA-F]{32,32})\/live-status$/g,
    convert: convertLiveStatus,
  },
  {
    event: "channel-info",
    method: "GET",
    pattern: /^\/service\/v1\/channels\/([0-9a-fA-F]{32,32})$/g,
    convert: convertChannelInfo,
  },
];

type InterceptorEvent = {
  [K in Intercept[][number] as K["event"]]: K["convert"];
};

export const InterceptEmitter = createNanoEvents<InterceptorEvent>();

export async function initializeInterceptor() {
  await injectScript("/chzzk-xhr.js", {
    keepInDom: false,
  });

  document.addEventListener("chzstream-xhr", (event) => {
    const { detail: body } = event as CustomEvent;

    const url = new URL(body.url);

    const intercept = INTERCEPT_LIST.find((item) => {
      const matchMethod = body.method === item.method;
      const matchUrl = item.pattern.test(url.pathname);

      item.pattern.lastIndex = 0;

      return matchMethod && matchUrl;
    });

    if (intercept === undefined) {
      return;
    }

    const json = JSON.parse(body.response) as ChzzkResponse;
    const data = intercept.convert(json.content);

    InterceptEmitter.emit(intercept.event, data);
  });
}
