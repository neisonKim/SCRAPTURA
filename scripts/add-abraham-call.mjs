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
    "content.before-abraham-call.ts"
  );


/* =====================================================
   FILE CHECK
   ===================================================== */

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

  "PERSON — ABRAHAM",

  'slug: "abraham"',

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
   ALREADY APPLIED CHECK
   ===================================================== */

if (
  source.includes(
    'slug: "call-of-abraham"'
  )
) {

  console.log(
    "call-of-abraham Story가 이미 존재합니다."
  );

  process.exit(
    0
  );

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
   GENESIS → ABRAHAM'S CALL
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
    'targetSlug: "call-of-abraham"'
  )
) {

  const abrahamRelation = `      {
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },
`;


  const replacement =
`${abrahamRelation}
      {
        targetType: "story",
        targetSlug: "call-of-abraham",
        relationType: "RELATED_STORY",
        label: "아브라함의 부르심",
      },
`;


  if (
    !genesisSection.includes(
      abrahamRelation
    )
  ) {

    throw new Error(
      "Genesis → Abraham 관계를 찾지 못했습니다. Abraham 단계가 먼저 완료되어야 합니다."
    );

  }


  genesisSection =
    genesisSection.replace(
      abrahamRelation,
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
    "Genesis → Abraham's Call 관계 추가"
  );

}


/* =====================================================
   ABRAHAM → ABRAHAM'S CALL
   ===================================================== */

const abrahamStart =
  source.indexOf(
    "PERSON — ABRAHAM"
  );


const nodesEnd =
  source.lastIndexOf(
    "\n];"
  );


if (
  abrahamStart === -1 ||
  nodesEnd === -1
) {

  throw new Error(
    "Abraham 영역을 찾지 못했습니다."
  );

}


let abrahamSection =
  source.slice(
    abrahamStart,
    nodesEnd
  );


if (
  !abrahamSection.includes(
    'targetSlug: "call-of-abraham"'
  )
) {

  const genesisRelation = `      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },
`;


  const replacement =
`      {
        targetType: "story",
        targetSlug: "call-of-abraham",
        relationType: "RELATED_STORY",
        label: "아브라함의 부르심",
      },

${genesisRelation}`;


  if (
    !abrahamSection.includes(
      genesisRelation
    )
  ) {

    throw new Error(
      "Abraham → Genesis 관계를 찾지 못했습니다."
    );

  }


  abrahamSection =
    abrahamSection.replace(
      genesisRelation,
      replacement
    );


  source =
    source.slice(
      0,
      abrahamStart
    ) +
    abrahamSection +
    source.slice(
      nodesEnd
    );


  console.log(
    "Abraham → Abraham's Call 관계 추가"
  );

}


/* =====================================================
   STORY — ABRAHAM'S CALL
   ===================================================== */

const storyNode = `

  /* =====================================================
     STORY — ABRAHAM'S CALL
     ===================================================== */

  {
    type: "story",

    slug: "call-of-abraham",

    titleKo:
      "아브라함의 부르심",

    titleEn:
      "The Call of Abraham",

    eyebrow:
      "STORIES · GENESIS 12",

    summary:
      "아브람이 익숙한 땅을 떠나라는 부르심을 받고 가족과 함께 가나안으로 이동하며 새로운 족장 이야기가 시작되는 장면입니다.",

    overview:
      "창세기 12장은 아브람이 고향과 친족의 영역을 떠나 새로운 땅으로 향하는 장면으로 시작합니다. 아브람은 사래와 롯, 그리고 함께한 사람들과 재산을 이끌고 가나안으로 이동합니다. 세겜과 벧엘 인근을 지나며 그의 가나안 여정이 본격적으로 시작됩니다.",

    biblicalContext:
      "창세기 1–11장이 창조와 초기 인류 전체를 중심으로 전개되었다면, 창세기 12장부터는 한 가족의 이야기로 서사의 초점이 이동합니다. 아브람의 이동은 이후 이삭, 야곱, 요셉으로 이어지는 족장 이야기의 출발점이며 창세기 후반부 전체를 이해하는 중요한 전환점입니다.",


    /* =================================================
       SCENE SEQUENCE
       ================================================= */

    scenes: [

      {
        number: "01",

        title:
          "THE CALL",

        scripture:
          "Genesis 12:1–3",

        description:
          "아브람은 자신의 땅과 친족의 영역을 떠나 새로운 땅으로 향하라는 부르심을 받습니다.",
      },


      {
        number: "02",

        title:
          "THE DEPARTURE",

        scripture:
          "Genesis 12:4–5",

        description:
          "아브람은 사래와 롯, 그리고 함께한 사람들과 재산을 이끌고 하란을 떠납니다.",
      },


      {
        number: "03",

        title:
          "CANAAN",

        scripture:
          "Genesis 12:5–6",

        description:
          "아브람의 일행은 가나안에 들어가 세겜 지역까지 이동합니다.",
      },


      {
        number: "04",

        title:
          "SHECHEM",

        scripture:
          "Genesis 12:6–7",

        description:
          "아브람은 세겜의 모레 상수리나무 부근에 이르고 그곳에서 제단을 세웁니다.",
      },


      {
        number: "05",

        title:
          "BETHEL",

        scripture:
          "Genesis 12:8",

        description:
          "아브람은 벧엘 동쪽 산지로 이동해 장막을 치고 다시 제단을 세웁니다.",
      },


      {
        number: "06",

        title:
          "THE JOURNEY SOUTH",

        scripture:
          "Genesis 12:9",

        description:
          "아브람은 계속해서 남쪽 지역으로 이동하며 가나안에서의 여정을 이어갑니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Genesis 12:1–9",
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
          "book",

        targetSlug:
          "genesis",

        relationType:
          "RELATED_BOOK",

        label:
          "창세기",
      },

    ],

  },
`;


/* =====================================================
   INSERT STORY
   ===================================================== */

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
    "nodes 배열의 끝을 찾지 못했습니다."
  );

}


source =
  source.slice(
    0,
    insertIndex
  ) +
  storyNode +
  source.slice(
    insertIndex
  );


/* =====================================================
   VALIDATION
   ===================================================== */

const validations = [

  [
    "Genesis",
    source.includes(
      'slug: "genesis"'
    ),
  ],

  [
    "Abraham",
    source.includes(
      'slug: "abraham"'
    ),
  ],

  [
    "Abraham's Call",
    source.includes(
      'slug: "call-of-abraham"'
    ),
  ],

  [
    "Story Relation",
    source.includes(
      'targetSlug: "call-of-abraham"'
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
        value,
      ]
    ) =>
      !value
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
  "========================================"
);
console.log(
  "SCRAPTURA ABRAHAM CALL PATCH COMPLETE"
);
console.log(
  "========================================"
);
console.log(
  "Genesis → Abraham's Call"
);
console.log(
  "Abraham → Abraham's Call"
);
console.log(
  "STORY — ABRAHAM'S CALL"
);
console.log(
  "기존 content.ts 전체 구조 유지"
);