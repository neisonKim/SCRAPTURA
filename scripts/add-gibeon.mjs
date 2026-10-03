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
  "content.before-gibeon.ts"
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
   * 실제 ContentNode의 slug만 탐색
   *
   * slug: "gibeon"       O
   * targetSlug: "gibeon" X
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
   CREATE PLACE — GIBEON
   ===================================================== */

let gibeon =
  findNodeRange(
    source,
    "gibeon"
  );


if (!gibeon) {

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

  ];


  /*
   * GIBEONITE TREATY
   */

  if (
    nodeExists(
      source,
      "gibeonite-treaty"
    )
  ) {

    relations.push({
      targetType:
        "story",

      targetSlug:
        "gibeonite-treaty",

      relationType:
        "RELATED_STORY",

      label:
        "기브온 주민들과의 조약",
    });
  }


  /*
   * SOUTHERN CAMPAIGN
   */

  if (
    nodeExists(
      source,
      "southern-campaign"
    )
  ) {

    relations.push({
      targetType:
        "story",

      targetSlug:
        "southern-campaign",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 남부 전투",
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


  const gibeonNode = `

  /* =====================================================
     PLACE — GIBEON
     ===================================================== */

  {
    type: "place",

    slug: "gibeon",

    titleKo: "기브온",

    titleEn: "Gibeon",

    eyebrow:
      "PLACES · CANAAN · JOSHUA 9–10",

    summary:
      "여호수아 9장에서 기브온 주민들이 이스라엘과 조약을 맺는 사건의 중심 장소이며, 이후 여호수아 10장의 가나안 남부 전투로 이어지는 중요한 성읍입니다.",

    overview:
      "기브온은 여호수아서 9–10장에서 중요한 역할을 하는 장소입니다. 기브온 주민들은 자신들이 먼 지역에서 온 사람들처럼 꾸미고 길갈의 이스라엘 진영을 찾아와 조약을 요청합니다. 이후 주변 왕들이 기브온을 공격하자 기브온 주민들은 여호수아에게 도움을 요청하고, 이야기는 남부 지역의 전투로 확대됩니다.",

    biblicalContext:
      "SCRAPTURA에서 기브온은 여호수아서 전반부의 전투 중심 이야기에서 외교와 조약, 그리고 가나안 남부 전투로 넘어가는 연결 지점입니다. Joshua, Gilgal, Gibeonite Treaty, Southern Campaign을 하나의 서사 흐름으로 연결하는 핵심 Place Node로 사용합니다.",


    /* =================================================
       KEY EVENT
       ================================================= */

    keyEvent: {

      title:
        "The Treaty with the Gibeonites",

      scripture:
        "Joshua 9:3–27",

      description:
        "기브온 주민들이 먼 지역에서 온 사람들처럼 꾸미고 이스라엘 진영을 찾아와 조약을 요청하며, 이후 그들의 실제 정체가 밝혀지는 사건입니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 9:3–27",
      "Joshua 10:1–15",
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
    gibeonNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PLACE — GIBEON 실제 Node 추가"
  );

}
else {

  if (
    !gibeon.content.includes(
      'type: "place"'
    )
  ) {

    throw new Error(
      'slug: "gibeon"가 존재하지만 type이 place가 아닙니다.'
    );
  }


  console.log(
    "PLACE — GIBEON 이미 존재"
  );
}


/* =====================================================
   VERIFY GIBEON
   ===================================================== */

gibeon =
  findNodeRange(
    source,
    "gibeon"
  );


if (!gibeon) {

  throw new Error(
    "Gibeon 실제 Node 생성 실패"
  );
}


/* =====================================================
   JOSHUA → GIBEON
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {

    targetType:
      "place",

    targetSlug:
      "gibeon",

    relationType:
      "RELATED_PLACE",

    label:
      "기브온",
  }
);


/* =====================================================
   BOOK OF JOSHUA → GIBEON
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
  {

    targetType:
      "place",

    targetSlug:
      "gibeon",

    relationType:
      "RELATED_PLACE",

    label:
      "기브온",
  }
);


/* =====================================================
   GILGAL → GIBEON
   ===================================================== */

source = addRelation(
  source,
  "gilgal",
  {

    targetType:
      "place",

    targetSlug:
      "gibeon",

    relationType:
      "RELATED_PLACE",

    label:
      "기브온",
  }
);


/* =====================================================
   OPTIONAL GIBEONITE TREATY
   ===================================================== */

if (
  nodeExists(
    source,
    "gibeonite-treaty"
  )
) {

  source = addRelation(
    source,
    "gibeon",
    {

      targetType:
        "story",

      targetSlug:
        "gibeonite-treaty",

      relationType:
        "RELATED_STORY",

      label:
        "기브온 주민들과의 조약",
    }
  );


  source = addRelation(
    source,
    "gibeonite-treaty",
    {

      targetType:
        "place",

      targetSlug:
        "gibeon",

      relationType:
        "RELATED_PLACE",

      label:
        "기브온",
    }
  );
}


/* =====================================================
   OPTIONAL SOUTHERN CAMPAIGN
   ===================================================== */

if (
  nodeExists(
    source,
    "southern-campaign"
  )
) {

  source = addRelation(
    source,
    "gibeon",
    {

      targetType:
        "story",

      targetSlug:
        "southern-campaign",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 남부 전투",
    }
  );


  source = addRelation(
    source,
    "southern-campaign",
    {

      targetType:
        "place",

      targetSlug:
        "gibeon",

      relationType:
        "RELATED_PLACE",

      label:
        "기브온",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalGibeon =
  findNodeRange(
    source,
    "gibeon"
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


const finalGilgal =
  findNodeRange(
    source,
    "gilgal"
  );


if (
  !finalGibeon ||
  !finalJoshua ||
  !finalBook ||
  !finalGilgal
) {

  throw new Error(
    "최종 Gibeon 검증 실패"
  );
}


const validations = [

  [
    "Gibeon actual slug",

    /^ {4}slug:\s*"gibeon"\s*,?\s*$/m
      .test(
        finalGibeon.content
      ),
  ],

  [
    "Gibeon Type",

    finalGibeon.content.includes(
      'type: "place"'
    ),
  ],

  [
    "Gibeon → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalGibeon.content
      ),
  ],

  [
    "Gibeon → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalGibeon.content
      ),
  ],

  [
    "Gibeon → Gilgal",

    /targetSlug\s*:\s*"gilgal"/
      .test(
        finalGibeon.content
      ),
  ],

  [
    "Joshua → Gibeon",

    /targetSlug\s*:\s*"gibeon"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Book → Gibeon",

    /targetSlug\s*:\s*"gibeon"/
      .test(
        finalBook.content
      ),
  ],

  [
    "Gilgal → Gibeon",

    /targetSlug\s*:\s*"gibeon"/
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
  "SCRAPTURA GIBEON PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PLACE — GIBEON"
);

console.log(
  "Gibeon ↔ Joshua"
);

console.log(
  "Gibeon ↔ Book of Joshua"
);

console.log(
  "Gibeon ↔ Gilgal"
);

console.log(
  "Gibeonite Treaty 존재 시 자동 연결"
);

console.log(
  "Southern Campaign 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);