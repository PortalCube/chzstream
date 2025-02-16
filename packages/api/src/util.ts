export function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  if (value.trim() === "") {
    return null;
  }

  return value;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
