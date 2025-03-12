import {
  checkWebsiteClient,
  createWebsiteClient,
  WebsiteClient,
} from "@chzstream/message";
import { atom, useSetAtom } from "jotai";
import { useEffect } from "react";

const clientAtom = atom<WebsiteClient | null>(null);
export const messageClientAtom = atom((get) => get(clientAtom));

export function useMessageClient() {
  const setClient = useSetAtom(clientAtom);

  useEffect(() => {
    if (checkWebsiteClient() === false) {
      alert("확장프로그램을 인식하지 못했습니다. 제한 모드로 진행합니다.");
      return;
    }

    const initialize = async () => {
      try {
        const client = await createWebsiteClient();
        setClient(client);
      } catch (error) {
        alert(
          "확장프로그램과의 통신 과정에서 오류가 발생했습니다. 제한 모드로 진행합니다."
        );
        console.error("Failed to create website client", error);
      }
    };

    initialize();
  }, []);
}
