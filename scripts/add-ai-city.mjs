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
  "content.before-ai-city.ts"
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
   * 실제 ContentNode slug만 검색
   *
   * slug: "ai"       O
   * targetSlug: "ai" X
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

  {
    slug:
      "gilgal",

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
   CREATE PLACE — AI
   ===================================================== */

let ai =
  findNodeRange(
    source,
    "ai"
  );


if (!ai) {

  const aiNode = `

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
    aiNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PLACE — AI 실제 Node 추가"
  );

}
else {

  if (
    !ai.content.includes(
      'type: "place"'
    )
  ) {

    throw new Error(
      'slug: "ai"가 이미 존재하지만 type이 place가 아닙니다.'
    );
  }


  console.log(
    "PLACE — AI 이미 존재"
  );
}


/* =====================================================
   VERIFY AI
   ===================================================== */

ai =
  findNodeRange(
    source,
    "ai"
  );


if (!ai) {

  throw new Error(
    "Ai 실제 Node 생성 실패"
  );
}


/* =====================================================
   JOSHUA → AI
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {

    targetType:
      "place",

    targetSlug:
      "ai",

    relationType:
      "RELATED_PLACE",

    label:
      "아이 성",
  }
);


/* =====================================================
   BOOK OF JOSHUA → AI
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
  {

    targetType:
      "place",

    targetSlug:
      "ai",

    relationType:
      "RELATED_PLACE",

    label:
      "아이 성",
  }
);


/* =====================================================
   JERICHO → AI
   ===================================================== */

source = addRelation(
  source,
  "jericho",
  {

    targetType:
      "place",

    targetSlug:
      "ai",

    relationType:
      "RELATED_PLACE",

    label:
      "아이 성",
  }
);


/* =====================================================
   GILGAL → AI
   ===================================================== */

source = addRelation(
  source,
  "gilgal",
  {

    targetType:
      "place",

    targetSlug:
      "ai",

    relationType:
      "RELATED_PLACE",

    label:
      "아이 성",
  }
);


/* =====================================================
   OPTIONAL STORY — BATTLE OF AI
   ===================================================== */

if (
  nodeExists(
    source,
    "battle-of-ai"
  )
) {

  source = addRelation(
    source,
    "ai",
    {

      targetType:
        "story",

      targetSlug:
        "battle-of-ai",

      relationType:
        "RELATED_STORY",

      label:
        "아이 성 전투",
    }
  );


  source = addRelation(
    source,
    "battle-of-ai",
    {

      targetType:
        "place",

      targetSlug:
        "ai",

      relationType:
        "RELATED_PLACE",

      label:
        "아이 성",
    }
  );
}


/* =====================================================
   OPTIONAL BETHEL
   ===================================================== */

if (
  nodeExists(
    source,
    "bethel"
  )
) {

  source = addRelation(
    source,
    "ai",
    {

      targetType:
        "place",

      targetSlug:
        "bethel",

      relationType:
        "RELATED_PLACE",

      label:
        "벧엘",
    }
  );


  source = addRelation(
    source,
    "bethel",
    {

      targetType:
        "place",

      targetSlug:
        "ai",

      relationType:
        "RELATED_PLACE",

      label:
        "아이 성",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalAi =
  findNodeRange(
    source,
    "ai"
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


const finalGilgal =
  findNodeRange(
    source,
    "gilgal"
  );


if (
  !finalAi ||
  !finalJoshua ||
  !finalBook ||
  !finalJericho ||
  !finalGilgal
) {

  throw new Error(
    "최종 Ai 검증 실패"
  );
}


const validations = [

  [
    "Ai actual slug",

    /^ {4}slug:\s*"ai"\s*,?\s*$/m
      .test(
        finalAi.content
      ),
  ],

  [
    "Ai Type",

    finalAi.content.includes(
      'type: "place"'
    ),
  ],

  [
    "Ai → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalAi.content
      ),
  ],

  [
    "Ai → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalAi.content
      ),
  ],

  [
    "Ai → Jericho",

    /targetSlug\s*:\s*"jericho"/
      .test(
        finalAi.content
      ),
  ],

  [
    "Ai → Gilgal",

    /targetSlug\s*:\s*"gilgal"/
      .test(
        finalAi.content
      ),
  ],

  [
    "Joshua → Ai",

    /targetSlug\s*:\s*"ai"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Book → Ai",

    /targetSlug\s*:\s*"ai"/
      .test(
        finalBook.content
      ),
  ],

  [
    "Jericho → Ai",

    /targetSlug\s*:\s*"ai"/
      .test(
        finalJericho.content
      ),
  ],

  [
    "Gilgal → Ai",

    /targetSlug\s*:\s*"ai"/
      .test(
        finalGilgal.content
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
  "SCRAPTURA AI CITY PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PLACE — AI"
);

console.log(
  "Ai ↔ Joshua"
);

console.log(
  "Ai ↔ Book of Joshua"
);

console.log(
  "Ai ↔ Jericho"
);

console.log(
  "Ai ↔ Gilgal"
);

console.log(
  "Bethel 존재 시 자동 연결"
);

console.log(
  "Battle of Ai 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);