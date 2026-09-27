export type JourneyStep = {
  label:
    | "PERSON"
    | "STORY"
    | "PLACE"
    | "PERIOD"
    | "SCRIPTURE";

  title: string;

  href: string;
};


export type Journey = {
  slug: string;

  number: string;

  label: string;

  titleKo: string;

  titleEn: string;

  description: string;

  image: string;

  steps: JourneyStep[];

  returnHref: string;

  returnLabel: string;
};


export const journeys:
  Journey[] = [

  /* =====================================================
     JOURNEY 01
     THE RISE OF DAVID
     ===================================================== */

  {
    slug:
      "rise-of-david",

    number:
      "01",

    label:
      "FEATURED JOURNEY",

    titleKo:
      "다윗의 부르심에서 왕국까지",

    titleEn:
      "THE RISE OF DAVID",

    description:
      "베들레헴의 목동에서 이스라엘의 왕이 되기까지, 다윗의 여정을 이야기·인물·장소·시대를 연결하며 따라갑니다.",

    image:
      "/assets/scraptura-david.jpg",

    steps: [

      {
        label:
          "PERSON",

        title:
          "다윗",

        href:
          "/people/david",
      },

      {
        label:
          "STORY",

        title:
          "다윗의 기름 부음",

        href:
          "/stories/david-is-anointed",
      },

      {
        label:
          "STORY",

        title:
          "다윗과 골리앗",

        href:
          "/stories/david-and-goliath",
      },

      {
        label:
          "PLACE",

        title:
          "엘라 골짜기",

        href:
          "/places/valley-of-elah",
      },

      {
        label:
          "PERSON",

        title:
          "요나단",

        href:
          "/people/jonathan",
      },

      {
        label:
          "PERIOD",

        title:
          "사울과 다윗의 시대",

        href:
          "/timeline/rise-of-david",
      },

      {
        label:
          "STORY",

        title:
          "다윗이 왕이 되다",

        href:
          "/stories/david-becomes-king",
      },

      {
        label:
          "SCRIPTURE",

        title:
          "사무엘상",

        href:
          "/bible/1-samuel",
      },

    ],

    returnHref:
      "/bible/1-samuel",

    returnLabel:
      "READ 1 SAMUEL",
  },


  /* =====================================================
     JOURNEY 02
     THE BIRTH OF THE KINGDOM
     ===================================================== */

  {
    slug:
      "birth-of-the-kingdom",

    number:
      "02",

    label:
      "HISTORICAL JOURNEY",

    titleKo:
      "사울에서 다윗 왕국까지",

    titleEn:
      "THE BIRTH OF THE KINGDOM",

    description:
      "사무엘과 사울의 시대에서 다윗의 등장, 길보아산의 전환점과 헤브론·예루살렘을 거쳐 이스라엘 통일 왕국이 형성되는 흐름을 따라갑니다.",

    image:
      "/assets/scraptura-jerusalem.jpg",

    steps: [

      {
        label:
          "PERSON",

        title:
          "사무엘",

        href:
          "/people/samuel",
      },

      {
        label:
          "PERSON",

        title:
          "사울",

        href:
          "/people/saul",
      },

      {
        label:
          "STORY",

        title:
          "다윗의 기름 부음",

        href:
          "/stories/david-is-anointed",
      },

      {
        label:
          "STORY",

        title:
          "다윗과 골리앗",

        href:
          "/stories/david-and-goliath",
      },

      {
        label:
          "PERSON",

        title:
          "요나단",

        href:
          "/people/jonathan",
      },

      {
        label:
          "PLACE",

        title:
          "길보아산",

        href:
          "/places/mount-gilboa",
      },

      {
        label:
          "STORY",

        title:
          "다윗이 왕이 되다",

        href:
          "/stories/david-becomes-king",
      },

      {
        label:
          "PLACE",

        title:
          "헤브론",

        href:
          "/places/hebron",
      },

      {
        label:
          "PLACE",

        title:
          "예루살렘",

        href:
          "/places/jerusalem",
      },

      {
        label:
          "PERIOD",

        title:
          "통일 왕국",

        href:
          "/timeline/united-kingdom",
      },

      {
        label:
          "SCRIPTURE",

        title:
          "사무엘상",

        href:
          "/bible/1-samuel",
      },

    ],

    returnHref:
      "/bible/1-samuel",

    returnLabel:
      "READ 1 SAMUEL",
  },

];


/* =====================================================
   GET JOURNEY
   ===================================================== */

export function getJourney(
  slug: string
) {

  return journeys.find(
    (journey) =>
      journey.slug ===
      slug
  );

}