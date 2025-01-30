export function makeUrls(urls: string[], mode: string) {
  if (mode === "development") {
    return [...urls, "http://localhost/*"];
  } else {
    return [...urls, "http://localhost/*"];
    // return urls;
  }
}
