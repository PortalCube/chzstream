function _isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasProperty<T extends string>(
  obj: Record<string, unknown>,
  key: T
): obj is Record<string, unknown> & Record<T, true> {
  return key in obj && obj[key] === true;
}

export function isTypedObject<T extends string>(
  value: unknown,
  key: T
): value is Record<string, unknown> & Record<T, true> {
  return isObject(value) && hasProperty(value, key);
}
