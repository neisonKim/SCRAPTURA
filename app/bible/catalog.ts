/* =====================================================
   SCRAPTURA BIBLE CATALOG
   66 BOOKS
   ===================================================== */

export type BibleTestament =
  | "OLD"
  | "NEW";


export type BibleCatalogBook = {
  type: "book";

  slug: string;

  titleKo: string;

  titleEn: string;

  testament: BibleTestament;

  chapterCount: number;

  eyebrow: string;

  summary: string;

  overview: string;

  biblicalContext: string;

  heroImage: string;

  scripture: string[];

  bookSections: [];

  relations: [];
};


type BibleSeed = {
  slug: string;
  titleKo: string;
  titleEn: string;
  chapters: number;
  testament: BibleTestament;
};


/* =====================================================
   OLD TESTAMENT
   ===================================================== */

const oldTestament:
  BibleSeed[] = [

  {
    slug: "genesis",
    titleKo: "창세기",
    titleEn: "Genesis",
    chapters: 50,
    testament: "OLD",
  },

  {
    slug: "exodus",
    titleKo: "출애굽기",
    titleEn: "Exodus",
    chapters: 40,
    testament: "OLD",
  },

  {
    slug: "leviticus",
    titleKo: "레위기",
    titleEn: "Leviticus",
    chapters: 27,
    testament: "OLD",
  },

  {
    slug: "numbers",
    titleKo: "민수기",
    titleEn: "Numbers",
    chapters: 36,
    testament: "OLD",
  },

  {
    slug: "deuteronomy",
    titleKo: "신명기",
    titleEn: "Deuteronomy",
    chapters: 34,
    testament: "OLD",
  },

  {
    slug: "joshua",
    titleKo: "여호수아",
    titleEn: "Joshua",
    chapters: 24,
    testament: "OLD",
  },

  {
    slug: "judges",
    titleKo: "사사기",
    titleEn: "Judges",
    chapters: 21,
    testament: "OLD",
  },

  {
    slug: "ruth",
    titleKo: "룻기",
    titleEn: "Ruth",
    chapters: 4,
    testament: "OLD",
  },

  {
    slug: "1-samuel",
    titleKo: "사무엘상",
    titleEn: "1 Samuel",
    chapters: 31,
    testament: "OLD",
  },

  {
    slug: "2-samuel",
    titleKo: "사무엘하",
    titleEn: "2 Samuel",
    chapters: 24,
    testament: "OLD",
  },

  {
    slug: "1-kings",
    titleKo: "열왕기상",
    titleEn: "1 Kings",
    chapters: 22,
    testament: "OLD",
  },

  {
    slug: "2-kings",
    titleKo: "열왕기하",
    titleEn: "2 Kings",
    chapters: 25,
    testament: "OLD",
  },

  {
    slug: "1-chronicles",
    titleKo: "역대상",
    titleEn: "1 Chronicles",
    chapters: 29,
    testament: "OLD",
  },

  {
    slug: "2-chronicles",
    titleKo: "역대하",
    titleEn: "2 Chronicles",
    chapters: 36,
    testament: "OLD",
  },

  {
    slug: "ezra",
    titleKo: "에스라",
    titleEn: "Ezra",
    chapters: 10,
    testament: "OLD",
  },

  {
    slug: "nehemiah",
    titleKo: "느헤미야",
    titleEn: "Nehemiah",
    chapters: 13,
    testament: "OLD",
  },

  {
    slug: "esther",
    titleKo: "에스더",
    titleEn: "Esther",
    chapters: 10,
    testament: "OLD",
  },

  {
    slug: "job",
    titleKo: "욥기",
    titleEn: "Job",
    chapters: 42,
    testament: "OLD",
  },

  {
    slug: "psalms",
    titleKo: "시편",
    titleEn: "Psalms",
    chapters: 150,
    testament: "OLD",
  },

  {
    slug: "proverbs",
    titleKo: "잠언",
    titleEn: "Proverbs",
    chapters: 31,
    testament: "OLD",
  },

  {
    slug: "ecclesiastes",
    titleKo: "전도서",
    titleEn: "Ecclesiastes",
    chapters: 12,
    testament: "OLD",
  },

  {
    slug: "song-of-songs",
    titleKo: "아가",
    titleEn: "Song of Songs",
    chapters: 8,
    testament: "OLD",
  },

  {
    slug: "isaiah",
    titleKo: "이사야",
    titleEn: "Isaiah",
    chapters: 66,
    testament: "OLD",
  },

  {
    slug: "jeremiah",
    titleKo: "예레미야",
    titleEn: "Jeremiah",
    chapters: 52,
    testament: "OLD",
  },

  {
    slug: "lamentations",
    titleKo: "예레미야애가",
    titleEn: "Lamentations",
    chapters: 5,
    testament: "OLD",
  },

  {
    slug: "ezekiel",
    titleKo: "에스겔",
    titleEn: "Ezekiel",
    chapters: 48,
    testament: "OLD",
  },

  {
    slug: "daniel",
    titleKo: "다니엘",
    titleEn: "Daniel",
    chapters: 12,
    testament: "OLD",
  },

  {
    slug: "hosea",
    titleKo: "호세아",
    titleEn: "Hosea",
    chapters: 14,
    testament: "OLD",
  },

  {
    slug: "joel",
    titleKo: "요엘",
    titleEn: "Joel",
    chapters: 3,
    testament: "OLD",
  },

  {
    slug: "amos",
    titleKo: "아모스",
    titleEn: "Amos",
    chapters: 9,
    testament: "OLD",
  },

  {
    slug: "obadiah",
    titleKo: "오바댜",
    titleEn: "Obadiah",
    chapters: 1,
    testament: "OLD",
  },

  {
    slug: "jonah",
    titleKo: "요나",
    titleEn: "Jonah",
    chapters: 4,
    testament: "OLD",
  },

  {
    slug: "micah",
    titleKo: "미가",
    titleEn: "Micah",
    chapters: 7,
    testament: "OLD",
  },

  {
    slug: "nahum",
    titleKo: "나훔",
    titleEn: "Nahum",
    chapters: 3,
    testament: "OLD",
  },

  {
    slug: "habakkuk",
    titleKo: "하박국",
    titleEn: "Habakkuk",
    chapters: 3,
    testament: "OLD",
  },

  {
    slug: "zephaniah",
    titleKo: "스바냐",
    titleEn: "Zephaniah",
    chapters: 3,
    testament: "OLD",
  },

  {
    slug: "haggai",
    titleKo: "학개",
    titleEn: "Haggai",
    chapters: 2,
    testament: "OLD",
  },

  {
    slug: "zechariah",
    titleKo: "스가랴",
    titleEn: "Zechariah",
    chapters: 14,
    testament: "OLD",
  },

  {
    slug: "malachi",
    titleKo: "말라기",
    titleEn: "Malachi",
    chapters: 4,
    testament: "OLD",
  },
];


