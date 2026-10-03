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
  "content.before-battle-of-ai.ts"
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
      "ai",

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
      "gilgal",

    type:
      "place",
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
   CREATE STORY — BATTLE OF AI
   ===================================================== */

let battle =
  findNodeRange(
    source,
    "battle-of-ai"
  );


if (!battle) {

  const battleNode = `

  /* =====================================================
     STORY — BATTLE OF AI
     ===================================================== */

  {
    type: "story",

    slug: "battle-of-ai",

    titleKo: "아이 성 전투",

    titleEn: "The Battle of Ai",

    eyebrow:
      "STORIES · JOSHUA 7–8 · CANAAN",

    summary:
      "여리고 이후 아이 성을 향한 첫 공격에서 이스라엘이 패배하고, 공동체 내부의 문제를 다룬 뒤 여호수아가 다시 아이 성을 공격해 점령하는 이야기입니다.",

    overview:
      "여리고 사건 이후 이스라엘은 아이 성을 다음 목표로 삼습니다. 정탐 결과를 바탕으로 소규모 병력이 먼저 공격하지만 패배합니다. 이후 여호수아 7장에서는 패배의 원인과 아간 사건이 전개됩니다. 문제를 해결한 뒤 여호수아는 새로운 전략으로 아이 성을 다시 공격하고, 여호수아 8장 후반부에서는 에발산과 그리심산을 배경으로 언약의 말씀을 낭독하는 장면이 이어집니다.",

    biblicalContext:
      "아이 성 전투는 여리고의 승리 직후 곧바로 이어지는 이야기이지만 처음부터 성공하는 서사가 아닙니다. SCRAPTURA에서는 첫 패배, 공동체 내부의 문제, 두 번째 공격, 그리고 에발산에서의 언약 장면을 하나의 흐름으로 구성합니다. 아이 성의 정확한 현대 고고학적 위치는 논쟁이 있으므로 특정 유적과 동일시하지 않습니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "THE ROAD FROM JERICHO",

        scripture:
          "Joshua 7:2",

        description:
          "여리고 사건 이후 여호수아는 사람들을 보내 다음 목표인 아이 성과 그 주변 지역을 살펴보게 합니다.",
      },


      {
        number:
          "02",

        title:
          "THE FIRST ATTACK",

        scripture:
          "Joshua 7:3–5",

        description:
          "정탐 결과를 바탕으로 일부 병력이 아이 성을 공격하지만 전투에서 패배하고 후퇴합니다.",
      },


      {
        number:
          "03",

        title:
          "JOSHUA BEFORE THE ARK",

        scripture:
          "Joshua 7:6–9",

        description:
          "패배 이후 여호수아와 이스라엘의 장로들은 언약궤 앞에서 상황을 두고 반응합니다.",
      },


      {
        number:
          "04",

        title:
          "THE HIDDEN TREASURE",

        scripture:
          "Joshua 7:10–21",

        description:
          "공동체 안에서 여리고 사건과 관련된 금지된 물건을 가져간 사람이 있었음이 드러나고 아간이 지목됩니다.",
      },


      {
        number:
          "05",

        title:
          "ACHAN",

        scripture:
          "Joshua 7:22–26",

        description:
          "아간과 관련된 사건이 처리되면서 여호수아 7장의 첫 번째 아이 성 공격 이야기가 마무리됩니다.",
      },


      {
        number:
          "06",

        title:
          "A NEW PLAN",

        scripture:
          "Joshua 8:1–9",

        description:
          "여호수아는 다시 아이 성을 향하지만 이번에는 복병을 배치하는 새로운 전략을 세웁니다.",
      },


      {
        number:
          "07",

        title:
          "THE AMBUSH",

        scripture:
          "Joshua 8:10–23",

        description:
          "이스라엘 군대는 후퇴하는 것처럼 움직여 아이 성의 병력을 끌어낸 뒤 복병을 이용해 전세를 뒤집습니다.",
      },


      {
        number:
          "08",

        title:
          "THE FALL OF AI",

        scripture:
          "Joshua 8:24–29",

        description:
          "두 번째 공격 끝에 아이 성이 점령되면서 여리고 이후의 다음 주요 전투가 마무리됩니다.",
      },


      {
        number:
          "09",

        title:
          "THE ALTAR ON MOUNT EBAL",

        scripture:
          "Joshua 8:30–32",

        description:
          "아이 성 사건 이후 여호수아는 에발산에 제단을 세우고 율법의 말씀을 기록합니다.",
      },


      {
        number:
          "10",

        title:
          "THE COVENANT WORDS",

        scripture:
          "Joshua 8:33–35",

        description:
          "이스라엘 공동체가 에발산과 그리심산을 중심으로 모인 가운데 여호수아가 율법의 말씀을 낭독합니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 7",
      "Joshua 8",
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
          "ai",

        relationType:
          "RELATED_PLACE",

        label:
          "아이 성",
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
          "gilgal",

        relationType:
          "RELATED_PLACE",

        label:
          "길갈",
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
    battleNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "STORY — BATTLE OF AI 실제 Node 추가"
  );

}
else {

  if (
    !battle.content.includes(
      'type: "story"'
    )
  ) {

    throw new Error(
      'slug: "battle-of-ai"가 존재하지만 type이 story가 아닙니다.'
    );
  }


  console.log(
    "STORY — BATTLE OF AI 이미 존재"
  );
}


/* =====================================================
   VERIFY STORY
   ===================================================== */

battle =
  findNodeRange(
    source,
    "battle-of-ai"
  );


if (!battle) {

  throw new Error(
    "Battle of Ai 실제 Node 생성 실패"
  );
}


/* =====================================================
   JOSHUA → BATTLE OF AI
   ===================================================== */

source = addRelation(
  source,
  "joshua",
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


/* =====================================================
   AI → BATTLE OF AI
   ===================================================== */

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


/* =====================================================
   BOOK → BATTLE OF AI
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
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


/* =====================================================
   GILGAL → BATTLE OF AI
   ===================================================== */

source = addRelation(
  source,
  "gilgal",
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


/* =====================================================
   JERICHO → BATTLE OF AI
   ===================================================== */

source = addRelation(
  source,
  "jericho",
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


/* =====================================================
   OPTIONAL ACHAN
   ===================================================== */

if (
  nodeExists(
    source,
    "achan"
  )
) {

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


  source = addRelation(
    source,
    "achan",
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
}


/* =====================================================
   OPTIONAL MOUNT EBAL
   ===================================================== */

if (
  nodeExists(
    source,
    "mount-ebal"
  )
) {

  source = addRelation(
    source,
    "battle-of-ai",
    {

      targetType:
        "place",

      targetSlug:
        "mount-ebal",

      relationType:
        "RELATED_PLACE",

      label:
        "에발산",
    }
  );


  source = addRelation(
    source,
    "mount-ebal",
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
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalBattle =
  findNodeRange(
    source,
    "battle-of-ai"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


const finalAi =
  findNodeRange(
    source,
    "ai"
  );


const finalBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (
  !finalBattle ||
  !finalJoshua ||
  !finalAi ||
  !finalBook
) {

  throw new Error(
    "최종 Battle of Ai 검증 실패"
  );
}


const validations = [

  [
    "Battle of Ai actual slug",

    /^ {4}slug:\s*"battle-of-ai"\s*,?\s*$/m
      .test(
        finalBattle.content
      ),
  ],

  [
    "Battle of Ai Type",

    finalBattle.content.includes(
      'type: "story"'
    ),
  ],

  [
    "Battle of Ai Scenes",

    finalBattle.content.includes(
      "scenes: ["
    ),
  ],

  [
    "Battle → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalBattle.content
      ),
  ],

  [
    "Battle → Ai",

    /targetSlug\s*:\s*"ai"/
      .test(
        finalBattle.content
      ),
  ],

  [
    "Battle → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalBattle.content
      ),
  ],

  [
    "Joshua → Battle",

    /targetSlug\s*:\s*"battle-of-ai"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Ai → Battle",

    /targetSlug\s*:\s*"battle-of-ai"/
      .test(
        finalAi.content
      ),
  ],

  [
    "Book → Battle",

    /targetSlug\s*:\s*"battle-of-ai"/
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
  "SCRAPTURA BATTLE OF AI PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — BATTLE OF AI"
);

console.log(
  "Story Scenes 10 stages"
);

console.log(
  "Joshua ↔ Battle of Ai"
);

console.log(
  "Ai ↔ Battle of Ai"
);

console.log(
  "Book of Joshua ↔ Battle of Ai"
);

console.log(
  "Gilgal ↔ Battle of Ai"
);

console.log(
  "Jericho ↔ Battle of Ai"
);

console.log(
  "Achan / Mount Ebal 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);