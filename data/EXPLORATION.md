# Timeline · Visual

`exploration.ts`에는 본문 흐름을 따르는 13개 시대와 24개 Visual 장면이 있습니다. 각 시대는 소개·배경·전환점 4개·성경 범위·관련 콘텐츠를 포함하고, 각 Visual은 감상 포인트 3개와 본문·인물·이야기 연결을 포함합니다.

한국어 해설은 새로 작성한 요약입니다. 연대 논쟁이 있는 초기 구간은 절대연도를 제시하지 않고 본문 순서를 따릅니다. 복음서는 차이를 지운 일자표로 합치지 않으며, 서신이 모두 사도행전 이후에 쓰였다고 설명하지 않습니다. 새 예루살렘의 환상은 과거의 시대 목록에 넣지 않습니다.

본문 확인에는 [공개 KJV](https://ebible.org/eng-kjv/)를 사용합니다. 예: [족장의 부르심](https://ebible.org/eng-kjv/GEN12.htm), [귀환](https://ebible.org/eng-kjv/EZR01.htm), [오순절](https://ebible.org/eng-kjv/ACT02.htm), [로마에서의 증언](https://ebible.org/eng-kjv/ACT28.htm). 각 항목의 `scripture`와 전환점에 세부 참조가 있습니다.

`data/content.ts`가 이 자료를 기존 성경 콘텐츠에 합치므로 검색과 사이트맵에도 나타납니다. `rise-of-david`, `united-kingdom`의 기존 주소는 유지하며 이번 해설과 새 이미지를 사용합니다. 이 37개 항목은 프로젝트에 포함된 공개 편집 콘텐츠이며 상세 페이지는 이 자료를 우선 사용합니다. 다른 주소의 공개 CMS 자료도 계속 조회합니다. Visual 목록은 로컬 자료를 즉시 표시하고 공개 CMS 항목을 병합하며, 원격 연결 실패로 로컬 장면을 숨기지 않습니다.

메인과 Timeline의 새 이미지는 내장 ImageGen으로 제작했습니다. 최종 프롬프트는 `archive-image-prompts.mjs`, 웹용 최종 파일은 `public/assets/editorial/*.webp`에 저장하며 생성 원본도 ImageGen 폴더에 보존합니다. Visual 24개는 앞서 제작한 권별 고해상도 이미지를 장면 해설과 연결해 재사용합니다.

검사:

```powershell
npm run exploration:check
npm run content:check
npx tsc --noEmit
npm run build -- --webpack
```

`scripts/verify-exploration.mjs`는 실행 중인 사이트의 전체 시대·장면 상세, 검색·사이트맵, 주제 필터, 연결 이동, 이미지 로드, 데스크톱·모바일 배치를 검증합니다.
