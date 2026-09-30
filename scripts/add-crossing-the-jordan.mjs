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
  "content.before-crossing-the-jordan.ts"
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
   * 실제 ContentNode slug만 탐색
   *
   * slug: "crossing-the-jordan"        O
   * targetSlug: "crossing-the-jordan"  X
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


  /*
   * 최상위 ContentNode 종료는
   * 두 칸 들여쓰기의 },
   */

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
   CREATE STORY — CROSSING THE JORDAN
   ===================================================== */

let story =
  findNodeRange(
    source,
    "crossing-the-jordan"
  );


if (!story) {

  const storyNode = `

  /* =====================================================
     STORY — CROSSING THE JORDAN
     ===================================================== */

  {
    type: "story",

    slug: "crossing-the-jordan",

    titleKo: "요단강 도하",

    titleEn: "Crossing the Jordan",

    eyebrow:
      "STORIES · JOSHUA 3–4 · CANAAN",

    summary:
      "여호수아의 지도 아래 이스라엘 공동체가 요단강을 건너 광야 시대를 마치고 가나안으로 들어가는 전환점의 이야기입니다.",

    overview:
      "여호수아서 3–4장에서 이스라엘 공동체는 요단강 앞에 도착합니다. 언약궤를 멘 제사장들이 강에 들어가고, 공동체는 마른 땅을 지나 강을 건넙니다. 이후 각 지파에서 한 명씩 선택된 사람들이 열두 개의 돌을 가져와 이 사건을 기억하기 위한 표징을 세웁니다.",

    biblicalContext:
      "요단강 도하는 출애굽과 광야 시대에서 가나안 진입 시대로 넘어가는 중요한 전환점입니다. SCRAPTURA에서는 Joshua, Jordan River, Book of Joshua를 연결하는 핵심 Story Node로 사용하고 이후 Gilgal과 Jericho로 이어지는 이동 흐름을 구성합니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "AT THE JORDAN",

        scripture:
          "Joshua 3:1",

        description:
          "여호수아와 이스라엘 공동체는 싯딤을 떠나 요단강에 도착하고 강을 건너기 전 그곳에 머뭅니다.",
      },


      {
        number:
          "02",

        title:
          "THE ARK GOES BEFORE",

        scripture:
          "Joshua 3:2–6",

        description:
          "관리들은 공동체에게 언약궤를 따라 이동하도록 지시하고 제사장들이 공동체 앞에서 움직이기 시작합니다.",
      },


      {
        number:
          "03",

        title:
          "THE PRIESTS ENTER",

        scripture:
          "Joshua 3:14–15",

        description:
          "언약궤를 멘 제사장들이 요단강 물가에 도착하고 그들의 발이 물에 잠기는 장면이 기록됩니다.",
      },


      {
        number:
          "04",

        title:
          "THE WATERS STOP",

        scripture:
          "Joshua 3:16",

        description:
          "상류에서 내려오던 물이 멈추면서 공동체가 강을 건널 수 있는 길이 열립니다.",
      },


      {
        number:
          "05",

        title:
          "ON DRY GROUND",

        scripture:
          "Joshua 3:17",

        description:
          "언약궤를 멘 제사장들이 강 가운데 서 있는 동안 이스라엘 공동체가 마른 땅을 지나 요단강을 건넙니다.",
      },


      {
        number:
          "06",

        title:
          "TWELVE STONES",

        scripture:
          "Joshua 4:1–8",

        description:
          "각 지파에서 한 명씩 선택된 사람들이 요단강 가운데에서 돌을 가져옵니다.",
      },


      {
        number:
          "07",

        title:
          "THE RIVER RETURNS",

        scripture:
          "Joshua 4:15–18",

        description:
          "제사장들이 요단강에서 올라온 뒤 강물이 다시 원래 흐름으로 돌아가는 장면이 이어집니다.",
      },


      {
        number:
          "08",

        title:
          "THE MEMORIAL",

        scripture:
          "Joshua 4:19–24",

        description:
          "이스라엘 공동체는 강을 건넌 뒤 열두 돌을 세우고 요단강 도하 사건을 기억하는 표징으로 삼습니다.",
      },

    ],


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
    storyNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "STORY — CROSSING THE JORDAN 실제 Node 추가"
  );

}
else {

  if (
    !story.content.includes(
      'type: "story"'
    )
  ) {

    throw new Error(
      'slug: "crossing-the-jordan"가 존재하지만 type이 story가 아닙니다.'
    );
  }


  console.log(
    "STORY — CROSSING THE JORDAN 이미 존재"
  );
}


/* =====================================================
   VERIFY STORY
   ===================================================== */

story =
  findNodeRange(
    source,
    "crossing-the-jordan"
  );


if (!story) {

  throw new Error(
    "Crossing the Jordan 실제 노드 생성 실패"
  );
}


/* =====================================================
   JOSHUA → STORY
   ===================================================== */

source = addRelation(
  source,
  "joshua",
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


/* =====================================================
   JORDAN → STORY
   ===================================================== */

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


/* =====================================================
   BOOK → STORY
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
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


/* =====================================================
   JERICHO → STORY
   ===================================================== */

source = addRelation(
  source,
  "jericho",
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


/* =====================================================
   OPTIONAL GILGAL
   ===================================================== */

if (
  nodeExists(
    source,
    "gilgal"
  )
) {

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


  source = addRelation(
    source,
    "gilgal",
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
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalStory =
  findNodeRange(
    source,
    "crossing-the-jordan"
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
  !finalStory ||
  !finalJoshua ||
  !finalJordan ||
  !finalBook ||
  !finalJericho
) {

  throw new Error(
    "최종 Crossing the Jordan 검증 실패"
  );
}


const validations = [

  [
    "Crossing the Jordan actual slug",

    /^ {4}slug:\s*"crossing-the-jordan"\s*,?\s*$/m
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
    "Story → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Story → Jordan",

    /targetSlug\s*:\s*"jordan-river"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Story → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Story → Jericho",

    /targetSlug\s*:\s*"jericho"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Joshua → Story",

    /targetSlug\s*:\s*"crossing-the-jordan"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Jordan → Story",

    /targetSlug\s*:\s*"crossing-the-jordan"/
      .test(
        finalJordan.content
      ),
  ],

  [
    "Book → Story",

    /targetSlug\s*:\s*"crossing-the-jordan"/
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
  "SCRAPTURA CROSSING THE JORDAN PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — CROSSING THE JORDAN"
);

console.log(
  "Story Scenes 8 stages"
);

console.log(
  "Joshua ↔ Crossing the Jordan"
);

console.log(
  "Jordan River ↔ Crossing the Jordan"
);

console.log(
  "Book of Joshua ↔ Crossing the Jordan"
);

console.log(
  "Jericho ↔ Crossing the Jordan"
);

console.log(
  "Gilgal 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);