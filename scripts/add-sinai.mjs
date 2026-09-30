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
  "content.before-sinai.ts"
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
 * 실제 최상위:
 *
 * slug: "sinai"
 *
 * 만 찾습니다.
 *
 * targetSlug: "sinai"
 *
 * 는 실제 노드로 인식하지 않습니다.
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
   RELATION CHECK
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
   REQUIRED NODE CHECK
   ===================================================== */

const exodusBefore =
  findNodeRange(
    source,
    "exodus"
  );


const mosesBefore =
  findNodeRange(
    source,
    "moses"
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
    "Exodus 노드는 있지만 type이 book이 아닙니다."
  );
}


if (!mosesBefore) {

  throw new Error(
    '실제 PERSON 노드 slug: "moses"를 찾지 못했습니다.'
  );
}


if (
  !mosesBefore.content.includes(
    'type: "person"'
  )
) {

  throw new Error(
    "Moses 노드는 있지만 type이 person이 아닙니다."
  );
}


console.log(
  "Exodus 실제 Book 노드 확인"
);

console.log(
  "Moses 실제 Person 노드 확인"
);


/* =====================================================
   CREATE SINAI
   ===================================================== */

let sinai =
  findNodeRange(
    source,
    "sinai"
  );


if (!sinai) {

  const sinaiNode = `

  /* =====================================================
     PLACE — SINAI
     ===================================================== */

  {
    type: "place",

    slug: "sinai",

    titleKo: "시내산",

    titleEn: "Mount Sinai",

    eyebrow:
      "PLACES · EXODUS · WILDERNESS",

    summary:
      "출애굽 이후 이스라엘 공동체가 도착하여 언약과 계명을 받는 사건이 전개되는 산으로, 출애굽기 광야 서사의 핵심 장소입니다.",

    overview:
      "출애굽기에서 이스라엘 자손은 이집트를 떠난 뒤 광야를 지나 시내산에 도착합니다. 이곳에서 모세가 산에 오르고 언약과 계명에 관한 핵심 장면들이 전개됩니다. 이후 성막과 공동체 규례에 관한 이야기 역시 시내산을 중심으로 이어집니다.",

    biblicalContext:
      "시내산은 출애굽기 19장 이후의 중심 무대입니다. 성경 본문에서는 이스라엘 공동체의 언약, 계명, 금송아지 사건, 언약 갱신과 연결됩니다. 시내산의 정확한 현대 지리적 위치에 대해서는 여러 견해가 있으므로 SCRAPTURA에서는 특정 현대 위치를 단정하지 않고 성경 본문에서의 역할을 중심으로 다룹니다.",

    keyEvent: {

      title:
        "Israel Arrives at Mount Sinai",

      scripture:
        "Exodus 19:1–6",

      description:
        "이스라엘 자손은 이집트를 떠난 뒤 광야를 지나 시내산에 도착하고, 모세가 산에 올라가는 장면을 시작으로 언약 서사가 전개됩니다.",
    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Exodus 19–24",
      "Exodus 32–34",
      "Exodus 40",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "moses",

        relationType:
          "RELATED_PERSON",

        label:
          "모세",
      },


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
    sinaiNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PLACE — SINAI 실제 Node 추가"
  );

}
else {

  console.log(
    "PLACE — SINAI 실제 Node가 이미 존재"
  );
}


/* =====================================================
   VERIFY SINAI
   ===================================================== */

sinai =
  findNodeRange(
    source,
    "sinai"
  );


if (!sinai) {

  throw new Error(
    "Sinai 실제 노드 생성 실패"
  );
}


/* =====================================================
   MOSES → SINAI
   ===================================================== */

source = addRelation(
  source,
  "moses",
  {

    targetType:
      "place",

    targetSlug:
      "sinai",

    relationType:
      "RELATED_PLACE",

    label:
      "시내산",
  }
);


/* =====================================================
   EXODUS → SINAI
   ===================================================== */

source = addRelation(
  source,
  "exodus",
  {

    targetType:
      "place",

    targetSlug:
      "sinai",

    relationType:
      "RELATED_PLACE",

    label:
      "시내산",
  }
);


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalSinai =
  findNodeRange(
    source,
    "sinai"
  );


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


if (
  !finalSinai ||
  !finalMoses ||
  !finalExodus
) {

  throw new Error(
    "최종 노드 검증 실패"
  );
}


const validations = [

  [
    "Sinai actual slug",
    /^[ \t]*slug:\s*"sinai"\s*,?\s*$/m
      .test(
        finalSinai.content
      ),
  ],

  [
    "Sinai Type",
    finalSinai.content.includes(
      'type: "place"'
    ),
  ],

  [
    "Sinai → Moses",
    /targetSlug\s*:\s*"moses"/
      .test(
        finalSinai.content
      ),
  ],

  [
    "Sinai → Exodus",
    /targetSlug\s*:\s*"exodus"/
      .test(
        finalSinai.content
      ),
  ],

  [
    "Moses → Sinai",
    /targetSlug\s*:\s*"sinai"/
      .test(
        finalMoses.content
      ),
  ],

  [
    "Exodus → Sinai",
    /targetSlug\s*:\s*"sinai"/
      .test(
        finalExodus.content
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
  "SCRAPTURA SINAI PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PLACE — SINAI 실제 Node 생성"
);

console.log(
  "Sinai → Moses"
);

console.log(
  "Sinai → Exodus"
);

console.log(
  "Moses → Sinai"
);

console.log(
  "Exodus → Sinai"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);