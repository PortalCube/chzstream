import { useEffect, useRef } from "react";

// TODO: setDragImage를 useCustomDragElement로 대체
export function useCustomDragElement(
  url: string
): React.RefObject<HTMLImageElement> {
  const imageRef = useRef<HTMLImageElement>(document.createElement("img"));

  useEffect(() => {
    const imageElement = imageRef.current;
    imageElement.src = url;

    imageElement.style.position = "absolute";
    imageElement.style.top = "-128px";
    imageElement.style.left = "-128px";
    imageElement.style.width = "64px";
    imageElement.style.height = "64px";
    imageElement.style.borderRadius = "50%";
    imageElement.style.objectFit = "cover";
    imageElement.style.backgroundColor = "rgba(32, 32, 32, 1)";

    const dragContainerElement: HTMLDivElement = (() => {
      const find = document.querySelector("body > #drag-container");
      if (find) {
        return find as HTMLDivElement;
      }

      const element = document.createElement("div");
      element.id = "drag-container";
      element.style.position = "absolute";

      return element;
    })();

    dragContainerElement.appendChild(imageElement);

    return () => {
      dragContainerElement.removeChild(imageElement);
    };
  }, [url]);

  return imageRef;
}
