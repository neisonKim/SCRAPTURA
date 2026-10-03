import type {
  ContentNode,
} from "./content";


/* =====================================================
   SCRAPTURA BIBLE DETAIL NODE AGGREGATOR

   기존 TypeScript 기반 ContentNode를
   한곳에서 집계해야 할 경우 사용하는 파일입니다.

   현재 새 성경 권별 데이터는:

   data/bible/books/*.json

   구조를 사용하며,
   /bible/[slug]/page.tsx의 JSON Loader가
   직접 읽도록 구성되어 있습니다.

   따라서 현재는 기존 Aggregator 배열만
   호환성을 위해 유지합니다.
   ===================================================== */


export const bibleNodes:
  ContentNode[] = [];