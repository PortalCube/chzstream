import { PayloadSchema } from "../payload.ts";

interface IframePointerDownMessage extends PayloadSchema {
  request: {
    button: number;
    clientX: number;
    clientY: number;
  };
  response: null;
}

export const IframePointerDownMessage: IframePointerDownMessage = {
  request: {} as IframePointerDownMessage["request"],
  response: null,
};
