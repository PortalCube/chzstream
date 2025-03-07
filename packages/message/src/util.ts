export function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray(value) === false
  );
}

export function hasProperty<K extends string, V>(
  item: unknown,
  key: K,
  value: V
): item is Record<string, unknown> & {
  [key in K]: V;
} {
  return isObject(item) && key in item && item[key] === value;
}

export function isTypedObject<K extends string>(
  item: unknown,
  key: K
): item is Record<string, unknown> & {
  [key in K]: true;
} {
  return hasProperty(item, key, true);
}
