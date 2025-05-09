import { ZodError } from "zod";

export function def<T>(defaultValue: T) {
  return (ctx: { error: ZodError; input: unknown }): T => {
    const { error, input } = ctx;
    reportSchemaError(error);
    return defaultValue;
  };
}

export async function reportSchemaError(error: ZodError) {
  // send error somewhere...
  // console.error(error);
}
