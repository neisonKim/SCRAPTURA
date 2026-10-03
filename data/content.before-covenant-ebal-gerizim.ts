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
        targetType: "person",
        targetSlug: "saul",
        relationType: "RELATED_PERSON",
        label: "사울",
      },

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

    heroImage:
      "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel 16:1–13",
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
        targetSlug: "samuel",
        relationType: "RELATED_PERSON",
        label: "사무엘",
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

    heroImage:
      "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel 18:1–4",
      "1 Samuel 19:1–7",
      "1 Samuel 20",
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
        targetSlug: "jonathan",
        relationType: "RELATED_PERSON",
        label: "요나단",
      },

      {
        targetType: "person",
        targetSlug: "saul",
        relationType: "RELATED_PERSON",
        label: "사울",
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

    heroImage:
      "/assets/scraptura-jerusalem.jpg",

    scripture: [
      "2 Samuel 2:1–4",
      "2 Samuel 5:1–12",
    ],

    relations: [
      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
      },

      {
        targetType: "place",
        targetSlug: "hebron",
        relationType: "RELATED_PLACE",
        label: "헤브론",
      },

      {
        targetType: "place",
        targetSlug: "jerusalem",
        relationType: "RELATED_PLACE",
        label: "예루살렘",
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
      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
      },

      {
        targetType: "person",
        targetSlug: "saul",
        relationType: "RELATED_PERSON",
        label: "사울",
      },

      {
        targetType: "place",
        targetSlug: "gath",
        relationType: "RELATED_PLACE",
        label: "가드",
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
        targetType: "book",
        targetSlug: "1-samuel",
        relationType: "RELATED_BOOK",
        label: "사무엘상",
      },
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

    eyebrow:
      "PEOPLE · PROPHET & JUDGE",

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

    heroImage:
      "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel 1–16",
    ],

    relations: [
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
        targetSlug: "jesse",
        relationType: "RELATED_PERSON",
        label: "이새",
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
     PERSON — JONATHAN
     ===================================================== */

  {
    type: "person",

    slug: "jonathan",

    titleKo: "요나단",

    titleEn: "Jonathan",

    eyebrow:
      "PEOPLE · HOUSE OF SAUL",

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

    heroImage:
      "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel 13–14",
      "1 Samuel 18–20",
      "1 Samuel 23",
      "1 Samuel 31",
    ],

    relations: [
      {
        targetType: "story",
        targetSlug: "david-and-jonathan",
        relationType: "RELATED_STORY",
        label: "다윗과 요나단",
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
     PERSON — JESSE
     ===================================================== */

  {
    type: "person",

    slug: "jesse",

    titleKo: "이새",

    titleEn: "Jesse",

    eyebrow:
      "PEOPLE · HOUSE OF BETHLEHEM",

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

    heroImage:
      "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel 16–17",
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
        targetSlug: "eliab",
        relationType: "RELATED_PERSON",
        label: "엘리압",
      },

      {
        targetType: "person",
        targetSlug: "samuel",
        relationType: "RELATED_PERSON",
        label: "사무엘",
      },

      {
        targetType: "place",
        targetSlug: "bethlehem",
        relationType: "RELATED_PLACE",
        label: "베들레헴",
      },

      {
        targetType: "story",
        targetSlug: "david-and-goliath",
        relationType: "RELATED_STORY",
        label: "다윗과 골리앗",
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
     PERSON — ELIAB
     ===================================================== */

  {
    type: "person",

    slug: "eliab",

    titleKo: "엘리압",

    titleEn: "Eliab",

    eyebrow:
      "PEOPLE · HOUSE OF JESSE",

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

    heroImage:
      "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 16:6–7",
      "1 Samuel 17:13",
      "1 Samuel 17:28–30",
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
        targetSlug: "jesse",
        relationType: "RELATED_PERSON",
        label: "이새",
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
        targetType: "story",
        targetSlug: "david-and-goliath",
        relationType: "RELATED_STORY",
        label: "다윗과 골리앗",
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
      {
        targetType: "place",
        targetSlug: "socoh",
        relationType: "RELATED_PLACE",
        label: "소고",
      },

      {
        targetType: "place",
        targetSlug: "azekah",
        relationType: "RELATED_PLACE",
        label: "아세가",
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

    eyebrow:
      "PLACES · CITY",

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

    heroImage:
      "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel 16:1–13",
      "1 Samuel 17:12–15",
    ],

    relations: [
      {
        targetType: "story",
        targetSlug: "david-is-anointed",
        relationType: "RELATED_STORY",
        label: "다윗의 기름 부음",
      },

      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
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
     PLACE — GATH
     ===================================================== */

  {
    type: "place",

    slug: "gath",

    titleKo: "가드",

    titleEn: "Gath",

    eyebrow:
      "PLACES · PHILISTINE CITY",

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

    heroImage:
      "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 17:4",
      "1 Samuel 21:10–15",
      "1 Samuel 27:1–7",
    ],

    relations: [
      {
        targetType: "person",
        targetSlug: "goliath",
        relationType: "RELATED_PERSON",
        label: "골리앗",
      },

      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
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
     PLACE — SOCOH
     ===================================================== */

  {
    type: "place",

    slug: "socoh",

    titleKo: "소고",

    titleEn: "Socoh",

    eyebrow:
      "PLACES · JUDAH",

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

    heroImage:
      "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 17:1",
    ],

    relations: [
      {
        targetType: "place",
        targetSlug: "valley-of-elah",
        relationType: "RELATED_PLACE",
        label: "엘라 골짜기",
      },

      {
        targetType: "place",
        targetSlug: "azekah",
        relationType: "RELATED_PLACE",
        label: "아세가",
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
     PLACE — AZEKAH
     ===================================================== */

  {
    type: "place",

    slug: "azekah",

    titleKo: "아세가",

    titleEn: "Azekah",

    eyebrow:
      "PLACES · JUDAH",

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

    heroImage:
      "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 17:1",
    ],

    relations: [
      {
        targetType: "place",
        targetSlug: "socoh",
        relationType: "RELATED_PLACE",
        label: "소고",
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
     PLACE — HEBRON
     ===================================================== */

  {
    type: "place",

    slug: "hebron",

    titleKo: "헤브론",

    titleEn: "Hebron",

    eyebrow:
      "PLACES · PATRIARCHAL & ROYAL CITY",

    summary:
      "아브라함이 머물며 제단을 세우고 가족의 매장지를 마련한 장소이자, 훗날 다윗이 유다의 왕으로 세워져 통치한 성읍으로 족장 시대와 왕정 시대를 연결하는 중요한 장소입니다.",

    overview:
      "헤브론은 창세기에서 아브라함의 이동과 정착 이야기 속에 등장합니다. 아브라함은 헤브론 인근 마므레 지역에 머물며 제단을 세웠고, 이후 사라가 죽은 뒤 막벨라 밭과 굴을 매입합니다. 수백 년 뒤 사무엘하에서는 다윗이 헤브론으로 올라가 유다의 왕으로 세워지고 이곳에서 통치를 시작합니다.",

    biblicalContext:
      "헤브론은 SCRAPTURA에서 여러 시대가 겹치는 대표적인 장소입니다. 창세기에서는 아브라함과 사라, 족장들의 이야기와 연결되고, 사무엘하에서는 다윗의 왕권 형성과 연결됩니다. 따라서 헤브론은 족장 시대의 가족 서사와 이스라엘 왕정의 형성을 하나의 지리적 공간에서 이어주는 장소입니다.",

    keyEvent: {
      title: "David Becomes King in Hebron",
      scripture: "2 Samuel 2:1–4",
      description:
        "유다 사람들이 헤브론에서 다윗에게 기름을 부어 유다 족속의 왕으로 세웁니다. 다윗의 왕권이 실제 통치 단계로 들어가는 핵심 장면입니다.",
    },

    heroImage:
      "/assets/scraptura-david.jpg",

    scripture: [
      "Genesis 13:18",
      "Genesis 23:1–20",
      "2 Samuel 2:1–4",
      "2 Samuel 5:1–5",
    ],

    relations: [
      {
        targetType: "story",
        targetSlug: "david-becomes-king",
        relationType: "RELATED_STORY",
        label: "다윗이 왕이 되다",
      },

      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
      },

      {
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },

      {
        targetType: "place",
        targetSlug: "jerusalem",
        relationType: "RELATED_PLACE",
        label: "예루살렘",
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

      {
        targetType: "place",
        targetSlug: "bethel",
        relationType: "RELATED_PLACE",
        label: "벧엘",
      },

      {
        targetType: "story",
        targetSlug: "call-of-abraham",
        relationType: "RELATED_STORY",
        label: "아브라함의 부르심",
      },

      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },

      {
        targetType: "person",
        targetSlug: "isaac",
        relationType: "RELATED_PERSON",
        label: "이삭",
      },

      {
        targetType: "person",
        targetSlug: "jacob",
        relationType: "RELATED_PERSON",
        label: "야곱",
      },

      {
        targetType: "person",
        targetSlug: "joseph",
        relationType: "RELATED_PERSON",
        label: "요셉",
      },
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

    eyebrow:
      "PLACES · BATTLEFIELD",

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

    heroImage:
      "/assets/scraptura-david-goliath.jpg",

    scripture: [
      "1 Samuel 31:1–6",
    ],

    relations: [
      {
        targetType: "person",
        targetSlug: "saul",
        relationType: "RELATED_PERSON",
        label: "사울",
      },

      {
        targetType: "person",
        targetSlug: "jonathan",
        relationType: "RELATED_PERSON",
        label: "요나단",
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
     PERIOD — RISE OF DAVID
     ===================================================== */

  {
    type: "period",

    slug: "rise-of-david",

    titleKo: "사울과 다윗의 시대",

    titleEn: "Saul & The Rise of David",

    eyebrow:
      "TIMELINE · EARLY MONARCHY",

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
      {
        targetType: "place",
        targetSlug: "hebron",
        relationType: "RELATED_PLACE",
        label: "헤브론",
      },

      {
        targetType: "place",
        targetSlug: "mount-gilboa",
        relationType: "RELATED_PLACE",
        label: "길보아산",
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
        targetSlug: "united-kingdom",
        relationType: "RELATED_PERIOD",
        label: "통일 왕국",
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
      {
        number: "01",
        title: "THE SHEPHERD",
        scripture: "1 Samuel 16:1–13",
        description:
          "다윗은 베들레헴의 이새의 아들로 등장합니다. 형들과 달리 양을 돌보고 있던 다윗은 사무엘에게 기름 부음을 받습니다.",
      },

      {
        number: "02",
        title: "THE WARRIOR",
        scripture: "1 Samuel 17",
        description:
          "엘라 골짜기에서 다윗은 골리앗의 도전을 듣고 그와 맞섭니다. 이 사건을 통해 다윗은 이스라엘 사람들에게 알려지기 시작합니다.",
      },

      {
        number: "03",
        title: "THE FUGITIVE",
        scripture: "1 Samuel 18–31",
        description:
          "사울과 다윗의 관계가 악화되면서 다윗은 사울을 피해 여러 지역을 이동합니다. 이 시기는 다윗이 왕이 되기 전 겪는 긴 도피의 시기를 구성합니다.",
      },

      {
        number: "04",
        title: "THE KING",
        scripture: "2 Samuel 2:1–7; 5:1–5",
        description:
          "사울의 죽음 이후 다윗은 먼저 유다의 왕이 되고, 이후 이스라엘 전체의 왕으로 세워집니다.",
      },

      {
        number: "05",
        title: "JERUSALEM",
        scripture: "2 Samuel 5:6–12",
        description:
          "다윗은 예루살렘을 점령하고 자신의 통치 중심지로 삼습니다. 예루살렘은 이후 이스라엘 왕국의 중요한 중심지가 됩니다.",
      },

      {
        number: "06",
        title: "CONFLICT & CONSEQUENCE",
        scripture: "2 Samuel 11–18",
        description:
          "다윗의 통치 후반에는 밧세바 사건과 왕실 내부의 갈등, 압살롬의 반역 등 심각한 사건들이 이어집니다.",
      },

      {
        number: "07",
        title: "THE LEGACY",
        scripture: "2 Samuel 23:1–7",
        description:
          "다윗의 이야기는 개인의 생애를 넘어 왕조와 언약의 역사로 이어집니다. 이후 성경의 여러 본문에서도 다윗과 그의 왕조가 중요한 기준점으로 등장합니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-david.jpg",

    scripture: [
      "1 Samuel",
      "2 Samuel",
      "Psalms",
    ],

    relations: [
      {
        targetType: "story",
        targetSlug: "david-is-anointed",
        relationType: "RELATED_STORY",
        label: "다윗의 기름 부음",
      },

      {
        targetType: "story",
        targetSlug: "david-and-jonathan",
        relationType: "RELATED_STORY",
        label: "다윗과 요나단",
      },

      {
        targetType: "story",
        targetSlug: "david-becomes-king",
        relationType: "RELATED_STORY",
        label: "다윗이 왕이 되다",
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

    eyebrow:
      "PLACES · HISTORICAL LAYERS",

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

    heroImage:
      "/assets/scraptura-jerusalem.jpg",

    scripture: [
      "2 Samuel 5:6–12",
    ],

    relations: [
      {
        targetType: "story",
        targetSlug: "david-becomes-king",
        relationType: "RELATED_STORY",
        label: "다윗이 왕이 되다",
      },

      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
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


  /* =====================================================
     PERIOD — UNITED KINGDOM
     ===================================================== */

  {
    type: "period",

    slug: "united-kingdom",

    titleKo: "통일 왕국",

    titleEn: "United Kingdom",

    eyebrow:
      "TIMELINE · MONARCHY",

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
      {
        targetType: "place",
        targetSlug: "hebron",
        relationType: "RELATED_PLACE",
        label: "헤브론",
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

    eyebrow:
      "BIBLE · OLD TESTAMENT",

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
      {
        targetType: "story",
        targetSlug: "david-is-anointed",
        relationType: "RELATED_STORY",
        label: "다윗의 기름 부음",
      },

      {
        targetType: "story",
        targetSlug: "david-and-jonathan",
        relationType: "RELATED_STORY",
        label: "다윗과 요나단",
      },

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


  /* =====================================================
     BOOK — GENESIS
     ===================================================== */

  {
    type: "book",

    slug: "genesis",

    titleKo: "창세기",

    titleEn: "Genesis",

    eyebrow:
      "BIBLE · OLD TESTAMENT · PENTATEUCH",

    summary:
      "창조와 타락, 홍수와 바벨, 그리고 아브라함·이삭·야곱·요셉으로 이어지는 족장들의 이야기를 통해 성경 역사의 시작을 보여주는 책입니다.",

    overview:
      "창세기는 성경 전체 이야기의 출발점입니다. 창세기 1–11장은 창조, 인간의 타락, 홍수와 바벨을 통해 초기 인류의 이야기를 보여줍니다. 창세기 12장부터는 아브라함을 시작으로 이삭, 야곱, 요셉의 이야기가 이어지며 하나의 가족을 중심으로 성경의 서사가 전개됩니다.",

    biblicalContext:
      "창세기는 세계와 인간의 기원에서 시작해 아브라함 한 사람의 부르심과 그의 가족 이야기로 초점을 좁혀 갑니다. 창조, 인간의 불순종, 심판과 회복, 언약이라는 주제가 반복되며 마지막에는 야곱의 가족이 이집트로 이동하면서 출애굽기의 역사적·서사적 배경이 형성됩니다.",

    bookSections: [
      {
        number: "01",
        title: "CREATION",
        scripture: "Genesis 1–2",
        description:
          "하늘과 땅, 생명과 인간의 창조가 기록되며 성경 전체의 이야기가 시작됩니다.",
      },

      {
        number: "02",
        title: "EDEN & THE FALL",
        scripture: "Genesis 3",
        description:
          "에덴동산에서 인간의 불순종이 일어나고 창조 세계에 새로운 갈등이 시작됩니다.",
      },

      {
        number: "03",
        title: "THE FLOOD",
        scripture: "Genesis 6–9",
        description:
          "노아와 홍수의 이야기가 전개되고 홍수 이후 하나님과 노아 사이의 언약이 기록됩니다.",
      },

      {
        number: "04",
        title: "BABEL",
        scripture: "Genesis 11",
        description:
          "사람들이 도시와 탑을 세우는 바벨 이야기를 통해 창세기 1–11장의 초기 인류 서사가 마무리됩니다.",
      },

      {
        number: "05",
        title: "ABRAHAM",
        scripture: "Genesis 12–25",
        description:
          "아브람이 고향을 떠나라는 부르심을 받고 가나안으로 이동하며 언약과 약속의 이야기가 본격적으로 시작됩니다.",
      },

      {
        number: "06",
        title: "ISAAC & JACOB",
        scripture: "Genesis 25–36",
        description:
          "아브라함의 후손인 이삭과 야곱의 이야기가 이어지며 족장 가문의 역사가 확장됩니다.",
      },

      {
        number: "07",
        title: "JOSEPH",
        scripture: "Genesis 37–50",
        description:
          "요셉이 이집트로 가게 된 뒤 새로운 삶을 시작하고 결국 야곱의 가족 전체가 이집트로 이동하게 됩니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      "Genesis 1–50",
    ],

    relations: [
      {
        targetType: "story",
        targetSlug: "creation",
        relationType: "RELATED_STORY",
        label: "창조 이야기",
      },

      {
        targetType: "story",
        targetSlug: "noah-and-the-flood",
        relationType: "RELATED_STORY",
        label: "노아와 홍수",
      },

      {
        targetType: "story",
        targetSlug: "tower-of-babel",
        relationType: "RELATED_STORY",
        label: "바벨탑",
      },

      {
        targetType: "person",
        targetSlug: "noah",
        relationType: "RELATED_PERSON",
        label: "노아",
      },

      {
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },

      {
        targetType: "person",
        targetSlug: "isaac",
        relationType: "RELATED_PERSON",
        label: "이삭",
      },

      {
        targetType: "person",
        targetSlug: "jacob",
        relationType: "RELATED_PERSON",
        label: "야곱",
      },

      {
        targetType: "person",
        targetSlug: "joseph",
        relationType: "RELATED_PERSON",
        label: "요셉",
      },

      {
        targetType: "place",
        targetSlug: "egypt",
        relationType: "RELATED_PLACE",
        label: "이집트",
      },

      {
        targetType: "book",
        targetSlug: "exodus",
        relationType: "RELATED_BOOK",
        label: "출애굽기",
      },
    ],
  },


  /* =====================================================
     STORY — CREATION
     ===================================================== */

  {
    type: "story",

    slug: "creation",

    titleKo: "창조 이야기",

    titleEn: "Creation",

    eyebrow:
      "STORIES · GENESIS 1–2",

    summary:
      "창세기 1–2장은 하늘과 땅, 생명과 인간이 창조되는 성경 이야기의 시작을 기록합니다.",

    overview:
      "창세기의 첫 장면은 세계의 창조로 시작합니다. 빛과 하늘, 땅과 바다, 식물과 천체, 생물과 인간이 순서에 따라 등장하며 창세기 2장은 인간과 에덴동산의 이야기를 보다 가까이에서 보여줍니다.",

    biblicalContext:
      "창조 이야기는 성경 전체의 출발점으로 기능합니다. 이후 등장하는 인간, 땅, 생명과 안식 같은 주제들은 성경의 다른 이야기에서도 계속 연결됩니다.",

    scenes: [
      {
        number: "01",
        title: "LIGHT",
        scripture: "Genesis 1:1–5",
        description:
          "창세기의 이야기가 시작되고 빛과 어둠이 구분됩니다.",
      },

      {
        number: "02",
        title: "SKY, LAND & SEA",
        scripture: "Genesis 1:6–10",
        description:
          "하늘과 물, 땅과 바다가 구분되며 세계의 공간이 형성됩니다.",
      },

      {
        number: "03",
        title: "LIFE",
        scripture: "Genesis 1:11–25",
        description:
          "식물과 천체, 바다와 하늘의 생물, 땅의 생물이 차례로 등장합니다.",
      },

      {
        number: "04",
        title: "HUMANKIND",
        scripture: "Genesis 1:26–31",
        description:
          "창조 이야기의 후반부에서 인간의 창조가 기록됩니다.",
      },

      {
        number: "05",
        title: "REST",
        scripture: "Genesis 2:1–3",
        description:
          "창조의 과정이 마무리되고 일곱째 날의 안식이 기록됩니다.",
      },

      {
        number: "06",
        title: "EDEN",
        scripture: "Genesis 2:4–25",
        description:
          "창세기 2장은 인간과 에덴동산의 이야기를 보다 구체적으로 전개합니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      "Genesis 1",
      "Genesis 2",
    ],

    relations: [
      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },
    ],
  },


  /* =====================================================
     STORY — NOAH & THE FLOOD
     ===================================================== */

  {
    type: "story",

    slug: "noah-and-the-flood",

    titleKo: "노아와 홍수",

    titleEn: "Noah & The Flood",

    eyebrow:
      "STORIES · GENESIS 6–9",

    summary:
      "창세기 6–9장은 노아와 그의 가족, 방주와 홍수, 그리고 홍수 이후의 언약으로 이어지는 이야기를 기록합니다.",

    overview:
      "노아와 홍수 이야기는 창세기 초기 인류 서사의 중요한 전환점입니다. 노아는 방주를 준비하고 가족과 생물들을 방주에 들이며, 이후 홍수가 시작됩니다. 물이 줄어든 뒤 방주는 산지에 머물고 노아와 그의 가족은 다시 땅으로 나옵니다.",

    biblicalContext:
      "노아와 홍수 이야기는 창세기 1–11장의 흐름 안에서 창조 이후 인간 세계의 확장과 심판, 그리고 새로운 시작을 연결합니다. 홍수 이후 노아와 그의 가족을 중심으로 이야기가 다시 시작되며 이후 민족들의 계보와 바벨 이야기로 이어집니다.",

    scenes: [
      {
        number: "01",
        title: "NOAH",
        scripture: "Genesis 6:5–12",
        description:
          "창세기 6장에서 인간 사회의 상황이 묘사되고 노아가 이야기의 중심 인물로 등장합니다.",
      },

      {
        number: "02",
        title: "THE ARK",
        scripture: "Genesis 6:13–22",
        description:
          "노아는 방주를 준비하라는 지시를 받고 그에 따라 방주를 만듭니다.",
      },

      {
        number: "03",
        title: "ENTERING THE ARK",
        scripture: "Genesis 7:1–16",
        description:
          "노아와 그의 가족이 방주에 들어가고 동물들도 함께 방주에 들어갑니다.",
      },

      {
        number: "04",
        title: "THE FLOOD",
        scripture: "Genesis 7:17–24",
        description:
          "홍수가 계속되며 물이 땅을 덮는 장면이 전개됩니다.",
      },

      {
        number: "05",
        title: "THE WATERS RECEDE",
        scripture: "Genesis 8:1–14",
        description:
          "물이 점차 줄어들고 노아는 새들을 보내 땅의 상태를 확인합니다.",
      },

      {
        number: "06",
        title: "A NEW BEGINNING",
        scripture: "Genesis 8:15–22",
        description:
          "노아의 가족과 생물들이 방주에서 나오며 홍수 이후 새로운 시작이 전개됩니다.",
      },

      {
        number: "07",
        title: "THE COVENANT",
        scripture: "Genesis 9:1–17",
        description:
          "홍수 이후 노아와 그의 후손에 관한 언약과 무지개의 표징이 기록됩니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      "Genesis 6",
      "Genesis 7",
      "Genesis 8",
      "Genesis 9",
    ],

    relations: [
      {
        targetType: "person",
        targetSlug: "noah",
        relationType: "RELATED_PERSON",
        label: "노아",
      },

      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },
    ],
  },


  /* =====================================================
     PERSON — NOAH
     ===================================================== */

  {
    type: "person",

    slug: "noah",

    titleKo: "노아",

    titleEn: "Noah",

    eyebrow:
      "PEOPLE · GENESIS 5–9",

    summary:
      "창세기 홍수 이야기의 중심 인물로, 방주를 준비하고 가족과 함께 홍수를 지나 새로운 시작을 맞이하는 인물입니다.",

    overview:
      "노아는 창세기 5장의 계보에서 라멕의 아들로 등장하고, 창세기 6장부터 홍수 이야기의 중심 인물이 됩니다. 그는 방주를 준비하고 가족과 함께 그 안으로 들어가며, 홍수가 끝난 뒤 다시 땅으로 나옵니다. 이후 창세기 9장에서는 노아와 그의 후손에 관한 언약이 기록됩니다.",

    biblicalContext:
      "노아의 이야기는 창세기 1–11장의 초기 인류 서사에서 중요한 전환점입니다. 창조와 인간의 불순종 이후 전개된 세계는 홍수를 거치며 새로운 시작으로 이어지고, 노아의 후손 이야기는 민족들의 계보와 바벨 이야기로 연결됩니다.",

    characterJourney: [
      {
        number: "01",
        title: "NOAH APPEARS",
        scripture: "Genesis 5:28–32",
        description:
          "노아는 창세기의 계보 속에서 라멕의 아들로 처음 소개됩니다.",
      },

      {
        number: "02",
        title: "NOAH'S GENERATION",
        scripture: "Genesis 6:5–12",
        description:
          "창세기 6장에서 당시 세상의 상황이 묘사되고 노아가 홍수 이야기의 중심 인물로 등장합니다.",
      },

      {
        number: "03",
        title: "THE ARK",
        scripture: "Genesis 6:13–22",
        description:
          "노아는 홍수를 대비해 방주를 준비하라는 지시를 받고 그에 따라 방주를 만듭니다.",
      },

      {
        number: "04",
        title: "ENTERING THE ARK",
        scripture: "Genesis 7:1–16",
        description:
          "노아와 그의 가족은 방주에 들어가고 생물들도 함께 방주에 들어갑니다.",
      },

      {
        number: "05",
        title: "THE FLOOD",
        scripture: "Genesis 7:17–24",
        description:
          "홍수가 시작되고 물이 땅을 덮는 동안 노아와 그의 가족은 방주 안에 머뭅니다.",
      },

      {
        number: "06",
        title: "THE WATERS RECEDE",
        scripture: "Genesis 8:1–14",
        description:
          "물이 점차 줄어들자 노아는 새들을 보내 땅의 상태를 확인합니다.",
      },

      {
        number: "07",
        title: "A NEW BEGINNING",
        scripture: "Genesis 8:15–22",
        description:
          "노아와 그의 가족이 방주에서 나오면서 홍수 이후의 새로운 이야기가 시작됩니다.",
      },

      {
        number: "08",
        title: "THE COVENANT",
        scripture: "Genesis 9:1–17",
        description:
          "노아와 그의 후손에 관한 언약이 기록되고 무지개가 그 언약의 표징으로 제시됩니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      "Genesis 5:28–32",
      "Genesis 6",
      "Genesis 7",
      "Genesis 8",
      "Genesis 9:1–17",
    ],

    relations: [
      {
        targetType: "story",
        targetSlug: "noah-and-the-flood",
        relationType: "RELATED_STORY",
        label: "노아와 홍수",
      },

      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },
    ],
  },


  /* =====================================================
     STORY — TOWER OF BABEL
     ===================================================== */

  {
    type: "story",

    slug: "tower-of-babel",

    titleKo: "바벨탑",

    titleEn: "Tower of Babel",

    eyebrow:
      "STORIES · GENESIS 11",

    summary:
      "창세기 11장은 사람들이 한곳에 모여 도시와 탑을 세우는 이야기와 언어가 나뉘고 사람들이 여러 지역으로 흩어지는 과정을 기록합니다.",

    overview:
      "홍수 이후 인류의 계보가 이어진 뒤 창세기 11장은 사람들이 시날 땅에 정착하는 장면으로 시작합니다. 사람들은 벽돌을 만들고 도시와 높은 탑을 세우려 합니다. 그러나 언어가 서로 달라지면서 함께 건설하던 일이 중단되고 사람들은 여러 지역으로 흩어집니다.",

    biblicalContext:
      "바벨 이야기는 창세기 1–11장의 초기 인류 서사를 마무리하는 중요한 전환점입니다. 창조, 인간의 불순종, 홍수 이후 다시 확장된 인류의 이야기가 바벨에서 여러 민족과 지역으로 분산되는 장면으로 이어집니다. 이후 창세기 12장부터는 이야기의 초점이 아브라함과 그의 가족에게 이동합니다.",

    scenes: [
      {
        number: "01",
        title: "ONE LANGUAGE",
        scripture: "Genesis 11:1",
        description:
          "이야기의 시작에서 온 땅의 사람들이 하나의 언어를 사용하는 것으로 묘사됩니다.",
      },

      {
        number: "02",
        title: "THE LAND OF SHINAR",
        scripture: "Genesis 11:2",
        description:
          "사람들이 동쪽으로 이동하다가 시날 땅의 평지를 발견하고 그곳에 정착합니다.",
      },

      {
        number: "03",
        title: "BRICKS & BUILDING",
        scripture: "Genesis 11:3",
        description:
          "사람들은 벽돌을 만들고 역청을 사용해 건축을 시작합니다.",
      },

      {
        number: "04",
        title: "THE CITY & THE TOWER",
        scripture: "Genesis 11:4",
        description:
          "사람들은 자신들을 위한 도시와 높은 탑을 세우고 흩어지지 않으려 합니다.",
      },

      {
        number: "05",
        title: "THE LANGUAGES",
        scripture: "Genesis 11:5–7",
        description:
          "사람들의 언어가 서로 달라지면서 서로의 말을 이해하지 못하게 됩니다.",
      },

      {
        number: "06",
        title: "THE SCATTERING",
        scripture: "Genesis 11:8",
        description:
          "도시 건설이 중단되고 사람들은 여러 지역으로 흩어집니다.",
      },

      {
        number: "07",
        title: "BABEL",
        scripture: "Genesis 11:9",
        description:
          "이 장소는 바벨이라 불리며 창세기 초기 인류 이야기의 중요한 전환점이 됩니다.",
      },
    ],

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      "Genesis 11:1–9",
    ],

    relations: [
      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },
    ],
  },

  /* =====================================================
     PERSON — ABRAHAM
     ===================================================== */

  {
    type: "person",

    slug: "abraham",

    titleKo: "아브라함",

    titleEn: "Abraham",

    eyebrow:
      "PEOPLE · PATRIARCH · GENESIS 11–25",

    summary:
      "창세기 족장 이야기의 중심 인물로, 고향을 떠나 가나안으로 이동하고 언약과 약속의 이야기를 이어가는 인물입니다.",

    overview:
      "아브라함은 처음에는 아브람이라는 이름으로 창세기 11장 후반에 등장합니다. 그는 가족과 함께 갈대아 우르에서 하란으로 이동하고, 이후 창세기 12장에서 새로운 땅으로 가라는 부르심을 받습니다. 그의 이야기는 가나안에서의 이동, 롯과의 관계, 언약, 이삭의 출생과 모리아 사건으로 이어집니다.",

    biblicalContext:
      "아브라함의 등장은 창세기의 이야기 구조에서 중요한 전환점입니다. 창세기 1–11장이 창조와 초기 인류 전체를 다룬다면, 창세기 12장부터는 아브라함과 그의 가족을 중심으로 이야기가 좁혀집니다. 이후 이삭, 야곱, 요셉으로 이어지는 족장 서사의 출발점이 됩니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number: "01",

        title:
          "UR TO HARAN",

        scripture:
          "Genesis 11:27–32",

        description:
          "아브람의 가족이 갈대아 우르를 떠나 가나안으로 향하다가 하란에 머무는 것으로 그의 초기 배경이 소개됩니다.",
      },


      {
        number: "02",

        title:
          "THE CALL",

        scripture:
          "Genesis 12:1–9",

        description:
          "아브람은 익숙한 땅을 떠나라는 부르심을 받고 가족과 함께 가나안으로 이동합니다.",
      },


      {
        number: "03",

        title:
          "CANAAN",

        scripture:
          "Genesis 12:6–9; 13:14–18",

        description:
          "아브람은 가나안 여러 지역을 이동하며 제단을 세우고 이후 헤브론 지역 인근에 머물게 됩니다.",
      },


      {
        number: "04",

        title:
          "ABRAM & LOT",

        scripture:
          "Genesis 13–14",

        description:
          "아브람과 롯의 가족이 서로 다른 지역으로 나뉘어 이동하고, 이후 아브람은 전쟁에 휘말린 롯을 구합니다.",
      },


      {
        number: "05",

        title:
          "THE COVENANT",

        scripture:
          "Genesis 15",

        description:
          "창세기 15장에서는 아브람과 그의 후손, 그리고 땅에 관한 언약의 이야기가 전개됩니다.",
      },


      {
        number: "06",

        title:
          "ABRAHAM",

        scripture:
          "Genesis 17",

        description:
          "아브람의 이름이 아브라함으로 바뀌고 언약의 표징과 후손에 관한 약속이 다시 확인됩니다.",
      },


      {
        number: "07",

        title:
          "ISAAC",

        scripture:
          "Genesis 21:1–7",

        description:
          "사라가 이삭을 낳으면서 아브라함의 가족 이야기는 다음 세대로 이어집니다.",
      },


      {
        number: "08",

        title:
          "MORIAH",

        scripture:
          "Genesis 22:1–19",

        description:
          "아브라함과 이삭이 모리아 지역으로 향하는 사건이 전개되며 아브라함 이야기의 중요한 장면을 구성합니다.",
      },


      {
        number: "09",

        title:
          "MACHPELAH",

        scripture:
          "Genesis 23",

        description:
          "사라가 죽은 뒤 아브라함은 헤브론 인근의 막벨라 밭과 굴을 매입해 가족의 매장지로 사용합니다.",
      },


      {
        number: "10",

        title:
          "THE LEGACY",

        scripture:
          "Genesis 25:1–11",

        description:
          "아브라함의 생애가 마무리되고 그의 이야기는 이삭과 다음 세대의 족장 이야기로 이어집니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Genesis 11:27–32",
      "Genesis 12–25",
    ],


    relations: [

      {
        targetType: "place",
        targetSlug: "bethel",
        relationType: "RELATED_PLACE",
        label: "벧엘",
      },


      {
        targetType:
          "book",

        targetSlug:
          "genesis",

        relationType:
          "RELATED_BOOK",

        label:
          "창세기",
      },


      {
        targetType:
          "place",

        targetSlug:
          "hebron",

        relationType:
          "RELATED_PLACE",

        label:
          "헤브론",
      },


      {
        targetType: "person",
        targetSlug: "isaac",
        relationType: "RELATED_PERSON",
        label: "이삭",
      },

      {
        targetType: "place",
        targetSlug: "egypt",
        relationType: "RELATED_PLACE",
        label: "이집트",
      },
    ],

  },




  /* =====================================================
     PLACE — SHECHEM
     ===================================================== */

  {
    type: "place",

    slug: "shechem",

    titleKo: "세겜",

    titleEn: "Shechem",

    eyebrow:
      "PLACES · CANAAN · PATRIARCHAL JOURNEY",

    summary:
      "아브람이 가나안에 들어온 뒤 도착한 주요 장소 가운데 하나로, 창세기 족장 이야기에서 반복적으로 등장하는 중요한 지역입니다.",

    overview:
      "세겜은 창세기 12장에서 아브람이 가나안에 들어온 뒤 도착한 첫 주요 장소 가운데 하나입니다. 아브람은 세겜의 모레 상수리나무 부근까지 이동하며 이곳에서 제단을 세웁니다. 이후 세겜은 야곱과 그의 가족 이야기에서도 다시 등장합니다.",

    biblicalContext:
      "세겜은 창세기 족장들의 이동을 연결하는 중요한 장소입니다. 아브라함의 가나안 진입 과정에서 등장하고, 이후 야곱의 귀환과 그의 가족 이야기에서도 다시 등장합니다.",

    keyEvent: {
      title:
        "Abraham Reaches Shechem",

      scripture:
        "Genesis 12:6–7",

      description:
        "아브람은 가나안에 들어와 세겜의 모레 상수리나무 부근까지 이동하고 그곳에서 제단을 세웁니다.",
    },

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      "Genesis 12:6–7",
      "Genesis 33:18–20",
      "Genesis 34",
      "Genesis 35:4",
    ],

    relations: [

      {
        targetType: "place",
        targetSlug: "bethel",
        relationType: "RELATED_PLACE",
        label: "벧엘",
      },

      {
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },

      {
        targetType: "story",
        targetSlug: "call-of-abraham",
        relationType: "RELATED_STORY",
        label: "아브라함의 부르심",
      },

      {
        targetType: "place",
        targetSlug: "canaan",
        relationType: "RELATED_PLACE",
        label: "가나안",
      },

      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },

      {
        targetType: "person",
        targetSlug: "jacob",
        relationType: "RELATED_PERSON",
        label: "야곱",
      },

      {
        targetType: "book",
        targetSlug: "book-of-joshua",
        relationType: "RELATED_BOOK",
        label: "여호수아",
      },

      {
        targetType: "place",
        targetSlug: "mount-ebal",
        relationType: "RELATED_PLACE",
        label: "에발산",
      },

      {
        targetType: "place",
        targetSlug: "mount-gerizim",
        relationType: "RELATED_PLACE",
        label: "그리심산",
      },
    ],
  },



  /* =====================================================
     PLACE — BETHEL
     ===================================================== */

  {
    type: "place",

    slug: "bethel",

    titleKo: "벧엘",

    titleEn: "Bethel",

    eyebrow:
      "PLACES · CANAAN · PATRIARCHAL JOURNEY",

    summary:
      "아브람이 세겜을 지나 가나안 산지로 이동하면서 장막을 치고 제단을 세운 장소로, 창세기 족장 이야기에서 반복적으로 등장하는 중요한 지역입니다.",

    overview:
      "창세기 12장에서 아브람은 세겜을 지난 뒤 벧엘 동쪽 산지로 이동합니다. 그는 벧엘과 아이 사이에 장막을 치고 그곳에 제단을 세웁니다. 이후 창세기에서는 야곱의 이야기에서도 벧엘이 중요한 장소로 다시 등장합니다.",

    biblicalContext:
      "벧엘은 아브라함의 가나안 초기 이동 경로와 야곱의 여정을 함께 연결하는 장소입니다. 아브라함은 이 지역에서 제단을 세웠고, 이후 야곱은 이곳에서 중요한 사건을 경험합니다. 따라서 SCRAPTURA에서는 벧엘을 세겜과 함께 족장 시대의 지리적 연결점으로 구성합니다.",

    keyEvent: {
      title:
        "Abraham Reaches Bethel",

      scripture:
        "Genesis 12:8",

      description:
        "아브람은 세겜을 떠나 벧엘 동쪽 산지로 이동하고 벧엘과 아이 사이에 장막을 친 뒤 제단을 세웁니다.",
    },

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      "Genesis 12:8",
      "Genesis 13:3–4",
      "Genesis 28:10–22",
      "Genesis 35:1–15",
    ],

    relations: [
      {
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },

      {
        targetType: "place",
        targetSlug: "shechem",
        relationType: "RELATED_PLACE",
        label: "세겜",
      },

      {
        targetType: "story",
        targetSlug: "call-of-abraham",
        relationType: "RELATED_STORY",
        label: "아브라함의 부르심",
      },

      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },

      {
        targetType: "place",
        targetSlug: "hebron",
        relationType: "RELATED_PLACE",
        label: "헤브론",
      },

      {
        targetType: "person",
        targetSlug: "jacob",
        relationType: "RELATED_PERSON",
        label: "야곱",
      },

      {
        targetType: "place",
        targetSlug: "ai",
        relationType: "RELATED_PLACE",
        label: "아이 성",
      },
    ],
  },



  /* =====================================================
     PERSON — ISAAC
     ===================================================== */

  {
    type: "person",

    slug: "isaac",

    titleKo: "이삭",

    titleEn: "Isaac",

    eyebrow:
      "PEOPLE · PATRIARCH · GENESIS 21–35",

    summary:
      "아브라함과 사라의 아들로 태어나 아브라함에서 야곱으로 이어지는 창세기 족장 서사의 두 번째 세대를 연결하는 인물입니다.",

    overview:
      "이삭은 아브라함과 사라 사이에서 태어나며 창세기 족장 이야기의 다음 세대를 이어갑니다. 그의 생애는 모리아 사건, 리브가와의 결혼, 에서와 야곱의 출생, 그랄 지역에서의 생활과 우물 이야기, 그리고 야곱과 에서를 둘러싼 가족 이야기로 이어집니다.",

    biblicalContext:
      "창세기에서 이삭은 아브라함과 야곱 사이를 연결하는 족장입니다. 아브라함에게 주어진 가족과 후손에 관한 이야기가 이삭을 통해 다음 세대로 이어지고, 이후 이삭의 아들 야곱을 중심으로 이스라엘 열두 지파의 가족 서사가 확장됩니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number: "01",

        title:
          "THE PROMISE",

        scripture:
          "Genesis 17:15–21",

        description:
          "아브라함과 사라 사이에서 태어날 아들의 이름이 이삭으로 제시되며 그의 출생이 예고됩니다.",
      },


      {
        number: "02",

        title:
          "THE BIRTH",

        scripture:
          "Genesis 21:1–7",

        description:
          "사라가 이삭을 낳으면서 아브라함 가족의 이야기가 새로운 세대로 이어집니다.",
      },


      {
        number: "03",

        title:
          "MORIAH",

        scripture:
          "Genesis 22:1–19",

        description:
          "이삭은 아브라함과 함께 모리아 지역으로 향하며 창세기 22장의 중심 사건에 등장합니다.",
      },


      {
        number: "04",

        title:
          "REBEKAH",

        scripture:
          "Genesis 24:62–67",

        description:
          "아브라함의 종이 데려온 리브가를 만나 결혼하면서 이삭의 가족 이야기가 본격적으로 시작됩니다.",
      },


      {
        number: "05",

        title:
          "ESAU & JACOB",

        scripture:
          "Genesis 25:19–28",

        description:
          "이삭과 리브가 사이에서 에서와 야곱이 태어나며 족장 이야기는 다음 세대로 확장됩니다.",
      },


      {
        number: "06",

        title:
          "GERAR",

        scripture:
          "Genesis 26:1–11",

        description:
          "기근이 발생한 시기에 이삭은 그랄 지역으로 이동하며 그곳에서 생활합니다.",
      },


      {
        number: "07",

        title:
          "THE WELLS",

        scripture:
          "Genesis 26:12–33",

        description:
          "이삭의 가족과 종들은 여러 우물을 둘러싼 갈등을 겪으며 새로운 거주 공간을 찾아 이동합니다.",
      },


      {
        number: "08",

        title:
          "THE BLESSING",

        scripture:
          "Genesis 27",

        description:
          "에서와 야곱을 둘러싼 축복 사건으로 이삭의 가족 안에서 중요한 전환이 일어납니다.",
      },


      {
        number: "09",

        title:
          "HEBRON",

        scripture:
          "Genesis 35:27–29",

        description:
          "야곱이 헤브론 지역의 마므레에 있는 이삭에게 돌아오고 이후 이삭의 생애가 마무리됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Genesis 17:15–21",
      "Genesis 21",
      "Genesis 22",
      "Genesis 24–28",
      "Genesis 35:27–29",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "abraham",

        relationType:
          "RELATED_PERSON",

        label:
          "아브라함",
      },


      {
        targetType:
          "place",

        targetSlug:
          "hebron",

        relationType:
          "RELATED_PLACE",

        label:
          "헤브론",
      },


      {
        targetType:
          "book",

        targetSlug:
          "genesis",

        relationType:
          "RELATED_BOOK",

        label:
          "창세기",
      },


      {
        targetType: "person",
        targetSlug: "jacob",
        relationType: "RELATED_PERSON",
        label: "야곱",
      },
    ],

  },



  /* =====================================================
     PERSON — JACOB
     ===================================================== */

  {
    type: "person",

    slug: "jacob",

    titleKo: "야곱",

    titleEn: "Jacob",

    eyebrow:
      "PEOPLE · PATRIARCH · GENESIS 25–35",

    summary:
      "이삭과 리브가의 아들이자 에서의 쌍둥이 동생으로, 이후 이스라엘이라는 이름을 받고 열두 아들의 가족을 통해 족장 이야기를 다음 세대로 연결하는 인물입니다.",

    overview:
      "야곱은 이삭과 리브가 사이에서 에서와 함께 태어납니다. 장자의 명분과 축복을 둘러싼 사건 이후 가족을 떠나 하란으로 향하며, 벧엘에서 중요한 장면을 경험합니다. 이후 하란에서 가족을 이루고 다시 가나안으로 돌아와 브니엘, 세겜, 벧엘, 헤브론으로 이어지는 여정을 거칩니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number: "01",

        title:
          "THE TWINS",

        scripture:
          "Genesis 25:19–26",

        description:
          "이삭과 리브가 사이에서 에서와 야곱이 태어나며 족장 가족의 다음 세대가 시작됩니다.",
      },


      {
        number: "02",

        title:
          "THE BIRTHRIGHT",

        scripture:
          "Genesis 25:27–34",

        description:
          "야곱과 에서 사이에서 장자의 명분을 둘러싼 사건이 발생합니다.",
      },


      {
        number: "03",

        title:
          "THE BLESSING",

        scripture:
          "Genesis 27",

        description:
          "이삭의 축복을 둘러싼 사건이 일어나고 야곱은 결국 가족을 떠나게 됩니다.",
      },


      {
        number: "04",

        title:
          "BETHEL",

        scripture:
          "Genesis 28:10–22",

        description:
          "하란으로 향하던 야곱은 한 장소에서 밤을 보내며 꿈을 꾸고 그곳을 벧엘이라 부릅니다.",
      },


      {
        number: "05",

        title:
          "HARAN",

        scripture:
          "Genesis 29–31",

        description:
          "야곱은 하란에서 라반의 가족과 함께 지내며 결혼하고 자녀와 가축을 포함한 큰 가족 공동체를 이루게 됩니다.",
      },


      {
        number: "06",

        title:
          "THE RETURN",

        scripture:
          "Genesis 31:17–55",

        description:
          "야곱은 가족과 소유를 이끌고 하란을 떠나 다시 가나안으로 향합니다.",
      },


      {
        number: "07",

        title:
          "PENIEL",

        scripture:
          "Genesis 32:22–32",

        description:
          "에서와 다시 만나기 전 야곱은 얍복 나루 부근에서 중요한 사건을 경험하고 이스라엘이라는 이름을 받습니다.",
      },


      {
        number: "08",

        title:
          "SHECHEM",

        scripture:
          "Genesis 33:18–20; 34",

        description:
          "가나안으로 돌아온 야곱의 가족은 세겜 지역에 머물며 이후 가족과 지역 주민 사이의 갈등을 경험합니다.",
      },


      {
        number: "09",

        title:
          "BETHEL AGAIN",

        scripture:
          "Genesis 35:1–15",

        description:
          "야곱은 다시 벧엘로 올라가 제단을 세우고 자신의 이전 여정과 연결되는 장소로 돌아옵니다.",
      },


      {
        number: "10",

        title:
          "HEBRON",

        scripture:
          "Genesis 35:27–29",

        description:
          "야곱은 헤브론 지역의 마므레에 있던 아버지 이삭에게 돌아오며 이삭 세대와 야곱 세대가 다시 연결됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Genesis 25:19–34",
      "Genesis 27–28",
      "Genesis 29–32",
      "Genesis 33–35",
    ],


    relations: [

      {
        targetType: "person",
        targetSlug: "isaac",
        relationType: "RELATED_PERSON",
        label: "이삭",
      },

      {
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },

      {
        targetType: "place",
        targetSlug: "bethel",
        relationType: "RELATED_PLACE",
        label: "벧엘",
      },

      {
        targetType: "place",
        targetSlug: "shechem",
        relationType: "RELATED_PLACE",
        label: "세겜",
      },

      {
        targetType: "place",
        targetSlug: "hebron",
        relationType: "RELATED_PLACE",
        label: "헤브론",
      },

      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },


      {
        targetType: "person",
        targetSlug: "joseph",
        relationType: "RELATED_PERSON",
        label: "요셉",
      },

      {
        targetType: "place",
        targetSlug: "egypt",
        relationType: "RELATED_PLACE",
        label: "이집트",
      },
    ],

  },



  /* =====================================================
     PERSON — JOSEPH
     ===================================================== */

  {
    type: "person",

    slug: "joseph",

    titleKo: "요셉",

    titleEn: "Joseph",

    eyebrow:
      "PEOPLE · PATRIARCHAL FAMILY · GENESIS 37–50",

    summary:
      "야곱의 아들 가운데 한 사람으로, 형제들에 의해 이집트로 팔려간 뒤 이집트의 통치 체계 안에서 높은 지위에 오르고 가족을 기근에서 구하는 인물입니다.",

    overview:
      "요셉의 이야기는 창세기 후반부의 중심 서사입니다. 야곱의 가족 안에서 시작된 갈등은 요셉이 이집트로 팔려가는 사건으로 이어지고, 요셉은 종과 죄수의 위치를 거쳐 파라오의 꿈을 해석한 뒤 이집트의 식량 정책을 담당하는 높은 지위에 오릅니다. 이후 기근 때문에 이집트로 내려온 형제들과 다시 만나면서 아브라함에서 시작된 족장 가족의 이야기가 이집트로 이동합니다.",

    biblicalContext:
      "요셉 서사는 창세기의 족장 이야기와 출애굽기의 배경을 연결합니다. 야곱의 가족이 가나안에서 이집트로 이동하게 되는 과정을 설명하며, 창세기 마지막 부분에서 이스라엘 가족이 이집트에 거주하게 되는 역사적·서사적 배경을 형성합니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number: "01",

        title:
          "THE DREAMS",

        scripture:
          "Genesis 37:1–11",

        description:
          "요셉은 자신의 가족과 관련된 꿈을 이야기하며 형제들과의 갈등이 더욱 깊어집니다.",
      },


      {
        number: "02",

        title:
          "THE PIT",

        scripture:
          "Genesis 37:12–24",

        description:
          "형제들을 찾아간 요셉은 붙잡혀 옷을 빼앗기고 구덩이에 던져집니다.",
      },


      {
        number: "03",

        title:
          "SOLD TO EGYPT",

        scripture:
          "Genesis 37:25–36",

        description:
          "요셉은 상인들에게 넘겨지고 결국 이집트로 이동하게 됩니다.",
      },


      {
        number: "04",

        title:
          "POTIPHAR'S HOUSE",

        scripture:
          "Genesis 39:1–20",

        description:
          "이집트에서 보디발의 집에 들어간 요셉은 신뢰를 얻지만 이후 사건으로 인해 감옥에 갇히게 됩니다.",
      },


      {
        number: "05",

        title:
          "THE PRISON",

        scripture:
          "Genesis 39:21–40:23",

        description:
          "감옥에서 요셉은 함께 수감된 사람들의 꿈을 해석하며 이후 파라오 앞에 서게 되는 계기를 얻게 됩니다.",
      },


      {
        number: "06",

        title:
          "PHARAOH'S DREAMS",

        scripture:
          "Genesis 41:1–36",

        description:
          "요셉은 파라오의 꿈을 해석하고 풍년과 기근에 대비하기 위한 계획을 제시합니다.",
      },


      {
        number: "07",

        title:
          "GOVERNOR OF EGYPT",

        scripture:
          "Genesis 41:37–57",

        description:
          "요셉은 이집트의 식량 관리와 기근 대비를 담당하는 높은 지위에 오르게 됩니다.",
      },


      {
        number: "08",

        title:
          "THE BROTHERS RETURN",

        scripture:
          "Genesis 42–44",

        description:
          "가나안의 기근으로 인해 요셉의 형제들이 곡식을 구하기 위해 이집트로 내려오면서 가족의 이야기가 다시 연결됩니다.",
      },


      {
        number: "09",

        title:
          "RECONCILIATION",

        scripture:
          "Genesis 45",

        description:
          "요셉은 자신의 정체를 형제들에게 밝히고 가족과 화해합니다.",
      },


      {
        number: "10",

        title:
          "JACOB COMES TO EGYPT",

        scripture:
          "Genesis 46–47",

        description:
          "야곱과 그의 가족이 이집트로 이동하면서 족장 가족의 생활 무대가 가나안에서 이집트로 확장됩니다.",
      },


      {
        number: "11",

        title:
          "THE FINAL YEARS",

        scripture:
          "Genesis 50:15–26",

        description:
          "야곱이 죽은 뒤 요셉은 형제들을 안심시키고 생애 마지막까지 이집트에 머뭅니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Genesis 37",
      "Genesis 39–41",
      "Genesis 42–47",
      "Genesis 50",
    ],


    relations: [

      {
        targetType: "person",
        targetSlug: "jacob",
        relationType: "RELATED_PERSON",
        label: "야곱",
      },

      {
        targetType: "place",
        targetSlug: "hebron",
        relationType: "RELATED_PLACE",
        label: "헤브론",
      },

      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },


      {
        targetType: "place",
        targetSlug: "egypt",
        relationType: "RELATED_PLACE",
        label: "이집트",
      },
    ],

  },



  /* =====================================================
     PLACE — EGYPT
     ===================================================== */

  {
    type: "place",

    slug: "egypt",

    titleKo: "이집트",

    titleEn: "Egypt",

    eyebrow:
      "PLACES · EGYPT · PATRIARCHAL TRANSITION",

    summary:
      "아브라함의 이동과 요셉의 생애, 야곱 가족의 이주가 이어지는 장소로 창세기의 족장 서사와 출애굽기의 배경을 연결하는 핵심 지역입니다.",

    overview:
      "창세기에서 이집트는 여러 세대에 걸쳐 등장합니다. 아브라함은 가나안에 기근이 발생했을 때 이집트로 내려가고, 이후 요셉은 형제들에 의해 팔려 이집트에 도착합니다. 요셉이 이집트에서 높은 지위에 오른 뒤 기근이 발생하면서 야곱과 그의 가족도 이집트로 이동합니다.",

    biblicalContext:
      "SCRAPTURA에서 이집트는 창세기와 출애굽기를 연결하는 중요한 지리적 노드입니다. 요셉의 이야기를 통해 야곱의 가족이 이집트에 정착하는 과정이 설명되고, 이후 출애굽기는 이집트에 거주하게 된 이스라엘 자손의 다음 시대를 다룹니다.",

    keyEvent: {
      title:
        "Jacob's Family Comes to Egypt",

      scripture:
        "Genesis 46:1–7",

      description:
        "기근이 계속되자 야곱은 가족과 함께 가나안을 떠나 이집트로 이동하며 요셉과 다시 만나게 됩니다.",
    },

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      "Genesis 12:10–20",
      "Genesis 37:25–36",
      "Genesis 39–41",
      "Genesis 42–47",
      "Genesis 50:22–26",
    ],

    relations: [

      {
        targetType: "person",
        targetSlug: "joseph",
        relationType: "RELATED_PERSON",
        label: "요셉",
      },

      {
        targetType: "person",
        targetSlug: "jacob",
        relationType: "RELATED_PERSON",
        label: "야곱",
      },

      {
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },

      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },


      {
        targetType: "book",
        targetSlug: "exodus",
        relationType: "RELATED_BOOK",
        label: "출애굽기",
      },

      {
        targetType: "person",
        targetSlug: "moses",
        relationType: "RELATED_PERSON",
        label: "모세",
      },
    ],

  },



  /* =====================================================
     BOOK — EXODUS
     ===================================================== */

  {
    type: "book",

    slug: "exodus",

    titleKo: "출애굽기",

    titleEn: "Exodus",

    eyebrow:
      "BIBLE · OLD TESTAMENT · TORAH",

    summary:
      "이집트에 거주하던 이스라엘 자손의 이야기에서 시작해 모세의 부르심, 출애굽, 광야 여정, 시내산 언약과 성막 건립으로 이어지는 성경의 두 번째 책입니다.",

    overview:
      "출애굽기는 창세기 마지막에 이집트에 정착한 야곱의 가족 이후의 이야기를 이어갑니다. 이스라엘 자손이 이집트에서 큰 공동체로 성장한 상황에서 모세가 등장하고, 출애굽과 광야 여정, 시내산에서의 언약, 성막 건립으로 이야기가 전개됩니다.",

    biblicalContext:
      "SCRAPTURA에서 출애굽기는 창세기와 이집트를 연결하는 다음 핵심 Book Node입니다. 창세기의 가족 중심 서사가 출애굽기에서는 이스라엘 공동체의 이야기로 확장되며 이후 광야 시대의 이야기로 이어집니다.",


    /* =================================================
       BOOK JOURNEY
       ================================================= */

    bookSections: [

      {
        number: "01",

        title:
          "ISRAEL IN EGYPT",

        scripture:
          "Exodus 1",

        description:
          "요셉 세대 이후 이스라엘 자손이 이집트에서 증가하고 새로운 상황에 놓이는 장면으로 출애굽기가 시작됩니다.",
      },


      {
        number: "02",

        title:
          "THE BIRTH OF MOSES",

        scripture:
          "Exodus 2",

        description:
          "모세의 출생과 성장, 미디안으로의 이동을 통해 이후 출애굽 서사의 중심 인물이 소개됩니다.",
      },


      {
        number: "03",

        title:
          "THE BURNING BUSH",

        scripture:
          "Exodus 3–4",

        description:
          "모세는 광야에서 부르심을 받고 이집트로 돌아가야 하는 사명을 받습니다.",
      },


      {
        number: "04",

        title:
          "MOSES & PHARAOH",

        scripture:
          "Exodus 5–11",

        description:
          "모세와 아론이 파라오 앞에 서면서 이스라엘 자손의 해방을 둘러싼 갈등이 본격적으로 전개됩니다.",
      },


      {
        number: "05",

        title:
          "PASSOVER",

        scripture:
          "Exodus 12–13",

        description:
          "유월절 사건과 함께 이스라엘 자손이 이집트를 떠나는 출애굽의 결정적인 전환점이 나타납니다.",
      },


      {
        number: "06",

        title:
          "THE SEA",

        scripture:
          "Exodus 14–15",

        description:
          "이집트를 떠난 이스라엘 자손은 바다 앞에서 위기를 맞고 이후 본격적인 광야 여정을 시작합니다.",
      },


      {
        number: "07",

        title:
          "THE WILDERNESS",

        scripture:
          "Exodus 16–18",

        description:
          "광야에서 음식과 물, 공동체 운영을 둘러싼 여러 사건이 이어집니다.",
      },


      {
        number: "08",

        title:
          "MOUNT SINAI",

        scripture:
          "Exodus 19–24",

        description:
          "이스라엘 공동체가 시내산에 도착하고 언약과 계명에 관한 핵심 장면이 전개됩니다.",
      },


      {
        number: "09",

        title:
          "THE TABERNACLE",

        scripture:
          "Exodus 25–31",

        description:
          "성막과 그 안에서 사용되는 기물, 제사장 관련 지침이 제시됩니다.",
      },


      {
        number: "10",

        title:
          "THE GOLDEN CALF",

        scripture:
          "Exodus 32–34",

        description:
          "금송아지 사건으로 공동체의 위기가 발생하고 이후 언약의 갱신 과정이 이어집니다.",
      },


      {
        number: "11",

        title:
          "THE TABERNACLE COMPLETED",

        scripture:
          "Exodus 35–40",

        description:
          "성막 제작이 진행되고 출애굽기의 마지막에는 성막이 완성되는 장면이 기록됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Exodus 1–40",
    ],


    relations: [

      {
        targetType:
          "book",

        targetSlug:
          "genesis",

        relationType:
          "RELATED_BOOK",

        label:
          "창세기",
      },


      {
        targetType:
          "place",

        targetSlug:
          "egypt",

        relationType:
          "RELATED_PLACE",

        label:
          "이집트",
      },


      {
        targetType: "person",
        targetSlug: "moses",
        relationType: "RELATED_PERSON",
        label: "모세",
      },

      {
        targetType: "place",
        targetSlug: "sinai",
        relationType: "RELATED_PLACE",
        label: "시내산",
      },

      {
        targetType: "story",
        targetSlug: "ten-commandments",
        relationType: "RELATED_STORY",
        label: "십계명",
      },

      {
        targetType: "person",
        targetSlug: "joshua",
        relationType: "RELATED_PERSON",
        label: "여호수아",
      },
    ],

  },



  /* =====================================================
     PERSON — MOSES
     ===================================================== */

  {
    type: "person",

    slug: "moses",

    titleKo: "모세",

    titleEn: "Moses",

    eyebrow:
      "PEOPLE · EXODUS · WILDERNESS JOURNEY",

    summary:
      "이집트에서 태어나 미디안 광야를 거쳐 이스라엘 자손을 이끌고 출애굽한 인물로, 출애굽기와 광야 시대의 중심 인물입니다.",

    overview:
      "모세의 이야기는 이집트에서의 출생으로 시작합니다. 그는 성장한 뒤 미디안으로 떠나고 광야에서 부르심을 받은 후 다시 이집트로 돌아갑니다. 이후 파라오와의 대면, 출애굽, 바다를 건너는 사건, 광야 여정, 시내산 언약과 성막 건립에 이르기까지 출애굽기의 주요 사건을 연결하는 중심 인물로 등장합니다.",

    biblicalContext:
      "모세는 출애굽기뿐 아니라 레위기, 민수기, 신명기로 이어지는 광야 시대의 중심 인물입니다. SCRAPTURA에서는 Egypt와 Exodus에서 시작해 이후 Sinai, Wilderness, Ten Commandments 등의 콘텐츠를 연결하는 핵심 Person Node 역할을 합니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number: "01",

        title:
          "THE CHILD OF THE NILE",

        scripture:
          "Exodus 2:1–10",

        description:
          "모세는 이스라엘 가정에서 태어나 나일강과 관련된 사건을 거쳐 파라오의 딸에게 발견되고 이집트 왕실 환경에서 성장합니다.",
      },


      {
        number: "02",

        title:
          "FLIGHT TO MIDIAN",

        scripture:
          "Exodus 2:11–25",

        description:
          "성인이 된 모세는 이집트를 떠나 미디안으로 이동하고 그곳에서 새로운 삶을 시작합니다.",
      },


      {
        number: "03",

        title:
          "THE BURNING BUSH",

        scripture:
          "Exodus 3:1–4:17",

        description:
          "광야에서 양 떼를 돌보던 모세는 불붙는 떨기나무 장면에서 부르심을 받고 이집트로 돌아가라는 사명을 받습니다.",
      },


      {
        number: "04",

        title:
          "RETURN TO EGYPT",

        scripture:
          "Exodus 4:18–31",

        description:
          "모세는 미디안을 떠나 이집트로 돌아가고 아론과 함께 이스라엘 장로들에게 자신의 사명을 전합니다.",
      },


      {
        number: "05",

        title:
          "BEFORE PHARAOH",

        scripture:
          "Exodus 5–11",

        description:
          "모세와 아론은 파라오 앞에 서서 이스라엘 자손을 보내 달라고 요구하고 긴 대립이 이어집니다.",
      },


      {
        number: "06",

        title:
          "PASSOVER & EXODUS",

        scripture:
          "Exodus 12–13",

        description:
          "유월절 사건 이후 이스라엘 자손이 이집트를 떠나며 모세는 공동체의 여정을 이끕니다.",
      },


      {
        number: "07",

        title:
          "THE SEA",

        scripture:
          "Exodus 14–15",

        description:
          "이스라엘 자손은 바다 앞에서 위기를 맞고 그 사건을 지나 본격적인 광야 여정으로 들어갑니다.",
      },


      {
        number: "08",

        title:
          "THE WILDERNESS",

        scripture:
          "Exodus 16–18",

        description:
          "광야에서 음식과 물, 공동체 운영을 둘러싼 여러 문제가 발생하며 모세는 공동체를 이끕니다.",
      },


      {
        number: "09",

        title:
          "MOUNT SINAI",

        scripture:
          "Exodus 19–24",

        description:
          "이스라엘 공동체가 시내산에 도착하고 모세를 중심으로 언약과 계명에 관한 주요 사건이 전개됩니다.",
      },


      {
        number: "10",

        title:
          "THE GOLDEN CALF",

        scripture:
          "Exodus 32–34",

        description:
          "금송아지 사건으로 공동체에 위기가 발생하고 모세는 이후의 언약 갱신 과정에서 핵심 역할을 합니다.",
      },


      {
        number: "11",

        title:
          "THE TABERNACLE",

        scripture:
          "Exodus 35–40",

        description:
          "성막 제작이 진행되고 출애굽기의 마지막에는 성막이 완성되면서 이후 광야 시대를 위한 기반이 마련됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-moses.jpg",


    scripture: [
      "Exodus 2–4",
      "Exodus 5–15",
      "Exodus 16–24",
      "Exodus 32–40",
    ],


    relations: [

      {
        targetType:
          "book",

        targetSlug:
          "exodus",

        relationType:
          "RELATED_BOOK",

        label:
          "출애굽기",
      },


      {
        targetType:
          "place",

        targetSlug:
          "egypt",

        relationType:
          "RELATED_PLACE",

        label:
          "이집트",
      },


      {
        targetType: "place",
        targetSlug: "sinai",
        relationType: "RELATED_PLACE",
        label: "시내산",
      },

      {
        targetType: "story",
        targetSlug: "ten-commandments",
        relationType: "RELATED_STORY",
        label: "십계명",
      },

      {
        targetType: "person",
        targetSlug: "joshua",
        relationType: "RELATED_PERSON",
        label: "여호수아",
      },
    ],

  },



  /* =====================================================
     PLACE — SINAI
     ===================================================== */

  {
    type: "place",

    slug: "sinai",

    titleKo: "시내산",

    titleEn: "Mount Sinai",

    eyebrow:
      "PLACES · EXODUS · WILDERNESS",

    summary:
      "출애굽 이후 이스라엘 공동체가 도착하여 언약과 계명을 받는 사건이 전개되는 산으로, 출애굽기 광야 서사의 핵심 장소입니다.",

    overview:
      "출애굽기에서 이스라엘 자손은 이집트를 떠난 뒤 광야를 지나 시내산에 도착합니다. 이곳에서 모세가 산에 오르고 언약과 계명에 관한 핵심 장면들이 전개됩니다. 이후 성막과 공동체 규례에 관한 이야기 역시 시내산을 중심으로 이어집니다.",

    biblicalContext:
      "시내산은 출애굽기 19장 이후의 중심 무대입니다. 성경 본문에서는 이스라엘 공동체의 언약, 계명, 금송아지 사건, 언약 갱신과 연결됩니다. 시내산의 정확한 현대 지리적 위치에 대해서는 여러 견해가 있으므로 SCRAPTURA에서는 특정 현대 위치를 단정하지 않고 성경 본문에서의 역할을 중심으로 다룹니다.",

    keyEvent: {

      title:
        "Israel Arrives at Mount Sinai",

      scripture:
        "Exodus 19:1–6",

      description:
        "이스라엘 자손은 이집트를 떠난 뒤 광야를 지나 시내산에 도착하고, 모세가 산에 올라가는 장면을 시작으로 언약 서사가 전개됩니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Exodus 19–24",
      "Exodus 32–34",
      "Exodus 40",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "moses",

        relationType:
          "RELATED_PERSON",

        label:
          "모세",
      },


      {
        targetType:
          "book",

        targetSlug:
          "exodus",

        relationType:
          "RELATED_BOOK",

        label:
          "출애굽기",
      },


      {
        targetType: "story",
        targetSlug: "ten-commandments",
        relationType: "RELATED_STORY",
        label: "십계명",
      },

      {
        targetType: "person",
        targetSlug: "joshua",
        relationType: "RELATED_PERSON",
        label: "여호수아",
      },
    ],

  },



  /* =====================================================
     STORY — TEN COMMANDMENTS
     ===================================================== */

  {
    type: "story",

    slug: "ten-commandments",

    titleKo: "십계명",

    titleEn: "The Ten Commandments",

    eyebrow:
      "STORIES · EXODUS · MOUNT SINAI",

    summary:
      "이스라엘 공동체가 시내산에 도착한 뒤 모세를 중심으로 계명과 언약에 관한 사건이 전개되는 출애굽기의 핵심 이야기입니다.",

    overview:
      "출애굽기 19장에서 이스라엘 공동체는 시내산에 도착합니다. 이어지는 출애굽기 20장에서는 십계명이 제시되고, 이후 언약과 돌판, 금송아지 사건과 언약의 갱신으로 이야기가 이어집니다.",

    biblicalContext:
      "SCRAPTURA에서는 십계명을 독립된 문장 목록으로만 다루기보다 시내산 도착, 모세의 중재, 언약, 돌판과 이후의 사건을 함께 연결된 이야기로 구성합니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "ARRIVAL AT SINAI",

        scripture:
          "Exodus 19:1–6",

        description:
          "이집트를 떠난 이스라엘 공동체가 광야를 지나 시내산에 도착하면서 새로운 이야기 구간이 시작됩니다.",
      },


      {
        number:
          "02",

        title:
          "PREPARING THE PEOPLE",

        scripture:
          "Exodus 19:10–15",

        description:
          "모세는 백성에게 앞으로 일어날 일을 준비하도록 지시합니다.",
      },


      {
        number:
          "03",

        title:
          "THE MOUNTAIN",

        scripture:
          "Exodus 19:16–20",

        description:
          "시내산을 중심으로 긴장감 있는 장면이 전개되고 모세가 산으로 올라갑니다.",
      },


      {
        number:
          "04",

        title:
          "THE TEN COMMANDMENTS",

        scripture:
          "Exodus 20:1–17",

        description:
          "출애굽기 20장에서 십계명이 제시되며 이스라엘 공동체의 언약 서사에서 핵심적인 부분을 이룹니다.",
      },


      {
        number:
          "05",

        title:
          "THE PEOPLE RESPOND",

        scripture:
          "Exodus 20:18–21",

        description:
          "백성은 산에서 펼쳐지는 장면을 경험하고 모세는 공동체와 산 사이에서 중요한 역할을 맡습니다.",
      },


      {
        number:
          "06",

        title:
          "THE COVENANT",

        scripture:
          "Exodus 24:1–18",

        description:
          "언약과 관련된 장면이 이어지고 모세는 다시 산으로 올라갑니다.",
      },


      {
        number:
          "07",

        title:
          "THE TABLETS",

        scripture:
          "Exodus 31:18",

        description:
          "출애굽기에서는 모세가 돌판을 받는 장면이 기록됩니다.",
      },


      {
        number:
          "08",

        title:
          "THE GOLDEN CALF",

        scripture:
          "Exodus 32:1–20",

        description:
          "모세가 산에 있는 동안 금송아지 사건이 발생하고 공동체에 큰 위기가 일어납니다.",
      },


      {
        number:
          "09",

        title:
          "THE COVENANT RENEWED",

        scripture:
          "Exodus 34:1–28",

        description:
          "금송아지 사건 이후 새로운 돌판과 함께 언약 갱신에 관한 장면이 이어집니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Exodus 19",
      "Exodus 20:1–17",
      "Exodus 24",
      "Exodus 31:18",
      "Exodus 32",
      "Exodus 34:1–28",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "moses",

        relationType:
          "RELATED_PERSON",

        label:
          "모세",
      },


      {
        targetType:
          "place",

        targetSlug:
          "sinai",

        relationType:
          "RELATED_PLACE",

        label:
          "시내산",
      },


      {
        targetType:
          "book",

        targetSlug:
          "exodus",

        relationType:
          "RELATED_BOOK",

        label:
          "출애굽기",
      },

    ],

  },



  /* =====================================================
     PERSON — JOSHUA
     ===================================================== */

  {
    type: "person",

    slug: "joshua",

    titleKo: "여호수아",

    titleEn: "Joshua",

    eyebrow:
      "PEOPLE · EXODUS · CANAAN JOURNEY",

    summary:
      "모세와 함께 광야 시대를 지나고 이후 이스라엘 공동체를 이끌어 요단강을 건너 가나안으로 들어가는 인물입니다.",

    overview:
      "여호수아는 출애굽기에서 아말렉과의 전투를 지휘하는 인물로 처음 중요한 역할을 맡습니다. 이후 모세를 보좌하며 광야 시대를 지나고, 가나안 정탐 사건에서도 등장합니다. 모세의 마지막 시기에는 그의 후계자로 세워지고, 여호수아서에서는 이스라엘 공동체를 이끌고 요단강을 건너 가나안으로 들어갑니다.",

    biblicalContext:
      "SCRAPTURA에서 여호수아는 출애굽과 광야 시대를 가나안 정착 이야기로 연결하는 핵심 Person Node입니다. 모세의 인물 여정에서 시작해 이후 요단강, 여리고, 가나안과 같은 장소 및 사건으로 탐험을 확장할 수 있습니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number:
          "01",

        title:
          "THE BATTLE WITH AMALEK",

        scripture:
          "Exodus 17:8–16",

        description:
          "여호수아는 아말렉과의 전투에서 이스라엘 사람들을 이끄는 인물로 등장합니다.",
      },


      {
        number:
          "02",

        title:
          "WITH MOSES",

        scripture:
          "Exodus 24:12–14",

        description:
          "여호수아는 모세와 함께 시내산 이야기의 일부에 등장하며 모세를 보좌하는 인물로 묘사됩니다.",
      },


      {
        number:
          "03",

        title:
          "THE TENT OF MEETING",

        scripture:
          "Exodus 33:7–11",

        description:
          "출애굽기에서는 여호수아가 모세와 회막을 둘러싼 장면에서도 등장합니다.",
      },


      {
        number:
          "04",

        title:
          "THE TWELVE SPIES",

        scripture:
          "Numbers 13:1–16",

        description:
          "여호수아는 가나안 땅을 정탐하기 위해 선택된 열두 명 가운데 한 사람으로 파견됩니다.",
      },


      {
        number:
          "05",

        title:
          "JOSHUA & CALEB",

        scripture:
          "Numbers 14:1–10",

        description:
          "정탐 이후 여호수아와 갈렙은 다른 정탐꾼들과 다른 입장을 보이며 공동체 앞에 섭니다.",
      },


      {
        number:
          "06",

        title:
          "THE SUCCESSOR",

        scripture:
          "Numbers 27:15–23",

        description:
          "모세의 뒤를 이어 공동체를 이끌 인물로 여호수아가 세워지는 장면이 기록됩니다.",
      },


      {
        number:
          "07",

        title:
          "BE STRONG & COURAGEOUS",

        scripture:
          "Deuteronomy 31:1–8",

        description:
          "모세의 마지막 시기에 여호수아는 이스라엘 공동체를 이끌어 다음 단계로 나아갈 인물로 다시 확인됩니다.",
      },


      {
        number:
          "08",

        title:
          "CROSSING THE JORDAN",

        scripture:
          "Joshua 3–4",

        description:
          "여호수아의 지도 아래 이스라엘 공동체가 요단강을 건너며 가나안 진입이 본격적으로 시작됩니다.",
      },


      {
        number:
          "09",

        title:
          "JERICHO",

        scripture:
          "Joshua 6",

        description:
          "여리고 사건은 여호수아서 초기 가나안 진입 서사의 대표적인 장면 가운데 하나입니다.",
      },


      {
        number:
          "10",

        title:
          "THE COVENANT AT SHECHEM",

        scripture:
          "Joshua 24",

        description:
          "여호수아의 이야기 후반부에는 세겜에서 이스라엘 공동체가 모이고 언약을 재확인하는 장면이 기록됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Exodus 17:8–16",
      "Exodus 24:12–14",
      "Exodus 33:7–11",
      "Numbers 13–14",
      "Numbers 27:15–23",
      "Deuteronomy 31",
      "Joshua 1–24",
    ],


    relations: [

      {
        targetType: "person",
        targetSlug: "moses",
        relationType: "RELATED_PERSON",
        label: "모세",
      },

      {
        targetType: "book",
        targetSlug: "exodus",
        relationType: "RELATED_BOOK",
        label: "출애굽기",
      },

      {
        targetType: "place",
        targetSlug: "sinai",
        relationType: "RELATED_PLACE",
        label: "시내산",
      },


      {
        targetType: "book",
        targetSlug: "book-of-joshua",
        relationType: "RELATED_BOOK",
        label: "여호수아",
      },

      {
        targetType: "place",
        targetSlug: "jericho",
        relationType: "RELATED_PLACE",
        label: "여리고",
      },

      {
        targetType: "story",
        targetSlug: "fall-of-jericho",
        relationType: "RELATED_STORY",
        label: "여리고 성 함락",
      },

      {
        targetType: "person",
        targetSlug: "rahab",
        relationType: "RELATED_PERSON",
        label: "라합",
      },

      {
        targetType: "place",
        targetSlug: "jordan-river",
        relationType: "RELATED_PLACE",
        label: "요단강",
      },

      {
        targetType: "story",
        targetSlug: "crossing-the-jordan",
        relationType: "RELATED_STORY",
        label: "요단강 도하",
      },

      {
        targetType: "place",
        targetSlug: "gilgal",
        relationType: "RELATED_PLACE",
        label: "길갈",
      },

      {
        targetType: "place",
        targetSlug: "ai",
        relationType: "RELATED_PLACE",
        label: "아이 성",
      },

      {
        targetType: "story",
        targetSlug: "battle-of-ai",
        relationType: "RELATED_STORY",
        label: "아이 성 전투",
      },

      {
        targetType: "person",
        targetSlug: "achan",
        relationType: "RELATED_PERSON",
        label: "아간",
      },

      {
        targetType: "place",
        targetSlug: "mount-ebal",
        relationType: "RELATED_PLACE",
        label: "에발산",
      },

      {
        targetType: "place",
        targetSlug: "mount-gerizim",
        relationType: "RELATED_PLACE",
        label: "그리심산",
      },
    ],

  },



  /* =====================================================
     BOOK — JOSHUA
     ===================================================== */

  {
    type: "book",

    slug: "book-of-joshua",

    titleKo: "여호수아",

    titleEn: "Joshua",

    eyebrow:
      "BIBLE · OLD TESTAMENT · HISTORICAL BOOKS",

    summary:
      "모세 이후 여호수아가 이스라엘 공동체를 이끌고 요단강을 건너 가나안에 들어가며, 정복과 땅의 분배, 세겜에서의 언약 갱신으로 이어지는 이야기입니다.",

    overview:
      "여호수아서는 모세의 죽음 이후 여호수아가 지도자로 세워지는 장면에서 시작합니다. 이스라엘 공동체는 요단강을 건너 가나안으로 들어가고, 여리고와 아이를 비롯한 여러 사건을 지나갑니다. 후반부에는 각 지파의 땅 분배가 기록되며 마지막에는 여호수아의 고별과 세겜에서의 언약 갱신이 전개됩니다.",

    biblicalContext:
      "SCRAPTURA에서 여호수아서는 모세와 광야 시대에서 가나안 시대를 연결하는 핵심 Book Node입니다. Person Joshua를 중심으로 요단강, 여리고, 세겜과 여러 가나안 지역의 이야기를 연결하는 기반이 됩니다.",


    /* =================================================
       BOOK JOURNEY
       ================================================= */

    bookSections: [

      {
        number:
          "01",

        title:
          "AFTER MOSES",

        scripture:
          "Joshua 1",

        description:
          "모세의 죽음 이후 여호수아가 이스라엘 공동체를 이끌 지도자로 등장하며 새로운 시대가 시작됩니다.",
      },


      {
        number:
          "02",

        title:
          "CROSSING THE JORDAN",

        scripture:
          "Joshua 3–4",

        description:
          "이스라엘 공동체가 요단강을 건너면서 광야 여정에서 가나안 진입 단계로 이동합니다.",
      },


      {
        number:
          "03",

        title:
          "JERICHO",

        scripture:
          "Joshua 5:13–6:27",

        description:
          "여리고 사건은 여호수아서 초기 가나안 진입 이야기의 대표적인 장면입니다.",
      },


      {
        number:
          "04",

        title:
          "AI & COVENANT",

        scripture:
          "Joshua 7–8",

        description:
          "아이 성과 관련된 사건과 그 이후의 전투, 그리고 에발산에서의 언약 관련 장면이 이어집니다.",
      },


      {
        number:
          "05",

        title:
          "THE GIBEONITES",

        scripture:
          "Joshua 9",

        description:
          "기브온 주민들과 이스라엘 지도자들 사이의 사건이 전개됩니다.",
      },


      {
        number:
          "06",

        title:
          "THE SOUTHERN CAMPAIGN",

        scripture:
          "Joshua 10",

        description:
          "여호수아서 10장에서는 가나안 남부 지역을 배경으로 여러 전투가 이어집니다.",
      },


      {
        number:
          "07",

        title:
          "THE NORTHERN CAMPAIGN",

        scripture:
          "Joshua 11–12",

        description:
          "북부 지역의 전투와 여호수아 시대 정복 이야기의 한 구간이 정리됩니다.",
      },


      {
        number:
          "08",

        title:
          "THE LAND",

        scripture:
          "Joshua 13–21",

        description:
          "여호수아서 후반부에서는 각 지파에게 땅이 분배되는 과정과 도피성, 레위인의 성읍 등이 기록됩니다.",
      },


      {
        number:
          "09",

        title:
          "THE EASTERN TRIBES",

        scripture:
          "Joshua 22",

        description:
          "요단 동쪽 지파들이 돌아가는 과정에서 제단을 둘러싼 갈등과 해명이 전개됩니다.",
      },


      {
        number:
          "10",

        title:
          "THE FINAL COVENANT",

        scripture:
          "Joshua 23–24",

        description:
          "여호수아는 마지막 권면을 전하고 세겜에서 공동체와 함께 언약을 재확인합니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 1–24",
    ],


    relations: [

      {
        targetType: "person",
        targetSlug: "joshua",
        relationType: "RELATED_PERSON",
        label: "여호수아",
      },

      {
        targetType: "person",
        targetSlug: "moses",
        relationType: "RELATED_PERSON",
        label: "모세",
      },

      {
        targetType: "place",
        targetSlug: "shechem",
        relationType: "RELATED_PLACE",
        label: "세겜",
      },


      {
        targetType: "place",
        targetSlug: "jericho",
        relationType: "RELATED_PLACE",
        label: "여리고",
      },

      {
        targetType: "story",
        targetSlug: "fall-of-jericho",
        relationType: "RELATED_STORY",
        label: "여리고 성 함락",
      },

      {
        targetType: "person",
        targetSlug: "rahab",
        relationType: "RELATED_PERSON",
        label: "라합",
      },

      {
        targetType: "place",
        targetSlug: "jordan-river",
        relationType: "RELATED_PLACE",
        label: "요단강",
      },

      {
        targetType: "story",
        targetSlug: "crossing-the-jordan",
        relationType: "RELATED_STORY",
        label: "요단강 도하",
      },

      {
        targetType: "place",
        targetSlug: "gilgal",
        relationType: "RELATED_PLACE",
        label: "길갈",
      },

      {
        targetType: "place",
        targetSlug: "ai",
        relationType: "RELATED_PLACE",
        label: "아이 성",
      },

      {
        targetType: "story",
        targetSlug: "battle-of-ai",
        relationType: "RELATED_STORY",
        label: "아이 성 전투",
      },

      {
        targetType: "person",
        targetSlug: "achan",
        relationType: "RELATED_PERSON",
        label: "아간",
      },

      {
        targetType: "place",
        targetSlug: "mount-ebal",
        relationType: "RELATED_PLACE",
        label: "에발산",
      },

      {
        targetType: "place",
        targetSlug: "mount-gerizim",
        relationType: "RELATED_PLACE",
        label: "그리심산",
      },
    ],

  },



  /* =====================================================
     PLACE — JERICHO
     ===================================================== */

  {
    type: "place",

    slug: "jericho",

    titleKo: "여리고",

    titleEn: "Jericho",

    eyebrow:
      "PLACES · CANAAN · JOSHUA",

    summary:
      "요단강을 건넌 이스라엘 공동체가 가나안 진입 과정에서 마주하는 주요 성읍으로, 여호수아 6장의 여리고 사건으로 잘 알려진 장소입니다.",

    overview:
      "여리고는 여호수아서 초반부에서 중요한 장소로 등장합니다. 이스라엘 공동체가 요단강을 건너 가나안에 들어온 뒤 길갈을 중심으로 진영을 정비하고, 이후 여리고 성을 둘러싼 사건이 전개됩니다. 여리고는 광야 여정에서 가나안 진입으로 넘어가는 이야기의 대표적인 장소 가운데 하나입니다.",

    biblicalContext:
      "여호수아서 2장에서는 정탐꾼들과 라합의 이야기가 여리고를 배경으로 전개됩니다. 이후 여호수아 5장과 6장에서는 이스라엘 공동체가 여리고를 마주하고 성을 도는 장면과 성이 무너지는 사건이 이어집니다. SCRAPTURA에서는 여리고를 Joshua, Book of Joshua, Rahab, Jordan Crossing, Fall of Jericho와 연결되는 핵심 Place Node로 확장할 수 있습니다.",


    /* =================================================
       KEY EVENT
       ================================================= */

    keyEvent: {

      title:
        "The Fall of Jericho",

      scripture:
        "Joshua 6:1–27",

      description:
        "이스라엘 공동체는 여호수아의 지휘 아래 여러 날 동안 여리고 성을 돌고, 일곱째 날의 사건을 거쳐 성이 무너지는 장면이 기록됩니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 2",
      "Joshua 5:13–15",
      "Joshua 6:1–27",
    ],


    relations: [

      {
        targetType: "person",
        targetSlug: "joshua",
        relationType: "RELATED_PERSON",
        label: "여호수아",
      },

      {
        targetType: "book",
        targetSlug: "book-of-joshua",
        relationType: "RELATED_BOOK",
        label: "여호수아",
      },


      {
        targetType: "story",
        targetSlug: "fall-of-jericho",
        relationType: "RELATED_STORY",
        label: "여리고 성 함락",
      },

      {
        targetType: "person",
        targetSlug: "rahab",
        relationType: "RELATED_PERSON",
        label: "라합",
      },

      {
        targetType: "place",
        targetSlug: "jordan-river",
        relationType: "RELATED_PLACE",
        label: "요단강",
      },

      {
        targetType: "story",
        targetSlug: "crossing-the-jordan",
        relationType: "RELATED_STORY",
        label: "요단강 도하",
      },

      {
        targetType: "place",
        targetSlug: "gilgal",
        relationType: "RELATED_PLACE",
        label: "길갈",
      },

      {
        targetType: "place",
        targetSlug: "ai",
        relationType: "RELATED_PLACE",
        label: "아이 성",
      },

      {
        targetType: "story",
        targetSlug: "battle-of-ai",
        relationType: "RELATED_STORY",
        label: "아이 성 전투",
      },

      {
        targetType: "person",
        targetSlug: "achan",
        relationType: "RELATED_PERSON",
        label: "아간",
      },
    ],

  },



  /* =====================================================
     STORY — FALL OF JERICHO
     ===================================================== */

  {
    type: "story",

    slug: "fall-of-jericho",

    titleKo: "여리고 성 함락",

    titleEn: "The Fall of Jericho",

    eyebrow:
      "STORIES · JOSHUA 2–6 · CANAAN",

    summary:
      "이스라엘 공동체가 요단강을 건너 가나안에 들어간 뒤 여호수아의 지휘 아래 여리고 성을 마주하고, 여러 날 동안 성을 돈 뒤 성이 무너지는 이야기입니다.",

    overview:
      "여리고 이야기는 단순히 성이 무너지는 장면만으로 구성되지 않습니다. 여호수아는 먼저 정탐꾼을 보내고, 정탐꾼들은 여리고에서 라합을 만나게 됩니다. 이후 이스라엘 공동체는 요단강을 건너 가나안에 들어오고, 여리고 앞에서 진영을 정비합니다. 여호수아 6장에서 공동체는 여러 날 동안 성을 돌고 마지막 날의 사건을 거쳐 여리고 성의 함락을 경험합니다.",

    biblicalContext:
      "SCRAPTURA에서는 여리고 성 함락을 여호수아 개인의 사건으로만 보지 않고 광야 시대에서 가나안 진입 시대로 넘어가는 전환점으로 구성합니다. 이 이야기는 Joshua, Jericho, Book of Joshua와 직접 연결되며 이후 Rahab, Jordan Crossing, Ai 등의 콘텐츠로 확장할 수 있습니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "THE SPIES",

        scripture:
          "Joshua 2:1",

        description:
          "여호수아는 싯딤에서 두 명의 정탐꾼을 여리고로 보내 가나안 진입을 준비합니다.",
      },


      {
        number:
          "02",

        title:
          "RAHAB",

        scripture:
          "Joshua 2:2–21",

        description:
          "정탐꾼들은 여리고에서 라합의 도움을 받고, 이후 그녀와 가족의 안전에 관한 약속이 이루어집니다.",
      },


      {
        number:
          "03",

        title:
          "CROSSING THE JORDAN",

        scripture:
          "Joshua 3–4",

        description:
          "이스라엘 공동체가 요단강을 건너면서 광야 여정에서 가나안 진입 단계로 이동합니다.",
      },


      {
        number:
          "04",

        title:
          "BEFORE JERICHO",

        scripture:
          "Joshua 5:13–15",

        description:
          "여리고를 앞둔 시점에서 여호수아에게 중요한 장면이 전개되며 이후 여리고 사건으로 이어집니다.",
      },


      {
        number:
          "05",

        title:
          "THE FIRST SIX DAYS",

        scripture:
          "Joshua 6:1–14",

        description:
          "이스라엘 공동체는 여호수아의 지시에 따라 여리고 성 주위를 돌기 시작합니다.",
      },


      {
        number:
          "06",

        title:
          "THE SEVENTH DAY",

        scripture:
          "Joshua 6:15–16",

        description:
          "일곱째 날에는 이전과 다른 방식으로 성을 여러 차례 돌며 이야기의 긴장이 절정에 이릅니다.",
      },


      {
        number:
          "07",

        title:
          "THE SHOUT",

        scripture:
          "Joshua 6:20",

        description:
          "나팔 소리와 백성의 외침 이후 여리고 성벽이 무너지는 장면이 기록됩니다.",
      },


      {
        number:
          "08",

        title:
          "RAHAB IS RESCUED",

        scripture:
          "Joshua 6:22–25",

        description:
          "정탐꾼들과의 약속에 따라 라합과 그의 가족이 성 밖으로 나오게 됩니다.",
      },


      {
        number:
          "09",

        title:
          "AFTER JERICHO",

        scripture:
          "Joshua 6:26–27",

        description:
          "여리고 사건 이후 여호수아의 이름이 알려지고 가나안 진입 이야기는 다음 지역과 사건으로 이어집니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 2",
      "Joshua 3–4",
      "Joshua 5:13–15",
      "Joshua 6:1–27",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "joshua",

        relationType:
          "RELATED_PERSON",

        label:
          "여호수아",
      },


      {
        targetType:
          "place",

        targetSlug:
          "jericho",

        relationType:
          "RELATED_PLACE",

        label:
          "여리고",
      },


      {
        targetType:
          "book",

        targetSlug:
          "book-of-joshua",

        relationType:
          "RELATED_BOOK",

        label:
          "여호수아",
      },


      {
        targetType: "person",
        targetSlug: "rahab",
        relationType: "RELATED_PERSON",
        label: "라합",
      },

      {
        targetType: "place",
        targetSlug: "gilgal",
        relationType: "RELATED_PLACE",
        label: "길갈",
      },
    ],

  },



  /* =====================================================
     PERSON — RAHAB
     ===================================================== */

  {
    type: "person",

    slug: "rahab",

    titleKo: "라합",

    titleEn: "Rahab",

    eyebrow:
      "PEOPLE · JERICHO · JOSHUA 2–6",

    summary:
      "여리고에 살던 인물로, 여호수아가 보낸 정탐꾼들을 숨겨 주고 그들과 약속을 맺으며 여리고 사건의 중요한 인물로 등장합니다.",

    overview:
      "라합은 여호수아 2장에서 처음 등장합니다. 여호수아가 여리고를 정탐하기 위해 두 사람을 보내자, 정탐꾼들은 라합의 집에 들어갑니다. 라합은 그들을 숨기고 추적자들을 다른 방향으로 보낸 뒤 정탐꾼들과 자신과 가족의 안전에 관한 약속을 맺습니다. 이후 여리고 성이 함락될 때 라합과 그의 가족은 보호받습니다.",

    biblicalContext:
      "SCRAPTURA에서 라합은 여리고라는 장소와 여리고 성 함락 이야기 사이를 연결하는 핵심 Person Node입니다. 그의 이야기는 정탐, 여리고 성, 가나안 진입이라는 흐름 안에서 이해할 수 있으며 이후 성경의 다른 본문에서도 다시 언급됩니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number:
          "01",

        title:
          "THE SPIES ARRIVE",

        scripture:
          "Joshua 2:1",

        description:
          "여호수아가 보낸 두 정탐꾼이 여리고에 들어가 라합의 집에 머물면서 이야기가 시작됩니다.",
      },


      {
        number:
          "02",

        title:
          "THE SEARCH",

        scripture:
          "Joshua 2:2–7",

        description:
          "여리고 왕은 정탐꾼들의 존재를 알게 되고 사람들을 보내 그들을 찾지만 라합은 정탐꾼들을 숨깁니다.",
      },


      {
        number:
          "03",

        title:
          "ON THE ROOF",

        scripture:
          "Joshua 2:8–11",

        description:
          "라합은 지붕 위에 숨겨 둔 정탐꾼들에게 자신이 알고 있는 상황과 여리고 사람들이 느끼는 두려움에 대해 이야기합니다.",
      },


      {
        number:
          "04",

        title:
          "THE PROMISE",

        scripture:
          "Joshua 2:12–14",

        description:
          "라합은 자신과 가족을 살려 달라고 요청하고 정탐꾼들은 조건에 따라 그들을 보호하겠다고 약속합니다.",
      },


      {
        number:
          "05",

        title:
          "THE SCARLET CORD",

        scripture:
          "Joshua 2:15–21",

        description:
          "정탐꾼들은 라합에게 창문에 붉은 줄을 매달도록 하고 가족을 집 안에 모으라는 조건을 전합니다.",
      },


      {
        number:
          "06",

        title:
          "THE SPIES RETURN",

        scripture:
          "Joshua 2:22–24",

        description:
          "정탐꾼들은 여호수아에게 돌아가 여리고에서 경험한 내용을 보고합니다.",
      },


      {
        number:
          "07",

        title:
          "THE FALL OF JERICHO",

        scripture:
          "Joshua 6:15–21",

        description:
          "이스라엘 공동체가 여리고를 도는 마지막 날 성이 무너지는 사건이 전개됩니다.",
      },


      {
        number:
          "08",

        title:
          "RAHAB IS RESCUED",

        scripture:
          "Joshua 6:22–25",

        description:
          "여호수아는 정탐꾼들에게 라합과 그의 가족을 데려오도록 지시하고, 약속에 따라 그들이 보호됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 2:1–24",
      "Joshua 6:17",
      "Joshua 6:22–25",
    ],


    relations: [

      {
        targetType:
          "place",

        targetSlug:
          "jericho",

        relationType:
          "RELATED_PLACE",

        label:
          "여리고",
      },


      {
        targetType:
          "story",

        targetSlug:
          "fall-of-jericho",

        relationType:
          "RELATED_STORY",

        label:
          "여리고 성 함락",
      },


      {
        targetType:
          "person",

        targetSlug:
          "joshua",

        relationType:
          "RELATED_PERSON",

        label:
          "여호수아",
      },


      {
        targetType:
          "book",

        targetSlug:
          "book-of-joshua",

        relationType:
          "RELATED_BOOK",

        label:
          "여호수아",
      },

    ],

  },



  /* =====================================================
     PLACE — JORDAN RIVER
     ===================================================== */

  {
    type: "place",

    slug: "jordan-river",

    titleKo: "요단강",

    titleEn: "Jordan River",

    eyebrow:
      "PLACES · CANAAN · JOSHUA 3–4",

    summary:
      "이스라엘 공동체가 광야 여정을 마치고 가나안으로 들어가는 과정에서 건너는 강으로, 여호수아서 3–4장의 핵심 장소입니다.",

    overview:
      "요단강은 여호수아서에서 광야 시대와 가나안 진입 시대를 구분하는 중요한 지리적 경계로 등장합니다. 여호수아의 지도 아래 이스라엘 공동체는 언약궤와 함께 요단강을 건너고, 강을 건넌 뒤에는 그 사건을 기억하기 위한 돌을 세웁니다.",

    biblicalContext:
      "SCRAPTURA에서 요단강은 Moses에서 Joshua로 이어지는 지도력의 전환과 광야에서 가나안으로 이어지는 공간적 전환을 동시에 보여 주는 Place Node입니다. 이후 Gilgal, Jericho, Crossing the Jordan Story와 직접 연결되는 중심 장소로 사용할 수 있습니다.",


    /* =================================================
       KEY EVENT
       ================================================= */

    keyEvent: {

      title:
        "Crossing the Jordan",

      scripture:
        "Joshua 3–4",

      description:
        "이스라엘 공동체는 여호수아의 지도 아래 요단강을 건너 가나안으로 들어가고, 이후 열두 돌을 세워 이 사건을 기억합니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 3",
      "Joshua 4",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "joshua",

        relationType:
          "RELATED_PERSON",

        label:
          "여호수아",
      },


      {
        targetType:
          "book",

        targetSlug:
          "book-of-joshua",

        relationType:
          "RELATED_BOOK",

        label:
          "여호수아",
      },


      {
        targetType:
          "place",

        targetSlug:
          "jericho",

        relationType:
          "RELATED_PLACE",

        label:
          "여리고",
      },


      {
        targetType: "story",
        targetSlug: "crossing-the-jordan",
        relationType: "RELATED_STORY",
        label: "요단강 도하",
      },

      {
        targetType: "place",
        targetSlug: "gilgal",
        relationType: "RELATED_PLACE",
        label: "길갈",
      },
    ],

  },



  /* =====================================================
     STORY — CROSSING THE JORDAN
     ===================================================== */

  {
    type: "story",

    slug: "crossing-the-jordan",

    titleKo: "요단강 도하",

    titleEn: "Crossing the Jordan",

    eyebrow:
      "STORIES · JOSHUA 3–4 · CANAAN",

    summary:
      "여호수아의 지도 아래 이스라엘 공동체가 요단강을 건너 광야 시대를 마치고 가나안으로 들어가는 전환점의 이야기입니다.",

    overview:
      "여호수아서 3–4장에서 이스라엘 공동체는 요단강 앞에 도착합니다. 언약궤를 멘 제사장들이 강에 들어가고, 공동체는 마른 땅을 지나 강을 건넙니다. 이후 각 지파에서 한 명씩 선택된 사람들이 열두 개의 돌을 가져와 이 사건을 기억하기 위한 표징을 세웁니다.",

    biblicalContext:
      "요단강 도하는 출애굽과 광야 시대에서 가나안 진입 시대로 넘어가는 중요한 전환점입니다. SCRAPTURA에서는 Joshua, Jordan River, Book of Joshua를 연결하는 핵심 Story Node로 사용하고 이후 Gilgal과 Jericho로 이어지는 이동 흐름을 구성합니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "AT THE JORDAN",

        scripture:
          "Joshua 3:1",

        description:
          "여호수아와 이스라엘 공동체는 싯딤을 떠나 요단강에 도착하고 강을 건너기 전 그곳에 머뭅니다.",
      },


      {
        number:
          "02",

        title:
          "THE ARK GOES BEFORE",

        scripture:
          "Joshua 3:2–6",

        description:
          "관리들은 공동체에게 언약궤를 따라 이동하도록 지시하고 제사장들이 공동체 앞에서 움직이기 시작합니다.",
      },


      {
        number:
          "03",

        title:
          "THE PRIESTS ENTER",

        scripture:
          "Joshua 3:14–15",

        description:
          "언약궤를 멘 제사장들이 요단강 물가에 도착하고 그들의 발이 물에 잠기는 장면이 기록됩니다.",
      },


      {
        number:
          "04",

        title:
          "THE WATERS STOP",

        scripture:
          "Joshua 3:16",

        description:
          "상류에서 내려오던 물이 멈추면서 공동체가 강을 건널 수 있는 길이 열립니다.",
      },


      {
        number:
          "05",

        title:
          "ON DRY GROUND",

        scripture:
          "Joshua 3:17",

        description:
          "언약궤를 멘 제사장들이 강 가운데 서 있는 동안 이스라엘 공동체가 마른 땅을 지나 요단강을 건넙니다.",
      },


      {
        number:
          "06",

        title:
          "TWELVE STONES",

        scripture:
          "Joshua 4:1–8",

        description:
          "각 지파에서 한 명씩 선택된 사람들이 요단강 가운데에서 돌을 가져옵니다.",
      },


      {
        number:
          "07",

        title:
          "THE RIVER RETURNS",

        scripture:
          "Joshua 4:15–18",

        description:
          "제사장들이 요단강에서 올라온 뒤 강물이 다시 원래 흐름으로 돌아가는 장면이 이어집니다.",
      },


      {
        number:
          "08",

        title:
          "THE MEMORIAL",

        scripture:
          "Joshua 4:19–24",

        description:
          "이스라엘 공동체는 강을 건넌 뒤 열두 돌을 세우고 요단강 도하 사건을 기억하는 표징으로 삼습니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 3",
      "Joshua 4",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "joshua",

        relationType:
          "RELATED_PERSON",

        label:
          "여호수아",
      },


      {
        targetType:
          "place",

        targetSlug:
          "jordan-river",

        relationType:
          "RELATED_PLACE",

        label:
          "요단강",
      },


      {
        targetType:
          "book",

        targetSlug:
          "book-of-joshua",

        relationType:
          "RELATED_BOOK",

        label:
          "여호수아",
      },


      {
        targetType:
          "place",

        targetSlug:
          "jericho",

        relationType:
          "RELATED_PLACE",

        label:
          "여리고",
      },


      {
        targetType: "place",
        targetSlug: "gilgal",
        relationType: "RELATED_PLACE",
        label: "길갈",
      },
    ],

  },



  /* =====================================================
     PLACE — GILGAL
     ===================================================== */

  {
    type: "place",

    slug: "gilgal",

    titleKo: "길갈",

    titleEn: "Gilgal",

    eyebrow:
      "PLACES · CANAAN · JOSHUA 4–5",

    summary:
      "이스라엘 공동체가 요단강을 건넌 뒤 진영을 세우고 열두 돌을 세운 장소로, 여리고 사건으로 넘어가기 전 중요한 거점입니다.",

    overview:
      "여호수아서에서 길갈은 요단강 도하 직후 이스라엘 공동체가 머무는 장소로 등장합니다. 요단강에서 가져온 열두 돌이 이곳에 세워지고, 공동체는 가나안에 들어온 뒤 중요한 준비 과정을 거칩니다. 이후 여리고를 향한 이야기 역시 길갈을 중심으로 이어집니다.",

    biblicalContext:
      "길갈은 여호수아서 4–5장에서 요단강 도하와 여리고 사건을 연결하는 핵심 장소입니다. SCRAPTURA에서는 Jordan River, Crossing the Jordan, Joshua, Jericho를 연결하는 중간 Place Node로 사용합니다.",


    /* =================================================
       KEY EVENT
       ================================================= */

    keyEvent: {

      title:
        "The Twelve Stones at Gilgal",

      scripture:
        "Joshua 4:19–24",

      description:
        "이스라엘 공동체는 요단강을 건넌 뒤 길갈에 진을 치고 강에서 가져온 열두 돌을 세워 요단강 도하 사건을 기억하는 표징으로 삼습니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 4:19–24",
      "Joshua 5:1–12",
      "Joshua 9:6",
      "Joshua 10:6–15",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "joshua",

        relationType:
          "RELATED_PERSON",

        label:
          "여호수아",
      },


      {
        targetType:
          "place",

        targetSlug:
          "jordan-river",

        relationType:
          "RELATED_PLACE",

        label:
          "요단강",
      },


      {
        targetType:
          "story",

        targetSlug:
          "crossing-the-jordan",

        relationType:
          "RELATED_STORY",

        label:
          "요단강 도하",
      },


      {
        targetType:
          "place",

        targetSlug:
          "jericho",

        relationType:
          "RELATED_PLACE",

        label:
          "여리고",
      },


      {
        targetType:
          "book",

        targetSlug:
          "book-of-joshua",

        relationType:
          "RELATED_BOOK",

        label:
          "여호수아",
      },


      {
        targetType: "place",
        targetSlug: "ai",
        relationType: "RELATED_PLACE",
        label: "아이 성",
      },

      {
        targetType: "story",
        targetSlug: "battle-of-ai",
        relationType: "RELATED_STORY",
        label: "아이 성 전투",
      },
    ],

  },



  /* =====================================================
     PLACE — AI
     Biblical City
     ===================================================== */

  {
    type: "place",

    slug: "ai",

    titleKo: "아이 성",

    titleEn: "Ai",

    eyebrow:
      "PLACES · CANAAN · JOSHUA 7–8",

    summary:
      "여리고 사건 이후 이스라엘 공동체가 다음으로 향하는 가나안의 성읍으로, 여호수아 7–8장에서 첫 패배와 두 번째 공격의 배경이 되는 장소입니다.",

    overview:
      "아이 성은 여리고 이후 여호수아서의 다음 주요 장소입니다. 처음 파견된 이스라엘 군대는 아이 성 전투에서 패배하고, 이후 공동체 내부의 문제를 다룬 뒤 여호수아는 새로운 전략으로 다시 아이 성을 공격합니다. 이 과정은 여호수아서 7장과 8장의 핵심 이야기입니다.",

    biblicalContext:
      "성경 본문은 아이 성을 벧엘 인근의 장소로 묘사하지만, 오늘날 어떤 고고학 유적이 성경의 아이 성에 해당하는지는 학계에서 논쟁이 있습니다. 따라서 SCRAPTURA에서는 특정 현대 유적을 확정하지 않고 성경 서사 속 장소인 Ai를 중심으로 콘텐츠를 구성합니다.",


    /* =================================================
       KEY EVENT
       ================================================= */

    keyEvent: {

      title:
        "The Battle of Ai",

      scripture:
        "Joshua 7–8",

      description:
        "이스라엘은 여리고 이후 아이 성을 공격했다가 처음에는 패배하지만, 이후 다시 공격해 성을 점령하는 이야기가 전개됩니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 7:2–5",
      "Joshua 7:6–26",
      "Joshua 8:1–29",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "joshua",

        relationType:
          "RELATED_PERSON",

        label:
          "여호수아",
      },


      {
        targetType:
          "book",

        targetSlug:
          "book-of-joshua",

        relationType:
          "RELATED_BOOK",

        label:
          "여호수아",
      },


      {
        targetType:
          "place",

        targetSlug:
          "jericho",

        relationType:
          "RELATED_PLACE",

        label:
          "여리고",
      },


      {
        targetType:
          "place",

        targetSlug:
          "gilgal",

        relationType:
          "RELATED_PLACE",

        label:
          "길갈",
      },


      {
        targetType: "place",
        targetSlug: "bethel",
        relationType: "RELATED_PLACE",
        label: "벧엘",
      },

      {
        targetType: "story",
        targetSlug: "battle-of-ai",
        relationType: "RELATED_STORY",
        label: "아이 성 전투",
      },

      {
        targetType: "person",
        targetSlug: "achan",
        relationType: "RELATED_PERSON",
        label: "아간",
      },

      {
        targetType: "place",
        targetSlug: "mount-ebal",
        relationType: "RELATED_PLACE",
        label: "에발산",
      },
    ],

  },



  /* =====================================================
     STORY — BATTLE OF AI
     ===================================================== */

  {
    type: "story",

    slug: "battle-of-ai",

    titleKo: "아이 성 전투",

    titleEn: "The Battle of Ai",

    eyebrow:
      "STORIES · JOSHUA 7–8 · CANAAN",

    summary:
      "여리고 이후 아이 성을 향한 첫 공격에서 이스라엘이 패배하고, 공동체 내부의 문제를 다룬 뒤 여호수아가 다시 아이 성을 공격해 점령하는 이야기입니다.",

    overview:
      "여리고 사건 이후 이스라엘은 아이 성을 다음 목표로 삼습니다. 정탐 결과를 바탕으로 소규모 병력이 먼저 공격하지만 패배합니다. 이후 여호수아 7장에서는 패배의 원인과 아간 사건이 전개됩니다. 문제를 해결한 뒤 여호수아는 새로운 전략으로 아이 성을 다시 공격하고, 여호수아 8장 후반부에서는 에발산과 그리심산을 배경으로 언약의 말씀을 낭독하는 장면이 이어집니다.",

    biblicalContext:
      "아이 성 전투는 여리고의 승리 직후 곧바로 이어지는 이야기이지만 처음부터 성공하는 서사가 아닙니다. SCRAPTURA에서는 첫 패배, 공동체 내부의 문제, 두 번째 공격, 그리고 에발산에서의 언약 장면을 하나의 흐름으로 구성합니다. 아이 성의 정확한 현대 고고학적 위치는 논쟁이 있으므로 특정 유적과 동일시하지 않습니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "THE ROAD FROM JERICHO",

        scripture:
          "Joshua 7:2",

        description:
          "여리고 사건 이후 여호수아는 사람들을 보내 다음 목표인 아이 성과 그 주변 지역을 살펴보게 합니다.",
      },


      {
        number:
          "02",

        title:
          "THE FIRST ATTACK",

        scripture:
          "Joshua 7:3–5",

        description:
          "정탐 결과를 바탕으로 일부 병력이 아이 성을 공격하지만 전투에서 패배하고 후퇴합니다.",
      },


      {
        number:
          "03",

        title:
          "JOSHUA BEFORE THE ARK",

        scripture:
          "Joshua 7:6–9",

        description:
          "패배 이후 여호수아와 이스라엘의 장로들은 언약궤 앞에서 상황을 두고 반응합니다.",
      },


      {
        number:
          "04",

        title:
          "THE HIDDEN TREASURE",

        scripture:
          "Joshua 7:10–21",

        description:
          "공동체 안에서 여리고 사건과 관련된 금지된 물건을 가져간 사람이 있었음이 드러나고 아간이 지목됩니다.",
      },


      {
        number:
          "05",

        title:
          "ACHAN",

        scripture:
          "Joshua 7:22–26",

        description:
          "아간과 관련된 사건이 처리되면서 여호수아 7장의 첫 번째 아이 성 공격 이야기가 마무리됩니다.",
      },


      {
        number:
          "06",

        title:
          "A NEW PLAN",

        scripture:
          "Joshua 8:1–9",

        description:
          "여호수아는 다시 아이 성을 향하지만 이번에는 복병을 배치하는 새로운 전략을 세웁니다.",
      },


      {
        number:
          "07",

        title:
          "THE AMBUSH",

        scripture:
          "Joshua 8:10–23",

        description:
          "이스라엘 군대는 후퇴하는 것처럼 움직여 아이 성의 병력을 끌어낸 뒤 복병을 이용해 전세를 뒤집습니다.",
      },


      {
        number:
          "08",

        title:
          "THE FALL OF AI",

        scripture:
          "Joshua 8:24–29",

        description:
          "두 번째 공격 끝에 아이 성이 점령되면서 여리고 이후의 다음 주요 전투가 마무리됩니다.",
      },


      {
        number:
          "09",

        title:
          "THE ALTAR ON MOUNT EBAL",

        scripture:
          "Joshua 8:30–32",

        description:
          "아이 성 사건 이후 여호수아는 에발산에 제단을 세우고 율법의 말씀을 기록합니다.",
      },


      {
        number:
          "10",

        title:
          "THE COVENANT WORDS",

        scripture:
          "Joshua 8:33–35",

        description:
          "이스라엘 공동체가 에발산과 그리심산을 중심으로 모인 가운데 여호수아가 율법의 말씀을 낭독합니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 7",
      "Joshua 8",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "joshua",

        relationType:
          "RELATED_PERSON",

        label:
          "여호수아",
      },


      {
        targetType:
          "place",

        targetSlug:
          "ai",

        relationType:
          "RELATED_PLACE",

        label:
          "아이 성",
      },


      {
        targetType:
          "book",

        targetSlug:
          "book-of-joshua",

        relationType:
          "RELATED_BOOK",

        label:
          "여호수아",
      },


      {
        targetType:
          "place",

        targetSlug:
          "gilgal",

        relationType:
          "RELATED_PLACE",

        label:
          "길갈",
      },


      {
        targetType:
          "place",

        targetSlug:
          "jericho",

        relationType:
          "RELATED_PLACE",

        label:
          "여리고",
      },


      {
        targetType: "person",
        targetSlug: "achan",
        relationType: "RELATED_PERSON",
        label: "아간",
      },

      {
        targetType: "place",
        targetSlug: "mount-ebal",
        relationType: "RELATED_PLACE",
        label: "에발산",
      },

      {
        targetType: "place",
        targetSlug: "mount-gerizim",
        relationType: "RELATED_PLACE",
        label: "그리심산",
      },
    ],

  },



  /* =====================================================
     PERSON — ACHAN
     ===================================================== */

  {
    type: "person",

    slug: "achan",

    titleKo: "아간",

    titleEn: "Achan",

    eyebrow:
      "PEOPLE · JOSHUA 7 · CANAAN",

    summary:
      "여리고 사건 이후 금지된 물건을 가져간 일로 인해 여호수아 7장의 아이 성 첫 패배와 공동체 내부의 문제를 설명하는 핵심 인물입니다.",

    overview:
      "아간은 유다 지파에 속한 인물로 여호수아 7장에서 등장합니다. 여리고 사건 이후 이스라엘이 아이 성을 공격했다가 패배하자 그 원인을 찾는 과정이 이어지고, 제비를 통해 아간이 지목됩니다. 그는 여리고에서 가져온 물건들을 숨겼음을 고백하고, 이후 사건은 아골 골짜기에서 마무리됩니다.",

    biblicalContext:
      "SCRAPTURA에서 아간은 여리고의 승리와 아이 성의 첫 패배를 연결하는 Person Node입니다. 그의 이야기를 통해 Jericho, Battle of Ai, Joshua 7, 그리고 이후 아이 성의 두 번째 공격으로 이어지는 서사적 연결을 보여 줄 수 있습니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number:
          "01",

        title:
          "AFTER JERICHO",

        scripture:
          "Joshua 6:17–19",

        description:
          "여리고 사건에서 특정 물건과 전리품에 관한 명령이 공동체에게 주어집니다.",
      },


      {
        number:
          "02",

        title:
          "THE TRESPASS",

        scripture:
          "Joshua 7:1",

        description:
          "여호수아 7장은 아간이 여리고에서 금지된 물건을 가져간 사실을 밝히며 시작합니다.",
      },


      {
        number:
          "03",

        title:
          "DEFEAT AT AI",

        scripture:
          "Joshua 7:2–5",

        description:
          "이스라엘은 여리고 이후 아이 성을 공격하지만 첫 번째 전투에서 패배하고 후퇴합니다.",
      },


      {
        number:
          "04",

        title:
          "SEARCHING THE CAMP",

        scripture:
          "Joshua 7:10–18",

        description:
          "패배 이후 공동체 내부의 문제를 찾는 과정이 진행되고 지파와 가문을 거쳐 아간이 지목됩니다.",
      },


      {
        number:
          "05",

        title:
          "THE CONFESSION",

        scripture:
          "Joshua 7:19–21",

        description:
          "아간은 여리고에서 본 외투와 은과 금을 가져와 자신의 장막 아래에 숨겼다고 고백합니다.",
      },


      {
        number:
          "06",

        title:
          "THE HIDDEN ITEMS",

        scripture:
          "Joshua 7:22–23",

        description:
          "사람들이 아간의 장막으로 가서 숨겨진 물건들을 찾아 여호수아와 공동체 앞에 가져옵니다.",
      },


      {
        number:
          "07",

        title:
          "THE VALLEY OF ACHOR",

        scripture:
          "Joshua 7:24–26",

        description:
          "아간과 관련된 사건은 아골 골짜기에서 마무리되고, 이후 여호수아서의 이야기는 다시 아이 성을 향한 두 번째 공격으로 이어집니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 6:17–19",
      "Joshua 7:1–26",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "joshua",

        relationType:
          "RELATED_PERSON",

        label:
          "여호수아",
      },


      {
        targetType:
          "story",

        targetSlug:
          "battle-of-ai",

        relationType:
          "RELATED_STORY",

        label:
          "아이 성 전투",
      },


      {
        targetType:
          "place",

        targetSlug:
          "jericho",

        relationType:
          "RELATED_PLACE",

        label:
          "여리고",
      },


      {
        targetType:
          "book",

        targetSlug:
          "book-of-joshua",

        relationType:
          "RELATED_BOOK",

        label:
          "여호수아",
      },


      {
        targetType: "place",
        targetSlug: "ai",
        relationType: "RELATED_PLACE",
        label: "아이 성",
      },
    ],

  },



  /* =====================================================
     PLACE — MOUNT EBAL
     ===================================================== */

  {
    type: "place",

    slug: "mount-ebal",

    titleKo: "에발산",

    titleEn: "Mount Ebal",

    eyebrow:
      "PLACES · CANAAN · JOSHUA 8",

    summary:
      "아이 성 전투 이후 여호수아가 제단을 세우고 율법의 말씀을 기록하며 공동체가 언약의 말씀을 듣는 장면의 핵심 장소입니다.",

    overview:
      "여호수아 8장 후반부에서 여호수아는 에발산에 제단을 세우고 제사를 드립니다. 돌 위에는 율법의 말씀이 기록되고, 이스라엘 공동체는 에발산과 그리심산을 중심으로 모여 율법의 말씀을 듣습니다. 이 장면은 아이 성 전투 이후 전쟁 서사에서 언약과 율법의 재확인으로 전환되는 중요한 지점입니다.",

    biblicalContext:
      "에발산은 성경에서 세겜 지역과 연결되어 등장하며 그리심산과 함께 축복과 저주의 언약 장면과 관련됩니다. SCRAPTURA에서는 여호수아 8장의 본문을 중심으로 다루며, 특정 고고학 구조물을 성경의 제단으로 확정하지 않고 고고학적 해석에는 논쟁이 있다는 점을 구분해 설명합니다.",


    /* =================================================
       KEY EVENT
       ================================================= */

    keyEvent: {

      title:
        "The Altar on Mount Ebal",

      scripture:
        "Joshua 8:30–35",

      description:
        "여호수아는 에발산에 제단을 세우고 율법의 말씀을 기록한 뒤 공동체 앞에서 축복과 저주의 말씀을 포함한 율법을 낭독합니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Deuteronomy 11:26–30",
      "Deuteronomy 27:1–13",
      "Joshua 8:30–35",
    ],


    relations: [

      {
        targetType: "person",
        targetSlug: "joshua",
        relationType: "RELATED_PERSON",
        label: "여호수아",
      },

      {
        targetType: "story",
        targetSlug: "battle-of-ai",
        relationType: "RELATED_STORY",
        label: "아이 성 전투",
      },

      {
        targetType: "place",
        targetSlug: "ai",
        relationType: "RELATED_PLACE",
        label: "아이 성",
      },

      {
        targetType: "book",
        targetSlug: "book-of-joshua",
        relationType: "RELATED_BOOK",
        label: "여호수아",
      },

      {
        targetType: "place",
        targetSlug: "shechem",
        relationType: "RELATED_PLACE",
        label: "세겜",
      },


      {
        targetType: "place",
        targetSlug: "mount-gerizim",
        relationType: "RELATED_PLACE",
        label: "그리심산",
      },
    ],

  },



  /* =====================================================
     PLACE — MOUNT GERIZIM
     ===================================================== */

  {
    type: "place",

    slug: "mount-gerizim",

    titleKo: "그리심산",

    titleEn: "Mount Gerizim",

    eyebrow:
      "PLACES · CANAAN · JOSHUA 8",

    summary:
      "세겜 인근에서 에발산과 마주하는 산으로, 여호수아 8장에서 공동체가 축복과 저주의 말씀을 듣는 언약 장면과 연결되는 장소입니다.",

    overview:
      "여호수아 8장 후반부에서는 이스라엘 공동체가 에발산과 그리심산을 중심으로 배치되고 율법의 말씀이 낭독됩니다. 그리심산은 이 장면에서 축복과 관련된 위치로 등장하며 에발산과 함께 언약의 공간적 구조를 형성합니다.",

    biblicalContext:
      "그리심산은 신명기와 여호수아서에서 에발산과 함께 언급됩니다. 두 산은 세겜 지역과 밀접하게 연결되며, 여호수아 8장의 언약 갱신 장면에서 중요한 지리적 배경을 이룹니다. SCRAPTURA에서는 Mount Ebal, Shechem, Joshua, Book of Joshua와 연결해 하나의 언약·지리 클러스터로 구성합니다.",


    /* =================================================
       KEY EVENT
       ================================================= */

    keyEvent: {

      title:
        "Blessing and Covenant",

      scripture:
        "Joshua 8:33–35",

      description:
        "이스라엘 공동체가 에발산과 그리심산을 중심으로 모인 가운데 여호수아가 율법의 축복과 저주의 말씀을 공동체 앞에서 낭독합니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Deuteronomy 11:26–30",
      "Deuteronomy 27:11–13",
      "Joshua 8:33–35",
    ],


    relations: [

      {
        targetType: "person",
        targetSlug: "joshua",
        relationType: "RELATED_PERSON",
        label: "여호수아",
      },

      {
        targetType: "place",
        targetSlug: "mount-ebal",
        relationType: "RELATED_PLACE",
        label: "에발산",
      },

      {
        targetType: "book",
        targetSlug: "book-of-joshua",
        relationType: "RELATED_BOOK",
        label: "여호수아",
      },

      {
        targetType: "place",
        targetSlug: "shechem",
        relationType: "RELATED_PLACE",
        label: "세겜",
      },

      {
        targetType: "story",
        targetSlug: "battle-of-ai",
        relationType: "RELATED_STORY",
        label: "아이 성 전투",
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