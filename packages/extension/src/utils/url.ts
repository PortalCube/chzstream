const url = new URL(window.location.href);

export function getNumberParam(name: string): number | null {
  const value = url.searchParams.get(name);

  if (value === null) {
    return null;
  }

  if (/\d+/g.test(value) === false) {
    return null;
  }

  return Number(value);
}

export function getStringParam(name: string): string | null {
  return url.searchParams.get(name);
}

export function hasStringParam(name: string, value?: string): boolean {
  return url.searchParams.has(name, value);
}

export const parentId: string | null = getStringParam("_csp");
export const iframeId: number | null = getNumberParam("_csi");
