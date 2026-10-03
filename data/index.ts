import type {
  ContentNode,
} from "../content-types";


/* =====================================================
   SCRAPTURA BIBLE DETAIL NODE AGGREGATOR

   앞으로 권별 파일을 이곳에서 합칩니다.

   예:

   import {
     joshuaNodes,
   } from "./joshua";

   import {
     leviticusNodes,
   } from "./leviticus";

   export const bibleNodes = [
     ...joshuaNodes,
     ...leviticusNodes,
   ];
   ===================================================== */


export const bibleNodes:
  ContentNode[] = [];