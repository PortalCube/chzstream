import { browser } from "wxt/browser/chrome";

type CookieInfo = {
  url: string;
  name: string;
  domain: string;
};

const targetCookies = [
  {
    domain: ".naver.com",
    url: "https://chzzk.naver.com",
    name: "NID_AUT",
  },
  {
    domain: ".naver.com",
    url: "https://chzzk.naver.com",
    name: "NID_SES",
  },
];

const TOP_LEVEL_DOMAINS = ["https://chzstream.app", "http://localhost:5286"];

export async function initializeCookie() {
  browser.cookies.onChanged.addListener(onCookieChanged);

  for (const domain of TOP_LEVEL_DOMAINS) {
    for (const target of targetCookies) {
      await convertToPartitionCookie(target, domain);
    }
  }
}

async function convertToPartitionCookie(target: CookieInfo, domain: string) {
  const currentCookie = await browser.cookies.get({
    url: target.url,
    name: target.name,
  });

  // 아직 쿠키가 없음
  if (currentCookie === null) {
    return;
  }

  await browser.cookies.set({
    url: target.url,
    name: target.name,
    value: currentCookie.value,
    partitionKey: {
      topLevelSite: domain,
    },
    domain: currentCookie.domain,
    httpOnly: currentCookie.httpOnly,
    path: currentCookie.path,
    sameSite: "no_restriction",
    secure: true,
    expirationDate: currentCookie.expirationDate,
  });
}

function onCookieChanged(info: chrome.cookies.CookieChangeInfo) {
  if (info.cookie.partitionKey !== undefined) {
    // 파티션 쿠키 변경사항은 무시
    return;
  }

  if (info.removed) {
    onCookieRemoved(info);
  } else {
    onCookieAdded(info);
  }
}

function onCookieRemoved(info: chrome.cookies.CookieChangeInfo) {
  if (info.cause === "overwrite") {
    return;
  }

  // 사용하는 쿠키 목록에 포함되는지 확인
  const cookie = info.cookie;
  const match = targetCookies.find((target) => {
    return target.domain === cookie.domain && target.name === cookie.name;
  });

  if (match) {
    // 파티션 쿠키 제거
    for (const domain of TOP_LEVEL_DOMAINS) {
      browser.cookies.remove({
        url: match.url,
        name: match.name,
        partitionKey: {
          topLevelSite: domain,
        },
      });
    }
  }
}

function onCookieAdded(info: chrome.cookies.CookieChangeInfo) {
  // 사용하는 쿠키 목록에 포함되는지 확인
  const cookie = info.cookie;
  const match = targetCookies.find((target) => {
    return target.domain === cookie.domain && target.name === cookie.name;
  });

  if (match) {
    // 파티션 쿠키 생성
    for (const domain of TOP_LEVEL_DOMAINS) {
      convertToPartitionCookie(match, domain);
    }
  }
}

// 개발용 -- 쿠키를 모두 지웁니다.
async function _clearCookies() {
  // 일반 쿠키 제거
  for (const target of targetCookies) {
    await browser.cookies.remove({
      url: target.url,
      name: target.name,
    });
  }

  // 파티션 쿠키 제거
  for (const domain of TOP_LEVEL_DOMAINS) {
    for (const target of targetCookies) {
      await browser.cookies.remove({
        url: target.url,
        name: target.name,
        partitionKey: {
          topLevelSite: domain,
        },
      });
    }
  }
}
