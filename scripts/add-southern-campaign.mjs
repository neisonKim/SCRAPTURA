import fs from "node:fs";
import path from "node:path";

const contentPath = path.join(process.cwd(), "data", "content.ts");
const backupPath = path.join(
  process.cwd(),
  "data",
  "content.before-southern-campaign.ts"
);

if (!fs.existsSync(contentPath)) {
  throw new Error("data/content.ts 파일을 찾을 수 없습니다.");
}

let source = fs.readFileSync(contentPath, "utf8");

fs.writeFileSync(backupPath, source, "utf8");

console.log("백업 생성:", backupPath);


/* =====================================================
   HELPERS
   ===================================================== */

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


function findNodeRange(fullSource, slug) {
  const escapedSlug = escapeRegex(slug);

  const slugRegex = new RegExp(
    `^ {4}slug:\\s*"${escapedSlug}"\\s*,?\\s*$`,
    "m"
  );

  const match = slugRegex.exec(fullSource);

  if (!match) {
    return null;
  }

  const slugIndex = match.index;

  const start = fullSource.lastIndexOf(
    "\n  {",
    slugIndex
  );

  if (start === -1) {
    throw new Error(
      `${slug} 노드 시작 위치를 찾지 못했습니다.`
    );
  }

  const afterSlug = fullSource.slice(slugIndex);

  const endMatch = /\r?\n {2}\},/.exec(afterSlug);

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
    content: fullSource.slice(start, end),
  };
}


function nodeExists(fullSource, slug) {
  return Boolean(
    findNodeRange(fullSource, slug)
  );
}


function hasRelation(nodeContent, targetSlug) {
  const escaped = escapeRegex(targetSlug);

  return new RegExp(
    `targetSlug\\s*:\\s*"${escaped}"`
  ).test(nodeContent);
}


function findRelationsEnd(
  nodeContent,
  relationsStart
) {
  const rest =
    nodeContent.slice(relationsStart);

  const match =
    /\r?\n {4}\],/.exec(rest);

  if (!match) {
    return -1;
  }

  return relationsStart + match.index;
}


function addRelation(
  fullSource,
  nodeSlug,
  relation
) {
  const node =
    findNodeRange(fullSource, nodeSlug);

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
    node.content.indexOf("relations: [");

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
    node.content.slice(0, relationsEnd) +
    relationCode +
    node.content.slice(relationsEnd);

  console.log(
    `${nodeSlug} → ${relation.targetSlug} 관계 추가`
  );

  return (
    fullSource.slice(0, node.start) +
    updatedNode +
    fullSource.slice(node.end)
  );
}


/* =====================================================
   REQUIRED NODES
   ===================================================== */

const requiredNodes = [
  {
    slug: "joshua",
    type: "person",
  },
  {
    slug: "gibeon",
    type: "place",
  },
  {
    slug: "gilgal",
    type: "place",
  },
  {
    slug: "gibeonite-treaty",
    type: "story",
  },
  {
    slug: "book-of-joshua",
    type: "book",
  },
];