/* =====================================================
   NEW TESTAMENT
   ===================================================== */

const newTestament:
  BibleSeed[] = [

  {
    slug: "matthew",
    titleKo: "마태복음",
    titleEn: "Matthew",
    chapters: 28,
    testament: "NEW",
  },

  {
    slug: "mark",
    titleKo: "마가복음",
    titleEn: "Mark",
    chapters: 16,
    testament: "NEW",
  },

  {
    slug: "luke",
    titleKo: "누가복음",
    titleEn: "Luke",
    chapters: 24,
    testament: "NEW",
  },

  {
    slug: "john",
    titleKo: "요한복음",
    titleEn: "John",
    chapters: 21,
    testament: "NEW",
  },

  {
    slug: "acts",
    titleKo: "사도행전",
    titleEn: "Acts",
    chapters: 28,
    testament: "NEW",
  },

  {
    slug: "romans",
    titleKo: "로마서",
    titleEn: "Romans",
    chapters: 16,
    testament: "NEW",
  },

  {
    slug: "1-corinthians",
    titleKo: "고린도전서",
    titleEn: "1 Corinthians",
    chapters: 16,
    testament: "NEW",
  },

  {
    slug: "2-corinthians",
    titleKo: "고린도후서",
    titleEn: "2 Corinthians",
    chapters: 13,
    testament: "NEW",
  },

  {
    slug: "galatians",
    titleKo: "갈라디아서",
    titleEn: "Galatians",
    chapters: 6,
    testament: "NEW",
  },

  {
    slug: "ephesians",
    titleKo: "에베소서",
    titleEn: "Ephesians",
    chapters: 6,
    testament: "NEW",
  },

  {
    slug: "philippians",
    titleKo: "빌립보서",
    titleEn: "Philippians",
    chapters: 4,
    testament: "NEW",
  },

  {
    slug: "colossians",
    titleKo: "골로새서",
    titleEn: "Colossians",
    chapters: 4,
    testament: "NEW",
  },

  {
    slug: "1-thessalonians",
    titleKo: "데살로니가전서",
    titleEn: "1 Thessalonians",
    chapters: 5,
    testament: "NEW",
  },

  {
    slug: "2-thessalonians",
    titleKo: "데살로니가후서",
    titleEn: "2 Thessalonians",
    chapters: 3,
    testament: "NEW",
  },

  {
    slug: "1-timothy",
    titleKo: "디모데전서",
    titleEn: "1 Timothy",
    chapters: 6,
    testament: "NEW",
  },

  {
    slug: "2-timothy",
    titleKo: "디모데후서",
    titleEn: "2 Timothy",
    chapters: 4,
    testament: "NEW",
  },

  {
    slug: "titus",
    titleKo: "디도서",
    titleEn: "Titus",
    chapters: 3,
    testament: "NEW",
  },

  {
    slug: "philemon",
    titleKo: "빌레몬서",
    titleEn: "Philemon",
    chapters: 1,
    testament: "NEW",
  },

  {
    slug: "hebrews",
    titleKo: "히브리서",
    titleEn: "Hebrews",
    chapters: 13,
    testament: "NEW",
  },

  {
    slug: "james",
    titleKo: "야고보서",
    titleEn: "James",
    chapters: 5,
    testament: "NEW",
  },

  {
    slug: "1-peter",
    titleKo: "베드로전서",
    titleEn: "1 Peter",
    chapters: 5,
    testament: "NEW",
  },

  {
    slug: "2-peter",
    titleKo: "베드로후서",
    titleEn: "2 Peter",
    chapters: 3,
    testament: "NEW",
  },

  {
    slug: "1-john",
    titleKo: "요한일서",
    titleEn: "1 John",
    chapters: 5,
    testament: "NEW",
  },

  {
    slug: "2-john",
    titleKo: "요한이서",
    titleEn: "2 John",
    chapters: 1,
    testament: "NEW",
  },

  {
    slug: "3-john",
    titleKo: "요한삼서",
    titleEn: "3 John",
    chapters: 1,
    testament: "NEW",
  },

  {
    slug: "jude",
    titleKo: "유다서",
    titleEn: "Jude",
    chapters: 1,
    testament: "NEW",
  },

  {
    slug: "revelation",
    titleKo: "요한계시록",
    titleEn: "Revelation",
    chapters: 22,
    testament: "NEW",
  },
];


