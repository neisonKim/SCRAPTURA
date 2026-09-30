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
  "content.before-ten-commandments.ts"
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
   STRICT NODE FINDER
   ===================================================== */

function escapeRegex(
  value
) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


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
    throw new Error(
      `${nodeSlug} 실제 노드를 찾지 못했습니다.`
    );
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
    throw new Error(
      `${nodeSlug}의 relations 배열을 찾지 못했습니다.`
    );
  }


  const relationsEnd =
    node.content.indexOf(
      "\n    ],",
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
   REQUIRED NODE CHECK
   ===================================================== */

const mosesBefore =
  findNodeRange(
    source,
    "moses"
  );


const sinaiBefore =
  findNodeRange(
    source,
    "sinai"
  );


const exodusBefore =
  findNodeRange(
    source,
    "exodus"
  );


if (!mosesBefore) {
  throw new Error(
    '실제 PERSON 노드 slug: "moses"를 찾지 못했습니다.'
  );
}


if (!sinaiBefore) {
  throw new Error(
    '실제 PLACE 노드 slug: "sinai"를 찾지 못했습니다.'
  );
}


if (!exodusBefore) {
  throw new Error(
    '실제 BOOK 노드 slug: "exodus"를 찾지 못했습니다.'
  );
}


if (
  !mosesBefore.content.includes(
    'type: "person"'
  )
) {
  throw new Error(
    "Moses type 검증 실패"
  );
}


if (
  !sinaiBefore.content.includes(
    'type: "place"'
  )
) {
  throw new Error(
    "Sinai type 검증 실패"
  );
}


if (
  !exodusBefore.content.includes(
    'type: "book"'
  )
) {
  throw new Error(
    "Exodus type 검증 실패"
  );
}


console.log(
  "Moses 실제 Person 노드 확인"
);

console.log(
  "Sinai 실제 Place 노드 확인"
);

console.log(
  "Exodus 실제 Book 노드 확인"
);


/* =====================================================
   CREATE STORY
   ===================================================== */

let tenCommandments =
  findNodeRange(
    source,
    "ten-commandments"
  );


if (!tenCommandments) {

  const storyNode = `

  /* =====================================================
     STORY — TEN COMMANDMENTS
     ===================================================== */

  {
    type: "story",

    slug: "ten-commandments",

    titleKo: "십계명",

    titleEn: "The Ten Commandments",

    eyebrow:
      "STORIES · EXODUS · MOUNT SINAI",

    summary:
      "이스라엘 공동체가 시내산에 도착한 뒤 모세를 중심으로 계명과 언약에 관한 사건이 전개되는 출애굽기의 핵심 이야기입니다.",

    overview:
      "출애굽기 19장에서 이스라엘 공동체는 시내산에 도착합니다. 이어지는 출애굽기 20장에서는 십계명이 제시되고, 이후 언약과 돌판, 금송아지 사건과 언약의 갱신으로 이야기가 이어집니다.",

    biblicalContext:
      "SCRAPTURA에서는 십계명을 독립된 문장 목록으로만 다루기보다 시내산 도착, 모세의 중재, 언약, 돌판과 이후의 사건을 함께 연결된 이야기로 구성합니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "ARRIVAL AT SINAI",

        scripture:
          "Exodus 19:1–6",

        description:
          "이집트를 떠난 이스라엘 공동체가 광야를 지나 시내산에 도착하면서 새로운 이야기 구간이 시작됩니다.",
      },


      {
        number:
          "02",

        title:
          "PREPARING THE PEOPLE",

        scripture:
          "Exodus 19:10–15",

        description:
          "모세는 백성에게 앞으로 일어날 일을 준비하도록 지시합니다.",
      },


      {
        number:
          "03",

        title:
          "THE MOUNTAIN",

        scripture:
          "Exodus 19:16–20",

        description:
          "시내산을 중심으로 긴장감 있는 장면이 전개되고 모세가 산으로 올라갑니다.",
      },


      {
        number:
          "04",

        title:
          "THE TEN COMMANDMENTS",

        scripture:
          "Exodus 20:1–17",

        description:
          "출애굽기 20장에서 십계명이 제시되며 이스라엘 공동체의 언약 서사에서 핵심적인 부분을 이룹니다.",
      },


      {
        number:
          "05",

        title:
          "THE PEOPLE RESPOND",

        scripture:
          "Exodus 20:18–21",

        description:
          "백성은 산에서 펼쳐지는 장면을 경험하고 모세는 공동체와 산 사이에서 중요한 역할을 맡습니다.",
      },


      {
        number:
          "06",

        title:
          "THE COVENANT",

        scripture:
          "Exodus 24:1–18",

        description:
          "언약과 관련된 장면이 이어지고 모세는 다시 산으로 올라갑니다.",
      },


      {
        number:
          "07",

        title:
          "THE TABLETS",

        scripture:
          "Exodus 31:18",

        description:
          "출애굽기에서는 모세가 돌판을 받는 장면이 기록됩니다.",
      },


      {
        number:
          "08",

        title:
          "THE GOLDEN CALF",

        scripture:
          "Exodus 32:1–20",

        description:
          "모세가 산에 있는 동안 금송아지 사건이 발생하고 공동체에 큰 위기가 일어납니다.",
      },


      {
        number:
          "09",

        title:
          "THE COVENANT RENEWED",

        scripture:
          "Exodus 34:1–28",

        description:
          "금송아지 사건 이후 새로운 돌판과 함께 언약 갱신에 관한 장면이 이어집니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Exodus 19",
      "Exodus 20:1–17",
      "Exodus 24",
      "Exodus 31:18",
      "Exodus 32",
      "Exodus 34:1–28",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "moses",

        relationType:
          "RELATED_PERSON",

        label:
          "모세",
      },


      {
        targetType:
          "place",

        targetSlug:
          "sinai",

        relationType:
          "RELATED_PLACE",

        label:
          "시내산",
      },


      {
        targetType:
          "book",

        targetSlug:
          "exodus",

        relationType:
          "RELATED_BOOK",

        label:
          "출애굽기",
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
    storyNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "STORY — TEN COMMANDMENTS 실제 Node 추가"
  );

}
else {

  console.log(
    "STORY — TEN COMMANDMENTS 이미 존재"
  );
}


/* =====================================================
   VERIFY STORY
   ===================================================== */

tenCommandments =
  findNodeRange(
    source,
    "ten-commandments"
  );


if (!tenCommandments) {
  throw new Error(
    "Ten Commandments 실제 노드 생성 실패"
  );
}


/* =====================================================
   MOSES → TEN COMMANDMENTS
   ===================================================== */

source = addRelation(
  source,
  "moses",
  {
    targetType:
      "story",

    targetSlug:
      "ten-commandments",

    relationType:
      "RELATED_STORY",

    label:
      "십계명",
  }
);


/* =====================================================
   SINAI → TEN COMMANDMENTS
   ===================================================== */

source = addRelation(
  source,
  "sinai",
  {
    targetType:
      "story",

    targetSlug:
      "ten-commandments",

    relationType:
      "RELATED_STORY",

    label:
      "십계명",
  }
);


/* =====================================================
   EXODUS → TEN COMMANDMENTS
   ===================================================== */

source = addRelation(
  source,
  "exodus",
  {
    targetType:
      "story",

    targetSlug:
      "ten-commandments",

    relationType:
      "RELATED_STORY",

    label:
      "십계명",
  }
);


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalStory =
  findNodeRange(
    source,
    "ten-commandments"
  );

const finalMoses =
  findNodeRange(
    source,
    "moses"
  );

const finalSinai =
  findNodeRange(
    source,
    "sinai"
  );

const finalExodus =
  findNodeRange(
    source,
    "exodus"
  );


if (
  !finalStory ||
  !finalMoses ||
  !finalSinai ||
  !finalExodus
) {
  throw new Error(
    "최종 노드 검증 실패"
  );
}


const validations = [

  [
    "Ten Commandments actual slug",
    /^[ \t]*slug:\s*"ten-commandments"\s*,?\s*$/m
      .test(
        finalStory.content
      ),
  ],

  [
    "Story Type",
    finalStory.content.includes(
      'type: "story"'
    ),
  ],

  [
    "Story Scenes",
    finalStory.content.includes(
      "scenes: ["
    ),
  ],

  [
    "Story → Moses",
    /targetSlug\s*:\s*"moses"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Story → Sinai",
    /targetSlug\s*:\s*"sinai"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Story → Exodus",
    /targetSlug\s*:\s*"exodus"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Moses → Story",
    /targetSlug\s*:\s*"ten-commandments"/
      .test(
        finalMoses.content
      ),
  ],

  [
    "Sinai → Story",
    /targetSlug\s*:\s*"ten-commandments"/
      .test(
        finalSinai.content
      ),
  ],

  [
    "Exodus → Story",
    /targetSlug\s*:\s*"ten-commandments"/
      .test(
        finalExodus.content
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


if (failed.length > 0) {

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
  "SCRAPTURA TEN COMMANDMENTS PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — TEN COMMANDMENTS"
);

console.log(
  "Story Scenes 9 stages"
);

console.log(
  "Moses → Ten Commandments"
);

console.log(
  "Sinai → Ten Commandments"
);

console.log(
  "Exodus → Ten Commandments"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);