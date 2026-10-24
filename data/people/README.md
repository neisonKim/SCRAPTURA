# 인물 이미지

공개 CMS와 로컬 콘텐츠를 함께 조사한 `image-inventory.json`이 이번 작업 이전의 이미지 기록입니다. 이미 존재하는 이미지가 있으면 다시 생성하지 않습니다. 다윗·모세 등 기존 로컬 이미지는 그대로 보존하며, 아브라함·노아의 기존 공개 CMS 이미지와 기존 예수 이미지 파일도 연결합니다. CMS에만 있는 아담의 이미지도 변경하지 않습니다.

`portrait-prompts.mjs`에 전용 이미지가 없는 70명의 최종 프롬프트를 보관합니다. 인물마다 역할·시대·배경과 구도를 구분하고, 내장 ImageGen으로 별도 제작합니다. 원본은 ImageGen 생성 폴더에 보존하고 웹용 파일만 `public/assets/people/<slug>.webp`에 저장합니다. 인물의 외모는 성경 기록을 바탕으로 한 시각적 해석입니다.

`portrait-images.json`은 실제 파일이 있는 새 이미지와 복구한 기존 이미지 연결을 등록합니다. `images.ts`는 인물의 기본 배경만 대체하며 전용 이미지를 덮어쓰지 않습니다. 패키지 로더, 통합 콘텐츠, 상세 페이지의 CMS 병합, 목록·검색 및 공유 미리보기에 같은 이미지를 사용합니다. 성경 콘텐츠 재생성 시에도 이 이미지 연결을 유지합니다. CMS 데이터나 기존 이미지 파일을 다시 업로드하거나 수정하지 않습니다.

인물 목록은 화면에 가까운 카드부터 이미지를 불러오고, 새 로컬 이미지는 표시 크기에 맞게 제공해 수십 장을 한 번에 원본 크기로 내려받지 않도록 합니다. 기존 외부 CMS 이미지 URL은 그대로 사용합니다.

```powershell
npm run people:images:sync
npm run content:generate
npm run people:images:check
npm run content:check
npx tsc --noEmit
npm run build -- --webpack
```

`people:images:check`는 이미지 개수·크기·중복, 인물 전체의 경로, 기존 이미지 파일의 원본 보존, 공개 CMS 이미지의 재사용과 기본 이미지 병합을 검사합니다. `people:images:verify`는 실행 중인 사이트에서 인물 상세 페이지 전체, 실제 이미지 응답, 목록·검색·상세 이동, CMS 연결 유무 및 모바일 표시를 검증합니다.

사용자의 모세 이미지 교체 요청에 따라 모세 노드만 `public/assets/people/moses-v2-wide.webp`로 연결했습니다. 생성 및 최종 구도 수정 프롬프트는 `moses-v2.prompt.txt`에 보관하며, 기존 `scraptura-moses.jpg`와 다른 인물 이미지는 유지합니다. 기본 이미지 70개를 관리하는 일괄 생성 목록과 별도의 교체 이미지입니다.
