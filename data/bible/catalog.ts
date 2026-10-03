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


type Seed = [
  string,
  string,
  string,
  number,
  BibleTestament
];


const seeds: Seed[] = [

  // OLD TESTAMENT 39

  ["genesis", "창세기", "Genesis", 50, "OLD"],
  ["exodus", "출애굽기", "Exodus", 40, "OLD"],
  ["leviticus", "레위기", "Leviticus", 27, "OLD"],
  ["numbers", "민수기", "Numbers", 36, "OLD"],
  ["deuteronomy", "신명기", "Deuteronomy", 34, "OLD"],

  ["joshua", "여호수아", "Joshua", 24, "OLD"],
  ["judges", "사사기", "Judges", 21, "OLD"],
  ["ruth", "룻기", "Ruth", 4, "OLD"],

  ["1-samuel", "사무엘상", "1 Samuel", 31, "OLD"],
  ["2-samuel", "사무엘하", "2 Samuel", 24, "OLD"],

  ["1-kings", "열왕기상", "1 Kings", 22, "OLD"],
  ["2-kings", "열왕기하", "2 Kings", 25, "OLD"],

  ["1-chronicles", "역대상", "1 Chronicles", 29, "OLD"],
  ["2-chronicles", "역대하", "2 Chronicles", 36, "OLD"],

  ["ezra", "에스라", "Ezra", 10, "OLD"],
  ["nehemiah", "느헤미야", "Nehemiah", 13, "OLD"],
  ["esther", "에스더", "Esther", 10, "OLD"],

  ["job", "욥기", "Job", 42, "OLD"],
  ["psalms", "시편", "Psalms", 150, "OLD"],
  ["proverbs", "잠언", "Proverbs", 31, "OLD"],
  ["ecclesiastes", "전도서", "Ecclesiastes", 12, "OLD"],
  ["song-of-songs", "아가", "Song of Songs", 8, "OLD"],

  ["isaiah", "이사야", "Isaiah", 66, "OLD"],
  ["jeremiah", "예레미야", "Jeremiah", 52, "OLD"],
  ["lamentations", "예레미야애가", "Lamentations", 5, "OLD"],
  ["ezekiel", "에스겔", "Ezekiel", 48, "OLD"],
  ["daniel", "다니엘", "Daniel", 12, "OLD"],

  ["hosea", "호세아", "Hosea", 14, "OLD"],
  ["joel", "요엘", "Joel", 3, "OLD"],
  ["amos", "아모스", "Amos", 9, "OLD"],
  ["obadiah", "오바댜", "Obadiah", 1, "OLD"],
  ["jonah", "요나", "Jonah", 4, "OLD"],
  ["micah", "미가", "Micah", 7, "OLD"],
  ["nahum", "나훔", "Nahum", 3, "OLD"],
  ["habakkuk", "하박국", "Habakkuk", 3, "OLD"],
  ["zephaniah", "스바냐", "Zephaniah", 3, "OLD"],
  ["haggai", "학개", "Haggai", 2, "OLD"],
  ["zechariah", "스가랴", "Zechariah", 14, "OLD"],
  ["malachi", "말라기", "Malachi", 4, "OLD"],


  // NEW TESTAMENT 27

  ["matthew", "마태복음", "Matthew", 28, "NEW"],
  ["mark", "마가복음", "Mark", 16, "NEW"],
  ["luke", "누가복음", "Luke", 24, "NEW"],
  ["john", "요한복음", "John", 21, "NEW"],
  ["acts", "사도행전", "Acts", 28, "NEW"],

  ["romans", "로마서", "Romans", 16, "NEW"],

  ["1-corinthians", "고린도전서", "1 Corinthians", 16, "NEW"],
  ["2-corinthians", "고린도후서", "2 Corinthians", 13, "NEW"],

  ["galatians", "갈라디아서", "Galatians", 6, "NEW"],
  ["ephesians", "에베소서", "Ephesians", 6, "NEW"],
  ["philippians", "빌립보서", "Philippians", 4, "NEW"],
  ["colossians", "골로새서", "Colossians", 4, "NEW"],

  ["1-thessalonians", "데살로니가전서", "1 Thessalonians", 5, "NEW"],
  ["2-thessalonians", "데살로니가후서", "2 Thessalonians", 3, "NEW"],

  ["1-timothy", "디모데전서", "1 Timothy", 6, "NEW"],
  ["2-timothy", "디모데후서", "2 Timothy", 4, "NEW"],

  ["titus", "디도서", "Titus", 3, "NEW"],
  ["philemon", "빌레몬서", "Philemon", 1, "NEW"],

  ["hebrews", "히브리서", "Hebrews", 13, "NEW"],
  ["james", "야고보서", "James", 5, "NEW"],

  ["1-peter", "베드로전서", "1 Peter", 5, "NEW"],
  ["2-peter", "베드로후서", "2 Peter", 3, "NEW"],

  ["1-john", "요한일서", "1 John", 5, "NEW"],
  ["2-john", "요한이서", "2 John", 1, "NEW"],
  ["3-john", "요한삼서", "3 John", 1, "NEW"],

  ["jude", "유다서", "Jude", 1, "NEW"],

  ["revelation", "요한계시록", "Revelation", 22, "NEW"],
];


function createBook(
  seed: Seed
): BibleCatalogBook {

  const [
    slug,
    titleKo,
    titleEn,
    chapterCount,
    testament,
  ] = seed;


  const testamentLabel =
    testament === "OLD"
      ? "OLD TESTAMENT"
      : "NEW TESTAMENT";


  return {
    type: "book",

    slug,

    titleKo,

    titleEn,

    testament,

    chapterCount,

    eyebrow:
      `BIBLE · ${testamentLabel}`,

    summary:
      `${titleKo}(${titleEn})를 탐험하는 SCRAPTURA 성경 아카이브입니다.`,

    overview:
      `${titleKo}의 전체 흐름과 주요 인물, 장소, 사건을 연결해 탐험하기 위한 Book 페이지입니다.`,

    biblicalContext:
      "현재 기본 성경 권 정보가 제공되고 있습니다. 상세 Story, Person, Place 콘텐츠는 제작되는 순서대로 연결됩니다.",

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      chapterCount === 1
        ? `${titleEn} 1`
        : `${titleEn} 1–${chapterCount}`,
    ],

    bookSections: [],

    relations: [],
  };
}


export const bibleCatalog:
  BibleCatalogBook[] =
  seeds.map(
    createBook
  );


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


export function getContentBookSlug(
  value: string
): string {

  const slug =
    normalizeBibleRouteSlug(
      value
    );


  if (
    slug === "joshua"
  ) {

    return "book-of-joshua";

  }


  return slug;
}


export function getBibleCatalogBook(
  value: string
):
  BibleCatalogBook | null {

  const slug =
    normalizeBibleRouteSlug(
      value
    );


  return (
    bibleCatalog.find(
      (book) =>
        book.slug === slug
    ) ??
    null
  );
}


export const oldTestamentBooks =
  bibleCatalog.filter(
    (book) =>
      book.testament === "OLD"
  );


export const newTestamentBooks =
  bibleCatalog.filter(
    (book) =>
      book.testament === "NEW"
  );


if (
  bibleCatalog.length !== 66
) {

  throw new Error(
    `Bible Catalog 오류: ${bibleCatalog.length}/66`
  );

}