export default defineUnlistedScript(() => {
  // @ts-expect-error 유저 정의 프로퍼티 체크
  if (window.XMLHttpRequest["_chzstream"]) {
    return;
  }

  class _XMLHttpRequest extends XMLHttpRequest {
    _chzstream = true;
    #method: string = "";
    #url: string = "";

    constructor() {
      super();

      this.addEventListener("load", () => {
        if (this.#url.startsWith("https://") === false) {
          return;
        }

        const url = new URL(this.#url);
        if (url.hostname !== "api.chzzk.naver.com") {
          return;
        }

        const event = new CustomEvent("chzstream-xhr", {
          detail: {
            method: this.#method,
            url: this.#url,
            response: this.response,
          },
        });

        document.dispatchEvent(event);
      });
    }

    open(
      method: string,
      url: string,
      async = true,
      user = null,
      password = null
    ) {
      this.#method = method;
      this.#url = url;
      super.open(method, url, async, user, password);
    }
  }

  window.XMLHttpRequest = _XMLHttpRequest;
});
