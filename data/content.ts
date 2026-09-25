export type ContentType =
  | "story"
  | "person"
  | "place"
  | "period"
  | "book"
  | "visual";

export type RelationType =
  | "RELATED_PERSON"
  | "RELATED_PLACE"
  | "RELATED_PERIOD"
  | "RELATED_BOOK"
  | "RELATED_STORY";


/* =====================================================
   RELATION
   ===================================================== */

export type Relation = {
  targetType: ContentType;
  targetSlug: string;
  relationType: RelationType;
  label: string;
};


/* =====================================================
   STORY SCENE
   ===================================================== */

export type StoryScene = {
  number: string;
  title: string;
  scripture: string;
  description: string;
  image?: string;
};

export type CharacterStage = {
  number: string;
  title: string;
  scripture: string;
  description: string;
};


/* =====================================================
   CONTENT NODE
   ===================================================== */

export type ContentNode = {
  type: ContentType;

  slug: string;

  titleKo: string;
  titleEn: string;

  eyebrow: string;

  summary: string;

  heroImage: string;

  overview?: string;

  biblicalContext?: string;

  keyEvent?: {
    title: string;
    scripture: string;
    description: string;
  };

  periodStages?: CharacterStage[];

  bookSections?: CharacterStage[];

  scenes?: StoryScene[];

  characterJourney?: CharacterStage[];

  scripture?: string[];

  relations?: Relation[];
};


/* =====================================================
   CONTENT DATA
   ===================================================== */