for (const required of requiredNodes) {
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
   CREATE SOUTHERN CAMPAIGN
   ===================================================== */

let southern =
  findNodeRange(
    source,
    "southern-campaign"
  );


if (!southern) {
  const relations = [
    {
      targetType: "person",
      targetSlug: "joshua",
      relationType: "RELATED_PERSON",
      label: "여호수아",
    },
    {
      targetType: "place",
      targetSlug: "gibeon",
      relationType: "RELATED_PLACE",
      label: "기브온",
    },
    {
      targetType: "place",
      targetSlug: "gilgal",
      relationType: "RELATED_PLACE",
      label: "길갈",
    },
    {
      targetType: "story",
      targetSlug: "gibeonite-treaty",
      relationType: "RELATED_STORY",
      label: "기브온 주민들과의 조약",
    },
    {
      targetType: "book",
      targetSlug: "book-of-joshua",
      relationType: "RELATED_BOOK",
      label: "여호수아",
    },
  ];


  if (
    nodeExists(
      source,
      "northern-campaign"
    )
  ) {
    relations.push({
      targetType: "story",
      targetSlug: "northern-campaign",
      relationType: "RELATED_STORY",
      label: "가나안 북부 전투",
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
      .join("\n\n");


  const southernNode = `

  /* =====================================================
     STORY — SOUTHERN CAMPAIGN
     ===================================================== */

  {
    type: "story",

    slug: "southern-campaign",

    titleKo: "가나안 남부 전투",

    titleEn: "The Southern Campaign",

    eyebrow:
      "STORIES · JOSHUA 10 · SOUTHERN CANAAN",

    summary:
      "기브온이 공격을 받자 여호수아가 길갈에서 군대를 이끌고 올라가 기브온을 지원하고, 이후 가나안 남부 지역의 여러 성읍을 상대로 전투가 확대되는 이야기입니다.",

    overview:
      "여호수아 10장은 기브온과 이스라엘의 조약이 새로운 군사적 충돌로 이어지는 과정을 보여 줍니다. 예루살렘 왕을 중심으로 한 여러 왕들이 기브온을 공격하자 기브온 주민들은 길갈에 있던 여호수아에게 도움을 요청합니다. 여호수아는 군대를 이끌고 기브온으로 이동하며, 전투는 이후 가나안 남부 여러 지역으로 확대됩니다.",

    biblicalContext:
      "SCRAPTURA에서는 여호수아 10장의 여러 전투를 개별 전투마다 분리하기보다 Southern Campaign이라는 하나의 Story Node로 구성합니다. 이를 통해 Gibeonite Treaty에서 시작된 사건이 Gibeon 전투와 남부 지역의 군사 작전으로 확대되는 흐름을 한 번에 탐색할 수 있습니다.",


    scenes: [

      {
        number: "01",

        title:
          "THE FIVE KINGS",

        scripture:
          "Joshua 10:1–5",

        description:
          "예루살렘 왕을 중심으로 여러 왕들이 기브온을 공격하기 위해 연합합니다.",
      },

      {
        number: "02",

        title:
          "A MESSAGE FROM GIBEON",

        scripture:
          "Joshua 10:6",

        description:
          "기브온 주민들은 길갈에 있는 여호수아에게 도움을 요청합니다.",
      },

      {
        number: "03",

        title:
          "THE MARCH FROM GILGAL",

        scripture:
          "Joshua 10:7–9",

        description:
          "여호수아와 군대가 길갈에서 출발해 기브온으로 이동합니다.",
      },

      {
        number: "04",

        title:
          "THE BATTLE AT GIBEON",

        scripture:
          "Joshua 10:10–11",

        description:
          "전투가 기브온에서 시작되고 적군은 여러 방향으로 흩어집니다.",
      },

      {
        number: "05",

        title:
          "SUN AND MOON",

        scripture:
          "Joshua 10:12–14",

        description:
          "본문은 전투 중 여호수아가 해와 달을 향해 말하는 특별한 장면을 기록합니다.",
      },

      {
        number: "06",

        title:
          "THE FIVE KINGS",

        scripture:
          "Joshua 10:16–27",

        description:
          "도망한 다섯 왕이 막게다의 굴에 숨고 이후 여호수아 앞에 나오게 됩니다.",
      },

      {
        number: "07",

        title:
          "THE SOUTHERN CITIES",

        scripture:
          "Joshua 10:28–39",

        description:
          "이야기는 막게다, 립나, 라기스, 에글론, 헤브론, 드빌 등 남부 지역의 여러 성읍으로 확대됩니다.",
      },

      {
        number: "08",

        title:
          "RETURN TO GILGAL",

        scripture:
          "Joshua 10:40–43",

        description:
          "남부 지역의 전투를 마친 여호수아와 이스라엘 군대는 길갈의 진영으로 돌아옵니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 10:1–15",
      "Joshua 10:16–27",
      "Joshua 10:28–43",
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
    beforeGetNode.lastIndexOf("];");


  if (nodesEnd === -1) {
    throw new Error(
      "nodes 배열 끝을 찾지 못했습니다."
    );
  }


  source =
    source.slice(0, nodesEnd) +
    southernNode +
    "\n" +
    source.slice(nodesEnd);


  console.log(
    "STORY — SOUTHERN CAMPAIGN 실제 Node 추가"
  );
}
else {
  if (
    !southern.content.includes(
      'type: "story"'
    )
  ) {
    throw new Error(
      'slug: "southern-campaign"가 존재하지만 type이 story가 아닙니다.'
    );
  }

  console.log(
    "STORY — SOUTHERN CAMPAIGN 이미 존재"
  );
}


/* =====================================================
   VERIFY CREATED NODE
   ===================================================== */

southern =
  findNodeRange(
    source,
    "southern-campaign"
  );


if (!southern) {
  throw new Error(
    "Southern Campaign 실제 Node 생성 실패"
  );
}


/* =====================================================
   BACKLINKS
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {
    targetType: "story",
    targetSlug: "southern-campaign",
    relationType: "RELATED_STORY",
    label: "가나안 남부 전투",
  }
);


source = addRelation(
  source,
  "gibeon",
  {
    targetType: "story",
    targetSlug: "southern-campaign",
    relationType: "RELATED_STORY",
    label: "가나안 남부 전투",
  }
);


source = addRelation(
  source,
  "gilgal",
  {
    targetType: "story",
    targetSlug: "southern-campaign",
    relationType: "RELATED_STORY",
    label: "가나안 남부 전투",
  }
);


source = addRelation(
  source,
  "gibeonite-treaty",
  {
    targetType: "story",
    targetSlug: "southern-campaign",
    relationType: "RELATED_STORY",
    label: "가나안 남부 전투",
  }
);


source = addRelation(
  source,
  "book-of-joshua",
  {
    targetType: "story",
    targetSlug: "southern-campaign",
    relationType: "RELATED_STORY",
    label: "가나안 남부 전투",
  }
);


/* =====================================================
   OPTIONAL NEXT STORY
   ===================================================== */

if (
  nodeExists(
    source,
    "northern-campaign"
  )
) {
  source = addRelation(
    source,
    "southern-campaign",
    {
      targetType: "story",
      targetSlug: "northern-campaign",
      relationType: "RELATED_STORY",
      label: "가나안 북부 전투",
    }
  );

  source = addRelation(
    source,
    "northern-campaign",
    {
      targetType: "story",
      targetSlug: "southern-campaign",
      relationType: "RELATED_STORY",
      label: "가나안 남부 전투",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

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

const finalGibeon =
  findNodeRange(
    source,
    "gibeon"
  );

const finalGilgal =
  findNodeRange(
    source,
    "gilgal"
  );

const finalTreaty =
  findNodeRange(
    source,
    "gibeonite-treaty"
  );

const finalBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (
  !finalSouthern ||
  !finalJoshua ||
  !finalGibeon ||
  !finalGilgal ||
  !finalTreaty ||
  !finalBook
) {
  throw new Error(
    "최종 Southern Campaign 검증 실패"
  );
}


const validations = [
  [
    "Southern Campaign slug",

    /^ {4}slug:\s*"southern-campaign"\s*,?\s*$/m
      .test(finalSouthern.content),
  ],

  [
    "Southern Campaign type",

    finalSouthern.content.includes(
      'type: "story"'
    ),
  ],

  [
    "Scenes",

    finalSouthern.content.includes(
      "scenes: ["
    ),
  ],

  [
    "Southern → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(finalSouthern.content),
  ],

  [
    "Southern → Gibeon",

    /targetSlug\s*:\s*"gibeon"/
      .test(finalSouthern.content),
  ],

  [
    "Southern → Gilgal",

    /targetSlug\s*:\s*"gilgal"/
      .test(finalSouthern.content),
  ],

  [
    "Southern → Treaty",

    /targetSlug\s*:\s*"gibeonite-treaty"/
      .test(finalSouthern.content),
  ],

  [
    "Southern → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(finalSouthern.content),
  ],

  [
    "Joshua → Southern",

    /targetSlug\s*:\s*"southern-campaign"/
      .test(finalJoshua.content),
  ],

  [
    "Gibeon → Southern",

    /targetSlug\s*:\s*"southern-campaign"/
      .test(finalGibeon.content),
  ],

  [
    "Treaty → Southern",

    /targetSlug\s*:\s*"southern-campaign"/
      .test(finalTreaty.content),
  ],

  [
    "Book → Southern",

    /targetSlug\s*:\s*"southern-campaign"/
      .test(finalBook.content),
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
    ([, result]) => !result
  );


if (failed.length > 0) {
  throw new Error(
    `검증 실패: ${
      failed
        .map(([name]) => name)
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
  "SCRAPTURA SOUTHERN CAMPAIGN PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — SOUTHERN CAMPAIGN"
);

console.log(
  "Story Scenes 8 stages"
);

console.log(
  "Southern Campaign ↔ Joshua"
);

console.log(
  "Southern Campaign ↔ Gibeon"
);

console.log(
  "Southern Campaign ↔ Gilgal"
);

console.log(
  "Southern Campaign ↔ Gibeonite Treaty"
);

console.log(
  "Southern Campaign ↔ Book of Joshua"
);

console.log(
  "Northern Campaign 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);