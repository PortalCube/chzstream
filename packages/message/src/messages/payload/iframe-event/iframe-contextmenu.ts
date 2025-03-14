import { PayloadSchema } from "../payload.ts";

interface IframeContextMenuMessage extends PayloadSchema {
  request: {
    button: number;
    clientX: number;
    clientY: number;
  };
  response: null;
}

export const IframeContextMenuMessage: IframeContextMenuMessage = {
  request: {} as IframeContextMenuMessage["request"],
  response: null,
};
