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
  "content.before-jericho.ts"
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
   STRICT NODE FINDER
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
   * 실제 slug 필드만 찾습니다.
   *
   * slug: "jericho"       O
   * targetSlug: "jericho" X
   */

  const slugRegex =
    new RegExp(
      `^[ \\t]*slug:\\s*"${escapedSlug}"\\s*,?\\s*$`,
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


  if (start === -1) {

    throw new Error(
      `${slug} 노드 시작 위치를 찾지 못했습니다.`
    );
  }


  const endMarker =
    "\n  },";


  const end =
    fullSource.indexOf(
      endMarker,
      slugIndex
    );


  if (end === -1) {

    throw new Error(
      `${slug} 노드 종료 위치를 찾지 못했습니다.`
    );
  }


  return {
    start,

    end:
      end +
      endMarker.length,

    content:
      fullSource.slice(
        start,
        end +
          endMarker.length
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
      `${nodeSlug}에 relations 없음 → 관계 추가 생략`
    );

    return fullSource;
  }


  const relationsEnd =
    node.content.indexOf(
      "\n    ],",
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

const joshuaPerson =
  findNodeRange(
    source,
    "joshua"
  );


if (!joshuaPerson) {

  throw new Error(
    'PERSON 노드 slug: "joshua"를 찾지 못했습니다.'
  );
}


if (
  !joshuaPerson.content.includes(
    'type: "person"'
  )
) {

  throw new Error(
    "Joshua 노드가 존재하지만 type이 person이 아닙니다."
  );
}


const joshuaBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (!joshuaBook) {

  throw new Error(
    'BOOK 노드 slug: "book-of-joshua"를 찾지 못했습니다.'
  );
}


if (
  !joshuaBook.content.includes(
    'type: "book"'
  )
) {

  throw new Error(
    "Book of Joshua 노드가 존재하지만 type이 book이 아닙니다."
  );
}


console.log(
  "Joshua Person 노드 확인"
);

console.log(
  "Book of Joshua 노드 확인"
);


/* =====================================================
   CREATE PLACE — JERICHO
   ===================================================== */

let jericho =
  findNodeRange(
    source,
    "jericho"
  );


if (!jericho) {

  const relations = [

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

  ];


  /*
   * CANAAN
   */

  if (
    nodeExists(
      source,
      "canaan"
    )
  ) {

    relations.push({
      targetType:
        "place",

      targetSlug:
        "canaan",

      relationType:
        "RELATED_PLACE",

      label:
        "가나안",
    });
  }


  /*
   * FALL OF JERICHO
   * 이미 Story가 존재하는 경우만 연결
   */

  if (
    nodeExists(
      source,
      "fall-of-jericho"
    )
  ) {

    relations.push({
      targetType:
        "story",

      targetSlug:
        "fall-of-jericho",

      relationType:
        "RELATED_STORY",

      label:
        "여리고 성 함락",
    });
  }


  const relationCode =
    relations
      .map(
        (
          relation
        ) => `      {
        targetType: "${relation.targetType}",
        targetSlug: "${relation.targetSlug}",
        relationType: "${relation.relationType}",
        label: "${relation.label}",
      },`
      )
      .join(
        "\n\n"
      );


  const jerichoNode = `

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

${relationCode}

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
    jerichoNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PLACE — JERICHO 실제 Node 추가"
  );

}
else {

  if (
    !jericho.content.includes(
      'type: "place"'
    )
  ) {

    throw new Error(
      'slug: "jericho"가 이미 존재하지만 type이 place가 아닙니다.'
    );
  }


  console.log(
    "PLACE — JERICHO 이미 존재"
  );
}


/* =====================================================
   VERIFY JERICHO
   ===================================================== */

jericho =
  findNodeRange(
    source,
    "jericho"
  );


if (!jericho) {

  throw new Error(
    "Jericho 실제 노드 생성 실패"
  );
}


/* =====================================================
   JOSHUA → JERICHO
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {
    targetType:
      "place",

    targetSlug:
      "jericho",

    relationType:
      "RELATED_PLACE",

    label:
      "여리고",
  }
);


/* =====================================================
   BOOK OF JOSHUA → JERICHO
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
  {
    targetType:
      "place",

    targetSlug:
      "jericho",

    relationType:
      "RELATED_PLACE",

    label:
      "여리고",
  }
);


/* =====================================================
   CANAAN → JERICHO
   ===================================================== */

if (
  nodeExists(
    source,
    "canaan"
  )
) {

  source = addRelation(
    source,
    "canaan",
    {
      targetType:
        "place",

      targetSlug:
        "jericho",

      relationType:
        "RELATED_PLACE",

      label:
        "여리고",
    }
  );
}


/* =====================================================
   EXISTING STORY → JERICHO
   ===================================================== */

if (
  nodeExists(
    source,
    "fall-of-jericho"
  )
) {

  source = addRelation(
    source,
    "fall-of-jericho",
    {
      targetType:
        "place",

      targetSlug:
        "jericho",

      relationType:
        "RELATED_PLACE",

      label:
        "여리고",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalJericho =
  findNodeRange(
    source,
    "jericho"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


const finalBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (
  !finalJericho ||
  !finalJoshua ||
  !finalBook
) {

  throw new Error(
    "최종 Jericho 검증 실패"
  );
}


const validations = [

  [
    "Jericho actual slug",

    /^[ \t]*slug:\s*"jericho"\s*,?\s*$/m
      .test(
        finalJericho.content
      ),
  ],

  [
    "Jericho Type",

    finalJericho.content.includes(
      'type: "place"'
    ),
  ],

  [
    "Jericho → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalJericho.content
      ),
  ],

  [
    "Jericho → Book of Joshua",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalJericho.content
      ),
  ],

  [
    "Joshua → Jericho",

    /targetSlug\s*:\s*"jericho"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Book of Joshua → Jericho",

    /targetSlug\s*:\s*"jericho"/
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
  "SCRAPTURA JERICHO PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PLACE — JERICHO"
);

console.log(
  "Jericho → Joshua"
);

console.log(
  "Jericho → Book of Joshua"
);

console.log(
  "Joshua → Jericho"
);

console.log(
  "Book of Joshua → Jericho"
);

console.log(
  "Canaan 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);