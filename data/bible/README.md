# SCRAPTURA 성경 콘텐츠

66권을 현재 사이트에서 탐험할 수 있도록 구성했습니다. 창세기·출애굽기는 `data/content.ts`의 기존 자료를 사용하고, 레위기와 새로 추가한 63권은 `books/*.json` 패키지를 사용합니다. 기존의 상세 이야기와 인물 자료는 유지합니다.

## 구성

- 각 권: 한국어 소개, 전체 개요, 배경, 본문 흐름, 성경 참조와 관련 콘텐츠.
- 긴 책은 주요 단락으로, 짧은 책은 장·절로 구분합니다. 분량에 맞춰 3–10개의 구간을 사용합니다.
- 민수기: 10개 Book Journey와 열두 정탐꾼·고라의 반역·놋뱀 사건·발람과 발락의 상세 이야기.
- 그 밖의 새 권: 주요 본문 구간을 따라 읽는 탐구 페이지. 시가·예언·서신을 가공의 사건으로 만들지 않으며 `SCRIPTURE STUDY`로 구분합니다.
- 공통 인물과 장소는 하나의 노드로 만들고 관련된 여러 권에서 연결합니다.
- 성경 권별 대표 이미지를 관련 이야기의 표지에도 공유합니다. 기존 전용 이미지는 유지합니다.

성경 번역문 전문이 아닌 직접 작성한 한국어 요약입니다. 각 새 패키지의 `sources`에는 참조할 수 있는 [공개 KJV 본문](https://ebible.org/eng-kjv/) 링크가 있습니다. 책의 순서는 프로젝트의 66권 카탈로그를 따릅니다. 요한삼서의 마지막 구간은 KJV의 14절 구분을 사용하며, 일부 번역의 15절 구분을 설명합니다. 저자나 연대가 불확실한 책은 이를 단정하지 않고 책 자체의 내용에 집중합니다.

## 수정과 재생성

작성 원본:

- `source/old-testament-history.mjs`: 민수기부터 에스더까지.
- `source/old-testament-wisdom-prophets.mjs`: 욥기부터 말라기까지.
- `source/new-testament.mjs`: 마태복음부터 요한계시록까지.
- `source/entities.mjs`: 공통 인물·장소 및 성경 참조.

```powershell
npm run content:generate
npm run content:check
npx tsc --noEmit
npm run build -- --webpack
```

생성 명령은 새 63개 JSON과 `package-registry.ts`를 다시 작성합니다. 생성 대상 JSON의 변경은 작성 원본에 반영해야 보존됩니다. 기존 레위기 JSON은 다시 작성하지 않습니다. 모든 파일은 UTF-8로 저장합니다.

## 사이트 연결

`package-loader.ts`가 등록된 패키지 전체를 조회합니다. `data/content.ts`가 패키지와 기존 자료를 합치며 같은 유형·slug의 기존 상세 자료를 보존합니다. 여호수아의 기존 `book-of-joshua` 주소는 호환을 위해 남겨 두고, 66권 목록에는 정식 `joshua` 주소만 표시합니다.

목록과 검색은 서버에서 로컬 자료를 먼저 전달하므로 Firestore 응답을 기다리지 않고 사용할 수 있습니다. 공개 상태의 Firestore 자료가 도착하면 같은 항목의 필드를 병합합니다. 새 JSON은 배포에 포함되는 공개 정적 콘텐츠이며, Firestore에 자동으로 업로드하지 않습니다.

`npm run content:check`는 실제 사이트의 데이터 모듈을 읽어 66권의 순서, 패키지 중복, 본문 구간의 장 범위와 연속성, 관계 대상, 인코딩, 이미지 경로, 목록·검색 병합 및 기존 자료의 보존을 검증합니다.

## 대표 이미지

출애굽기와 사무엘상은 기존 이미지를 재사용하고, 나머지 64권은 내장 ImageGen으로 책마다 별도의 대표 이미지를 생성했습니다. 이미지 생성에 사용한 공통 스타일과 각 책의 최종 프롬프트는 `cover-prompts.mjs`에 보관합니다. 원본 파일은 ImageGen의 생성 폴더에 남기고 웹용 최종 파일은 `public/assets/bible/*.webp`에 저장합니다.

`cover-images.json`은 실제 파일이 있는 표지만 등록합니다. `images.ts`는 이 표지를 권별 페이지, 관련 이야기, 목록과 검색에 연결하며 기존 전용 표지를 보존합니다. Firestore의 공통 기본 이미지는 새 표지를 덮어쓰지 않습니다. 이미지 파일 추가 후에는 다음을 실행합니다.

```powershell
npm run images:sync
npm run content:generate
npm run images:check
npm run content:check
```

`images:check`는 64개 생성 파일의 형식·해상도·중복, 66권 표지 및 이야기 이미지의 경로, 기존 이미지 보존과 CMS 기본 이미지의 병합을 검사합니다.
