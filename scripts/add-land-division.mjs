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
  "content.before-land-division.ts"
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
      "northern-campaign",

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
   CREATE STORY — LAND DIVISION
   ===================================================== */

let landDivision =
  findNodeRange(
    source,
    "land-division"
  );


if (!landDivision) {

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
        "northern-campaign",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 북부 전투",
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


  /* =================================================
     OPTIONAL CALEB
     ================================================= */

  if (
    nodeExists(
      source,
      "caleb"
    )
  ) {
    relations.push({
      targetType:
        "person",

      targetSlug:
        "caleb",

      relationType:
        "RELATED_PERSON",

      label:
        "갈렙",
    });
  }


  /* =================================================
     OPTIONAL HEBRON
     ================================================= */

  if (
    nodeExists(
      source,
      "hebron"
    )
  ) {
    relations.push({
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


  /* =================================================
     OPTIONAL SHILOH
     ================================================= */

  if (
    nodeExists(
      source,
      "shiloh"
    )
  ) {
    relations.push({
      targetType:
        "place",

      targetSlug:
        "shiloh",

      relationType:
        "RELATED_PLACE",

      label:
        "실로",
    });
  }


  /* =================================================
     OPTIONAL EASTERN TRIBES
     ================================================= */

  if (
    nodeExists(
      source,
      "eastern-tribes"
    )
  ) {
    relations.push({
      targetType:
        "story",

      targetSlug:
        "eastern-tribes",

      relationType:
        "RELATED_STORY",

      label:
        "요단 동쪽 지파들",
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


  const landDivisionNode = `

  /* =====================================================
     STORY — LAND DIVISION
     ===================================================== */

  {
    type: "story",

    slug:
      "land-division",

    titleKo:
      "가나안 땅 분배",

    titleEn:
      "The Division of the Land",

    eyebrow:
      "STORIES · JOSHUA 13–21 · THE LAND",

    summary:
      "주요 전투가 마무리된 뒤 가나안 땅을 이스라엘 지파들에게 분배하고, 갈렙의 기업과 실로의 회막, 도피성 및 레위 성읍이 정해지는 과정을 다루는 이야기입니다.",

    overview:
      "여호수아 13–21장은 가나안 정복 이야기의 성격이 크게 바뀌는 구간입니다. 앞선 장들이 전투와 이동을 중심으로 전개되었다면, 이 부분에서는 확보한 땅을 각 지파에게 분배하는 과정이 중심이 됩니다. 갈렙의 헤브론 요청, 유다와 요셉 자손의 기업, 실로에 세워진 회막, 남은 지파들의 분배, 도피성 그리고 레위인들의 성읍이 차례로 등장합니다.",

    biblicalContext:
      "SCRAPTURA에서는 여호수아 13–21장의 긴 지명 목록과 경계 설명을 모두 독립 콘텐츠로 분리하기보다 Land Division이라는 대표 Story Node로 묶습니다. 이후 필요하면 각 지파의 영토나 주요 성읍을 별도의 Place 또는 Theme Node로 확장할 수 있습니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "LAND STILL REMAINS",

        scripture:
          "Joshua 13:1–7",

        description:
          "여호수아가 나이가 든 시점에서 아직 남은 지역들이 언급되고, 땅을 지파들에게 기업으로 분배하라는 지시가 이어집니다.",
      },


      {
        number:
          "02",

        title:
          "EAST OF THE JORDAN",

        scripture:
          "Joshua 13:8–33",

        description:
          "르우벤, 갓, 므낫세 반 지파가 요단 동쪽에서 받은 기업이 정리됩니다.",
      },


      {
        number:
          "03",

        title:
          "CALEB AND HEBRON",

        scripture:
          "Joshua 14:6–15",

        description:
          "갈렙은 과거 정탐 사건을 되돌아보며 자신에게 약속된 헤브론 산지를 기업으로 요청합니다.",
      },


      {
        number:
          "04",

        title:
          "JUDAH AND JOSEPH",

        scripture:
          "Joshua 15–17",

        description:
          "유다 지파와 요셉 자손인 에브라임과 므낫세 지파의 영토와 성읍들이 상세히 정리됩니다.",
      },


      {
        number:
          "05",

        title:
          "THE TABERNACLE AT SHILOH",

        scripture:
          "Joshua 18:1",

        description:
          "이스라엘 공동체가 실로에 모이고 회막이 그곳에 세워지면서 새로운 중심지가 형성됩니다.",
      },


      {
        number:
          "06",

        title:
          "THE REMAINING TRIBES",

        scripture:
          "Joshua 18:2–19:51",

        description:
          "아직 기업을 받지 못한 일곱 지파의 땅을 조사하고 제비를 통해 남은 지역이 분배됩니다.",
      },


      {
        number:
          "07",

        title:
          "CITIES OF REFUGE",

        scripture:
          "Joshua 20:1–9",

        description:
          "도피성이 지정되어 특정 상황에서 피신할 수 있는 장소들이 정해집니다.",
      },


      {
        number:
          "08",

        title:
          "THE LEVITICAL CITIES",

        scripture:
          "Joshua 21:1–42",

        description:
          "레위 사람들에게 각 지파의 기업 가운데 성읍과 주변 목초지가 배정됩니다.",
      },


      {
        number:
          "09",

        title:
          "THE PROMISE AND THE LAND",

        scripture:
          "Joshua 21:43–45",

        description:
          "여호수아 21장은 땅 분배 구간을 마무리하며 이스라엘에게 주어진 약속과 그 성취를 요약합니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 13–17",
      "Joshua 18–19",
      "Joshua 20",
      "Joshua 21",
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
    landDivisionNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "STORY — LAND DIVISION 실제 Node 추가"
  );

}
else {

  if (
    !landDivision.content.includes(
      'type: "story"'
    )
  ) {
    throw new Error(
      'slug: "land-division"가 존재하지만 type이 story가 아닙니다.'
    );
  }


  console.log(
    "STORY — LAND DIVISION 이미 존재"
  );
}


/* =====================================================
   VERIFY CREATED NODE
   ===================================================== */

landDivision =
  findNodeRange(
    source,
    "land-division"
  );


if (!landDivision) {
  throw new Error(
    "Land Division 실제 Node 생성 실패"
  );
}


/* =====================================================
   REQUIRED BACKLINKS
   ===================================================== */

source = addRelation(
  source,
  "joshua",
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
  "book-of-joshua",
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


/* =====================================================
   OPTIONAL CALEB
   ===================================================== */

if (
  nodeExists(
    source,
    "caleb"
  )
) {

  source = addRelation(
    source,
    "land-division",
    {

      targetType:
        "person",

      targetSlug:
        "caleb",

      relationType:
        "RELATED_PERSON",

      label:
        "갈렙",
    }
  );


  source = addRelation(
    source,
    "caleb",
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
}


/* =====================================================
   OPTIONAL HEBRON
   ===================================================== */

if (
  nodeExists(
    source,
    "hebron"
  )
) {

  source = addRelation(
    source,
    "land-division",
    {

      targetType:
        "place",

      targetSlug:
        "hebron",

      relationType:
        "RELATED_PLACE",

      label:
        "헤브론",
    }
  );


  source = addRelation(
    source,
    "hebron",
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
}


/* =====================================================
   OPTIONAL SHILOH
   ===================================================== */

if (
  nodeExists(
    source,
    "shiloh"
  )
) {

  source = addRelation(
    source,
    "land-division",
    {

      targetType:
        "place",

      targetSlug:
        "shiloh",

      relationType:
        "RELATED_PLACE",

      label:
        "실로",
    }
  );


  source = addRelation(
    source,
    "shiloh",
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
}


/* =====================================================
   OPTIONAL EASTERN TRIBES
   ===================================================== */

if (
  nodeExists(
    source,
    "eastern-tribes"
  )
) {

  source = addRelation(
    source,
    "land-division",
    {

      targetType:
        "story",

      targetSlug:
        "eastern-tribes",

      relationType:
        "RELATED_STORY",

      label:
        "요단 동쪽 지파들",
    }
  );


  source = addRelation(
    source,
    "eastern-tribes",
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
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalLand =
  findNodeRange(
    source,
    "land-division"
  );


const finalNorthern =
  findNodeRange(
    source,
    "northern-campaign"
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
  !finalLand ||
  !finalNorthern ||
  !finalJoshua ||
  !finalBook
) {
  throw new Error(
    "최종 Land Division 검증 실패"
  );
}


const validations = [

  [
    "Land Division slug",

    /^ {4}slug:\s*"land-division"\s*,?\s*$/m
      .test(
        finalLand.content
      ),
  ],

  [
    "Land Division type",

    finalLand.content.includes(
      'type: "story"'
    ),
  ],

  [
    "Land Division scenes",

    finalLand.content.includes(
      "scenes: ["
    ),
  ],

  [
    "Land → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalLand.content
      ),
  ],

  [
    "Land → Northern",

    /targetSlug\s*:\s*"northern-campaign"/
      .test(
        finalLand.content
      ),
  ],

  [
    "Land → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalLand.content
      ),
  ],

  [
    "Joshua → Land",

    /targetSlug\s*:\s*"land-division"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Northern → Land",

    /targetSlug\s*:\s*"land-division"/
      .test(
        finalNorthern.content
      ),
  ],

  [
    "Book → Land",

    /targetSlug\s*:\s*"land-division"/
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
  "SCRAPTURA LAND DIVISION PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — LAND DIVISION"
);

console.log(
  "Story Scenes 9 stages"
);

console.log(
  "Land Division ↔ Joshua"
);

console.log(
  "Land Division ↔ Northern Campaign"
);

console.log(
  "Land Division ↔ Book of Joshua"
);

console.log(
  "Caleb / Hebron / Shiloh 존재 시 자동 연결"
);

console.log(
  "Eastern Tribes 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);