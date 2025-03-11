import { PayloadSchema } from "../payload.ts";

interface IframeKeyDownMessage extends PayloadSchema {
  request: {
    key: string;
  };
  response: null;
}

export const IframeKeyDownMessage: IframeKeyDownMessage = {
  request: {} as IframeKeyDownMessage["request"],
  response: null,
};
