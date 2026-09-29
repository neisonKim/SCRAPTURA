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
  "content.before-exodus-fixed.ts"
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
   STRICT TOP-LEVEL NODE FINDER
   ===================================================== */

/*
 * 중요:
 *
 * slug: "exodus"
 *
 * 만 찾습니다.
 *
 * targetSlug: "exodus"
 *
 * 는 절대 실제 노드로 인식하지 않습니다.
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


  /*
   * ContentNode 최상위 slug는
   * 정확히 4칸 들여쓰기되어 있다는
   * 현재 content.ts 구조를 사용합니다.
   */

  const slugRegex =
    new RegExp(
      `^ {4}slug:\\s*"${escapedSlug}"\\s*,?\\r?$`,
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


  /*
   * 해당 최상위 객체의 시작
   */

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


  /*
   * 해당 최상위 객체의 종료
   */

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


  /*
   * 이미 동일 관계가 있으면 유지
   */

  const exactTargetRegex =
    new RegExp(
      `targetSlug:\\s*"${relation.targetSlug}"`
    );


  if (
    exactTargetRegex.test(
      node.content
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

    throw new Error(
      `${nodeSlug}의 relations 배열을 찾지 못했습니다.`
    );
  }


  const relationsEnd =
    node.content.indexOf(
      "\n    ],",
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
   REQUIRED CURRENT NODES
   ===================================================== */

const genesisBefore =
  findNodeRange(
    source,
    "genesis"
  );


const egyptBefore =
  findNodeRange(
    source,
    "egypt"
  );


if (!genesisBefore) {

  throw new Error(
    "실제 Genesis 노드를 찾지 못했습니다."
  );
}


if (!egyptBefore) {

  throw new Error(
    "실제 Egypt 노드를 찾지 못했습니다."
  );
}


console.log(
  "Genesis 실제 노드 확인"
);

console.log(
  "Egypt 실제 노드 확인"
);


/* =====================================================
   CREATE EXODUS NODE FIRST
   ===================================================== */

let exodus =
  findNodeRange(
    source,
    "exodus"
  );


if (!exodus) {

  const exodusNode = `

  /* =====================================================
     BOOK — EXODUS
     ===================================================== */

  {
    type: "book",

    slug: "exodus",

    titleKo: "출애굽기",

    titleEn: "Exodus",

    eyebrow:
      "BIBLE · OLD TESTAMENT · TORAH",

    summary:
      "이집트에 거주하던 이스라엘 자손의 이야기에서 시작해 모세의 부르심, 출애굽, 광야 여정, 시내산 언약과 성막 건립으로 이어지는 성경의 두 번째 책입니다.",

    overview:
      "출애굽기는 창세기 마지막에 이집트에 정착한 야곱의 가족 이후의 이야기를 이어갑니다. 이스라엘 자손이 이집트에서 큰 공동체로 성장한 상황에서 모세가 등장하고, 출애굽과 광야 여정, 시내산에서의 언약, 성막 건립으로 이야기가 전개됩니다.",

    biblicalContext:
      "SCRAPTURA에서 출애굽기는 창세기와 이집트를 연결하는 다음 핵심 Book Node입니다. 창세기의 가족 중심 서사가 출애굽기에서는 이스라엘 공동체의 이야기로 확장되며 이후 광야 시대의 이야기로 이어집니다.",


    /* =================================================
       BOOK JOURNEY
       ================================================= */

    bookSections: [

      {
        number: "01",

        title:
          "ISRAEL IN EGYPT",

        scripture:
          "Exodus 1",

        description:
          "요셉 세대 이후 이스라엘 자손이 이집트에서 증가하고 새로운 상황에 놓이는 장면으로 출애굽기가 시작됩니다.",
      },


      {
        number: "02",

        title:
          "THE BIRTH OF MOSES",

        scripture:
          "Exodus 2",

        description:
          "모세의 출생과 성장, 미디안으로의 이동을 통해 이후 출애굽 서사의 중심 인물이 소개됩니다.",
      },


      {
        number: "03",

        title:
          "THE BURNING BUSH",

        scripture:
          "Exodus 3–4",

        description:
          "모세는 광야에서 부르심을 받고 이집트로 돌아가야 하는 사명을 받습니다.",
      },


      {
        number: "04",

        title:
          "MOSES & PHARAOH",

        scripture:
          "Exodus 5–11",

        description:
          "모세와 아론이 파라오 앞에 서면서 이스라엘 자손의 해방을 둘러싼 갈등이 본격적으로 전개됩니다.",
      },


      {
        number: "05",

        title:
          "PASSOVER",

        scripture:
          "Exodus 12–13",

        description:
          "유월절 사건과 함께 이스라엘 자손이 이집트를 떠나는 출애굽의 결정적인 전환점이 나타납니다.",
      },


      {
        number: "06",

        title:
          "THE SEA",

        scripture:
          "Exodus 14–15",

        description:
          "이집트를 떠난 이스라엘 자손은 바다 앞에서 위기를 맞고 이후 본격적인 광야 여정을 시작합니다.",
      },


      {
        number: "07",

        title:
          "THE WILDERNESS",

        scripture:
          "Exodus 16–18",

        description:
          "광야에서 음식과 물, 공동체 운영을 둘러싼 여러 사건이 이어집니다.",
      },


      {
        number: "08",

        title:
          "MOUNT SINAI",

        scripture:
          "Exodus 19–24",

        description:
          "이스라엘 공동체가 시내산에 도착하고 언약과 계명에 관한 핵심 장면이 전개됩니다.",
      },


      {
        number: "09",

        title:
          "THE TABERNACLE",

        scripture:
          "Exodus 25–31",

        description:
          "성막과 그 안에서 사용되는 기물, 제사장 관련 지침이 제시됩니다.",
      },


      {
        number: "10",

        title:
          "THE GOLDEN CALF",

        scripture:
          "Exodus 32–34",

        description:
          "금송아지 사건으로 공동체의 위기가 발생하고 이후 언약의 갱신 과정이 이어집니다.",
      },


      {
        number: "11",

        title:
          "THE TABERNACLE COMPLETED",

        scripture:
          "Exodus 35–40",

        description:
          "성막 제작이 진행되고 출애굽기의 마지막에는 성막이 완성되는 장면이 기록됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Exodus 1–40",
    ],


    relations: [

      {
        targetType:
          "book",

        targetSlug:
          "genesis",

        relationType:
          "RELATED_BOOK",

        label:
          "창세기",
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
    exodusNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "BOOK — EXODUS 실제 노드 추가 완료"
  );

}
else {

  console.log(
    "BOOK — EXODUS 실제 노드가 이미 존재합니다."
  );
}


/* =====================================================
   VERIFY EXODUS EXISTS
   ===================================================== */

exodus =
  findNodeRange(
    source,
    "exodus"
  );


if (!exodus) {

  throw new Error(
    "Exodus 실제 노드 생성 실패"
  );
}


/* =====================================================
   GENESIS → EXODUS
   ===================================================== */

source = addRelation(
  source,
  "genesis",
  {
    targetType:
      "book",

    targetSlug:
      "exodus",

    relationType:
      "RELATED_BOOK",

    label:
      "출애굽기",
  }
);


/* =====================================================
   EGYPT → EXODUS
   ===================================================== */

source = addRelation(
  source,
  "egypt",
  {
    targetType:
      "book",

    targetSlug:
      "exodus",

    relationType:
      "RELATED_BOOK",

    label:
      "출애굽기",
  }
);


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalExodus =
  findNodeRange(
    source,
    "exodus"
  );


const finalGenesis =
  findNodeRange(
    source,
    "genesis"
  );


const finalEgypt =
  findNodeRange(
    source,
    "egypt"
  );


if (
  !finalExodus ||
  !finalGenesis ||
  !finalEgypt
) {

  throw new Error(
    "최종 노드 검증 실패"
  );
}


const validations = [

  [
    "Exodus 실제 slug",
    /^ {4}slug:\s*"exodus"/m
      .test(
        finalExodus.content
      ),
  ],

  [
    "Exodus Type",
    finalExodus.content.includes(
      'type: "book"'
    ),
  ],

  [
    "Exodus Book Journey",
    finalExodus.content.includes(
      "bookSections: ["
    ),
  ],

[
  "Exodus → Genesis",
  /targetSlug:\s*"genesis"/
    .test(
      finalExodus.content
    ),
],

[
  "Exodus → Egypt",
  /targetSlug:\s*"egypt"/
    .test(
      finalExodus.content
    ),
],
  [
    "Genesis → Exodus",
    finalGenesis.content.includes(
      'targetSlug: "exodus"'
    ),
  ],

  [
    "Egypt → Exodus",
    finalEgypt.content.includes(
      'targetSlug: "exodus"'
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
  "SCRAPTURA EXODUS FIXED PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "BOOK — EXODUS 실제 Node 생성 확인"
);

console.log(
  "Exodus → Genesis"
);

console.log(
  "Exodus → Egypt"
);

console.log(
  "Genesis → Exodus"
);

console.log(
  "Egypt → Exodus"
);

console.log(
  "Book Journey 11 sections"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);