/* =====================================================
   BUILD BOOK
   ===================================================== */

function createCatalogBook(
  seed: BibleSeed
): BibleCatalogBook {

  const testamentLabel =
    seed.testament ===
    "OLD"
      ? "OLD TESTAMENT"
      : "NEW TESTAMENT";


  const scriptureRange =
    seed.chapters ===
      1
      ? `${seed.titleEn} 1`
      : `${seed.titleEn} 1–${seed.chapters}`;


  return {
    type:
      "book",

    slug:
      seed.slug,

    titleKo:
      seed.titleKo,

    titleEn:
      seed.titleEn,

    testament:
      seed.testament,

    chapterCount:
      seed.chapters,

    eyebrow:
      `BIBLE · ${testamentLabel}`,

    summary:
      `${seed.titleKo}(${seed.titleEn})를 탐험하는 SCRAPTURA 성경 아카이브입니다.`,

    overview:
      `${seed.titleKo}의 전체 흐름과 주요 인물, 장소, 사건을 연결해 탐험하기 위한 Book 페이지입니다.`,

    biblicalContext:
      "현재 기본 성경 권 정보가 제공되고 있습니다. 상세 Story, Person, Place 콘텐츠는 제작되는 순서대로 이 Book Node에 연결됩니다.",

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      scriptureRange,
    ],

    bookSections:
      [],

    relations:
      [],
  };
}


/* =====================================================
   66 BOOK CATALOG
   ===================================================== */

export const bibleCatalog:
  BibleCatalogBook[] = [

  ...oldTestament.map(
    createCatalogBook
  ),

  ...newTestament.map(
    createCatalogBook
  ),
];


/* =====================================================
   ROUTE ALIASES
   ===================================================== */

const aliases:
  Record<string, string> = {

  "book-of-joshua":
    "joshua",

  "psalm":
    "psalms",

  "song-of-solomon":
    "song-of-songs",

  "songs":
    "song-of-songs",

  "revelations":
    "revelation",
};


/* =====================================================
   NORMALIZE ROUTE
   ===================================================== */

export function normalizeBibleRouteSlug(
  value: string
): string {

  const slug =
    value
      .trim()
      .toLowerCase();


  return (
    aliases[slug] ??
    slug
  );
}


/* =====================================================
   CONTENT.TS SLUG
   ===================================================== */

export function getContentBookSlug(
  value: string
): string {

  const slug =
    normalizeBibleRouteSlug(
      value
    );


  /*
   * 현재 상세 여호수아 데이터의
   * 실제 local slug
   */

  if (
    slug ===
    "joshua"
  ) {

    return "book-of-joshua";

  }


  return slug;
}


/* =====================================================
   GET BIBLE CATALOG BOOK
   ===================================================== */

export function getBibleCatalogBook(
  value: string
): BibleCatalogBook | null {

  const slug =
    normalizeBibleRouteSlug(
      value
    );


  return (
    bibleCatalog.find(
      (
        book
      ) =>
        book.slug ===
        slug
    ) ??
    null
  );
}


/* =====================================================
   TESTAMENT EXPORT
   ===================================================== */

export const oldTestamentBooks =
  bibleCatalog.filter(
    (
      book
    ) =>
      book.testament ===
      "OLD"
  );


export const newTestamentBooks =
  bibleCatalog.filter(
    (
      book
    ) =>
      book.testament ===
      "NEW"
  );


/* =====================================================
   VALIDATION
   ===================================================== */

if (
  bibleCatalog.length !==
  66
) {

  throw new Error(
    `SCRAPTURA Bible Catalog 오류: ${bibleCatalog.length}/66`
  );

}