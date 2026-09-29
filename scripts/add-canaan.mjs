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
    "content.before-canaan.ts"
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

  "STORY — ABRAHAM'S CALL",

  'slug: "abraham"',

  'slug: "call-of-abraham"',

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
   ALREADY APPLIED
   ===================================================== */

if (
  source.includes(
    'slug: "canaan"'
  )
) {

  console.log(
    "PLACE — CANAAN이 이미 존재합니다."
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
   ABRAHAM → CANAAN
   ===================================================== */

const abrahamStart =
  source.indexOf(
    "PERSON — ABRAHAM"
  );


const callStart =
  source.indexOf(
    "STORY — ABRAHAM'S CALL",
    abrahamStart
  );


if (
  abrahamStart === -1 ||
  callStart === -1
) {

  throw new Error(
    "Abraham 영역을 찾지 못했습니다."
  );

}


let abrahamSection =
  source.slice(
    abrahamStart,
    callStart
  );


if (
  !abrahamSection.includes(
    'targetSlug: "canaan"'
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
        targetType: "place",
        targetSlug: "canaan",
        relationType: "RELATED_PLACE",
        label: "가나안",
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
      callStart
    );


  console.log(
    "Abraham → Canaan 관계 추가"
  );

}


/* =====================================================
   ABRAHAM'S CALL → CANAAN
   ===================================================== */

const storyStart =
  source.indexOf(
    "STORY — ABRAHAM'S CALL"
  );


const nodesEnd =
  source.lastIndexOf(
    "\n];"
  );


if (
  storyStart === -1 ||
  nodesEnd === -1
) {

  throw new Error(
    "Abraham's Call 영역을 찾지 못했습니다."
  );

}


let storySection =
  source.slice(
    storyStart,
    nodesEnd
  );


if (
  !storySection.includes(
    'targetSlug: "canaan"'
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
        targetType: "place",
        targetSlug: "canaan",
        relationType: "RELATED_PLACE",
        label: "가나안",
      },
`;


  if (
    !storySection.includes(
      abrahamRelation
    )
  ) {

    throw new Error(
      "Abraham's Call → Abraham 관계를 찾지 못했습니다."
    );

  }


  storySection =
    storySection.replace(
      abrahamRelation,
      replacement
    );


  source =
    source.slice(
      0,
      storyStart
    ) +
    storySection +
    source.slice(
      nodesEnd
    );


  console.log(
    "Abraham's Call → Canaan 관계 추가"
  );

}


/* =====================================================
   GENESIS → CANAAN
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
    'targetSlug: "canaan"'
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
        targetType: "place",
        targetSlug: "canaan",
        relationType: "RELATED_PLACE",
        label: "가나안",
      },
`;


  if (
    !genesisSection.includes(
      abrahamRelation
    )
  ) {

    throw new Error(
      "Genesis → Abraham 관계를 찾지 못했습니다."
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
    "Genesis → Canaan 관계 추가"
  );

}


/* =====================================================
   PLACE — CANAAN
   ===================================================== */

const canaanNode = `

  /* =====================================================
     PLACE — CANAAN
     ===================================================== */

  {
    type: "place",

    slug: "canaan",

    titleKo:
      "가나안",

    titleEn:
      "Canaan",

    eyebrow:
      "PLACES · PATRIARCHAL LAND",

    summary:
      "아브라함이 부르심을 받은 뒤 이동한 지역으로, 창세기 족장 이야기의 중심 무대가 되는 땅입니다.",

    overview:
      "가나안은 창세기에서 아브라함과 그의 가족 이야기가 전개되는 핵심 지역입니다. 아브람은 하란을 떠난 뒤 가나안에 들어와 세겜, 벧엘 인근, 헤브론 등 여러 지역을 이동합니다. 이후 이삭과 야곱의 이야기에서도 이 지역은 중요한 배경으로 계속 등장합니다.",

    biblicalContext:
      "창세기 12장 이후의 서사는 초기 인류 전체에서 아브라함과 그의 후손을 중심으로 초점이 이동합니다. 가나안은 단순한 하나의 도시가 아니라 여러 성읍과 지역을 포함하는 넓은 지리적 공간으로, 족장들의 이동과 거주 이야기를 연결하는 주요 배경입니다.",


    keyEvent: {

      title:
        "Abraham Enters Canaan",

      scripture:
        "Genesis 12:5–9",

      description:
        "아브람은 하란을 떠난 뒤 가나안 땅에 들어와 세겜 지역과 벧엘 인근을 지나며 이동합니다. 이 장면은 족장 시대의 지리적 이야기가 본격적으로 시작되는 중요한 전환점입니다.",

    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Genesis 12:5–9",
      "Genesis 13:12–18",
      "Genesis 17:8",
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
          "story",

        targetSlug:
          "call-of-abraham",

        relationType:
          "RELATED_STORY",

        label:
          "아브라함의 부르심",
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

    ],

  },
`;


/* =====================================================
   INSERT
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
  canaanNode +
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
    "Canaan",
    source.includes(
      'slug: "canaan"'
    ),
  ],

  [
    "Canaan relations",
    source.includes(
      'targetSlug: "canaan"'
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
  "===================================="
);
console.log(
  "SCRAPTURA CANAAN PATCH COMPLETE"
);
console.log(
  "===================================="
);
console.log(
  "Abraham → Canaan"
);
console.log(
  "Abraham's Call → Canaan"
);
console.log(
  "Genesis → Canaan"
);
console.log(
  "PLACE — CANAAN"
);
console.log(
  "기존 content.ts 전체 구조 유지"
);