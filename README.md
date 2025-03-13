# chzstream

https://chzstream.app/

## Packages

chzstream은 pnpm workspace를 이용한 모노레포를 사용합니다.

- `website` React 프로젝트
- `extension` 브라우저 확장프로그램 프로젝트
- `message` 메시징 라이브러리
- `url` url 라이브러리
- `api` 치지직 API 라이브러리

## Local development

본 프로젝트는 pnpm을 메인 패키지 매니저로 사용합니다.

#### 프로젝트 종속성 설치

```
pnpm i
```

#### Website (React) 개발 서버 실행

```
pnpm web dev
```

##### Website (React) 빌드

```
pnpm web build
```

#### Web-Extension 개발 서버 실행

```
pnpm ext dev
```

#### Web-Extension 빌드

```
pnpm ext build
```

#### Website + Web-Extension 개발 서버 동시 실행

```
pnpm dev
```

## Bug Report

오류 제보, 기능 피드백, 사용 문의등은 Github Issue로 제보 부탁드립니다.

## License

본 서비스의 소스코드는 MIT 라이언스하에 배포됩니다.
