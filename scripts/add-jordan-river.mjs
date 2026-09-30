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
  "content.before-jordan-river.ts"
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
      "book-of-joshua",

    type:
      "book",
  },

  {
    slug:
      "jericho",

    type:
      "place",
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
   CREATE PLACE — JORDAN RIVER
   ===================================================== */

let jordan =
  findNodeRange(
    source,
    "jordan-river"
  );


if (!jordan) {

  const jordanNode = `

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
    jordanNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PLACE — JORDAN RIVER 실제 Node 추가"
  );

}
else {

  if (
    !jordan.content.includes(
      'type: "place"'
    )
  ) {

    throw new Error(
      'slug: "jordan-river"가 존재하지만 type이 place가 아닙니다.'
    );
  }


  console.log(
    "PLACE — JORDAN RIVER 이미 존재"
  );
}


/* =====================================================
   VERIFY JORDAN
   ===================================================== */

jordan =
  findNodeRange(
    source,
    "jordan-river"
  );


if (!jordan) {

  throw new Error(
    "Jordan River 실제 노드 생성 실패"
  );
}


/* =====================================================
   JOSHUA → JORDAN
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {
    targetType:
      "place",

    targetSlug:
      "jordan-river",

    relationType:
      "RELATED_PLACE",

    label:
      "요단강",
  }
);


/* =====================================================
   BOOK OF JOSHUA → JORDAN
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
  {
    targetType:
      "place",

    targetSlug:
      "jordan-river",

    relationType:
      "RELATED_PLACE",

    label:
      "요단강",
  }
);


/* =====================================================
   JERICHO → JORDAN
   ===================================================== */

source = addRelation(
  source,
  "jericho",
  {
    targetType:
      "place",

    targetSlug:
      "jordan-river",

    relationType:
      "RELATED_PLACE",

    label:
      "요단강",
  }
);


/* =====================================================
   OPTIONAL CROSSING STORY
   ===================================================== */

if (
  nodeExists(
    source,
    "crossing-the-jordan"
  )
) {

  source = addRelation(
    source,
    "jordan-river",
    {
      targetType:
        "story",

      targetSlug:
        "crossing-the-jordan",

      relationType:
        "RELATED_STORY",

      label:
        "요단강 도하",
    }
  );


  source = addRelation(
    source,
    "crossing-the-jordan",
    {
      targetType:
        "place",

      targetSlug:
        "jordan-river",

      relationType:
        "RELATED_PLACE",

      label:
        "요단강",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalJordan =
  findNodeRange(
    source,
    "jordan-river"
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


const finalJericho =
  findNodeRange(
    source,
    "jericho"
  );


if (
  !finalJordan ||
  !finalJoshua ||
  !finalBook ||
  !finalJericho
) {

  throw new Error(
    "최종 Jordan River 검증 실패"
  );
}


const validations = [

  [
    "Jordan actual slug",

    /^ {4}slug:\s*"jordan-river"\s*,?\s*$/m
      .test(
        finalJordan.content
      ),
  ],

  [
    "Jordan Type",

    finalJordan.content.includes(
      'type: "place"'
    ),
  ],

  [
    "Jordan → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalJordan.content
      ),
  ],

  [
    "Jordan → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalJordan.content
      ),
  ],

  [
    "Jordan → Jericho",

    /targetSlug\s*:\s*"jericho"/
      .test(
        finalJordan.content
      ),
  ],

  [
    "Joshua → Jordan",

    /targetSlug\s*:\s*"jordan-river"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Book → Jordan",

    /targetSlug\s*:\s*"jordan-river"/
      .test(
        finalBook.content
      ),
  ],

  [
    "Jericho → Jordan",

    /targetSlug\s*:\s*"jordan-river"/
      .test(
        finalJericho.content
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
  "SCRAPTURA JORDAN RIVER PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PLACE — JORDAN RIVER"
);

console.log(
  "Jordan River ↔ Joshua"
);

console.log(
  "Jordan River ↔ Book of Joshua"
);

console.log(
  "Jordan River ↔ Jericho"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);