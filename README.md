# SCRAPTURA

성경의 이야기·인물·장소·시대·각 권을 연결하는 Next.js 기반 탐험 아카이브입니다.

## 현재 구성

- Next.js App Router와 반응형 페이지.
- Stories / People / Places / Timeline / Bible / Visual 목록과 상세페이지, Journeys 및 검색.
- 성경 66권의 개요와 본문 흐름, 관련 인물·장소·이야기 및 본문 탐구.
- Firebase 인증, 관리자 CMS, Firestore 콘텐츠 관리, 관계 편집 및 이미지 업로드 코드.
- 목록과 검색의 로컬 콘텐츠 초기 표시 및 공개 Firestore 자료 병합.

## 실행

```powershell
npm install
npm run dev
```

기존 Firebase 설정을 담은 `.env.local`이 필요합니다. 프로덕션 빌드와 실행:

```powershell
npm run build -- --webpack
npm run start
```

## 콘텐츠 작성과 검증

새 콘텐츠의 작성 원본과 JSON 생성 방법은 [성경 콘텐츠 안내](data/bible/README.md)를 참고하세요. 기존 상세 자료는 `data/content.ts`, 성경 권별 패키지는 `data/bible/books/`, 스타일은 `app/globals.css`에서 관리합니다.

```powershell
npm run content:generate
npm run content:check
npx tsc --noEmit
```

실행 중인 사이트의 66권 상세페이지, 대표 관계 페이지와 사이트맵 검사:

```powershell
npm run content:verify -- --base-url http://localhost:3000
```

추가된 콘텐츠는 성경 번역문 전문 대신 직접 작성한 한국어 요약과 본문 참조를 제공합니다. 새 JSON은 공개 정적 콘텐츠로 포함되며 Firestore에 자동 업로드하지 않습니다.
