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
  "content.before-jacob.ts"
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
  'slug: "abraham"',
  'slug: "isaac"',
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
   NODE FINDER
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
   NODE EXISTS
   ===================================================== */

function nodeExists(
  slug
) {

  return (
    findNodeRange(
      source,
      slug
    ) !== null
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
      `${nodeSlug} relations 없음 → 생략`
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
   GENESIS → JACOB
   ===================================================== */

source = addRelation(
  source,
  "genesis",
  {
    targetType:
      "person",

    targetSlug:
      "jacob",

    relationType:
      "RELATED_PERSON",

    label:
      "야곱",
  }
);


/* =====================================================
   ISAAC → JACOB
   ===================================================== */

source = addRelation(
  source,
  "isaac",
  {
    targetType:
      "person",

    targetSlug:
      "jacob",

    relationType:
      "RELATED_PERSON",

    label:
      "야곱",
  }
);


/* =====================================================
   BETHEL → JACOB
   ===================================================== */

source = addRelation(
  source,
  "bethel",
  {
    targetType:
      "person",

    targetSlug:
      "jacob",

    relationType:
      "RELATED_PERSON",

    label:
      "야곱",
  }
);


/* =====================================================
   SHECHEM → JACOB
   ===================================================== */

source = addRelation(
  source,
  "shechem",
  {
    targetType:
      "person",

    targetSlug:
      "jacob",

    relationType:
      "RELATED_PERSON",

    label:
      "야곱",
  }
);


/* =====================================================
   HEBRON → JACOB
   ===================================================== */

source = addRelation(
  source,
  "hebron",
  {
    targetType:
      "person",

    targetSlug:
      "jacob",

    relationType:
      "RELATED_PERSON",

    label:
      "야곱",
  }
);


/* =====================================================
   PERSON — JACOB
   ===================================================== */

const jacobExists =
  findNodeRange(
    source,
    "jacob"
  ) !== null;


if (!jacobExists) {

  const availableRelations = [];


  /*
   * ISAAC
   */

  if (
    findNodeRange(
      source,
      "isaac"
    )
  ) {

    availableRelations.push({
      targetType:
        "person",

      targetSlug:
        "isaac",

      relationType:
        "RELATED_PERSON",

      label:
        "이삭",
    });
  }


  /*
   * ABRAHAM
   */

  if (
    findNodeRange(
      source,
      "abraham"
    )
  ) {

    availableRelations.push({
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
   * BETHEL
   */

  if (
    findNodeRange(
      source,
      "bethel"
    )
  ) {

    availableRelations.push({
      targetType:
        "place",

      targetSlug:
        "bethel",

      relationType:
        "RELATED_PLACE",

      label:
        "벧엘",
    });
  }


  /*
   * SHECHEM
   */

  if (
    findNodeRange(
      source,
      "shechem"
    )
  ) {

    availableRelations.push({
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
   * HEBRON
   */

  if (
    findNodeRange(
      source,
      "hebron"
    )
  ) {

    availableRelations.push({
      targetType:
        "place",

      targetSlug:
        "hebron",

      relationType:
        "RELATED_PLACE",

      label:
        "헤브론",
    });
  }


  /*
   * GENESIS
   */

  availableRelations.push({
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
    availableRelations
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


  const jacobNode = `

  /* =====================================================
     PERSON — JACOB
     ===================================================== */

  {
    type: "person",

    slug: "jacob",

    titleKo: "야곱",

    titleEn: "Jacob",

    eyebrow:
      "PEOPLE · PATRIARCH · GENESIS 25–35",

    summary:
      "이삭과 리브가의 아들이자 에서의 쌍둥이 동생으로, 이후 이스라엘이라는 이름을 받고 열두 아들의 가족을 통해 족장 이야기를 다음 세대로 연결하는 인물입니다.",

    overview:
      "야곱은 이삭과 리브가 사이에서 에서와 함께 태어납니다. 장자의 명분과 축복을 둘러싼 사건 이후 가족을 떠나 하란으로 향하며, 벧엘에서 중요한 장면을 경험합니다. 이후 하란에서 가족을 이루고 다시 가나안으로 돌아와 브니엘, 세겜, 벧엘, 헤브론으로 이어지는 여정을 거칩니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number: "01",

        title:
          "THE TWINS",

        scripture:
          "Genesis 25:19–26",

        description:
          "이삭과 리브가 사이에서 에서와 야곱이 태어나며 족장 가족의 다음 세대가 시작됩니다.",
      },


      {
        number: "02",

        title:
          "THE BIRTHRIGHT",

        scripture:
          "Genesis 25:27–34",

        description:
          "야곱과 에서 사이에서 장자의 명분을 둘러싼 사건이 발생합니다.",
      },


      {
        number: "03",

        title:
          "THE BLESSING",

        scripture:
          "Genesis 27",

        description:
          "이삭의 축복을 둘러싼 사건이 일어나고 야곱은 결국 가족을 떠나게 됩니다.",
      },


      {
        number: "04",

        title:
          "BETHEL",

        scripture:
          "Genesis 28:10–22",

        description:
          "하란으로 향하던 야곱은 한 장소에서 밤을 보내며 꿈을 꾸고 그곳을 벧엘이라 부릅니다.",
      },


      {
        number: "05",

        title:
          "HARAN",

        scripture:
          "Genesis 29–31",

        description:
          "야곱은 하란에서 라반의 가족과 함께 지내며 결혼하고 자녀와 가축을 포함한 큰 가족 공동체를 이루게 됩니다.",
      },


      {
        number: "06",

        title:
          "THE RETURN",

        scripture:
          "Genesis 31:17–55",

        description:
          "야곱은 가족과 소유를 이끌고 하란을 떠나 다시 가나안으로 향합니다.",
      },


      {
        number: "07",

        title:
          "PENIEL",

        scripture:
          "Genesis 32:22–32",

        description:
          "에서와 다시 만나기 전 야곱은 얍복 나루 부근에서 중요한 사건을 경험하고 이스라엘이라는 이름을 받습니다.",
      },


      {
        number: "08",

        title:
          "SHECHEM",

        scripture:
          "Genesis 33:18–20; 34",

        description:
          "가나안으로 돌아온 야곱의 가족은 세겜 지역에 머물며 이후 가족과 지역 주민 사이의 갈등을 경험합니다.",
      },


      {
        number: "09",

        title:
          "BETHEL AGAIN",

        scripture:
          "Genesis 35:1–15",

        description:
          "야곱은 다시 벧엘로 올라가 제단을 세우고 자신의 이전 여정과 연결되는 장소로 돌아옵니다.",
      },


      {
        number: "10",

        title:
          "HEBRON",

        scripture:
          "Genesis 35:27–29",

        description:
          "야곱은 헤브론 지역의 마므레에 있던 아버지 이삭에게 돌아오며 이삭 세대와 야곱 세대가 다시 연결됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Genesis 25:19–34",
      "Genesis 27–28",
      "Genesis 29–32",
      "Genesis 33–35",
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
    jacobNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PERSON — JACOB 추가 완료"
  );

}
else {

  console.log(
    "PERSON — JACOB 이미 존재"
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalJacob =
  findNodeRange(
    source,
    "jacob"
  );


if (!finalJacob) {

  throw new Error(
    "Jacob 노드 생성 검증 실패"
  );
}


const validations = [
  [
    "Jacob Type",
    finalJacob.content.includes(
      'type: "person"'
    ),
  ],

  [
    "Jacob Slug",
    finalJacob.content.includes(
      'slug: "jacob"'
    ),
  ],

  [
    "Isaac Relation",
    finalJacob.content.includes(
      'targetSlug: "isaac"'
    ),
  ],

  [
    "Genesis Relation",
    finalJacob.content.includes(
      'targetSlug: "genesis"'
    ),
  ],

  [
    "Character Journey",
    finalJacob.content.includes(
      "characterJourney: ["
    ),
  ],

  [
    "getNode Preserved",
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
  "SCRAPTURA JACOB PATCH COMPLETE"
);
console.log(
  "=================================="
);
console.log(
  "Genesis → Jacob"
);
console.log(
  "Isaac → Jacob"
);
console.log(
  "Bethel → Jacob"
);
console.log(
  "Shechem → Jacob"
);
console.log(
  "Hebron → Jacob"
);
console.log(
  "PERSON — JACOB"
);
console.log(
  "기존 데이터 유지"
);
console.log(
  "백업:",
  backupPath
);