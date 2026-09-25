# SCRAPTURA Next.js v2.1

v2.0 Visual Prototype를 실제 서비스 구조로 전환한 첫 코드베이스입니다.

## 현재 구현
- Next.js App Router
- 공통 Header / Footer / Hero
- HOME
- Stories / People / Places / Timeline / Bible 목록
- 동적 상세 Route `[slug]`
- Story / Person / Place / Period / Book 데이터 모델
- Relation 데이터 및 Continue Exploring
- Journeys
- Visual placeholder
- 기존 SCRAPTURA 이미지 자산 보존
- PC / Tablet / Mobile 반응형

## 의도적으로 아직 하지 않은 것
- Firebase 연결
- Authentication
- Admin CMS
- Firestore CRUD
- 최종 Hero/Background 이미지 교체
- 전문 검색엔진
- 성경 번역문 전문 저장

## 실행
npm install
npm run dev

## 다음 개발 순서
1. Firebase project config
2. Authentication + operators
3. Firestore collections
4. Admin login/dashboard
5. Content CRUD
6. Relation editor
7. Media upload
8. Search
9. Production deployment

디자인 세부 수정은 `app/globals.css`에서 할 수 있으며, 콘텐츠/관계 데이터는 `data/content.ts`에서 관리합니다.
