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
  "content.before-rahab.ts"
);


/* =====================================================
   FILE CHECK
   ===================================================== */

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
   HELPERS
   ===================================================== */

function escapeRegex(
  value
) {

  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


/* =====================================================
   STRICT TOP-LEVEL NODE FINDER
   ===================================================== */

function findNodeRange(
  fullSource,
  slug
) {

  const escapedSlug =
    escapeRegex(
      slug
    );


  /*
   * ContentNode의 실제 slug만 찾습니다.
   *
   *     slug: "rahab"          O
   *     targetSlug: "rahab"    X
   */

  const slugRegex =
    new RegExp(
      `^ {4}slug:\\s*"${escapedSlug}"\\s*,?\\s*$`,
      "m"
    );


  const match =
    slugRegex.exec(
      fullSource
    );


  if (!match) {
    return null;
  }


  const slugIndex =
    match.index;


  const start =
    fullSource.lastIndexOf(
      "\n  {",
      slugIndex
    );


  if (
    start === -1
  ) {

    throw new Error(
      `${slug} 노드 시작 위치를 찾지 못했습니다.`
    );
  }


  const afterSlug =
    fullSource.slice(
      slugIndex
    );


  const endMatch =
    /\r?\n {2}\},/.exec(
      afterSlug
    );


  if (!endMatch) {

    throw new Error(
      `${slug} 노드 종료 위치를 찾지 못했습니다.`
    );
  }


  const end =
    slugIndex +
    endMatch.index +
    endMatch[0].length;


  return {
    start,
    end,

    content:
      fullSource.slice(
        start,
        end
      ),
  };
}


/* =====================================================
   NODE EXISTS
   ===================================================== */

function nodeExists(
  fullSource,
  slug
) {

  return Boolean(
    findNodeRange(
      fullSource,
      slug
    )
  );
}


/* =====================================================
   RELATION CHECK
   ===================================================== */

function hasRelation(
  nodeContent,
  targetSlug
) {

  const escaped =
    escapeRegex(
      targetSlug
    );


  return new RegExp(
    `targetSlug\\s*:\\s*"${escaped}"`
  ).test(
    nodeContent
  );
}


/* =====================================================
   RELATIONS ARRAY END
   ===================================================== */

function findRelationsEnd(
  nodeContent,
  relationsStart
) {

  const rest =
    nodeContent.slice(
      relationsStart
    );


  const match =
    /\r?\n {4}\],/.exec(
      rest
    );


  if (!match) {
    return -1;
  }


  return (
    relationsStart +
    match.index
  );
}


/* =====================================================
   ADD RELATION
   ===================================================== */

function addRelation(
  fullSource,
  nodeSlug,
  relation
) {

  const node =
    findNodeRange(
      fullSource,
      nodeSlug
    );


  if (!node) {

    console.log(
      `${nodeSlug} 없음 → 관계 추가 생략`
    );

    return fullSource;
  }


  if (
    hasRelation(
      node.content,
      relation.targetSlug
    )
  ) {

    console.log(
      `${nodeSlug} → ${relation.targetSlug} 이미 존재`
    );

    return fullSource;
  }


  const relationsStart =
    node.content.indexOf(
      "relations: ["
    );


  if (
    relationsStart === -1
  ) {

    console.log(
      `${nodeSlug} relations 없음 → 관계 추가 생략`
    );

    return fullSource;
  }


  const relationsEnd =
    findRelationsEnd(
      node.content,
      relationsStart
    );


  if (
    relationsEnd === -1
  ) {

    throw new Error(
      `${nodeSlug} relations 종료 위치를 찾지 못했습니다.`
    );
  }


  const relationCode = `

      {
        targetType: "${relation.targetType}",
        targetSlug: "${relation.targetSlug}",
        relationType: "${relation.relationType}",
        label: "${relation.label}",
      },`;


  const updatedNode =
    node.content.slice(
      0,
      relationsEnd
    ) +
    relationCode +
    node.content.slice(
      relationsEnd
    );


  console.log(
    `${nodeSlug} → ${relation.targetSlug} 관계 추가`
  );


  return (
    fullSource.slice(
      0,
      node.start
    ) +
    updatedNode +
    fullSource.slice(
      node.end
    )
  );
}


/* =====================================================
   REQUIRED NODES
   ===================================================== */

const requiredNodes = [
  {
    slug:
      "jericho",

    type:
      "place",
  },

  {
    slug:
      "fall-of-jericho",

    type:
      "story",
  },

  {
    slug:
      "book-of-joshua",

    type:
      "book",
  },

  {
    slug:
      "joshua",

    type:
      "person",
  },
];


