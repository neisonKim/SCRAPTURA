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
  "content.before-mount-gerizim.ts"
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
      "mount-ebal",

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
   CREATE PLACE — MOUNT GERIZIM
   ===================================================== */

let mountGerizim =
  findNodeRange(
    source,
    "mount-gerizim"
  );


if (!mountGerizim) {

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


  const mountGerizimNode = `

  /* =====================================================
     PLACE — MOUNT GERIZIM
     ===================================================== */

  {
    type: "place",

    slug: "mount-gerizim",

    titleKo: "그리심산",

    titleEn: "Mount Gerizim",

    eyebrow:
      "PLACES · CANAAN · JOSHUA 8",

    summary:
      "세겜 인근에서 에발산과 마주하는 산으로, 여호수아 8장에서 공동체가 축복과 저주의 말씀을 듣는 언약 장면과 연결되는 장소입니다.",

    overview:
      "여호수아 8장 후반부에서는 이스라엘 공동체가 에발산과 그리심산을 중심으로 배치되고 율법의 말씀이 낭독됩니다. 그리심산은 이 장면에서 축복과 관련된 위치로 등장하며 에발산과 함께 언약의 공간적 구조를 형성합니다.",

    biblicalContext:
      "그리심산은 신명기와 여호수아서에서 에발산과 함께 언급됩니다. 두 산은 세겜 지역과 밀접하게 연결되며, 여호수아 8장의 언약 갱신 장면에서 중요한 지리적 배경을 이룹니다. SCRAPTURA에서는 Mount Ebal, Shechem, Joshua, Book of Joshua와 연결해 하나의 언약·지리 클러스터로 구성합니다.",


    /* =================================================
       KEY EVENT
       ================================================= */

    keyEvent: {

      title:
        "Blessing and Covenant",

      scripture:
        "Joshua 8:33–35",

      description:
        "이스라엘 공동체가 에발산과 그리심산을 중심으로 모인 가운데 여호수아가 율법의 축복과 저주의 말씀을 공동체 앞에서 낭독합니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Deuteronomy 11:26–30",
      "Deuteronomy 27:11–13",
      "Joshua 8:33–35",
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
    mountGerizimNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PLACE — MOUNT GERIZIM 실제 Node 추가"
  );

}
else {

  if (
    !mountGerizim.content.includes(
      'type: "place"'
    )
  ) {

    throw new Error(
      'slug: "mount-gerizim"가 존재하지만 type이 place가 아닙니다.'
    );
  }


  console.log(
    "PLACE — MOUNT GERIZIM 이미 존재"
  );
}


/* =====================================================
   VERIFY
   ===================================================== */

mountGerizim =
  findNodeRange(
    source,
    "mount-gerizim"
  );


if (!mountGerizim) {

  throw new Error(
    "Mount Gerizim 실제 Node 생성 실패"
  );
}


/* =====================================================
   JOSHUA → GERIZIM
   ===================================================== */

source = addRelation(
  source,
  "joshua",
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


/* =====================================================
   MOUNT EBAL → GERIZIM
   ===================================================== */

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


/* =====================================================
   BOOK → GERIZIM
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
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


/* =====================================================
   SHECHEM ↔ GERIZIM
   ===================================================== */

if (
  nodeExists(
    source,
    "shechem"
  )
) {

  source = addRelation(
    source,
    "mount-gerizim",
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
        "mount-gerizim",

      relationType:
        "RELATED_PLACE",

      label:
        "그리심산",
    }
  );
}


/* =====================================================
   BATTLE OF AI → GERIZIM
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
        "place",

      targetSlug:
        "mount-gerizim",

      relationType:
        "RELATED_PLACE",

      label:
        "그리심산",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalGerizim =
  findNodeRange(
    source,
    "mount-gerizim"
  );


const finalEbal =
  findNodeRange(
    source,
    "mount-ebal"
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


if (
  !finalGerizim ||
  !finalEbal ||
  !finalJoshua ||
  !finalBook
) {

  throw new Error(
    "최종 Mount Gerizim 검증 실패"
  );
}


const validations = [

  [
    "Gerizim actual slug",

    /^ {4}slug:\s*"mount-gerizim"\s*,?\s*$/m
      .test(
        finalGerizim.content
      ),
  ],

  [
    "Gerizim Type",

    finalGerizim.content.includes(
      'type: "place"'
    ),
  ],

  [
    "Gerizim → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalGerizim.content
      ),
  ],

  [
    "Gerizim → Ebal",

    /targetSlug\s*:\s*"mount-ebal"/
      .test(
        finalGerizim.content
      ),
  ],

  [
    "Gerizim → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalGerizim.content
      ),
  ],

  [
    "Ebal → Gerizim",

    /targetSlug\s*:\s*"mount-gerizim"/
      .test(
        finalEbal.content
      ),
  ],

  [
    "Joshua → Gerizim",

    /targetSlug\s*:\s*"mount-gerizim"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Book → Gerizim",

    /targetSlug\s*:\s*"mount-gerizim"/
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
  "SCRAPTURA MOUNT GERIZIM PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PLACE — MOUNT GERIZIM"
);

console.log(
  "Mount Gerizim ↔ Mount Ebal"
);

console.log(
  "Mount Gerizim ↔ Joshua"
);

console.log(
  "Mount Gerizim ↔ Book of Joshua"
);

console.log(
  "Shechem 존재 시 자동 연결"
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