export const nodes: ContentNode[] = [

  /* =====================================================
     STORY — DAVID & GOLIATH
     ===================================================== */

  {
    type: "story",

    slug: "david-and-goliath",

    titleKo: "다윗과 골리앗",

    titleEn: "David & Goliath",

    eyebrow: "STORY · 1 SAMUEL 17",

    summary:
      "이스라엘과 블레셋이 대치한 엘라 골짜기. 블레셋의 전사 골리앗이 이스라엘을 향해 도전하자, 베들레헴에서 온 젊은 목동 다윗이 그와 맞섭니다. 다윗은 사울의 갑옷 대신 자신에게 익숙한 물매와 돌을 선택하고 골리앗과 대결합니다.",

    overview:
      "이스라엘과 블레셋의 군대가 엘라 골짜기를 사이에 두고 대치합니다. 블레셋 진영에서는 가드 출신의 전사 골리앗이 나와 이스라엘 군대에 일대일 전투를 요구합니다. 이스라엘 사람들이 두려워하는 가운데, 베들레헴에서 형들에게 음식을 전달하기 위해 전쟁터에 온 다윗이 그의 도전을 듣게 됩니다. 다윗은 사울의 갑옷을 사용하지 않고 자신에게 익숙한 물매를 들고 골리앗과 맞섭니다. 이 사건은 이후 이스라엘 역사에서 중요한 인물로 등장하는 다윗의 초기 이야기를 구성합니다.",


    /* =================================================
       SCENE SEQUENCE
       ================================================= */

    scenes: [
      {
        number: "01",
        title: "THE VALLEY",
        scripture: "1 Samuel 17:1–3",
        description:
          "이스라엘과 블레셋의 군대가 엘라 골짜기를 사이에 두고 서로 마주합니다.",
        image: "/assets/story-david-goliath-01.jpg",
      },

      {
        number: "02",
        title: "THE CHALLENGE",
        scripture: "1 Samuel 17:4–11",
        description:
          "가드 출신의 골리앗이 블레셋 진영에서 나와 이스라엘에 일대일 전투를 요구합니다.",
        image: "/assets/story-david-goliath-02.jpg",
      },

      {
        number: "03",
        title: "THE SHEPHERD",
        scripture: "1 Samuel 17:12–30",
        description:
          "베들레헴에서 양을 돌보던 다윗이 아버지 이새의 부탁을 받고 형들이 있는 전쟁터에 도착합니다.",
        image: "/assets/story-david-goliath-03.jpg",
      },

      {
        number: "04",
        title: "THE FIVE STONES",
        scripture: "1 Samuel 17:31–40",
        description:
          "다윗은 사울의 갑옷 대신 자신에게 익숙한 물매를 선택하고 시냇가에서 돌 다섯 개를 고릅니다.",
        image: "/assets/story-david-goliath-04.jpg",
      },

      {
        number: "05",
        title: "THE BATTLE",
        scripture: "1 Samuel 17:41–51",
        description:
          "다윗은 골리앗과 맞서 물매로 돌을 던지고 골리앗을 쓰러뜨립니다.",
        image: "/assets/story-david-goliath-05.jpg",
      },

      {
        number: "06",
        title: "THE AFTERMATH",
        scripture: "1 Samuel 17:52–58",
        description:
          "골리앗이 쓰러진 뒤 블레셋 군대가 도망하고 이스라엘 군대가 그들을 추격합니다.",
        image: "/assets/story-david-goliath-06.jpg",
      },
    ],


    heroImage:
      "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 17",
    ],

    /* =================================================
       RELATIONS
       ================================================= */


    relations: [

      /* PEOPLE */

      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
      },

      {
        targetType: "person",
        targetSlug: "goliath",
        relationType: "RELATED_PERSON",
        label: "골리앗",
      },

      {
        targetType: "person",
        targetSlug: "saul",
        relationType: "RELATED_PERSON",
        label: "사울",
      },


      /* PLACES */

      {
        targetType: "place",
        targetSlug: "valley-of-elah",
        relationType: "RELATED_PLACE",
        label: "엘라 골짜기",
      },

      {
        targetType: "place",
        targetSlug: "bethlehem",
        relationType: "RELATED_PLACE",
        label: "베들레헴",
      },

      {
        targetType: "place",
        targetSlug: "gath",
        relationType: "RELATED_PLACE",
        label: "가드",
      },


      /* PERIOD */

      {
        targetType: "period",
        targetSlug: "rise-of-david",
        relationType: "RELATED_PERIOD",
        label: "사울과 다윗의 시대",
      },


      /* BIBLE */

      {
        targetType: "book",
        targetSlug: "1-samuel",
        relationType: "RELATED_BOOK",
        label: "사무엘상",
      },

    ],

  }, // ← 빠져 있던 David & Goliath 객체 종료

    /* =====================================================
     STORY — DAVID IS ANOINTED
     ===================================================== */

  {
    type: "story",
    slug: "david-is-anointed",
    titleKo: "다윗의 기름 부음",
    titleEn: "David Is Anointed",
    eyebrow: "STORIES · 1 SAMUEL 16",

    summary:
      "사무엘이 베들레헴의 이새 집을 찾아가고, 들에서 양을 돌보던 다윗에게 기름을 붓는 이야기입니다.",

    overview:
      "사무엘상 16장은 사울의 왕권에 대한 이전 장의 선언 이후 새로운 인물이 등장하는 전환점입니다. 사무엘은 베들레헴의 이새에게 보내지고, 이새의 아들들을 차례로 본 뒤 막내 다윗을 불러 그에게 기름을 붓습니다.",

    scenes: [
      {
        number: "01",
        title: "THE JOURNEY TO BETHLEHEM",
        scripture: "1 Samuel 16:1–5",
        description:
          "사무엘은 베들레헴으로 가서 이새와 그의 아들들을 제사에 초대합니다.",
      },
      {
        number: "02",
        title: "THE SONS OF JESSE",
        scripture: "1 Samuel 16:6–10",
        description:
          "사무엘은 이새의 아들들을 차례로 보지만 그들 가운데 선택된 사람을 찾지 못합니다.",
      },
      {
        number: "03",
        title: "THE YOUNGEST SON",
        scripture: "1 Samuel 16:11",
        description:
          "사무엘은 다른 아들이 있는지 묻고, 들에서 양을 돌보던 막내 다윗이 불려옵니다.",
      },
      {
        number: "04",
        title: "THE ANOINTING",
        scripture: "1 Samuel 16:12–13",
        description:
          "다윗이 도착하자 사무엘은 그에게 기름을 붓습니다. 다윗의 인물 여정에서 중요한 전환점입니다.",
      },
    ],

    heroImage: "/assets/scraptura-david.jpg",

    scripture: ["1 Samuel 16:1–13"],

    relations: [
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "person", targetSlug: "samuel", relationType: "RELATED_PERSON", label: "사무엘" },
      { targetType: "person", targetSlug: "jesse", relationType: "RELATED_PERSON", label: "이새" },
      { targetType: "person", targetSlug: "eliab", relationType: "RELATED_PERSON", label: "엘리압" },
      { targetType: "place", targetSlug: "bethlehem", relationType: "RELATED_PLACE", label: "베들레헴" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     STORY — DAVID & JONATHAN
     ===================================================== */

  {
    type: "story",
    slug: "david-and-jonathan",
    titleKo: "다윗과 요나단",
    titleEn: "David & Jonathan",
    eyebrow: "STORIES · 1 SAMUEL 18–20",

    summary:
      "다윗과 요나단이 깊은 관계와 언약을 맺고, 사울과 다윗의 갈등 속에서 서로를 지키는 이야기입니다.",

    overview:
      "다윗이 골리앗과의 사건 이후 사울의 궁정과 군대에서 중요한 인물로 부각되는 가운데 요나단과 다윗의 관계가 시작됩니다. 사울의 적대감이 커지면서 요나단은 다윗을 보호하고 두 사람은 서로의 관계와 미래에 관한 언약을 확인합니다.",

    scenes: [
      {
        number: "01",
        title: "THE COVENANT",
        scripture: "1 Samuel 18:1–4",
        description:
          "요나단과 다윗은 깊은 관계를 맺고 언약을 세웁니다.",
      },
      {
        number: "02",
        title: "SAUL'S HOSTILITY",
        scripture: "1 Samuel 19:1–7",
        description:
          "사울이 다윗을 죽이려 하자 요나단은 다윗에게 위험을 알리고 사울에게 다윗을 변호합니다.",
      },
      {
        number: "03",
        title: "THE WARNING",
        scripture: "1 Samuel 20:1–34",
        description:
          "다윗과 요나단은 사울의 의도를 확인하기 위한 계획을 세우고 상황이 위험하다는 사실을 확인합니다.",
      },
      {
        number: "04",
        title: "THE FAREWELL",
        scripture: "1 Samuel 20:35–42",
        description:
          "두 사람은 서로의 언약을 다시 확인한 뒤 헤어집니다.",
      },
    ],

    heroImage: "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel 18:1–4",
      "1 Samuel 19:1–7",
      "1 Samuel 20",
    ],

    relations: [
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "person", targetSlug: "jonathan", relationType: "RELATED_PERSON", label: "요나단" },
      { targetType: "person", targetSlug: "saul", relationType: "RELATED_PERSON", label: "사울" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     STORY — DAVID BECOMES KING
     ===================================================== */

  {
    type: "story",
    slug: "david-becomes-king",
    titleKo: "다윗이 왕이 되다",
    titleEn: "David Becomes King",
    eyebrow: "STORIES · 2 SAMUEL 2–5",

    summary:
      "사울 사후 다윗이 헤브론에서 유다의 왕이 되고, 이후 이스라엘 전체의 왕으로 세워져 예루살렘으로 향하는 이야기입니다.",

    overview:
      "사울의 죽음 이후 다윗의 이야기는 도피 생활에서 실제 왕권의 형성으로 전환됩니다. 다윗은 헤브론에서 먼저 유다의 왕으로 세워지고, 이후 이스라엘의 장로들이 그에게 나아와 이스라엘의 왕으로 기름을 붓습니다. 이어 예루살렘을 점령하면서 새로운 통치 중심지가 형성됩니다.",

    scenes: [
      {
        number: "01",
        title: "HEBRON",
        scripture: "2 Samuel 2:1–4",
        description:
          "다윗은 헤브론으로 올라가고 유다 사람들이 그에게 기름을 부어 유다의 왕으로 세웁니다.",
      },
      {
        number: "02",
        title: "THE YEARS OF TRANSITION",
        scripture: "2 Samuel 2–4",
        description:
          "사울 왕가와 다윗의 집 사이에 긴장이 이어지며 왕권의 전환 과정이 전개됩니다.",
      },
      {
        number: "03",
        title: "KING OVER ISRAEL",
        scripture: "2 Samuel 5:1–5",
        description:
          "이스라엘의 장로들이 헤브론에서 다윗을 왕으로 세웁니다.",
      },
      {
        number: "04",
        title: "JERUSALEM",
        scripture: "2 Samuel 5:6–12",
        description:
          "다윗은 예루살렘을 점령하고 그곳을 자신의 통치 중심지로 삼습니다.",
      },
    ],

    heroImage: "/assets/scraptura-jerusalem.jpg",

    scripture: [
      "2 Samuel 2:1–4",
      "2 Samuel 5:1–12",
    ],

    relations: [
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "place", targetSlug: "hebron", relationType: "RELATED_PLACE", label: "헤브론" },
      { targetType: "place", targetSlug: "jerusalem", relationType: "RELATED_PLACE", label: "예루살렘" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "period", targetSlug: "united-kingdom", relationType: "RELATED_PERIOD", label: "통일 왕국" },
    ],
  },


  /* =====================================================
     PERSON — GOLIATH
     ===================================================== */

  {
    type: "person",

    slug: "goliath",

    titleKo: "골리앗",

    titleEn: "Goliath",

    eyebrow:
      "PEOPLE · PHILISTINE WARRIOR",

    summary:
      "가드 출신의 블레셋 전사로, 엘라 골짜기에서 이스라엘 군대를 향해 일대일 전투를 요구한 인물입니다.",
 



    characterJourney: [
      {
        number: "01",
        title: "THE WARRIOR OF GATH",
        scripture: "1 Samuel 17:4–7",
        description:
          "골리앗은 가드 출신의 블레셋 전사로 등장합니다. 본문은 그의 무장과 전투 장비를 상세하게 묘사합니다.",
      },
      {
        number: "02",
        title: "THE CHALLENGE",
        scripture: "1 Samuel 17:8–11",
        description:
          "골리앗은 이스라엘 진영을 향해 한 사람을 선택해 자신과 싸우게 하라고 요구하며 반복적으로 도전합니다.",
      },
      {
        number: "03",
        title: "THE CONFRONTATION",
        scripture: "1 Samuel 17:41–47",
        description:
          "골리앗과 다윗이 서로 마주합니다. 두 사람의 대화는 이 대결을 단순한 무력의 충돌을 넘어 서로 다른 확신이 맞서는 장면으로 보여줍니다.",
      },
      {
        number: "04",
        title: "THE FALL",
        scripture: "1 Samuel 17:48–51",
        description:
          "다윗이 물매로 던진 돌에 골리앗이 쓰러지면서 대결은 끝나고, 전투의 흐름도 이스라엘 쪽으로 바뀌게 됩니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 17",
    ],

    relations: [
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "person", targetSlug: "saul", relationType: "RELATED_PERSON", label: "사울" },
      { targetType: "place", targetSlug: "gath", relationType: "RELATED_PLACE", label: "가드" },
      { targetType: "place", targetSlug: "valley-of-elah", relationType: "RELATED_PLACE", label: "엘라 골짜기" },
      { targetType: "story", targetSlug: "david-and-goliath", relationType: "RELATED_STORY", label: "다윗과 골리앗" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],

  },


  /* =====================================================
     PERSON — SAUL
     ===================================================== */

  {
    type: "person",

    slug: "saul",

    titleKo: "사울",

    titleEn: "Saul",

    eyebrow:
      "PEOPLE · KING OF ISRAEL",

    summary:
      "이스라엘의 왕으로서 블레셋과 대치했으며, 엘라 골짜기에서 골리앗의 도전을 받은 이스라엘 군대를 이끌었습니다.",

    characterJourney: [
      {
        number: "01",
        title: "THE CHOSEN KING",
        scripture: "1 Samuel 9–10",
        description:
          "사울은 베냐민 지파 출신으로 등장하며, 사무엘을 통해 기름 부음을 받고 이스라엘의 왕으로 세워집니다.",
      },
      {
        number: "02",
        title: "THE KINGDOM",
        scripture: "1 Samuel 11–14",
        description:
          "왕이 된 사울은 이스라엘을 이끌고 주변 세력과 전쟁을 벌입니다. 그의 통치 초기에는 군사적 승리와 왕권의 확립이 이어집니다.",
      },
      {
        number: "03",
        title: "THE REJECTION",
        scripture: "1 Samuel 15",
        description:
          "아말렉과의 전쟁 이후 사무엘은 사울의 행동을 책망합니다. 이 사건은 사울의 통치와 이후 다윗의 등장 사이를 연결하는 중요한 전환점이 됩니다.",
      },
      {
        number: "04",
        title: "THE RISE OF DAVID",
        scripture: "1 Samuel 16–18",
        description:
          "다윗이 등장하고 골리앗과의 대결 이후 명성을 얻으면서 사울과 다윗의 관계에도 변화가 시작됩니다.",
      },
      {
        number: "05",
        title: "THE PURSUIT",
        scripture: "1 Samuel 19–26",
        description:
          "사울은 다윗을 위협적인 존재로 여기며 여러 차례 그를 추격합니다. 다윗의 도피 생활과 사울의 통치 후반부가 이 시기에 서로 얽혀 전개됩니다.",
      },
      {
        number: "06",
        title: "THE FINAL BATTLE",
        scripture: "1 Samuel 28–31",
        description:
          "블레셋과의 전쟁이 다시 격화되는 가운데 사울의 통치는 마지막 국면에 들어갑니다. 길보아산 전투에서 사울과 그의 아들들이 죽으면서 그의 시대가 끝납니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 9–31",
    ],

    relations: [
      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
      },
      {
        targetType: "person",
        targetSlug: "goliath",
        relationType: "RELATED_PERSON",
        label: "골리앗",
      },
      {
        targetType: "place",
        targetSlug: "valley-of-elah",
        relationType: "RELATED_PLACE",
        label: "엘라 골짜기",
      },
      {
        targetType: "story",
        targetSlug: "david-and-goliath",
        relationType: "RELATED_STORY",
        label: "다윗과 골리앗",
      },
      {
        targetType: "period",
        targetSlug: "rise-of-david",
        relationType: "RELATED_PERIOD",
        label: "사울과 다윗의 시대",
      },
      {
        targetType: "book",
        targetSlug: "1-samuel",
        relationType: "RELATED_BOOK",
        label: "사무엘상",
      },
    ],

  },


  /* =====================================================
     PERSON — SAMUEL
     ===================================================== */

  {
    type: "person",
    slug: "samuel",
    titleKo: "사무엘",
    titleEn: "Samuel",
    eyebrow: "PEOPLE · PROPHET & JUDGE",

    summary:
      "이스라엘의 사사이자 예언자로 활동하며 사울과 다윗의 왕정 전환을 연결하는 핵심 인물입니다.",

    overview:
      "사무엘은 사무엘상 초반부터 등장해 이스라엘을 이끌고, 왕을 요구하는 백성에게 왕정의 의미를 경고하며, 이후 사울과 다윗에게 기름을 붓습니다. 사울의 시대와 다윗의 등장을 연결하는 중심 인물입니다.",

    characterJourney: [
      {
        number: "01",
        title: "THE CHILD",
        scripture: "1 Samuel 1–3",
        description:
          "한나의 아들로 태어나 실로에서 성장하며 하나님의 부르심을 받습니다.",
      },
      {
        number: "02",
        title: "THE JUDGE",
        scripture: "1 Samuel 7",
        description:
          "이스라엘을 이끌며 미스바에서 백성을 모으고 블레셋과의 위기 속에서 지도력을 발휘합니다.",
      },
      {
        number: "03",
        title: "THE REQUEST FOR A KING",
        scripture: "1 Samuel 8",
        description:
          "이스라엘 백성이 왕을 요구하자 왕정이 가져올 결과를 설명합니다.",
      },
      {
        number: "04",
        title: "SAUL IS ANOINTED",
        scripture: "1 Samuel 9–10",
        description:
          "사울을 만나 그에게 기름을 붓고 이스라엘의 왕으로 세워지는 과정에 참여합니다.",
      },
      {
        number: "05",
        title: "THE REJECTION OF SAUL",
        scripture: "1 Samuel 13–15",
        description:
          "사울의 행동을 책망하며 그의 왕권과 관련된 중요한 선언을 전합니다.",
      },
      {
        number: "06",
        title: "DAVID IS ANOINTED",
        scripture: "1 Samuel 16:1–13",
        description:
          "베들레헴의 이새 집에서 다윗에게 기름을 부으며 새로운 왕의 서사가 시작됩니다.",
      },
    ],

    heroImage: "/assets/scraptura-david.jpg",

    scripture: ["1 Samuel 1–16"],

    relations: [
      { targetType: "person", targetSlug: "saul", relationType: "RELATED_PERSON", label: "사울" },
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "person", targetSlug: "jesse", relationType: "RELATED_PERSON", label: "이새" },
      { targetType: "place", targetSlug: "bethlehem", relationType: "RELATED_PLACE", label: "베들레헴" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     PERSON — JONATHAN
     ===================================================== */

  {
    type: "person",
    slug: "jonathan",
    titleKo: "요나단",
    titleEn: "Jonathan",
    eyebrow: "PEOPLE · HOUSE OF SAUL",

    summary:
      "사울의 아들이자 다윗과 깊은 관계를 맺으며 사울 왕가와 다윗의 이야기를 연결하는 인물입니다.",

    overview:
      "요나단은 사울의 아들로서 블레셋과의 전투에서 활약하며, 이후 다윗과 언약을 맺습니다. 사울과 다윗의 갈등이 깊어지는 과정에서 다윗을 보호하고 돕는 중요한 역할을 합니다.",

    characterJourney: [
      {
        number: "01",
        title: "THE WARRIOR",
        scripture: "1 Samuel 13–14",
        description:
          "블레셋과의 전투에서 적극적으로 행동하며 사울 왕정 초기의 주요 전사로 등장합니다.",
      },
      {
        number: "02",
        title: "DAVID",
        scripture: "1 Samuel 18:1–4",
        description:
          "다윗과 깊은 관계를 맺고 언약을 세우며 자신의 의복과 무기를 다윗에게 줍니다.",
      },
      {
        number: "03",
        title: "BETWEEN SAUL & DAVID",
        scripture: "1 Samuel 19–20",
        description:
          "사울의 위협 속에서 다윗을 보호하고 두 사람 사이의 갈등을 중재하려 합니다.",
      },
      {
        number: "04",
        title: "THE COVENANT",
        scripture: "1 Samuel 20",
        description:
          "다윗과 다시 언약을 확인하며 서로의 관계와 미래의 가족에 대한 약속을 나눕니다.",
      },
      {
        number: "05",
        title: "THE FINAL MEETING",
        scripture: "1 Samuel 23:15–18",
        description:
          "다윗이 도피 중일 때 그를 만나 격려하고 두 사람의 언약을 다시 확인합니다.",
      },
      {
        number: "06",
        title: "MOUNT GILBOA",
        scripture: "1 Samuel 31",
        description:
          "블레셋과의 전투에서 사울과 함께 죽으며 그의 이야기가 마무리됩니다.",
      },
    ],

    heroImage: "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel 13–14",
      "1 Samuel 18–20",
      "1 Samuel 23",
      "1 Samuel 31",
    ],

    relations: [
      { targetType: "story", targetSlug: "david-and-jonathan", relationType: "RELATED_STORY", label: "다윗과 요나단" },
      { targetType: "person", targetSlug: "saul", relationType: "RELATED_PERSON", label: "사울" },
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     PERSON — JESSE
     ===================================================== */

  {
    type: "person",
    slug: "jesse",
    titleKo: "이새",
    titleEn: "Jesse",
    eyebrow: "PEOPLE · HOUSE OF BETHLEHEM",

    summary:
      "베들레헴에 살던 다윗의 아버지로, 다윗의 초기 이야기와 가족 배경을 연결하는 인물입니다.",

    overview:
      "이새는 베들레헴 사람으로 소개되며 여러 아들의 아버지입니다. 사무엘이 그의 집을 방문하면서 다윗의 기름 부음이 이루어지고, 이후 이새는 전장에 있는 아들들에게 다윗을 보내며 사무엘상 17장의 이야기와 연결됩니다.",

    characterJourney: [
      {
        number: "01",
        title: "BETHLEHEM",
        scripture: "1 Samuel 16:1",
        description:
          "베들레헴 사람으로 소개되며 그의 가정이 다윗의 초기 서사의 중심 배경이 됩니다.",
      },
      {
        number: "02",
        title: "SAMUEL ARRIVES",
        scripture: "1 Samuel 16:4–10",
        description:
          "사무엘이 그의 집을 찾아와 아들들을 살펴보는 장면에 등장합니다.",
      },
      {
        number: "03",
        title: "DAVID IS CALLED",
        scripture: "1 Samuel 16:11–13",
        description:
          "들에서 양을 돌보던 다윗이 불려오고 사무엘이 그에게 기름을 붓습니다.",
      },
      {
        number: "04",
        title: "THE ROAD TO THE VALLEY",
        scripture: "1 Samuel 17:17–20",
        description:
          "이새가 다윗에게 전장에 있는 형들에게 음식을 가져가도록 보내면서 다윗이 엘라 골짜기로 향합니다.",
      },
    ],

    heroImage: "/assets/scraptura-david.jpg",

    scripture: ["1 Samuel 16–17"],

    relations: [
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "person", targetSlug: "eliab", relationType: "RELATED_PERSON", label: "엘리압" },
      { targetType: "person", targetSlug: "samuel", relationType: "RELATED_PERSON", label: "사무엘" },
      { targetType: "place", targetSlug: "bethlehem", relationType: "RELATED_PLACE", label: "베들레헴" },
      { targetType: "story", targetSlug: "david-and-goliath", relationType: "RELATED_STORY", label: "다윗과 골리앗" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     PERSON — ELIAB
     ===================================================== */

  {
    type: "person",
    slug: "eliab",
    titleKo: "엘리압",
    titleEn: "Eliab",
    eyebrow: "PEOPLE · HOUSE OF JESSE",

    summary:
      "이새의 장남이자 다윗의 형으로, 다윗의 기름 부음과 엘라 골짜기 이야기에서 등장합니다.",

    overview:
      "엘리압은 이새의 장남으로 사무엘상 16장에서 사무엘 앞에 먼저 등장하지만 선택된 인물은 다윗입니다. 사무엘상 17장에서는 전장에 있던 형들 가운데 한 명으로 등장하며 골리앗의 도전에 관심을 보이는 다윗과 대화합니다.",

    characterJourney: [
      {
        number: "01",
        title: "BEFORE SAMUEL",
        scripture: "1 Samuel 16:6–7",
        description:
          "사무엘이 이새의 아들들을 살펴볼 때 가장 먼저 주목받지만 왕으로 선택되지는 않습니다.",
      },
      {
        number: "02",
        title: "THE ARMY",
        scripture: "1 Samuel 17:13",
        description:
          "사울을 따라 전쟁에 나간 이새의 세 아들 가운데 첫째로 언급됩니다.",
      },
      {
        number: "03",
        title: "DAVID ARRIVES",
        scripture: "1 Samuel 17:28–30",
        description:
          "전장에 도착한 다윗이 사람들과 이야기하는 것을 듣고 다윗을 꾸짖습니다.",
      },
    ],

    heroImage: "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 16:6–7",
      "1 Samuel 17:13",
      "1 Samuel 17:28–30",
    ],

    relations: [
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "person", targetSlug: "jesse", relationType: "RELATED_PERSON", label: "이새" },
      { targetType: "place", targetSlug: "bethlehem", relationType: "RELATED_PLACE", label: "베들레헴" },
      { targetType: "place", targetSlug: "valley-of-elah", relationType: "RELATED_PLACE", label: "엘라 골짜기" },
      { targetType: "story", targetSlug: "david-and-goliath", relationType: "RELATED_STORY", label: "다윗과 골리앗" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     PLACE — VALLEY OF ELAH
     ===================================================== */

  {
    type: "place",

    slug: "valley-of-elah",

    titleKo: "엘라 골짜기",

    titleEn: "Valley of Elah",

    eyebrow:
      "PLACES · BIBLICAL LANDSCAPE",

    summary:
      "이스라엘과 블레셋 군대가 대치하고 다윗과 골리앗의 이야기가 전개되는 핵심 장소입니다.",

    overview:
      "엘라 골짜기는 사무엘상 17장에서 이스라엘과 블레셋 군대가 서로 대치한 장소로 등장합니다. 성경 본문은 블레셋이 소고와 아세가 사이에 진을 치고, 이스라엘이 엘라 골짜기에 진을 쳤다고 기록합니다. 이 공간은 다윗과 골리앗의 대결이 전개되는 이야기의 중심 무대입니다.",

    biblicalContext:
      "사무엘상 17장의 서사는 두 군대가 골짜기를 사이에 두고 마주한 상황에서 시작됩니다. 블레셋 진영의 골리앗이 이스라엘을 향해 대표 전사를 요구하고, 이후 베들레헴에서 온 다윗이 전장에 도착하면서 이야기가 전환됩니다. 따라서 엘라 골짜기는 장소 정보에 그치지 않고 다윗의 초기 서사와 사울 시대의 군사적 긴장을 연결하는 공간으로 기능합니다.",

    keyEvent: {
      title: "David & Goliath",
      scripture: "1 Samuel 17",
      description:
        "엘라 골짜기에서 다윗은 블레셋 전사 골리앗과 맞섭니다. 이 사건은 다윗이 이스라엘의 이야기에서 본격적으로 부각되는 대표적인 장면 가운데 하나입니다.",
    },

    heroImage:
      "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 17:1–3",
      "1 Samuel 17:19",
      "1 Samuel 17:40–51",
    ],

    relations: [
      { targetType: "place", targetSlug: "socoh", relationType: "RELATED_PLACE", label: "소고" },
      { targetType: "place", targetSlug: "azekah", relationType: "RELATED_PLACE", label: "아세가" },
      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
      },
      {
        targetType: "person",
        targetSlug: "goliath",
        relationType: "RELATED_PERSON",
        label: "골리앗",
      },
      {
        targetType: "person",
        targetSlug: "saul",
        relationType: "RELATED_PERSON",
        label: "사울",
      },
      {
        targetType: "place",
        targetSlug: "bethlehem",
        relationType: "RELATED_PLACE",
        label: "베들레헴",
      },
      {
        targetType: "place",
        targetSlug: "gath",
        relationType: "RELATED_PLACE",
        label: "가드",
      },
      {
        targetType: "story",
        targetSlug: "david-and-goliath",
        relationType: "RELATED_STORY",
        label: "다윗과 골리앗",
      },
      {
        targetType: "period",
        targetSlug: "rise-of-david",
        relationType: "RELATED_PERIOD",
        label: "사울과 다윗의 시대",
      },
      {
        targetType: "book",
        targetSlug: "1-samuel",
        relationType: "RELATED_BOOK",
        label: "사무엘상",
      },
    ],
  },


  /* =====================================================
     PLACE — BETHLEHEM
     ===================================================== */

  {
    type: "place",
    slug: "bethlehem",
    titleKo: "베들레헴",
    titleEn: "Bethlehem",
    eyebrow: "PLACES · CITY",

    summary:
      "다윗의 가족이 살았던 유다 지역의 성읍으로, 다윗의 초기 이야기에서 중요한 출발점이 되는 장소입니다.",

    overview:
      "베들레헴은 사무엘상에서 이새와 그의 가족이 살던 성읍으로 등장합니다. 사무엘은 이곳에서 이새의 아들들을 만나고 다윗에게 기름을 붓습니다. 이후 다윗은 베들레헴에서 아버지의 양을 돌보다가 형들이 있는 전쟁터로 향합니다.",

    biblicalContext:
      "다윗의 초기 서사에서 베들레헴은 왕궁이나 전장이 아니라 그의 가족과 목동 생활이 시작되는 공간입니다. 사무엘상 16장은 다윗의 선택과 기름 부음을, 사무엘상 17장은 베들레헴에서 엘라 골짜기로 이어지는 그의 이동을 보여줍니다.",

    keyEvent: {
      title: "The Anointing of David",
      scripture: "1 Samuel 16:1–13",
      description:
        "사무엘이 베들레헴에 있는 이새의 집을 찾아가고, 이새의 아들들 가운데 다윗에게 기름을 붓습니다. 이 장면은 다윗의 인물 여정에서 중요한 출발점입니다.",
    },

    heroImage: "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel 16:1–13",
      "1 Samuel 17:12–15",
    ],

    relations: [
      { targetType: "story", targetSlug: "david-is-anointed", relationType: "RELATED_STORY", label: "다윗의 기름 부음" },
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "place", targetSlug: "valley-of-elah", relationType: "RELATED_PLACE", label: "엘라 골짜기" },
      { targetType: "story", targetSlug: "david-and-goliath", relationType: "RELATED_STORY", label: "다윗과 골리앗" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     PLACE — GATH
     ===================================================== */

  {
    type: "place",
    slug: "gath",
    titleKo: "가드",
    titleEn: "Gath",
    eyebrow: "PLACES · PHILISTINE CITY",

    summary:
      "블레셋의 주요 성읍 가운데 하나이며, 사무엘상 17장에서 골리앗의 출신지로 언급됩니다.",

    overview:
      "가드는 성경에서 블레셋의 주요 성읍 가운데 하나로 등장합니다. 사무엘상 17장은 골리앗을 가드 출신의 전사로 소개하며, 이 때문에 가드는 다윗과 골리앗 이야기의 배경을 이해하는 데 중요한 장소가 됩니다.",

    biblicalContext:
      "다윗의 이야기에서 가드는 골리앗의 출신지라는 점뿐 아니라 이후 다윗의 도피 서사와도 연결됩니다. 사무엘상 21장과 27장에서 다윗은 가드 왕 아기스와 관련된 장면에 등장합니다. 따라서 가드는 블레셋 세계와 다윗의 관계를 여러 시점에서 보여주는 장소입니다.",

    keyEvent: {
      title: "Goliath of Gath",
      scripture: "1 Samuel 17:4",
      description:
        "사무엘상 17장은 이스라엘 군대에 도전한 골리앗을 가드 출신으로 소개합니다. 가드는 골리앗의 배경과 블레셋 진영을 연결하는 핵심 장소입니다.",
    },

    heroImage: "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 17:4",
      "1 Samuel 21:10–15",
      "1 Samuel 27:1–7",
    ],

    relations: [
      { targetType: "person", targetSlug: "goliath", relationType: "RELATED_PERSON", label: "골리앗" },
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "place", targetSlug: "valley-of-elah", relationType: "RELATED_PLACE", label: "엘라 골짜기" },
      { targetType: "story", targetSlug: "david-and-goliath", relationType: "RELATED_STORY", label: "다윗과 골리앗" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     PLACE — SOCOH
     ===================================================== */

  {
    type: "place",
    slug: "socoh",
    titleKo: "소고",
    titleEn: "Socoh",
    eyebrow: "PLACES · JUDAH",

    summary:
      "사무엘상 17장에서 블레셋 군대가 진을 친 지역을 설명할 때 언급되는 유다의 장소입니다.",

    overview:
      "소고는 다윗과 골리앗 이야기의 지리적 배경을 구성하는 장소입니다. 사무엘상 17장은 블레셋 사람들이 군대를 모아 유다에 속한 소고에 집결하고, 소고와 아세가 사이의 에베스담밈에 진을 쳤다고 기록합니다.",

    biblicalContext:
      "소고는 엘라 골짜기의 전투 장면을 단독 장소가 아니라 주변 지형과 함께 이해하도록 돕습니다. SCRAPTURA에서는 소고를 엘라 골짜기, 아세가와 연결해 사무엘상 17장의 공간 구조를 탐험하도록 구성합니다.",

    keyEvent: {
      title: "Philistine Encampment",
      scripture: "1 Samuel 17:1",
      description:
        "블레셋 군대가 유다에 속한 소고에 모이고 소고와 아세가 사이에 진을 치면서 다윗과 골리앗 이야기의 전장 배경이 형성됩니다.",
    },

    heroImage: "/assets/scraptura-david-goliath.jpg",

    scripture: ["1 Samuel 17:1"],

    relations: [
      { targetType: "place", targetSlug: "valley-of-elah", relationType: "RELATED_PLACE", label: "엘라 골짜기" },
      { targetType: "place", targetSlug: "azekah", relationType: "RELATED_PLACE", label: "아세가" },
      { targetType: "story", targetSlug: "david-and-goliath", relationType: "RELATED_STORY", label: "다윗과 골리앗" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     PLACE — AZEKAH
     ===================================================== */

  {
    type: "place",
    slug: "azekah",
    titleKo: "아세가",
    titleEn: "Azekah",
    eyebrow: "PLACES · JUDAH",

    summary:
      "사무엘상 17장에서 소고와 함께 블레셋 진영의 위치를 설명하는 데 사용되는 장소입니다.",

    overview:
      "아세가는 다윗과 골리앗 이야기의 전장 위치를 설명할 때 소고와 함께 등장합니다. 사무엘상 17:1은 블레셋 군대가 소고와 아세가 사이에 진을 쳤다고 기록합니다.",

    biblicalContext:
      "아세가는 엘라 골짜기 주변의 지리적 관계를 이해하는 데 중요한 연결점입니다. SCRAPTURA에서는 아세가를 소고와 엘라 골짜기에 연결하여 성경 본문에 등장하는 장소들이 서로 어떤 공간적 맥락을 이루는지 탐험하도록 구성합니다.",

    keyEvent: {
      title: "The Battlefield Setting",
      scripture: "1 Samuel 17:1",
      description:
        "소고와 아세가 사이에 블레셋 진영이 자리하면서 사무엘상 17장의 대치 상황이 시작됩니다.",
    },

    heroImage: "/assets/scraptura-david-goliath.jpg",

    scripture: ["1 Samuel 17:1"],

    relations: [
      { targetType: "place", targetSlug: "socoh", relationType: "RELATED_PLACE", label: "소고" },
      { targetType: "place", targetSlug: "valley-of-elah", relationType: "RELATED_PLACE", label: "엘라 골짜기" },
      { targetType: "story", targetSlug: "david-and-goliath", relationType: "RELATED_STORY", label: "다윗과 골리앗" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     PLACE — HEBRON
     ===================================================== */

  {
    type: "place",
    slug: "hebron",
    titleKo: "헤브론",
    titleEn: "Hebron",
    eyebrow: "PLACES · ROYAL CITY",

    summary:
      "사울 사후 다윗이 유다의 왕으로 기름 부음을 받고 통치한 장소로, 다윗 왕권의 중요한 전환점입니다.",

    overview:
      "사무엘하 2장에서 다윗은 헤브론으로 올라가라는 지시를 받고 그곳에 정착합니다. 이후 유다 사람들이 헤브론에서 다윗에게 기름을 부어 유다 족속의 왕으로 세웁니다.",

    biblicalContext:
      "헤브론은 다윗의 도피 생활과 예루살렘 통치 사이를 연결하는 장소입니다. 사무엘하 5장은 다윗이 헤브론에서 유다를 7년 6개월 동안 다스렸으며, 이후 이스라엘 전체의 왕으로 세워졌다고 기록합니다.",

    keyEvent: {
      title: "David Becomes King in Hebron",
      scripture: "2 Samuel 2:1–4",
      description:
        "유다 사람들이 헤브론에서 다윗에게 기름을 부어 유다 족속의 왕으로 세웁니다. 다윗의 왕권이 실제 통치 단계로 들어가는 핵심 장면입니다.",
    },

    heroImage: "/assets/scraptura-david.jpg",

    scripture: [
      "2 Samuel 2:1–4",
      "2 Samuel 5:1–5",
    ],

    relations: [
      { targetType: "story", targetSlug: "david-becomes-king", relationType: "RELATED_STORY", label: "다윗이 왕이 되다" },
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "place", targetSlug: "jerusalem", relationType: "RELATED_PLACE", label: "예루살렘" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "period", targetSlug: "united-kingdom", relationType: "RELATED_PERIOD", label: "통일 왕국" },
    ],
  },


  /* =====================================================
     PLACE — MOUNT GILBOA
     ===================================================== */

  {
    type: "place",
    slug: "mount-gilboa",
    titleKo: "길보아산",
    titleEn: "Mount Gilboa",
    eyebrow: "PLACES · BATTLEFIELD",

    summary:
      "사무엘상 마지막 장에서 사울과 그의 아들들이 블레셋과 전투를 벌이는 장소입니다.",

    overview:
      "길보아산은 사무엘상 31장의 마지막 전투 배경입니다. 이스라엘 군대가 블레셋 앞에서 패하고 사울의 아들들이 죽으며, 사울 역시 이 전투에서 죽습니다.",

    biblicalContext:
      "길보아산의 전투는 사무엘상의 사울 서사를 마무리하고 이후 다윗의 왕권 이야기로 넘어가는 전환점입니다. 이 장소는 사울, 요나단, 블레셋과 사울과 다윗의 시대를 하나의 사건으로 연결합니다.",

    keyEvent: {
      title: "The Final Battle of Saul",
      scripture: "1 Samuel 31:1–6",
      description:
        "이스라엘과 블레셋의 전투에서 사울의 아들들이 죽고 사울의 통치도 끝을 맞습니다. 사무엘상의 마지막 국면을 이루는 사건입니다.",
    },

    heroImage: "/assets/scraptura-david-goliath.jpg",

    scripture: ["1 Samuel 31:1–6"],

    relations: [
      { targetType: "person", targetSlug: "saul", relationType: "RELATED_PERSON", label: "사울" },
      { targetType: "person", targetSlug: "jonathan", relationType: "RELATED_PERSON", label: "요나단" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     PERIOD — RISE OF DAVID
     ===================================================== */

  {
    type: "period",
    slug: "rise-of-david",
    titleKo: "사울과 다윗의 시대",
    titleEn: "Saul & The Rise of David",
    eyebrow: "TIMELINE · EARLY MONARCHY",

    summary:
      "사울의 통치와 다윗의 등장이 교차하며 이스라엘 왕정의 초기 역사가 전개되는 시기입니다.",

    overview:
      "사무엘상 후반부는 이스라엘의 첫 왕 사울의 통치와 다윗의 등장이 서로 교차하는 시기를 보여줍니다. 사울이 왕으로 세워지고 왕권을 형성하는 과정에서 다윗이 등장하며, 골리앗과의 대결 이후 두 인물의 관계는 이 시대의 중요한 서사 축이 됩니다.",

    biblicalContext:
      "이 시기는 단일한 연대 숫자보다 사무엘상에 기록된 사건의 흐름을 중심으로 살펴보는 것이 적절합니다. 사울의 왕권, 다윗의 기름 부음, 엘라 골짜기의 사건, 사울과 다윗의 갈등, 다윗의 도피, 길보아산 전투가 이어지며 이후 다윗 왕국의 형성으로 연결됩니다.",

    periodStages: [
      {
        number: "01",
        title: "SAUL BECOMES KING",
        scripture: "1 Samuel 9–11",
        description:
          "사울이 사무엘을 만나 기름 부음을 받고 이스라엘의 왕으로 세워집니다.",
      },
      {
        number: "02",
        title: "DAVID IS ANOINTED",
        scripture: "1 Samuel 16:1–13",
        description:
          "사무엘이 베들레헴에서 이새의 아들 다윗에게 기름을 붓습니다.",
      },
      {
        number: "03",
        title: "THE VALLEY OF ELAH",
        scripture: "1 Samuel 17",
        description:
          "이스라엘과 블레셋이 엘라 골짜기에서 대치하고 다윗이 골리앗과 맞섭니다.",
      },
      {
        number: "04",
        title: "SAUL & DAVID",
        scripture: "1 Samuel 18–20",
        description:
          "다윗의 명성이 높아지는 가운데 사울과 다윗의 관계가 점차 갈등으로 변합니다.",
      },
      {
        number: "05",
        title: "DAVID THE FUGITIVE",
        scripture: "1 Samuel 21–27",
        description:
          "다윗은 사울을 피해 여러 지역을 이동하며 도피 생활을 이어갑니다.",
      },
      {
        number: "06",
        title: "THE END OF SAUL",
        scripture: "1 Samuel 28–31",
        description:
          "블레셋과의 전쟁이 이어지고 길보아산 전투에서 사울의 통치가 끝납니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 9–31",
    ],

    relations: [
      { targetType: "place", targetSlug: "hebron", relationType: "RELATED_PLACE", label: "헤브론" },
      { targetType: "place", targetSlug: "mount-gilboa", relationType: "RELATED_PLACE", label: "길보아산" },
      { targetType: "person", targetSlug: "saul", relationType: "RELATED_PERSON", label: "사울" },
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "person", targetSlug: "goliath", relationType: "RELATED_PERSON", label: "골리앗" },
      { targetType: "place", targetSlug: "bethlehem", relationType: "RELATED_PLACE", label: "베들레헴" },
      { targetType: "place", targetSlug: "valley-of-elah", relationType: "RELATED_PLACE", label: "엘라 골짜기" },
      { targetType: "place", targetSlug: "gath", relationType: "RELATED_PLACE", label: "가드" },
      { targetType: "place", targetSlug: "jerusalem", relationType: "RELATED_PLACE", label: "예루살렘" },
      { targetType: "story", targetSlug: "david-and-goliath", relationType: "RELATED_STORY", label: "다윗과 골리앗" },
      { targetType: "period", targetSlug: "united-kingdom", relationType: "RELATED_PERIOD", label: "통일 왕국" },
      { targetType: "book", targetSlug: "1-samuel", relationType: "RELATED_BOOK", label: "사무엘상" },
    ],
  },


  /* =====================================================
     PERSON — DAVID
     ===================================================== */

  {
    type: "person",

    slug: "david",

    titleKo: "다윗",

    titleEn: "David",

    eyebrow:
      "PEOPLE · CHARACTER JOURNEY",

    summary:
      "목동에서 왕이 되기까지 이어지는 다윗의 인물 여정.",

    characterJourney: [
      { number: "01", title: "THE SHEPHERD", scripture: "1 Samuel 16:1–13", description: "다윗은 베들레헴의 이새의 아들로 등장합니다. 형들과 달리 양을 돌보고 있던 다윗은 사무엘에게 기름 부음을 받습니다." },
      { number: "02", title: "THE WARRIOR", scripture: "1 Samuel 17", description: "엘라 골짜기에서 다윗은 골리앗의 도전을 듣고 그와 맞섭니다. 이 사건을 통해 다윗은 이스라엘 사람들에게 알려지기 시작합니다." },
      { number: "03", title: "THE FUGITIVE", scripture: "1 Samuel 18–31", description: "사울과 다윗의 관계가 악화되면서 다윗은 사울을 피해 여러 지역을 이동합니다. 이 시기는 다윗이 왕이 되기 전 겪는 긴 도피의 시기를 구성합니다." },
      { number: "04", title: "THE KING", scripture: "2 Samuel 2:1–7; 5:1–5", description: "사울의 죽음 이후 다윗은 먼저 유다의 왕이 되고, 이후 이스라엘 전체의 왕으로 세워집니다." },
      { number: "05", title: "JERUSALEM", scripture: "2 Samuel 5:6–12", description: "다윗은 예루살렘을 점령하고 자신의 통치 중심지로 삼습니다. 예루살렘은 이후 이스라엘 왕국의 중요한 중심지가 됩니다." },
      { number: "06", title: "CONFLICT & CONSEQUENCE", scripture: "2 Samuel 11–18", description: "다윗의 통치 후반에는 밧세바 사건과 왕실 내부의 갈등, 압살롬의 반역 등 심각한 사건들이 이어집니다." },
      { number: "07", title: "THE LEGACY", scripture: "2 Samuel 23:1–7", description: "다윗의 이야기는 개인의 생애를 넘어 왕조와 언약의 역사로 이어집니다. 이후 성경의 여러 본문에서도 다윗과 그의 왕조가 중요한 기준점으로 등장합니다." },
    ],

    heroImage:
      "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel",
      "2 Samuel",
      "Psalms",
    ],

    relations: [
      { targetType: "story", targetSlug: "david-is-anointed", relationType: "RELATED_STORY", label: "다윗의 기름 부음" },
      { targetType: "story", targetSlug: "david-and-jonathan", relationType: "RELATED_STORY", label: "다윗과 요나단" },
      { targetType: "story", targetSlug: "david-becomes-king", relationType: "RELATED_STORY", label: "다윗이 왕이 되다" },
      {
        targetType: "person",
        targetSlug: "goliath",
        relationType: "RELATED_PERSON",
        label: "골리앗",
      },
      {
        targetType: "person",
        targetSlug: "saul",
        relationType: "RELATED_PERSON",
        label: "사울",
      },
      {
        targetType: "place",
        targetSlug: "bethlehem",
        relationType: "RELATED_PLACE",
        label: "베들레헴",
      },
      {
        targetType: "place",
        targetSlug: "valley-of-elah",
        relationType: "RELATED_PLACE",
        label: "엘라 골짜기",
      },
      {
        targetType: "place",
        targetSlug: "jerusalem",
        relationType: "RELATED_PLACE",
        label: "예루살렘",
      },
      {
        targetType: "story",
        targetSlug: "david-and-goliath",
        relationType: "RELATED_STORY",
        label: "다윗과 골리앗",
      },
      {
        targetType: "period",
        targetSlug: "rise-of-david",
        relationType: "RELATED_PERIOD",
        label: "사울과 다윗의 시대",
      },
      {
        targetType: "book",
        targetSlug: "1-samuel",
        relationType: "RELATED_BOOK",
        label: "사무엘상",
      },
    ],

  },


  /* =====================================================
     PLACE — JERUSALEM
     ===================================================== */

  {
    type: "place",
    slug: "jerusalem",
    titleKo: "예루살렘",
    titleEn: "Jerusalem",
    eyebrow: "PLACES · HISTORICAL LAYERS",

    summary:
      "왕국과 성전, 멸망과 회복, 복음서의 사건이 중첩되는 핵심 장소.",

    overview:
      "예루살렘은 성경의 여러 시대가 겹쳐지는 핵심 장소입니다. 현재 SCRAPTURA의 다윗 중심 콘텐츠에서는 다윗이 이 성읍을 점령하고 자신의 통치 중심지로 삼는 장면에 초점을 맞춥니다.",

    biblicalContext:
      "사무엘하 5장에서 다윗은 예루살렘을 점령한 뒤 이곳에 거주하며 다윗 성이라 부릅니다. 이후 예루살렘은 다윗 왕조와 왕국 서사의 중요한 중심지가 됩니다. 향후 SCRAPTURA에서는 성전, 왕국의 분열과 멸망, 귀환, 복음서의 사건 등 다른 역사적 층위도 별도로 연결할 수 있습니다.",

    keyEvent: {
      title: "David Takes Jerusalem",
      scripture: "2 Samuel 5:6–12",
      description:
        "다윗은 예루살렘을 점령하고 자신의 통치 중심지로 삼습니다. 이 사건은 다윗의 개인 서사와 이스라엘 왕국의 중심지가 연결되는 중요한 전환점입니다.",
    },

    heroImage: "/assets/scraptura-jerusalem.jpg",

    scripture: [
      "2 Samuel 5:6–12",
    ],

    relations: [
      { targetType: "story", targetSlug: "david-becomes-king", relationType: "RELATED_STORY", label: "다윗이 왕이 되다" },
      { targetType: "person", targetSlug: "david", relationType: "RELATED_PERSON", label: "다윗" },
      { targetType: "period", targetSlug: "rise-of-david", relationType: "RELATED_PERIOD", label: "사울과 다윗의 시대" },
      { targetType: "period", targetSlug: "united-kingdom", relationType: "RELATED_PERIOD", label: "통일 왕국" },
    ],
  },


  /* =====================================================
     PERIOD — UNITED KINGDOM
     ===================================================== */

  {
    type: "period",
    slug: "united-kingdom",
    titleKo: "통일 왕국",
    titleEn: "United Kingdom",
    eyebrow: "TIMELINE · MONARCHY",

    summary:
      "이스라엘의 왕정이 형성되고 사울에서 다윗으로 왕권이 이어지며 예루살렘이 왕국의 중심지로 자리 잡아 가는 시대입니다.",

    overview:
      "통일 왕국은 이스라엘의 여러 지파가 왕정 아래 결집되는 흐름을 살펴보는 시대 구간입니다. 현재 SCRAPTURA에서는 사울의 초기 왕정에서 다윗의 통치와 예루살렘의 부상으로 이어지는 흐름에 초점을 맞춥니다.",

    biblicalContext:
      "사무엘상은 사울의 왕정과 다윗의 등장을 보여주고, 사무엘하는 사울 사후 다윗이 유다의 왕이 된 뒤 점차 이스라엘 전체의 왕으로 세워지는 과정을 기록합니다. 다윗이 예루살렘을 점령하고 통치 중심지로 삼으면서 인물, 장소, 왕국의 역사가 하나의 축으로 연결됩니다.",

    periodStages: [
      {
        number: "01",
        title: "THE FIRST KING",
        scripture: "1 Samuel 9–11",
        description:
          "사울이 이스라엘의 왕으로 세워지며 왕정의 초기 단계가 시작됩니다.",
      },
      {
        number: "02",
        title: "THE RISE OF DAVID",
        scripture: "1 Samuel 16–31",
        description:
          "다윗이 기름 부음을 받고 등장하며 사울의 통치 후반부와 새로운 왕권의 서사가 교차합니다.",
      },
      {
        number: "03",
        title: "KING OVER JUDAH",
        scripture: "2 Samuel 2:1–4",
        description:
          "사울 사후 다윗은 헤브론에서 유다 족속의 왕으로 기름 부음을 받습니다.",
      },
      {
        number: "04",
        title: "KING OVER ISRAEL",
        scripture: "2 Samuel 5:1–5",
        description:
          "이스라엘의 장로들이 헤브론에서 다윗에게 나아오고 다윗은 이스라엘의 왕으로 세워집니다.",
      },
      {
        number: "05",
        title: "JERUSALEM",
        scripture: "2 Samuel 5:6–12",
        description:
          "다윗이 예루살렘을 점령하고 이곳을 통치의 중심지로 삼습니다.",
      },
      {
        number: "06",
        title: "THE ARK IN JERUSALEM",
        scripture: "2 Samuel 6",
        description:
          "언약궤가 예루살렘으로 옮겨지면서 왕국의 중심지인 예루살렘의 역할이 더욱 두드러집니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-jerusalem.jpg",

    scripture: [
      "1 Samuel 9–31",
      "2 Samuel 2:1–4",
      "2 Samuel 5–7",
    ],

    relations: [
      { targetType: "place", targetSlug: "hebron", relationType: "RELATED_PLACE", label: "헤브론" },
      {
        targetType: "person",
        targetSlug: "saul",
        relationType: "RELATED_PERSON",
        label: "사울",
      },
      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
      },
      {
        targetType: "place",
        targetSlug: "jerusalem",
        relationType: "RELATED_PLACE",
        label: "예루살렘",
      },
      {
        targetType: "place",
        targetSlug: "bethlehem",
        relationType: "RELATED_PLACE",
        label: "베들레헴",
      },
      {
        targetType: "period",
        targetSlug: "rise-of-david",
        relationType: "RELATED_PERIOD",
        label: "사울과 다윗의 시대",
      },
      {
        targetType: "book",
        targetSlug: "1-samuel",
        relationType: "RELATED_BOOK",
        label: "사무엘상",
      },
    ],
  },


  /* =====================================================
     BOOK — 1 SAMUEL
     ===================================================== */

  {
    type: "book",
    slug: "1-samuel",
    titleKo: "사무엘상",
    titleEn: "1 Samuel",
    eyebrow: "BIBLE · OLD TESTAMENT",

    summary:
      "사사 시대의 마지막 국면에서 이스라엘 왕정의 시작, 사울의 통치, 그리고 다윗의 등장을 연결하는 성경의 책입니다.",

    overview:
      "사무엘상은 사무엘의 출생과 사역에서 시작해 이스라엘이 왕을 요구하는 과정, 사울의 즉위와 통치, 다윗의 등장, 그리고 사울의 마지막 전투까지 이어집니다. SCRAPTURA의 현재 다윗 중심 탐험에서 인물·장소·사건·시대를 연결하는 핵심 성경 본문입니다.",

    biblicalContext:
      "사무엘상은 왕정이 시작되는 과정만 기록하는 것이 아니라 사무엘, 사울, 다윗이라는 주요 인물의 이야기를 통해 이스라엘의 지도력 변화가 어떻게 전개되는지를 보여줍니다. 현재 SCRAPTURA에서는 본문의 사건 순서를 따라 관련 인물과 장소로 이동할 수 있도록 구성합니다.",

    bookSections: [
      {
        number: "01",
        title: "SAMUEL",
        scripture: "1 Samuel 1–7",
        description:
          "사무엘의 출생과 성장, 엘리 가문, 언약궤 이야기와 사무엘의 지도력이 전개됩니다.",
      },
      {
        number: "02",
        title: "ISRAEL ASKS FOR A KING",
        scripture: "1 Samuel 8",
        description:
          "이스라엘 백성이 왕을 요구하면서 왕정의 시작을 향한 중요한 전환이 일어납니다.",
      },
      {
        number: "03",
        title: "SAUL",
        scripture: "1 Samuel 9–15",
        description:
          "사울이 왕으로 세워지고 초기 통치를 시작하지만 이후 사무엘과의 갈등과 책망이 이어집니다.",
      },
      {
        number: "04",
        title: "DAVID APPEARS",
        scripture: "1 Samuel 16",
        description:
          "사무엘이 베들레헴에서 다윗에게 기름을 부으면서 다윗의 이야기가 본격적으로 시작됩니다.",
      },
      {
        number: "05",
        title: "DAVID & GOLIATH",
        scripture: "1 Samuel 17",
        description:
          "엘라 골짜기에서 다윗과 골리앗의 이야기가 전개되며 다윗이 이스라엘 안에서 크게 부각됩니다.",
      },
      {
        number: "06",
        title: "SAUL & DAVID",
        scripture: "1 Samuel 18–27",
        description:
          "다윗의 명성이 높아지는 가운데 사울과 다윗의 갈등이 깊어지고 다윗의 도피 생활이 이어집니다.",
      },
      {
        number: "07",
        title: "THE END OF SAUL",
        scripture: "1 Samuel 28–31",
        description:
          "사울의 통치가 마지막 국면에 들어가고 블레셋과의 전투를 거쳐 사무엘상의 이야기가 마무리됩니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel 1–31",
    ],

    relations: [
      { targetType: "story", targetSlug: "david-is-anointed", relationType: "RELATED_STORY", label: "다윗의 기름 부음" },
      { targetType: "story", targetSlug: "david-and-jonathan", relationType: "RELATED_STORY", label: "다윗과 요나단" },
      {
        targetType: "person",
        targetSlug: "samuel",
        relationType: "RELATED_PERSON",
        label: "사무엘",
      },
      {
        targetType: "person",
        targetSlug: "jonathan",
        relationType: "RELATED_PERSON",
        label: "요나단",
      },
      {
        targetType: "person",
        targetSlug: "jesse",
        relationType: "RELATED_PERSON",
        label: "이새",
      },
      {
        targetType: "person",
        targetSlug: "eliab",
        relationType: "RELATED_PERSON",
        label: "엘리압",
      },
      {
        targetType: "person",
        targetSlug: "saul",
        relationType: "RELATED_PERSON",
        label: "사울",
      },
      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
      },
      {
        targetType: "person",
        targetSlug: "goliath",
        relationType: "RELATED_PERSON",
        label: "골리앗",
      },
      {
        targetType: "place",
        targetSlug: "bethlehem",
        relationType: "RELATED_PLACE",
        label: "베들레헴",
      },
      {
        targetType: "place",
        targetSlug: "valley-of-elah",
        relationType: "RELATED_PLACE",
        label: "엘라 골짜기",
      },
      {
        targetType: "place",
        targetSlug: "gath",
        relationType: "RELATED_PLACE",
        label: "가드",
      },
      {
        targetType: "story",
        targetSlug: "david-and-goliath",
        relationType: "RELATED_STORY",
        label: "다윗과 골리앗",
      },
      {
        targetType: "period",
        targetSlug: "rise-of-david",
        relationType: "RELATED_PERIOD",
        label: "사울과 다윗의 시대",
      },
      {
        targetType: "period",
        targetSlug: "united-kingdom",
        relationType: "RELATED_PERIOD",
        label: "통일 왕국",
      },
    ],
  },

];


/* =====================================================
   GET CONTENT
   ===================================================== */

export const getNode = (
  type: ContentType,
  slug: string
) =>
  nodes.find(
    (n) =>
      n.type === type &&
      n.slug === slug
  );