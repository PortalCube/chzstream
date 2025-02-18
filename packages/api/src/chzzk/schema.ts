import { z } from "zod";

export function createResponseSchema<T extends z.ZodSchema>(
  contentSchema: T
): z.ZodSchema {
  return z.object({
    code: z.number(),
    message: z.string().nullable(),
    content: contentSchema,
  });
}

export function createPaginationSchema<
  DataType extends z.ZodSchema,
  NextType extends z.ZodSchema,
>(dataSchema: DataType, nextSchema: NextType): z.ZodSchema {
  return createResponseSchema(
    z.object({
      size: z.number(),
      page: z
        .object({
          next: nextSchema,
        })
        .nullable(),
      data: z.array(dataSchema),
    })
  );
}
