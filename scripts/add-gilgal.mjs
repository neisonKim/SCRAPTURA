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
  "content.before-gilgal.ts"
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
   * 실제 ContentNode의 slug만 검색
   *
   * slug: "gilgal"       O
   * targetSlug: "gilgal" X
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


  if (start === -1) {

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
   RELATIONS END
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


  if (relationsStart === -1) {

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


  if (relationsEnd === -1) {

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
      "joshua",

    type:
      "person",
  },

  {
    slug:
      "jordan-river",

    type:
      "place",
  },

  {
    slug:
      "crossing-the-jordan",

    type:
      "story",
  },

  {
    slug:
      "jericho",

    type:
      "place",
  },

  {
    slug:
      "book-of-joshua",

    type:
      "book",
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
   CREATE PLACE — GILGAL
   ===================================================== */

let gilgal =
  findNodeRange(
    source,
    "gilgal"
  );


if (!gilgal) {

  const gilgalNode = `

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
    gilgalNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PLACE — GILGAL 실제 Node 추가"
  );

}
else {

  if (
    !gilgal.content.includes(
      'type: "place"'
    )
  ) {

    throw new Error(
      'slug: "gilgal"가 존재하지만 type이 place가 아닙니다.'
    );
  }


  console.log(
    "PLACE — GILGAL 이미 존재"
  );
}


/* =====================================================
   VERIFY GILGAL
   ===================================================== */

gilgal =
  findNodeRange(
    source,
    "gilgal"
  );


if (!gilgal) {

  throw new Error(
    "Gilgal 실제 Node 생성 실패"
  );
}


/* =====================================================
   JOSHUA → GILGAL
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {

    targetType:
      "place",

    targetSlug:
      "gilgal",

    relationType:
      "RELATED_PLACE",

    label:
      "길갈",
  }
);


/* =====================================================
   JORDAN RIVER → GILGAL
   ===================================================== */

source = addRelation(
  source,
  "jordan-river",
  {

    targetType:
      "place",

    targetSlug:
      "gilgal",

    relationType:
      "RELATED_PLACE",

    label:
      "길갈",
  }
);


/* =====================================================
   CROSSING STORY → GILGAL
   ===================================================== */

source = addRelation(
  source,
  "crossing-the-jordan",
  {

    targetType:
      "place",

    targetSlug:
      "gilgal",

    relationType:
      "RELATED_PLACE",

    label:
      "길갈",
  }
);


/* =====================================================
   JERICHO → GILGAL
   ===================================================== */

source = addRelation(
  source,
  "jericho",
  {

    targetType:
      "place",

    targetSlug:
      "gilgal",

    relationType:
      "RELATED_PLACE",

    label:
      "길갈",
  }
);


/* =====================================================
   BOOK → GILGAL
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
  {

    targetType:
      "place",

    targetSlug:
      "gilgal",

    relationType:
      "RELATED_PLACE",

    label:
      "길갈",
  }
);


/* =====================================================
   OPTIONAL FALL OF JERICHO
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
        "gilgal",

      relationType:
        "RELATED_PLACE",

      label:
        "길갈",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalGilgal =
  findNodeRange(
    source,
    "gilgal"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


const finalJordan =
  findNodeRange(
    source,
    "jordan-river"
  );


const finalCrossing =
  findNodeRange(
    source,
    "crossing-the-jordan"
  );


const finalJericho =
  findNodeRange(
    source,
    "jericho"
  );


const finalBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (
  !finalGilgal ||
  !finalJoshua ||
  !finalJordan ||
  !finalCrossing ||
  !finalJericho ||
  !finalBook
) {

  throw new Error(
    "최종 Gilgal 검증 실패"
  );
}


const validations = [

  [
    "Gilgal actual slug",

    /^ {4}slug:\s*"gilgal"\s*,?\s*$/m
      .test(
        finalGilgal.content
      ),
  ],

  [
    "Gilgal Type",

    finalGilgal.content.includes(
      'type: "place"'
    ),
  ],

  [
    "Gilgal → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalGilgal.content
      ),
  ],

  [
    "Gilgal → Jordan River",

    /targetSlug\s*:\s*"jordan-river"/
      .test(
        finalGilgal.content
      ),
  ],

  [
    "Gilgal → Crossing",

    /targetSlug\s*:\s*"crossing-the-jordan"/
      .test(
        finalGilgal.content
      ),
  ],

  [
    "Gilgal → Jericho",

    /targetSlug\s*:\s*"jericho"/
      .test(
        finalGilgal.content
      ),
  ],

  [
    "Gilgal → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalGilgal.content
      ),
  ],

  [
    "Joshua → Gilgal",

    /targetSlug\s*:\s*"gilgal"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Jordan → Gilgal",

    /targetSlug\s*:\s*"gilgal"/
      .test(
        finalJordan.content
      ),
  ],

  [
    "Crossing → Gilgal",

    /targetSlug\s*:\s*"gilgal"/
      .test(
        finalCrossing.content
      ),
  ],

  [
    "Jericho → Gilgal",

    /targetSlug\s*:\s*"gilgal"/
      .test(
        finalJericho.content
      ),
  ],

  [
    "Book → Gilgal",

    /targetSlug\s*:\s*"gilgal"/
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
  "SCRAPTURA GILGAL PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PLACE — GILGAL"
);

console.log(
  "Gilgal ↔ Joshua"
);

console.log(
  "Gilgal ↔ Jordan River"
);

console.log(
  "Gilgal ↔ Crossing the Jordan"
);

console.log(
  "Gilgal ↔ Jericho"
);

console.log(
  "Gilgal ↔ Book of Joshua"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);