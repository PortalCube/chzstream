import { PayloadSchema } from "../payload.ts";

interface IframePointerMoveMessage extends PayloadSchema {
  request: {
    clientX: number;
    clientY: number;
  };
  response: null;
}

export const IframePointerMoveMessage: IframePointerMoveMessage = {
  request: {} as IframePointerMoveMessage["request"],
  response: null,
};
