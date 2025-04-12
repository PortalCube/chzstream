import { useEffect, useState } from "react";

export function useLoadingImage(targetUrl: string, loadingUrl: string) {
  const [imageObject] = useState<HTMLImageElement>(new Image());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onLoad = () => setLoading(false);
    // const onError = () => setLoading(false);

    imageObject.addEventListener("load", onLoad);
    // imageObject.addEventListener("error", onError);

    imageObject.src = targetUrl;

    return () => {
      imageObject.removeEventListener("load", onLoad);
      // imageObject.removeEventListener("error", onError);
    };
  }, [imageObject, targetUrl]);

  return loading ? loadingUrl : targetUrl;
}
