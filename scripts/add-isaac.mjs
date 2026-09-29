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
  "content.before-isaac.ts"
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
   BASIC SAFETY CHECK
   ===================================================== */

const required = [
  "export type ContentType",
  "export const nodes: ContentNode[] = [",
  'slug: "genesis"',
  'slug: "abraham"',
  'slug: "hebron"',
  "export const getNode",
];


for (const marker of required) {
  if (!source.includes(marker)) {
    throw new Error(
      `필수 데이터가 없습니다: ${marker}`
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
    throw new Error(
      `${slug} 노드를 찾지 못했습니다.`
    );
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


  if (
    node.content.includes(
      `targetSlug: "${relation.targetSlug}"`
    )
  ) {

    console.log(
      `${nodeSlug} → ${relation.targetSlug} 관계 이미 존재`
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
      `${nodeSlug}의 relations 배열 종료 위치를 찾지 못했습니다.`
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
   GENESIS → ISAAC
   ===================================================== */

source = addRelation(
  source,
  "genesis",
  {
    targetType:
      "person",

    targetSlug:
      "isaac",

    relationType:
      "RELATED_PERSON",

    label:
      "이삭",
  }
);


/* =====================================================
   ABRAHAM → ISAAC
   ===================================================== */

source = addRelation(
  source,
  "abraham",
  {
    targetType:
      "person",

    targetSlug:
      "isaac",

    relationType:
      "RELATED_PERSON",

    label:
      "이삭",
  }
);


/* =====================================================
   HEBRON → ISAAC
   ===================================================== */

source = addRelation(
  source,
  "hebron",
  {
    targetType:
      "person",

    targetSlug:
      "isaac",

    relationType:
      "RELATED_PERSON",

    label:
      "이삭",
  }
);


/* =====================================================
   PERSON — ISAAC
   ===================================================== */

const alreadyExists =
  /type:\s*"person"[\s\S]{0,200}slug:\s*"isaac"/
    .test(source);


if (!alreadyExists) {

  const isaacNode = `

  /* =====================================================
     PERSON — ISAAC
     ===================================================== */

  {
    type: "person",

    slug: "isaac",

    titleKo: "이삭",

    titleEn: "Isaac",

    eyebrow:
      "PEOPLE · PATRIARCH · GENESIS 21–35",

    summary:
      "아브라함과 사라의 아들로 태어나 아브라함에서 야곱으로 이어지는 창세기 족장 서사의 두 번째 세대를 연결하는 인물입니다.",

    overview:
      "이삭은 아브라함과 사라 사이에서 태어나며 창세기 족장 이야기의 다음 세대를 이어갑니다. 그의 생애는 모리아 사건, 리브가와의 결혼, 에서와 야곱의 출생, 그랄 지역에서의 생활과 우물 이야기, 그리고 야곱과 에서를 둘러싼 가족 이야기로 이어집니다.",

    biblicalContext:
      "창세기에서 이삭은 아브라함과 야곱 사이를 연결하는 족장입니다. 아브라함에게 주어진 가족과 후손에 관한 이야기가 이삭을 통해 다음 세대로 이어지고, 이후 이삭의 아들 야곱을 중심으로 이스라엘 열두 지파의 가족 서사가 확장됩니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number: "01",

        title:
          "THE PROMISE",

        scripture:
          "Genesis 17:15–21",

        description:
          "아브라함과 사라 사이에서 태어날 아들의 이름이 이삭으로 제시되며 그의 출생이 예고됩니다.",
      },


      {
        number: "02",

        title:
          "THE BIRTH",

        scripture:
          "Genesis 21:1–7",

        description:
          "사라가 이삭을 낳으면서 아브라함 가족의 이야기가 새로운 세대로 이어집니다.",
      },


      {
        number: "03",

        title:
          "MORIAH",

        scripture:
          "Genesis 22:1–19",

        description:
          "이삭은 아브라함과 함께 모리아 지역으로 향하며 창세기 22장의 중심 사건에 등장합니다.",
      },


      {
        number: "04",

        title:
          "REBEKAH",

        scripture:
          "Genesis 24:62–67",

        description:
          "아브라함의 종이 데려온 리브가를 만나 결혼하면서 이삭의 가족 이야기가 본격적으로 시작됩니다.",
      },


      {
        number: "05",

        title:
          "ESAU & JACOB",

        scripture:
          "Genesis 25:19–28",

        description:
          "이삭과 리브가 사이에서 에서와 야곱이 태어나며 족장 이야기는 다음 세대로 확장됩니다.",
      },


      {
        number: "06",

        title:
          "GERAR",

        scripture:
          "Genesis 26:1–11",

        description:
          "기근이 발생한 시기에 이삭은 그랄 지역으로 이동하며 그곳에서 생활합니다.",
      },


      {
        number: "07",

        title:
          "THE WELLS",

        scripture:
          "Genesis 26:12–33",

        description:
          "이삭의 가족과 종들은 여러 우물을 둘러싼 갈등을 겪으며 새로운 거주 공간을 찾아 이동합니다.",
      },


      {
        number: "08",

        title:
          "THE BLESSING",

        scripture:
          "Genesis 27",

        description:
          "에서와 야곱을 둘러싼 축복 사건으로 이삭의 가족 안에서 중요한 전환이 일어납니다.",
      },


      {
        number: "09",

        title:
          "HEBRON",

        scripture:
          "Genesis 35:27–29",

        description:
          "야곱이 헤브론 지역의 마므레에 있는 이삭에게 돌아오고 이후 이삭의 생애가 마무리됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Genesis 17:15–21",
      "Genesis 21",
      "Genesis 22",
      "Genesis 24–28",
      "Genesis 35:27–29",
    ],


    relations: [

      {
        targetType:
          "person",

        targetSlug:
          "abraham",

        relationType:
          "RELATED_PERSON",

        label:
          "아브라함",
      },


      {
        targetType:
          "place",

        targetSlug:
          "hebron",

        relationType:
          "RELATED_PLACE",

        label:
          "헤브론",
      },


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

    ],

  },
`;


  const getNodeIndex =
    source.lastIndexOf(
      "export const getNode"
    );


  if (getNodeIndex === -1) {
    throw new Error(
      "export const getNode를 찾지 못했습니다."
    );
  }


  const beforeGetNode =
    source.slice(
      0,
      getNodeIndex
    );


  const nodesEnd =
    beforeGetNode.lastIndexOf(
      "];"
    );


  if (nodesEnd === -1) {
    throw new Error(
      "nodes 배열 끝을 찾지 못했습니다."
    );
  }


  source =
    source.slice(
      0,
      nodesEnd
    ) +
    isaacNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PERSON — ISAAC 추가 완료"
  );

}
else {

  console.log(
    "PERSON — ISAAC이 이미 존재합니다."
  );

}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const validations = [
  [
    "Isaac Node",
    /type:\s*"person"[\s\S]{0,200}slug:\s*"isaac"/
      .test(source),
  ],

  [
    "Genesis → Isaac",
    findNodeRange(
      source,
      "genesis"
    )
      .content
      .includes(
        'targetSlug: "isaac"'
      ),
  ],

  [
    "Abraham → Isaac",
    findNodeRange(
      source,
      "abraham"
    )
      .content
      .includes(
        'targetSlug: "isaac"'
      ),
  ],

  [
    "Hebron → Isaac",
    findNodeRange(
      source,
      "hebron"
    )
      .content
      .includes(
        'targetSlug: "isaac"'
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
    ([, value]) =>
      !value
  );


if (failed.length > 0) {

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
  "SCRAPTURA ISAAC PATCH COMPLETE"
);
console.log(
  "=================================="
);
console.log(
  "Genesis → Isaac"
);
console.log(
  "Abraham → Isaac"
);
console.log(
  "Hebron → Isaac"
);
console.log(
  "PERSON — ISAAC"
);
console.log(
  "기존 데이터 유지"
);
console.log(
  "백업:",
  backupPath
);