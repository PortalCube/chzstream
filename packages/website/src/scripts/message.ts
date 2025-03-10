import {
  checkWebsiteClient,
  createWebsiteClient,
  WebsiteClient,
} from "@chzstream/message";

export let MessageClient: WebsiteClient | null = null;

export async function initializeClientMessage() {
  if (checkWebsiteClient() === false) {
    alert("확장프로그램을 인식하지 못했습니다!");
    return;
  }

  MessageClient = await createWebsiteClient();
}
