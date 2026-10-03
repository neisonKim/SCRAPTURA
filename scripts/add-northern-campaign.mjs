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
  "content.before-northern-campaign.ts"
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

function escapeRegex(value) {
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
    escapeRegex(slug);

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

  if (relationsStart === -1) {
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
      "southern-campaign",

    type:
      "story",
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
   CREATE STORY — NORTHERN CAMPAIGN
   ===================================================== */

let northern =
  findNodeRange(
    source,
    "northern-campaign"
  );


if (!northern) {

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
        "southern-campaign",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 남부 전투",
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
   * OPTIONAL HAZOR
   */

  if (
    nodeExists(
      source,
      "hazor"
    )
  ) {
    relations.push({
      targetType:
        "place",

      targetSlug:
        "hazor",

      relationType:
        "RELATED_PLACE",

      label:
        "하솔",
    });
  }


  /*
   * OPTIONAL LAND DIVISION
   */

  if (
    nodeExists(
      source,
      "land-division"
    )
  ) {
    relations.push({
      targetType:
        "story",

      targetSlug:
        "land-division",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 땅 분배",
    });
  }


  const relationCode =
    relations
      .map(
        (relation) => `      {
        targetType: "${relation.targetType}",
        targetSlug: "${relation.targetSlug}",
        relationType: "${relation.relationType}",
        label: "${relation.label}",
      },`
      )
      .join(
        "\n\n"
      );


  const northernNode = `

  /* =====================================================
     STORY — NORTHERN CAMPAIGN
     ===================================================== */

  {
    type: "story",

    slug:
      "northern-campaign",

    titleKo:
      "가나안 북부 전투",

    titleEn:
      "The Northern Campaign",

    eyebrow:
      "STORIES · JOSHUA 11 · NORTHERN CANAAN",

    summary:
      "가나안 남부 전투 이후 하솔 왕 야빈을 중심으로 북부 지역의 여러 세력이 연합하고, 여호수아와 이스라엘 군대가 메롬 물가와 북부 지역에서 전투를 벌이는 이야기입니다.",

    overview:
      "여호수아 11장은 가나안 남부 지역의 전투 이후 북부 지역의 연합군과 충돌하는 과정을 기록합니다. 하솔 왕 야빈을 중심으로 여러 왕과 군대가 모이고, 여호수아는 북쪽으로 이동해 메롬 물가 부근에서 이들과 맞섭니다. 이후 하솔을 비롯한 북부 지역의 여러 성읍에 대한 이야기가 이어지고, 장 후반부에서는 여호수아의 군사 작전을 정리하는 요약이 나타납니다.",

    biblicalContext:
      "SCRAPTURA에서는 여호수아 11장을 Northern Campaign이라는 하나의 Story Node로 구성합니다. 개별 전투를 모두 별도의 콘텐츠로 분리하기보다 Southern Campaign 이후 북부 연합군과의 충돌, 하솔, 메롬 물가, 그리고 정복 서사의 요약을 하나의 흐름으로 보여 줍니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "THE NORTHERN COALITION",

        scripture:
          "Joshua 11:1–5",

        description:
          "하솔 왕 야빈을 중심으로 북부 지역의 여러 왕과 군대가 이스라엘에 대응하기 위해 연합합니다.",
      },


      {
        number:
          "02",

        title:
          "THE WATERS OF MEROM",

        scripture:
          "Joshua 11:6–9",

        description:
          "여호수아와 이스라엘 군대는 북부 연합군이 모인 메롬 물가로 이동해 전투를 벌입니다.",
      },


      {
        number:
          "03",

        title:
          "THE FALL OF HAZOR",

        scripture:
          "Joshua 11:10–11",

        description:
          "여호수아는 북부 연합의 중심으로 묘사되는 하솔을 공격하고 성을 불사릅니다.",
      },


      {
        number:
          "04",

        title:
          "THE NORTHERN CITIES",

        scripture:
          "Joshua 11:12–15",

        description:
          "본문은 북부 지역 여러 왕과 성읍에 대한 전투를 요약하며 모세에게 주어진 명령과 여호수아의 실행을 연결합니다.",
      },


      {
        number:
          "05",

        title:
          "A LONG CAMPAIGN",

        scripture:
          "Joshua 11:16–20",

        description:
          "여호수아의 전투가 가나안 여러 지역으로 확대되었으며 상당한 기간에 걸쳐 진행된 것으로 묘사됩니다.",
      },


      {
        number:
          "06",

        title:
          "THE ANAKIM",

        scripture:
          "Joshua 11:21–22",

        description:
          "본문은 산지 지역과 여러 성읍에 있던 아낙 자손에 대한 여호수아의 전투를 별도로 언급합니다.",
      },


      {
        number:
          "07",

        title:
          "THE LAND AT REST",

        scripture:
          "Joshua 11:23",

        description:
          "여호수아 11장은 주요 전투 구간을 정리하고 이후 땅을 지파들에게 분배하는 다음 단계로 이야기를 전환합니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 11:1–9",
      "Joshua 11:10–15",
      "Joshua 11:16–23",
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
    northernNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "STORY — NORTHERN CAMPAIGN 실제 Node 추가"
  );

}
else {

  if (
    !northern.content.includes(
      'type: "story"'
    )
  ) {
    throw new Error(
      'slug: "northern-campaign"가 존재하지만 type이 story가 아닙니다.'
    );
  }


  console.log(
    "STORY — NORTHERN CAMPAIGN 이미 존재"
  );
}


/* =====================================================
   VERIFY CREATED NODE
   ===================================================== */

northern =
  findNodeRange(
    source,
    "northern-campaign"
  );


if (!northern) {
  throw new Error(
    "Northern Campaign 실제 Node 생성 실패"
  );
}


/* =====================================================
   BACKLINKS
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {
    targetType:
      "story",

    targetSlug:
      "northern-campaign",

    relationType:
      "RELATED_STORY",

    label:
      "가나안 북부 전투",
  }
);


source = addRelation(
  source,
  "southern-campaign",
  {
    targetType:
      "story",

    targetSlug:
      "northern-campaign",

    relationType:
      "RELATED_STORY",

    label:
      "가나안 북부 전투",
  }
);


source = addRelation(
  source,
  "book-of-joshua",
  {
    targetType:
      "story",

    targetSlug:
      "northern-campaign",

    relationType:
      "RELATED_STORY",

    label:
      "가나안 북부 전투",
  }
);


/* =====================================================
   OPTIONAL HAZOR
   ===================================================== */

if (
  nodeExists(
    source,
    "hazor"
  )
) {

  source = addRelation(
    source,
    "northern-campaign",
    {
      targetType:
        "place",

      targetSlug:
        "hazor",

      relationType:
        "RELATED_PLACE",

      label:
        "하솔",
    }
  );


  source = addRelation(
    source,
    "hazor",
    {
      targetType:
        "story",

      targetSlug:
        "northern-campaign",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 북부 전투",
    }
  );
}


/* =====================================================
   OPTIONAL LAND DIVISION
   ===================================================== */

if (
  nodeExists(
    source,
    "land-division"
  )
) {

  source = addRelation(
    source,
    "northern-campaign",
    {
      targetType:
        "story",

      targetSlug:
        "land-division",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 땅 분배",
    }
  );


  source = addRelation(
    source,
    "land-division",
    {
      targetType:
        "story",

      targetSlug:
        "northern-campaign",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 북부 전투",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalNorthern =
  findNodeRange(
    source,
    "northern-campaign"
  );


const finalSouthern =
  findNodeRange(
    source,
    "southern-campaign"
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
  !finalNorthern ||
  !finalSouthern ||
  !finalJoshua ||
  !finalBook
) {
  throw new Error(
    "최종 Northern Campaign 검증 실패"
  );
}


const validations = [

  [
    "Northern Campaign slug",

    /^ {4}slug:\s*"northern-campaign"\s*,?\s*$/m
      .test(
        finalNorthern.content
      ),
  ],

  [
    "Northern Campaign type",

    finalNorthern.content.includes(
      'type: "story"'
    ),
  ],

  [
    "Northern Campaign scenes",

    finalNorthern.content.includes(
      "scenes: ["
    ),
  ],

  [
    "Northern → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalNorthern.content
      ),
  ],

  [
    "Northern → Southern",

    /targetSlug\s*:\s*"southern-campaign"/
      .test(
        finalNorthern.content
      ),
  ],

  [
    "Northern → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalNorthern.content
      ),
  ],

  [
    "Joshua → Northern",

    /targetSlug\s*:\s*"northern-campaign"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Southern → Northern",

    /targetSlug\s*:\s*"northern-campaign"/
      .test(
        finalSouthern.content
      ),
  ],

  [
    "Book → Northern",

    /targetSlug\s*:\s*"northern-campaign"/
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
    ([, result]) =>
      !result
  );


if (
  failed.length > 0
) {
  throw new Error(
    `검증 실패: ${
      failed
        .map(
          ([name]) => name
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
  "SCRAPTURA NORTHERN CAMPAIGN PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — NORTHERN CAMPAIGN"
);

console.log(
  "Story Scenes 7 stages"
);

console.log(
  "Northern Campaign ↔ Joshua"
);

console.log(
  "Northern Campaign ↔ Southern Campaign"
);

console.log(
  "Northern Campaign ↔ Book of Joshua"
);

console.log(
  "Hazor 존재 시 자동 연결"
);

console.log(
  "Land Division 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);