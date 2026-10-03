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
  "content.before-achan.ts"
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
      "battle-of-ai",

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
   CREATE PERSON — ACHAN
   ===================================================== */

let achan =
  findNodeRange(
    source,
    "achan"
  );


if (!achan) {

  const achanNode = `

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
    achanNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PERSON — ACHAN 실제 Node 추가"
  );

}
else {

  if (
    !achan.content.includes(
      'type: "person"'
    )
  ) {

    throw new Error(
      'slug: "achan"가 존재하지만 type이 person이 아닙니다.'
    );
  }


  console.log(
    "PERSON — ACHAN 이미 존재"
  );
}


/* =====================================================
   VERIFY ACHAN
   ===================================================== */

achan =
  findNodeRange(
    source,
    "achan"
  );


if (!achan) {

  throw new Error(
    "Achan 실제 Node 생성 실패"
  );
}


/* =====================================================
   JOSHUA → ACHAN
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {

    targetType:
      "person",

    targetSlug:
      "achan",

    relationType:
      "RELATED_PERSON",

    label:
      "아간",
  }
);


/* =====================================================
   BATTLE OF AI → ACHAN
   ===================================================== */

source = addRelation(
  source,
  "battle-of-ai",
  {

    targetType:
      "person",

    targetSlug:
      "achan",

    relationType:
      "RELATED_PERSON",

    label:
      "아간",
  }
);


/* =====================================================
   JERICHO → ACHAN
   ===================================================== */

source = addRelation(
  source,
  "jericho",
  {

    targetType:
      "person",

    targetSlug:
      "achan",

    relationType:
      "RELATED_PERSON",

    label:
      "아간",
  }
);


/* =====================================================
   BOOK OF JOSHUA → ACHAN
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
  {

    targetType:
      "person",

    targetSlug:
      "achan",

    relationType:
      "RELATED_PERSON",

    label:
      "아간",
  }
);


/* =====================================================
   OPTIONAL AI CITY
   ===================================================== */

if (
  nodeExists(
    source,
    "ai"
  )
) {

  source = addRelation(
    source,
    "achan",
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


  source = addRelation(
    source,
    "ai",
    {

      targetType:
        "person",

      targetSlug:
        "achan",

      relationType:
        "RELATED_PERSON",

      label:
        "아간",
    }
  );
}


/* =====================================================
   OPTIONAL VALLEY OF ACHOR
   ===================================================== */

if (
  nodeExists(
    source,
    "valley-of-achor"
  )
) {

  source = addRelation(
    source,
    "achan",
    {

      targetType:
        "place",

      targetSlug:
        "valley-of-achor",

      relationType:
        "RELATED_PLACE",

      label:
        "아골 골짜기",
    }
  );


  source = addRelation(
    source,
    "valley-of-achor",
    {

      targetType:
        "person",

      targetSlug:
        "achan",

      relationType:
        "RELATED_PERSON",

      label:
        "아간",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalAchan =
  findNodeRange(
    source,
    "achan"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


const finalBattle =
  findNodeRange(
    source,
    "battle-of-ai"
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
  !finalAchan ||
  !finalJoshua ||
  !finalBattle ||
  !finalJericho ||
  !finalBook
) {

  throw new Error(
    "최종 Achan 검증 실패"
  );
}


const validations = [

  [
    "Achan actual slug",

    /^ {4}slug:\s*"achan"\s*,?\s*$/m
      .test(
        finalAchan.content
      ),
  ],

  [
    "Achan Type",

    finalAchan.content.includes(
      'type: "person"'
    ),
  ],

  [
    "Achan Character Journey",

    finalAchan.content.includes(
      "characterJourney: ["
    ),
  ],

  [
    "Achan → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalAchan.content
      ),
  ],

  [
    "Achan → Battle of Ai",

    /targetSlug\s*:\s*"battle-of-ai"/
      .test(
        finalAchan.content
      ),
  ],

  [
    "Achan → Jericho",

    /targetSlug\s*:\s*"jericho"/
      .test(
        finalAchan.content
      ),
  ],

  [
    "Achan → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalAchan.content
      ),
  ],

  [
    "Joshua → Achan",

    /targetSlug\s*:\s*"achan"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Battle → Achan",

    /targetSlug\s*:\s*"achan"/
      .test(
        finalBattle.content
      ),
  ],

  [
    "Jericho → Achan",

    /targetSlug\s*:\s*"achan"/
      .test(
        finalJericho.content
      ),
  ],

  [
    "Book → Achan",

    /targetSlug\s*:\s*"achan"/
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
  "SCRAPTURA ACHAN PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PERSON — ACHAN"
);

console.log(
  "Character Journey 7 stages"
);

console.log(
  "Achan ↔ Joshua"
);

console.log(
  "Achan ↔ Battle of Ai"
);

console.log(
  "Achan ↔ Jericho"
);

console.log(
  "Achan ↔ Book of Joshua"
);

console.log(
  "Ai / Valley of Achor 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);