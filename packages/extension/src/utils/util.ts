export function convertToVaildString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  if (value.trim() === "") {
    return null;
  }

  return value;
}
