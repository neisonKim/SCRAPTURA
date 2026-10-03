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
  "content.before-mount-ebal.ts"
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
   CREATE PLACE — MOUNT EBAL
   ===================================================== */

let mountEbal =
  findNodeRange(
    source,
    "mount-ebal"
  );


if (!mountEbal) {

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

  ];


  /*
   * SHECHEM
   */

  if (
    nodeExists(
      source,
      "shechem"
    )
  ) {

    relations.push({
      targetType:
        "place",

      targetSlug:
        "shechem",

      relationType:
        "RELATED_PLACE",

      label:
        "세겜",
    });
  }


  /*
   * MOUNT GERIZIM
   */

  if (
    nodeExists(
      source,
      "mount-gerizim"
    )
  ) {

    relations.push({
      targetType:
        "place",

      targetSlug:
        "mount-gerizim",

      relationType:
        "RELATED_PLACE",

      label:
        "그리심산",
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


  const mountEbalNode = `

  /* =====================================================
     PLACE — MOUNT EBAL
     ===================================================== */

  {
    type: "place",

    slug: "mount-ebal",

    titleKo: "에발산",

    titleEn: "Mount Ebal",

    eyebrow:
      "PLACES · CANAAN · JOSHUA 8",

    summary:
      "아이 성 전투 이후 여호수아가 제단을 세우고 율법의 말씀을 기록하며 공동체가 언약의 말씀을 듣는 장면의 핵심 장소입니다.",

    overview:
      "여호수아 8장 후반부에서 여호수아는 에발산에 제단을 세우고 제사를 드립니다. 돌 위에는 율법의 말씀이 기록되고, 이스라엘 공동체는 에발산과 그리심산을 중심으로 모여 율법의 말씀을 듣습니다. 이 장면은 아이 성 전투 이후 전쟁 서사에서 언약과 율법의 재확인으로 전환되는 중요한 지점입니다.",

    biblicalContext:
      "에발산은 성경에서 세겜 지역과 연결되어 등장하며 그리심산과 함께 축복과 저주의 언약 장면과 관련됩니다. SCRAPTURA에서는 여호수아 8장의 본문을 중심으로 다루며, 특정 고고학 구조물을 성경의 제단으로 확정하지 않고 고고학적 해석에는 논쟁이 있다는 점을 구분해 설명합니다.",


    /* =================================================
       KEY EVENT
       ================================================= */

    keyEvent: {

      title:
        "The Altar on Mount Ebal",

      scripture:
        "Joshua 8:30–35",

      description:
        "여호수아는 에발산에 제단을 세우고 율법의 말씀을 기록한 뒤 공동체 앞에서 축복과 저주의 말씀을 포함한 율법을 낭독합니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Deuteronomy 11:26–30",
      "Deuteronomy 27:1–13",
      "Joshua 8:30–35",
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
    mountEbalNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PLACE — MOUNT EBAL 실제 Node 추가"
  );

}
else {

  if (
    !mountEbal.content.includes(
      'type: "place"'
    )
  ) {

    throw new Error(
      'slug: "mount-ebal"가 존재하지만 type이 place가 아닙니다.'
    );
  }


  console.log(
    "PLACE — MOUNT EBAL 이미 존재"
  );
}


/* =====================================================
   VERIFY MOUNT EBAL
   ===================================================== */

mountEbal =
  findNodeRange(
    source,
    "mount-ebal"
  );


if (!mountEbal) {

  throw new Error(
    "Mount Ebal 실제 Node 생성 실패"
  );
}


/* =====================================================
   JOSHUA → MOUNT EBAL
   ===================================================== */

source = addRelation(
  source,
  "joshua",
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


/* =====================================================
   BATTLE OF AI → MOUNT EBAL
   ===================================================== */

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


/* =====================================================
   AI → MOUNT EBAL
   ===================================================== */

source = addRelation(
  source,
  "ai",
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


/* =====================================================
   BOOK OF JOSHUA → MOUNT EBAL
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
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


/* =====================================================
   SHECHEM ↔ MOUNT EBAL
   ===================================================== */

if (
  nodeExists(
    source,
    "shechem"
  )
) {

  source = addRelation(
    source,
    "mount-ebal",
    {

      targetType:
        "place",

      targetSlug:
        "shechem",

      relationType:
        "RELATED_PLACE",

      label:
        "세겜",
    }
  );


  source = addRelation(
    source,
    "shechem",
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
}


/* =====================================================
   MOUNT GERIZIM ↔ MOUNT EBAL
   ===================================================== */

if (
  nodeExists(
    source,
    "mount-gerizim"
  )
) {

  source = addRelation(
    source,
    "mount-ebal",
    {

      targetType:
        "place",

      targetSlug:
        "mount-gerizim",

      relationType:
        "RELATED_PLACE",

      label:
        "그리심산",
    }
  );


  source = addRelation(
    source,
    "mount-gerizim",
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
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalMountEbal =
  findNodeRange(
    source,
    "mount-ebal"
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
  !finalMountEbal ||
  !finalJoshua ||
  !finalBattle ||
  !finalAi ||
  !finalBook
) {

  throw new Error(
    "최종 Mount Ebal 검증 실패"
  );
}


const validations = [

  [
    "Mount Ebal actual slug",

    /^ {4}slug:\s*"mount-ebal"\s*,?\s*$/m
      .test(
        finalMountEbal.content
      ),
  ],

  [
    "Mount Ebal Type",

    finalMountEbal.content.includes(
      'type: "place"'
    ),
  ],

  [
    "Mount Ebal → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalMountEbal.content
      ),
  ],

  [
    "Mount Ebal → Battle of Ai",

    /targetSlug\s*:\s*"battle-of-ai"/
      .test(
        finalMountEbal.content
      ),
  ],

  [
    "Mount Ebal → Ai",

    /targetSlug\s*:\s*"ai"/
      .test(
        finalMountEbal.content
      ),
  ],

  [
    "Mount Ebal → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalMountEbal.content
      ),
  ],

  [
    "Joshua → Mount Ebal",

    /targetSlug\s*:\s*"mount-ebal"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Battle → Mount Ebal",

    /targetSlug\s*:\s*"mount-ebal"/
      .test(
        finalBattle.content
      ),
  ],

  [
    "Ai → Mount Ebal",

    /targetSlug\s*:\s*"mount-ebal"/
      .test(
        finalAi.content
      ),
  ],

  [
    "Book → Mount Ebal",

    /targetSlug\s*:\s*"mount-ebal"/
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
  "SCRAPTURA MOUNT EBAL PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PLACE — MOUNT EBAL"
);

console.log(
  "Mount Ebal ↔ Joshua"
);

console.log(
  "Mount Ebal ↔ Battle of Ai"
);

console.log(
  "Mount Ebal ↔ Ai"
);

console.log(
  "Mount Ebal ↔ Book of Joshua"
);

console.log(
  "Shechem 존재 시 자동 연결"
);

console.log(
  "Mount Gerizim 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);