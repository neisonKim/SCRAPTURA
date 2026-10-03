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
  "content.before-covenant-ebal-gerizim.ts"
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
      "book-of-joshua",

    type:
      "book",
  },

  {
    slug:
      "mount-ebal",

    type:
      "place",
  },

  {
    slug:
      "mount-gerizim",

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
   CREATE STORY
   COVENANT AT EBAL AND GERIZIM
   ===================================================== */

let covenantStory =
  findNodeRange(
    source,
    "covenant-at-ebal-and-gerizim"
  );


if (!covenantStory) {

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
        "place",

      targetSlug:
        "mount-ebal",

      relationType:
        "RELATED_PLACE",

      label:
        "에발산",
    },


    {
      targetType:
        "place",

      targetSlug:
        "mount-gerizim",

      relationType:
        "RELATED_PLACE",

      label:
        "그리심산",
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
   * BATTLE OF AI
   */

  if (
    nodeExists(
      source,
      "battle-of-ai"
    )
  ) {

    relations.push({
      targetType:
        "story",

      targetSlug:
        "battle-of-ai",

      relationType:
        "RELATED_STORY",

      label:
        "아이 성 전투",
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


  const storyNode = `

  /* =====================================================
     STORY — COVENANT AT EBAL AND GERIZIM
     ===================================================== */

  {
    type: "story",

    slug:
      "covenant-at-ebal-and-gerizim",

    titleKo:
      "에발산과 그리심산의 언약",

    titleEn:
      "Covenant at Ebal and Gerizim",

    eyebrow:
      "STORIES · JOSHUA 8:30–35 · COVENANT",

    summary:
      "아이 성 사건 이후 여호수아가 에발산에 제단을 세우고 율법을 기록하며, 에발산과 그리심산 사이에서 이스라엘 공동체가 언약의 말씀을 듣는 장면입니다.",

    overview:
      "여호수아 8장 후반부는 아이 성 전투가 끝난 뒤 전쟁 이야기에서 언약과 율법의 장면으로 전환됩니다. 여호수아는 에발산에 돌 제단을 세우고 제사를 드리며, 모세의 율법을 돌에 기록합니다. 이후 이스라엘 공동체는 에발산과 그리심산을 중심으로 모이고 여호수아는 율법의 축복과 저주의 말씀을 포함해 기록된 말씀을 공동체 앞에서 낭독합니다.",

    biblicalContext:
      "이 장면은 신명기에서 모세가 명령한 축복과 저주의 언약 구조와 연결됩니다. SCRAPTURA에서는 전투의 승리 자체보다 아이 성 이후 공동체가 다시 율법과 언약의 말씀 앞에 서는 전환점으로 표현합니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "AFTER AI",

        scripture:
          "Joshua 8:30",

        description:
          "아이 성 사건 이후 여호수아와 이스라엘 공동체의 이야기는 에발산으로 이동합니다.",
      },


      {
        number:
          "02",

        title:
          "THE ALTAR",

        scripture:
          "Joshua 8:30–31",

        description:
          "여호수아는 에발산에 이스라엘의 하나님을 위한 돌 제단을 세웁니다.",
      },


      {
        number:
          "03",

        title:
          "THE OFFERINGS",

        scripture:
          "Joshua 8:31",

        description:
          "공동체는 제단 위에서 번제와 화목제를 드립니다.",
      },


      {
        number:
          "04",

        title:
          "THE LAW ON STONES",

        scripture:
          "Joshua 8:32",

        description:
          "여호수아는 모세의 율법을 돌 위에 기록합니다.",
      },


      {
        number:
          "05",

        title:
          "EBAL AND GERIZIM",

        scripture:
          "Joshua 8:33",

        description:
          "이스라엘 공동체는 언약궤를 중심으로 에발산과 그리심산 쪽에 나뉘어 서게 됩니다.",
      },


      {
        number:
          "06",

        title:
          "BLESSING AND CURSE",

        scripture:
          "Joshua 8:34",

        description:
          "여호수아는 율법에 기록된 축복과 저주의 말씀을 공동체 앞에서 낭독합니다.",
      },


      {
        number:
          "07",

        title:
          "THE WHOLE ASSEMBLY",

        scripture:
          "Joshua 8:35",

        description:
          "이스라엘 전체 공동체와 함께 여자와 아이들, 그들 가운데 있던 이방인까지 말씀을 듣는 장면으로 이야기가 마무리됩니다.",
      },

    ],


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
    storyNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "STORY — COVENANT AT EBAL AND GERIZIM 실제 Node 추가"
  );

}
else {

  if (
    !covenantStory.content.includes(
      'type: "story"'
    )
  ) {

    throw new Error(
      "covenant-at-ebal-and-gerizim가 존재하지만 type이 story가 아닙니다."
    );
  }


  console.log(
    "STORY — COVENANT AT EBAL AND GERIZIM 이미 존재"
  );
}


/* =====================================================
   VERIFY STORY
   ===================================================== */

covenantStory =
  findNodeRange(
    source,
    "covenant-at-ebal-and-gerizim"
  );


if (!covenantStory) {

  throw new Error(
    "Covenant Story 실제 Node 생성 실패"
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
      "covenant-at-ebal-and-gerizim",

    relationType:
      "RELATED_STORY",

    label:
      "에발산과 그리심산의 언약",
  }
);


/* =====================================================
   MOUNT EBAL → STORY
   ===================================================== */

source = addRelation(
  source,
  "mount-ebal",
  {

    targetType:
      "story",

    targetSlug:
      "covenant-at-ebal-and-gerizim",

    relationType:
      "RELATED_STORY",

    label:
      "에발산과 그리심산의 언약",
  }
);


/* =====================================================
   MOUNT GERIZIM → STORY
   ===================================================== */

source = addRelation(
  source,
  "mount-gerizim",
  {

    targetType:
      "story",

    targetSlug:
      "covenant-at-ebal-and-gerizim",

    relationType:
      "RELATED_STORY",

    label:
      "에발산과 그리심산의 언약",
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
      "covenant-at-ebal-and-gerizim",

    relationType:
      "RELATED_STORY",

    label:
      "에발산과 그리심산의 언약",
  }
);


/* =====================================================
   SHECHEM → STORY
   ===================================================== */

if (
  nodeExists(
    source,
    "shechem"
  )
) {

  source = addRelation(
    source,
    "shechem",
    {

      targetType:
        "story",

      targetSlug:
        "covenant-at-ebal-and-gerizim",

      relationType:
        "RELATED_STORY",

      label:
        "에발산과 그리심산의 언약",
    }
  );
}


/* =====================================================
   BATTLE OF AI → STORY
   ===================================================== */

if (
  nodeExists(
    source,
    "battle-of-ai"
  )
) {

  source = addRelation(
    source,
    "battle-of-ai",
    {

      targetType:
        "story",

      targetSlug:
        "covenant-at-ebal-and-gerizim",

      relationType:
        "RELATED_STORY",

      label:
        "에발산과 그리심산의 언약",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalStory =
  findNodeRange(
    source,
    "covenant-at-ebal-and-gerizim"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


const finalEbal =
  findNodeRange(
    source,
    "mount-ebal"
  );


const finalGerizim =
  findNodeRange(
    source,
    "mount-gerizim"
  );


const finalBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (
  !finalStory ||
  !finalJoshua ||
  !finalEbal ||
  !finalGerizim ||
  !finalBook
) {

  throw new Error(
    "최종 Covenant Story 검증 실패"
  );
}


const validations = [

  [
    "Covenant Story actual slug",

    /^ {4}slug:\s*"covenant-at-ebal-and-gerizim"\s*,?\s*$/m
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
    "Story → Mount Ebal",

    /targetSlug\s*:\s*"mount-ebal"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Story → Mount Gerizim",

    /targetSlug\s*:\s*"mount-gerizim"/
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
    "Joshua → Story",

    /targetSlug\s*:\s*"covenant-at-ebal-and-gerizim"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Ebal → Story",

    /targetSlug\s*:\s*"covenant-at-ebal-and-gerizim"/
      .test(
        finalEbal.content
      ),
  ],

  [
    "Gerizim → Story",

    /targetSlug\s*:\s*"covenant-at-ebal-and-gerizim"/
      .test(
        finalGerizim.content
      ),
  ],

  [
    "Book → Story",

    /targetSlug\s*:\s*"covenant-at-ebal-and-gerizim"/
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
  "SCRAPTURA COVENANT EBAL GERIZIM PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — COVENANT AT EBAL AND GERIZIM"
);

console.log(
  "Story Scenes 7 stages"
);

console.log(
  "Joshua ↔ Covenant Story"
);

console.log(
  "Mount Ebal ↔ Covenant Story"
);

console.log(
  "Mount Gerizim ↔ Covenant Story"
);

console.log(
  "Book of Joshua ↔ Covenant Story"
);

console.log(
  "Shechem / Battle of Ai 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);