for (
  const required
  of requiredNodes
) {

  const node =
    findNodeRange(
      source,
      required.slug
    );


  if (!node) {

    throw new Error(
      `필수 Node를 찾지 못했습니다: ${required.slug}`
    );
  }


  if (
    !node.content.includes(
      `type: "${required.type}"`
    )
  ) {

    throw new Error(
      `${required.slug}의 type이 ${required.type}이 아닙니다.`
    );
  }


  console.log(
    `${required.slug} 확인`
  );
}


/* =====================================================
   CREATE PERSON — RAHAB
   ===================================================== */

let rahab =
  findNodeRange(
    source,
    "rahab"
  );


if (!rahab) {

  const rahabNode = `

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
`;


  const getNodePosition =
    source.lastIndexOf(
      "export const getNode"
    );


  if (
    getNodePosition === -1
  ) {

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


  if (
    nodesEnd === -1
  ) {

    throw new Error(
      "nodes 배열 끝을 찾지 못했습니다."
    );
  }


  source =
    source.slice(
      0,
      nodesEnd
    ) +
    rahabNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PERSON — RAHAB 실제 Node 추가"
  );

}
else {

  if (
    !rahab.content.includes(
      'type: "person"'
    )
  ) {

    throw new Error(
      'slug: "rahab"가 존재하지만 type이 person이 아닙니다.'
    );
  }


  console.log(
    "PERSON — RAHAB 이미 존재"
  );
}


/* =====================================================
   VERIFY RAHAB
   ===================================================== */

rahab =
  findNodeRange(
    source,
    "rahab"
  );


if (!rahab) {

  throw new Error(
    "Rahab 실제 노드 생성 실패"
  );
}


/* =====================================================
   JERICHO → RAHAB
   ===================================================== */

source = addRelation(
  source,
  "jericho",
  {
    targetType:
      "person",

    targetSlug:
      "rahab",

    relationType:
      "RELATED_PERSON",

    label:
      "라합",
  }
);


/* =====================================================
   FALL OF JERICHO → RAHAB
   ===================================================== */

source = addRelation(
  source,
  "fall-of-jericho",
  {
    targetType:
      "person",

    targetSlug:
      "rahab",

    relationType:
      "RELATED_PERSON",

    label:
      "라합",
  }
);


/* =====================================================
   BOOK OF JOSHUA → RAHAB
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
  {
    targetType:
      "person",

    targetSlug:
      "rahab",

    relationType:
      "RELATED_PERSON",

    label:
      "라합",
  }
);


/* =====================================================
   JOSHUA → RAHAB
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {
    targetType:
      "person",

    targetSlug:
      "rahab",

    relationType:
      "RELATED_PERSON",

    label:
      "라합",
  }
);


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalRahab =
  findNodeRange(
    source,
    "rahab"
  );


const finalJericho =
  findNodeRange(
    source,
    "jericho"
  );


const finalStory =
  findNodeRange(
    source,
    "fall-of-jericho"
  );


const finalBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


if (
  !finalRahab ||
  !finalJericho ||
  !finalStory ||
  !finalBook ||
  !finalJoshua
) {

  throw new Error(
    "최종 Rahab 검증 실패"
  );
}


const validations = [

  [
    "Rahab actual slug",

    /^ {4}slug:\s*"rahab"\s*,?\s*$/m
      .test(
        finalRahab.content
      ),
  ],

  [
    "Rahab Type",

    finalRahab.content.includes(
      'type: "person"'
    ),
  ],

  [
    "Rahab Character Journey",

    finalRahab.content.includes(
      "characterJourney: ["
    ),
  ],

  [
    "Rahab → Jericho",

    /targetSlug\s*:\s*"jericho"/
      .test(
        finalRahab.content
      ),
  ],

  [
    "Rahab → Fall of Jericho",

    /targetSlug\s*:\s*"fall-of-jericho"/
      .test(
        finalRahab.content
      ),
  ],

  [
    "Rahab → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalRahab.content
      ),
  ],

  [
    "Rahab → Book of Joshua",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalRahab.content
      ),
  ],

  [
    "Jericho → Rahab",

    /targetSlug\s*:\s*"rahab"/
      .test(
        finalJericho.content
      ),
  ],

  [
    "Story → Rahab",

    /targetSlug\s*:\s*"rahab"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Book → Rahab",

    /targetSlug\s*:\s*"rahab"/
      .test(
        finalBook.content
      ),
  ],

  [
    "getNode preserved",

    source.includes(
      "export const getNode"
    ),
  ],

];


const failed =
  validations.filter(
    (
      [, result]
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
   SAVE
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
  "SCRAPTURA RAHAB PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PERSON — RAHAB"
);

console.log(
  "Character Journey 8 stages"
);

console.log(
  "Rahab ↔ Jericho"
);

console.log(
  "Rahab ↔ Fall of Jericho"
);

console.log(
  "Rahab ↔ Book of Joshua"
);

console.log(
  "Joshua → Rahab"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);