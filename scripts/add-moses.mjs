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
  "content.before-moses-fixed.ts"
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

/*
 * 실제:
 *
 * slug: "moses"
 *
 * 만 찾습니다.
 *
 * targetSlug: "moses"
 *
 * 는 노드로 인식하지 않습니다.
 */

function findNodeRange(
  fullSource,
  slug
) {

  const escapedSlug =
    slug.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
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
   RELATION EXISTS
   ===================================================== */

function hasRelation(
  nodeContent,
  targetSlug
) {

  const escaped =
    targetSlug.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
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


  if (
    relationsStart === -1
  ) {

    throw new Error(
      `${nodeSlug}의 relations 배열을 찾지 못했습니다.`
    );
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

const exodusBefore =
  findNodeRange(
    source,
    "exodus"
  );


const egyptBefore =
  findNodeRange(
    source,
    "egypt"
  );


if (!exodusBefore) {

  throw new Error(
    '실제 BOOK 노드 slug: "exodus"를 찾지 못했습니다.'
  );
}


if (
  !exodusBefore.content.includes(
    'type: "book"'
  )
) {

  throw new Error(
    "exodus 노드는 존재하지만 type이 book이 아닙니다."
  );
}


if (!egyptBefore) {

  throw new Error(
    '실제 PLACE 노드 slug: "egypt"를 찾지 못했습니다.'
  );
}


if (
  !egyptBefore.content.includes(
    'type: "place"'
  )
) {

  throw new Error(
    "egypt 노드는 존재하지만 type이 place가 아닙니다."
  );
}


console.log(
  "Exodus 실제 Book 노드 확인"
);

console.log(
  "Egypt 실제 Place 노드 확인"
);


/* =====================================================
   CREATE MOSES FIRST
   ===================================================== */

let moses =
  findNodeRange(
    source,
    "moses"
  );


if (!moses) {

  const mosesNode = `

  /* =====================================================
     PERSON — MOSES
     ===================================================== */

  {
    type: "person",

    slug: "moses",

    titleKo: "모세",

    titleEn: "Moses",

    eyebrow:
      "PEOPLE · EXODUS · WILDERNESS JOURNEY",

    summary:
      "이집트에서 태어나 미디안 광야를 거쳐 이스라엘 자손을 이끌고 출애굽한 인물로, 출애굽기와 광야 시대의 중심 인물입니다.",

    overview:
      "모세의 이야기는 이집트에서의 출생으로 시작합니다. 그는 성장한 뒤 미디안으로 떠나고 광야에서 부르심을 받은 후 다시 이집트로 돌아갑니다. 이후 파라오와의 대면, 출애굽, 바다를 건너는 사건, 광야 여정, 시내산 언약과 성막 건립에 이르기까지 출애굽기의 주요 사건을 연결하는 중심 인물로 등장합니다.",

    biblicalContext:
      "모세는 출애굽기뿐 아니라 레위기, 민수기, 신명기로 이어지는 광야 시대의 중심 인물입니다. SCRAPTURA에서는 Egypt와 Exodus에서 시작해 이후 Sinai, Wilderness, Ten Commandments 등의 콘텐츠를 연결하는 핵심 Person Node 역할을 합니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number: "01",

        title:
          "THE CHILD OF THE NILE",

        scripture:
          "Exodus 2:1–10",

        description:
          "모세는 이스라엘 가정에서 태어나 나일강과 관련된 사건을 거쳐 파라오의 딸에게 발견되고 이집트 왕실 환경에서 성장합니다.",
      },


      {
        number: "02",

        title:
          "FLIGHT TO MIDIAN",

        scripture:
          "Exodus 2:11–25",

        description:
          "성인이 된 모세는 이집트를 떠나 미디안으로 이동하고 그곳에서 새로운 삶을 시작합니다.",
      },


      {
        number: "03",

        title:
          "THE BURNING BUSH",

        scripture:
          "Exodus 3:1–4:17",

        description:
          "광야에서 양 떼를 돌보던 모세는 불붙는 떨기나무 장면에서 부르심을 받고 이집트로 돌아가라는 사명을 받습니다.",
      },


      {
        number: "04",

        title:
          "RETURN TO EGYPT",

        scripture:
          "Exodus 4:18–31",

        description:
          "모세는 미디안을 떠나 이집트로 돌아가고 아론과 함께 이스라엘 장로들에게 자신의 사명을 전합니다.",
      },


      {
        number: "05",

        title:
          "BEFORE PHARAOH",

        scripture:
          "Exodus 5–11",

        description:
          "모세와 아론은 파라오 앞에 서서 이스라엘 자손을 보내 달라고 요구하고 긴 대립이 이어집니다.",
      },


      {
        number: "06",

        title:
          "PASSOVER & EXODUS",

        scripture:
          "Exodus 12–13",

        description:
          "유월절 사건 이후 이스라엘 자손이 이집트를 떠나며 모세는 공동체의 여정을 이끕니다.",
      },


      {
        number: "07",

        title:
          "THE SEA",

        scripture:
          "Exodus 14–15",

        description:
          "이스라엘 자손은 바다 앞에서 위기를 맞고 그 사건을 지나 본격적인 광야 여정으로 들어갑니다.",
      },


      {
        number: "08",

        title:
          "THE WILDERNESS",

        scripture:
          "Exodus 16–18",

        description:
          "광야에서 음식과 물, 공동체 운영을 둘러싼 여러 문제가 발생하며 모세는 공동체를 이끕니다.",
      },


      {
        number: "09",

        title:
          "MOUNT SINAI",

        scripture:
          "Exodus 19–24",

        description:
          "이스라엘 공동체가 시내산에 도착하고 모세를 중심으로 언약과 계명에 관한 주요 사건이 전개됩니다.",
      },


      {
        number: "10",

        title:
          "THE GOLDEN CALF",

        scripture:
          "Exodus 32–34",

        description:
          "금송아지 사건으로 공동체에 위기가 발생하고 모세는 이후의 언약 갱신 과정에서 핵심 역할을 합니다.",
      },


      {
        number: "11",

        title:
          "THE TABERNACLE",

        scripture:
          "Exodus 35–40",

        description:
          "성막 제작이 진행되고 출애굽기의 마지막에는 성막이 완성되면서 이후 광야 시대를 위한 기반이 마련됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-moses.jpg",


    scripture: [
      "Exodus 2–4",
      "Exodus 5–15",
      "Exodus 16–24",
      "Exodus 32–40",
    ],


    relations: [

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


      {
        targetType:
          "place",

        targetSlug:
          "egypt",

        relationType:
          "RELATED_PLACE",

        label:
          "이집트",
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
    mosesNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PERSON — MOSES 실제 노드 추가"
  );

}
else {

  console.log(
    "PERSON — MOSES 실제 노드가 이미 존재"
  );
}


/* =====================================================
   VERIFY MOSES
   ===================================================== */

moses =
  findNodeRange(
    source,
    "moses"
  );


if (!moses) {

  throw new Error(
    "Moses 실제 노드 생성 실패"
  );
}


/* =====================================================
   EXODUS → MOSES
   ===================================================== */

source = addRelation(
  source,
  "exodus",
  {
    targetType:
      "person",

    targetSlug:
      "moses",

    relationType:
      "RELATED_PERSON",

    label:
      "모세",
  }
);


/* =====================================================
   EGYPT → MOSES
   ===================================================== */

source = addRelation(
  source,
  "egypt",
  {
    targetType:
      "person",

    targetSlug:
      "moses",

    relationType:
      "RELATED_PERSON",

    label:
      "모세",
  }
);


/* =====================================================
   SINAI → MOSES
   기존 노드가 있을 때만
   ===================================================== */

if (
  findNodeRange(
    source,
    "sinai"
  )
) {

  source = addRelation(
    source,
    "sinai",
    {
      targetType:
        "person",

      targetSlug:
        "moses",

      relationType:
        "RELATED_PERSON",

      label:
        "모세",
    }
  );
}


/* =====================================================
   MIDIAN → MOSES
   기존 노드가 있을 때만
   ===================================================== */

if (
  findNodeRange(
    source,
    "midian"
  )
) {

  source = addRelation(
    source,
    "midian",
    {
      targetType:
        "person",

      targetSlug:
        "moses",

      relationType:
        "RELATED_PERSON",

      label:
        "모세",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalMoses =
  findNodeRange(
    source,
    "moses"
  );


const finalExodus =
  findNodeRange(
    source,
    "exodus"
  );


const finalEgypt =
  findNodeRange(
    source,
    "egypt"
  );


if (
  !finalMoses ||
  !finalExodus ||
  !finalEgypt
) {

  throw new Error(
    "최종 노드 검증 실패"
  );
}


const validations = [

  [
    "Moses actual slug",
    /^[ \t]*slug:\s*"moses"\s*,?\s*$/m
      .test(
        finalMoses.content
      ),
  ],

  [
    "Moses Type",
    finalMoses.content.includes(
      'type: "person"'
    ),
  ],

  [
    "Moses Character Journey",
    finalMoses.content.includes(
      "characterJourney: ["
    ),
  ],

  [
    "Moses → Exodus",
    /targetSlug\s*:\s*"exodus"/
      .test(
        finalMoses.content
      ),
  ],

  [
    "Moses → Egypt",
    /targetSlug\s*:\s*"egypt"/
      .test(
        finalMoses.content
      ),
  ],

  [
    "Exodus → Moses",
    /targetSlug\s*:\s*"moses"/
      .test(
        finalExodus.content
      ),
  ],

  [
    "Egypt → Moses",
    /targetSlug\s*:\s*"moses"/
      .test(
        finalEgypt.content
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
  "SCRAPTURA MOSES FIXED PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PERSON — MOSES 실제 Node 생성"
);

console.log(
  "Moses → Exodus"
);

console.log(
  "Moses → Egypt"
);

console.log(
  "Exodus → Moses"
);

console.log(
  "Egypt → Moses"
);

console.log(
  "Character Journey 11 stages"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);