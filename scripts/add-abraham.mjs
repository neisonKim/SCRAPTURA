import fs from "node:fs";
import path from "node:path";


const contentPath =
  path.join(
    process.cwd(),
    "data",
    "content.ts"
  );


const backupPath =
  path.join(
    process.cwd(),
    "data",
    "content.before-abraham.ts"
  );


if (
  !fs.existsSync(
    contentPath
  )
) {

  throw new Error(
    "data/content.ts 파일을 찾을 수 없습니다."
  );

}


let source =
  fs.readFileSync(
    contentPath,
    "utf8"
  );


/* =====================================================
   SAFETY CHECK
   ===================================================== */

const requiredMarkers = [

  "export type ContentType",

  "export const nodes: ContentNode[] = [",

  "BOOK — GENESIS",

  "STORY — TOWER OF BABEL",

  "PLACE — HEBRON",

  "export const getNode",

];


for (
  const marker
  of requiredMarkers
) {

  if (
    !source.includes(
      marker
    )
  ) {

    throw new Error(
      `필수 구조를 찾지 못했습니다: ${marker}`
    );

  }

}


/* =====================================================
   BACKUP
   ===================================================== */

fs.writeFileSync(
  backupPath,
  source,
  "utf8"
);


console.log(
  "백업 생성:",
  backupPath
);


/* =====================================================
   GENESIS → ABRAHAM
   ===================================================== */

const genesisStart =
  source.indexOf(
    "BOOK — GENESIS"
  );


const creationStart =
  source.indexOf(
    "STORY — CREATION",
    genesisStart
  );


if (
  genesisStart === -1 ||
  creationStart === -1
) {

  throw new Error(
    "Genesis 영역을 찾지 못했습니다."
  );

}


let genesisSection =
  source.slice(
    genesisStart,
    creationStart
  );


if (
  !genesisSection.includes(
    'targetSlug: "abraham"'
  )
) {

  const noahRelation = `      {
        targetType: "person",
        targetSlug: "noah",
        relationType: "RELATED_PERSON",
        label: "노아",
      },
`;


  const replacement =
`${noahRelation}
      {
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },
`;


  if (
    !genesisSection.includes(
      noahRelation
    )
  ) {

    throw new Error(
      "Genesis의 Noah 관계를 찾지 못했습니다."
    );

  }


  genesisSection =
    genesisSection.replace(
      noahRelation,
      replacement
    );


  source =
    source.slice(
      0,
      genesisStart
    ) +
    genesisSection +
    source.slice(
      creationStart
    );


  console.log(
    "Genesis → Abraham 관계 추가"
  );

}
else {

  console.log(
    "Genesis → Abraham 관계가 이미 존재합니다."
  );

}


/* =====================================================
   HEBRON → ABRAHAM
   ===================================================== */

const hebronStart =
  source.indexOf(
    "PLACE — HEBRON"
  );


const gilboaStart =
  source.indexOf(
    "PLACE — MOUNT GILBOA",
    hebronStart
  );


if (
  hebronStart === -1 ||
  gilboaStart === -1
) {

  throw new Error(
    "Hebron 영역을 찾지 못했습니다."
  );

}


let hebronSection =
  source.slice(
    hebronStart,
    gilboaStart
  );


if (
  !hebronSection.includes(
    'targetSlug: "abraham"'
  )
) {

  const davidRelation = `      {
        targetType: "person",
        targetSlug: "david",
        relationType: "RELATED_PERSON",
        label: "다윗",
      },
`;


  const replacement =
`${davidRelation}
      {
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },
`;


  if (
    !hebronSection.includes(
      davidRelation
    )
  ) {

    throw new Error(
      "Hebron의 David 관계를 찾지 못했습니다."
    );

  }


  hebronSection =
    hebronSection.replace(
      davidRelation,
      replacement
    );


  source =
    source.slice(
      0,
      hebronStart
    ) +
    hebronSection +
    source.slice(
      gilboaStart
    );


  console.log(
    "Hebron → Abraham 관계 추가"
  );

}
else {

  console.log(
    "Hebron → Abraham 관계가 이미 존재합니다."
  );

}


/* =====================================================
   PERSON — ABRAHAM
   ===================================================== */

if (
  !source.includes(
    'slug: "abraham"'
  )
) {

  const abrahamNode = `

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

    ],

  },
`;


  const endMarker =
    `

];


/* =====================================================
   GET CONTENT`;


  const insertIndex =
    source.lastIndexOf(
      endMarker
    );


  if (
    insertIndex === -1
  ) {

    throw new Error(
      "nodes 배열 마지막 위치를 찾지 못했습니다."
    );

  }


  source =
    source.slice(
      0,
      insertIndex
    ) +
    abrahamNode +
    source.slice(
      insertIndex
    );


  console.log(
    "PERSON — ABRAHAM 추가"
  );

}
else {

  console.log(
    "Abraham 노드가 이미 존재합니다."
  );

}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const validations = [

  [
    "ContentType",
    source.includes(
      "export type ContentType"
    ),
  ],

  [
    "ContentNode",
    source.includes(
      "export type ContentNode"
    ),
  ],

  [
    "nodes array",
    source.includes(
      "export const nodes: ContentNode[] = ["
    ),
  ],

  [
    "Genesis",
    source.includes(
      'slug: "genesis"'
    ),
  ],

  [
    "Tower of Babel",
    source.includes(
      'slug: "tower-of-babel"'
    ),
  ],

  [
    "Abraham",
    source.includes(
      'slug: "abraham"'
    ),
  ],

  [
    "getNode",
    source.includes(
      "export const getNode"
    ),
  ],

];


const failed =
  validations.filter(
    (
      [
        ,
        result,
      ]
    ) =>
      !result
  );


if (
  failed.length >
  0
) {

  throw new Error(
    `검증 실패: ${
      failed
        .map(
          ([name]) =>
            name
        )
        .join(", ")
    }`
  );

}


/* =====================================================
   WRITE
   ===================================================== */

fs.writeFileSync(
  contentPath,
  source,
  "utf8"
);


console.log("");
console.log(
  "====================================="
);
console.log(
  "SCRAPTURA ABRAHAM PATCH COMPLETE"
);
console.log(
  "====================================="
);
console.log(
  "Genesis → Abraham"
);
console.log(
  "Hebron → Abraham"
);
console.log(
  "PERSON — ABRAHAM"
);
console.log(
  "기존 content.ts 전체 구조 유지"
);