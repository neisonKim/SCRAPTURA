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
  "content.before-fall-of-jericho.ts"
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
   * 실제 slug만 탐색
   *
   * slug: "fall-of-jericho"       O
   * targetSlug: "fall-of-jericho" X
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
      `${nodeSlug} relations 없음 → 관계 추가 생략`
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

const requiredNodes = [
  {
    slug:
      "joshua",

    type:
      "person",
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
   CREATE STORY — FALL OF JERICHO
   ===================================================== */

let story =
  findNodeRange(
    source,
    "fall-of-jericho"
  );


if (!story) {

  const storyNode = `

  /* =====================================================
     STORY — FALL OF JERICHO
     ===================================================== */

  {
    type: "story",

    slug: "fall-of-jericho",

    titleKo: "여리고 성 함락",

    titleEn: "The Fall of Jericho",

    eyebrow:
      "STORIES · JOSHUA 2–6 · CANAAN",

    summary:
      "이스라엘 공동체가 요단강을 건너 가나안에 들어간 뒤 여호수아의 지휘 아래 여리고 성을 마주하고, 여러 날 동안 성을 돈 뒤 성이 무너지는 이야기입니다.",

    overview:
      "여리고 이야기는 단순히 성이 무너지는 장면만으로 구성되지 않습니다. 여호수아는 먼저 정탐꾼을 보내고, 정탐꾼들은 여리고에서 라합을 만나게 됩니다. 이후 이스라엘 공동체는 요단강을 건너 가나안에 들어오고, 여리고 앞에서 진영을 정비합니다. 여호수아 6장에서 공동체는 여러 날 동안 성을 돌고 마지막 날의 사건을 거쳐 여리고 성의 함락을 경험합니다.",

    biblicalContext:
      "SCRAPTURA에서는 여리고 성 함락을 여호수아 개인의 사건으로만 보지 않고 광야 시대에서 가나안 진입 시대로 넘어가는 전환점으로 구성합니다. 이 이야기는 Joshua, Jericho, Book of Joshua와 직접 연결되며 이후 Rahab, Jordan Crossing, Ai 등의 콘텐츠로 확장할 수 있습니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "THE SPIES",

        scripture:
          "Joshua 2:1",

        description:
          "여호수아는 싯딤에서 두 명의 정탐꾼을 여리고로 보내 가나안 진입을 준비합니다.",
      },


      {
        number:
          "02",

        title:
          "RAHAB",

        scripture:
          "Joshua 2:2–21",

        description:
          "정탐꾼들은 여리고에서 라합의 도움을 받고, 이후 그녀와 가족의 안전에 관한 약속이 이루어집니다.",
      },


      {
        number:
          "03",

        title:
          "CROSSING THE JORDAN",

        scripture:
          "Joshua 3–4",

        description:
          "이스라엘 공동체가 요단강을 건너면서 광야 여정에서 가나안 진입 단계로 이동합니다.",
      },


      {
        number:
          "04",

        title:
          "BEFORE JERICHO",

        scripture:
          "Joshua 5:13–15",

        description:
          "여리고를 앞둔 시점에서 여호수아에게 중요한 장면이 전개되며 이후 여리고 사건으로 이어집니다.",
      },


      {
        number:
          "05",

        title:
          "THE FIRST SIX DAYS",

        scripture:
          "Joshua 6:1–14",

        description:
          "이스라엘 공동체는 여호수아의 지시에 따라 여리고 성 주위를 돌기 시작합니다.",
      },


      {
        number:
          "06",

        title:
          "THE SEVENTH DAY",

        scripture:
          "Joshua 6:15–16",

        description:
          "일곱째 날에는 이전과 다른 방식으로 성을 여러 차례 돌며 이야기의 긴장이 절정에 이릅니다.",
      },


      {
        number:
          "07",

        title:
          "THE SHOUT",

        scripture:
          "Joshua 6:20",

        description:
          "나팔 소리와 백성의 외침 이후 여리고 성벽이 무너지는 장면이 기록됩니다.",
      },


      {
        number:
          "08",

        title:
          "RAHAB IS RESCUED",

        scripture:
          "Joshua 6:22–25",

        description:
          "정탐꾼들과의 약속에 따라 라합과 그의 가족이 성 밖으로 나오게 됩니다.",
      },


      {
        number:
          "09",

        title:
          "AFTER JERICHO",

        scripture:
          "Joshua 6:26–27",

        description:
          "여리고 사건 이후 여호수아의 이름이 알려지고 가나안 진입 이야기는 다음 지역과 사건으로 이어집니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 2",
      "Joshua 3–4",
      "Joshua 5:13–15",
      "Joshua 6:1–27",
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
    storyNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "STORY — FALL OF JERICHO 실제 Node 추가"
  );

}
else {

  if (
    !story.content.includes(
      'type: "story"'
    )
  ) {

    throw new Error(
      'fall-of-jericho slug가 존재하지만 type이 story가 아닙니다.'
    );
  }


  console.log(
    "STORY — FALL OF JERICHO 이미 존재"
  );
}


/* =====================================================
   VERIFY STORY
   ===================================================== */

story =
  findNodeRange(
    source,
    "fall-of-jericho"
  );


if (!story) {

  throw new Error(
    "Fall of Jericho 실제 노드 생성 실패"
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
      "fall-of-jericho",

    relationType:
      "RELATED_STORY",

    label:
      "여리고 성 함락",
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
      "fall-of-jericho",

    relationType:
      "RELATED_STORY",

    label:
      "여리고 성 함락",
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
      "fall-of-jericho",

    relationType:
      "RELATED_STORY",

    label:
      "여리고 성 함락",
  }
);


/* =====================================================
   OPTIONAL RAHAB
   ===================================================== */

if (
  nodeExists(
    source,
    "rahab"
  )
) {

  source = addRelation(
    source,
    "rahab",
    {
      targetType:
        "story",

      targetSlug:
        "fall-of-jericho",

      relationType:
        "RELATED_STORY",

      label:
        "여리고 성 함락",
    }
  );


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
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalStory =
  findNodeRange(
    source,
    "fall-of-jericho"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
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
  !finalStory ||
  !finalJoshua ||
  !finalJericho ||
  !finalBook
) {

  throw new Error(
    "최종 Fall of Jericho 검증 실패"
  );
}


const validations = [

  [
    "Fall of Jericho actual slug",

    /^[ \t]*slug:\s*"fall-of-jericho"\s*,?\s*$/m
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
    "Story → Jericho",

    /targetSlug\s*:\s*"jericho"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Story → Book of Joshua",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Joshua → Story",

    /targetSlug\s*:\s*"fall-of-jericho"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Jericho → Story",

    /targetSlug\s*:\s*"fall-of-jericho"/
      .test(
        finalJericho.content
      ),
  ],

  [
    "Book → Story",

    /targetSlug\s*:\s*"fall-of-jericho"/
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
  "SCRAPTURA FALL OF JERICHO PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — FALL OF JERICHO"
);

console.log(
  "Story Scenes 9 stages"
);

console.log(
  "Joshua ↔ Fall of Jericho"
);

console.log(
  "Jericho ↔ Fall of Jericho"
);

console.log(
  "Book of Joshua ↔ Fall of Jericho"
);

console.log(
  "Rahab 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);