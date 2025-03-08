export function hasProperty<K extends string, V>(
  item: unknown,
  key: K,
  value: V
): item is Record<string, unknown> & {
  [key in K]: V;
} {
  if (typeof item !== "object") return false;
  if (item === null) return false;
  if (Array.isArray(item)) return false;
  if (key in item === false) return false;

  const it = item as Record<string, unknown>;
  if (it[key] !== value) return false;

  return true;
}
