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
  "content.before-egypt.ts"
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
   SAFETY CHECK
   ===================================================== */

const required = [
  "export const nodes: ContentNode[] = [",
  'slug: "genesis"',
  'slug: "jacob"',
  'slug: "joseph"',
  "export const getNode",
];


for (const marker of required) {

  if (!source.includes(marker)) {
    throw new Error(
      `필수 구조를 찾지 못했습니다: ${marker}`
    );
  }
}


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
   FIND NODE
   ===================================================== */

function findNodeRange(
  fullSource,
  slug
) {

  const slugMarker =
    `slug: "${slug}"`;


  const slugIndex =
    fullSource.indexOf(
      slugMarker
    );


  if (slugIndex === -1) {
    return null;
  }


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
    node.content.includes(
      `targetSlug: "${relation.targetSlug}"`
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
   JOSEPH → EGYPT
   ===================================================== */

source = addRelation(
  source,
  "joseph",
  {
    targetType:
      "place",

    targetSlug:
      "egypt",

    relationType:
      "RELATED_PLACE",

    label:
      "이집트",
  }
);


/* =====================================================
   JACOB → EGYPT
   ===================================================== */

source = addRelation(
  source,
  "jacob",
  {
    targetType:
      "place",

    targetSlug:
      "egypt",

    relationType:
      "RELATED_PLACE",

    label:
      "이집트",
  }
);


/* =====================================================
   GENESIS → EGYPT
   ===================================================== */

source = addRelation(
  source,
  "genesis",
  {
    targetType:
      "place",

    targetSlug:
      "egypt",

    relationType:
      "RELATED_PLACE",

    label:
      "이집트",
  }
);


/* =====================================================
   ABRAHAM → EGYPT
   기존 Abraham 노드가 있을 때만
   ===================================================== */

if (
  findNodeRange(
    source,
    "abraham"
  )
) {

  source = addRelation(
    source,
    "abraham",
    {
      targetType:
        "place",

      targetSlug:
        "egypt",

      relationType:
        "RELATED_PLACE",

      label:
        "이집트",
    }
  );
}


/* =====================================================
   PLACE — EGYPT
   ===================================================== */

const egyptExists =
  findNodeRange(
    source,
    "egypt"
  );


if (!egyptExists) {

  const relations = [];


  /*
   * JOSEPH
   */

  relations.push({
    targetType:
      "person",

    targetSlug:
      "joseph",

    relationType:
      "RELATED_PERSON",

    label:
      "요셉",
  });


  /*
   * JACOB
   */

  relations.push({
    targetType:
      "person",

    targetSlug:
      "jacob",

    relationType:
      "RELATED_PERSON",

    label:
      "야곱",
  });


  /*
   * ABRAHAM
   */

  if (
    findNodeRange(
      source,
      "abraham"
    )
  ) {

    relations.push({
      targetType:
        "person",

      targetSlug:
        "abraham",

      relationType:
        "RELATED_PERSON",

      label:
        "아브라함",
    });
  }


  /*
   * GENESIS
   */

  relations.push({
    targetType:
      "book",

    targetSlug:
      "genesis",

    relationType:
      "RELATED_BOOK",

    label:
      "창세기",
  });


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


  const egyptNode = `

  /* =====================================================
     PLACE — EGYPT
     ===================================================== */

  {
    type: "place",

    slug: "egypt",

    titleKo: "이집트",

    titleEn: "Egypt",

    eyebrow:
      "PLACES · EGYPT · PATRIARCHAL TRANSITION",

    summary:
      "아브라함의 이동과 요셉의 생애, 야곱 가족의 이주가 이어지는 장소로 창세기의 족장 서사와 출애굽기의 배경을 연결하는 핵심 지역입니다.",

    overview:
      "창세기에서 이집트는 여러 세대에 걸쳐 등장합니다. 아브라함은 가나안에 기근이 발생했을 때 이집트로 내려가고, 이후 요셉은 형제들에 의해 팔려 이집트에 도착합니다. 요셉이 이집트에서 높은 지위에 오른 뒤 기근이 발생하면서 야곱과 그의 가족도 이집트로 이동합니다.",

    biblicalContext:
      "SCRAPTURA에서 이집트는 창세기와 출애굽기를 연결하는 중요한 지리적 노드입니다. 요셉의 이야기를 통해 야곱의 가족이 이집트에 정착하는 과정이 설명되고, 이후 출애굽기는 이집트에 거주하게 된 이스라엘 자손의 다음 시대를 다룹니다.",

    keyEvent: {
      title:
        "Jacob's Family Comes to Egypt",

      scripture:
        "Genesis 46:1–7",

      description:
        "기근이 계속되자 야곱은 가족과 함께 가나안을 떠나 이집트로 이동하며 요셉과 다시 만나게 됩니다.",
    },

    heroImage:
      "/assets/scraptura-home-clean.jpg",

    scripture: [
      "Genesis 12:10–20",
      "Genesis 37:25–36",
      "Genesis 39–41",
      "Genesis 42–47",
      "Genesis 50:22–26",
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
    egyptNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PLACE — EGYPT 추가 완료"
  );

}
else {

  console.log(
    "PLACE — EGYPT 이미 존재"
  );
}


/* =====================================================
   VALIDATION
   ===================================================== */

const egypt =
  findNodeRange(
    source,
    "egypt"
  );


if (!egypt) {

  throw new Error(
    "Egypt 노드 생성 검증 실패"
  );
}


const joseph =
  findNodeRange(
    source,
    "joseph"
  );


const jacob =
  findNodeRange(
    source,
    "jacob"
  );


const genesis =
  findNodeRange(
    source,
    "genesis"
  );


const validations = [
  [
    "Egypt Type",
    egypt.content.includes(
      'type: "place"'
    ),
  ],

  [
    "Egypt Slug",
    egypt.content.includes(
      'slug: "egypt"'
    ),
  ],

  [
    "Egypt → Joseph",
    egypt.content.includes(
      'targetSlug: "joseph"'
    ),
  ],

  [
    "Egypt → Jacob",
    egypt.content.includes(
      'targetSlug: "jacob"'
    ),
  ],

  [
    "Egypt → Genesis",
    egypt.content.includes(
      'targetSlug: "genesis"'
    ),
  ],

  [
    "Joseph → Egypt",
    joseph?.content.includes(
      'targetSlug: "egypt"'
    ),
  ],

  [
    "Jacob → Egypt",
    jacob?.content.includes(
      'targetSlug: "egypt"'
    ),
  ],

  [
    "Genesis → Egypt",
    genesis?.content.includes(
      'targetSlug: "egypt"'
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
  "=================================="
);
console.log(
  "SCRAPTURA EGYPT PATCH COMPLETE"
);
console.log(
  "=================================="
);
console.log(
  "Joseph → Egypt"
);
console.log(
  "Jacob → Egypt"
);
console.log(
  "Genesis → Egypt"
);
console.log(
  "Abraham 존재 시 → Egypt"
);
console.log(
  "PLACE — EGYPT"
);
console.log(
  "기존 데이터 유지"
);
console.log(
  "백업:",
  backupPath
);