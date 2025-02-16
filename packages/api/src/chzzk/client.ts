import { APIClient } from "@api/client.ts";
import { isObject } from "@api/util.ts";

const BASE_URL = "https://api.chzzk.naver.com";
export const Client = new APIClient<Response>(BASE_URL, handler);

function isResponse(response: unknown): response is Response {
  if (isObject(response) === false) {
    console.error("response is not an object");
    return false;
  }

  if ("code" in response === false) {
    console.error("response does not have a code field");
    return false;
  }

  if (typeof response.code !== "number") {
    console.error("response code is not a number");
    return false;
  }

  if ("message" in response === false) {
    console.error("response does not have a message field");
    return false;
  }

  if (typeof response.message !== "string" && response.message !== null) {
    console.error("response message is not a string or null");
    return false;
  }

  if ("content" in response === false) {
    console.error("response does not have a content field");
    return false;
  }

  return true;
}

function handler(response: unknown): Response {
  if (isResponse(response) === false) {
    throw new Error("response is not valid");
  }

  if (response.code !== 200) {
    throw new Error("request failed:" + response.message);
  }

  return response;
}

export type Response = {
  code: number;
  message: string | null;
  content: unknown;
};
