import fs from "node:fs";
import path from "node:path";

const contentPath = path.join(
  process.cwd(),
  "data",
  "content.ts"
);

const backupPath = path.join(
  process.cwd(),
  "data",
  "content.before-bethel.ts"
);

if (!fs.existsSync(contentPath)) {
  throw new Error(
    "data/content.ts 파일을 찾을 수 없습니다."
  );
}

let source = fs.readFileSync(
  contentPath,
  "utf8"
);


/* =====================================================
   SAFETY CHECK
   ===================================================== */

const required = [
  "export const nodes: ContentNode[] = [",
  "PERSON — ABRAHAM",
  "PLACE — SHECHEM",
  'slug: "abraham"',
  'slug: "shechem"',
  "export const getNode",
];

for (const marker of required) {
  if (!source.includes(marker)) {
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


/* =====================================================
   RELATION HELPER
   ===================================================== */

function addRelation(
  fullSource,
  startMarker,
  endIndex,
  targetSlug,
  relationCode
) {
  const startIndex =
    fullSource.indexOf(
      startMarker
    );

  if (startIndex === -1) {
    throw new Error(
      `${startMarker} 영역을 찾지 못했습니다.`
    );
  }

  const section =
    fullSource.slice(
      startIndex,
      endIndex
    );

  if (
    section.includes(
      `targetSlug: "${targetSlug}"`
    )
  ) {
    return fullSource;
  }

  const relationsIndex =
    section.indexOf(
      "relations: ["
    );

  if (relationsIndex === -1) {
    throw new Error(
      `${startMarker}의 relations를 찾지 못했습니다.`
    );
  }

  const insertPosition =
    startIndex +
    relationsIndex +
    "relations: [".length;

  return (
    fullSource.slice(
      0,
      insertPosition
    ) +
    "\n\n" +
    relationCode +
    fullSource.slice(
      insertPosition
    )
  );
}


/* =====================================================
   ABRAHAM → BETHEL
   ===================================================== */

let shechemPosition =
  source.indexOf(
    "PLACE — SHECHEM"
  );

source = addRelation(
  source,
  "PERSON — ABRAHAM",
  shechemPosition,
  "bethel",
`      {
        targetType: "place",
        targetSlug: "bethel",
        relationType: "RELATED_PLACE",
        label: "벧엘",
      },
`
);

console.log(
  "Abraham → Bethel 관계 추가"
);


/* =====================================================
   SHECHEM → BETHEL
   ===================================================== */

shechemPosition =
  source.indexOf(
    "PLACE — SHECHEM"
  );

const arrayEndPosition =
  source.lastIndexOf(
    "\n];"
  );

source = addRelation(
  source,
  "PLACE — SHECHEM",
  arrayEndPosition,
  "bethel",
`      {
        targetType: "place",
        targetSlug: "bethel",
        relationType: "RELATED_PLACE",
        label: "벧엘",
      },
`
);

console.log(
  "Shechem → Bethel 관계 추가"
);


/* =====================================================
   PLACE — BETHEL
   ===================================================== */

if (
  !/type:\s*"place"[\s\S]{0,200}slug:\s*"bethel"/
    .test(source)
) {

  const bethelNode = `

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
    ],
  },
`;


  const getNodePosition =
    source.lastIndexOf(
      "export const getNode"
    );

  if (getNodePosition === -1) {
    throw new Error(
      "export const getNode를 찾지 못했습니다."
    );
  }


  const beforeGetNode =
    source.slice(
      0,
      getNodePosition
    );


  const nodesEnd =
    beforeGetNode.lastIndexOf(
      "];"
    );


  if (nodesEnd === -1) {
    throw new Error(
      "nodes 배열 끝을 찾지 못했습니다."
    );
  }


  source =
    source.slice(
      0,
      nodesEnd
    ) +
    bethelNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PLACE — BETHEL 추가"
  );
}


/* =====================================================
   VALIDATION
   ===================================================== */

if (
  !/type:\s*"place"[\s\S]{0,200}slug:\s*"bethel"/
    .test(source)
) {
  throw new Error(
    "Bethel Place 생성 검증 실패"
  );
}

if (
  !source.includes(
    'targetSlug: "bethel"'
  )
) {
  throw new Error(
    "Bethel 관계 생성 검증 실패"
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
  "=================================="
);
console.log(
  "SCRAPTURA BETHEL PATCH COMPLETE"
);
console.log(
  "=================================="
);
console.log(
  "Abraham → Bethel"
);
console.log(
  "Shechem → Bethel"
);
console.log(
  "PLACE — BETHEL"
);
console.log(
  "기존 데이터 유지"
);
console.log(
  "백업:",
  backupPath
);