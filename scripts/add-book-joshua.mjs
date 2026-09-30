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
  "content.before-book-joshua.ts"
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


/*
 * 실제 slug만 찾습니다.
 *
 * slug: "book-of-joshua"    ← 검색
 * targetSlug: "book-of-joshua" ← 무시
 */

function findNodeRange(
  fullSource,
  slug
) {

  const escapedSlug =
    escapeRegex(
      slug
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
   REQUIRED JOSHUA PERSON
   ===================================================== */

const joshuaPerson =
  findNodeRange(
    source,
    "joshua"
  );


if (!joshuaPerson) {

  throw new Error(
    'PERSON 노드 slug: "joshua"를 찾지 못했습니다.'
  );
}


if (
  !joshuaPerson.content.includes(
    'type: "person"'
  )
) {

  throw new Error(
    "Joshua 노드가 존재하지만 type이 person이 아닙니다."
  );
}


console.log(
  "Joshua 실제 Person 노드 확인"
);


/* =====================================================
   CREATE BOOK — JOSHUA
   ===================================================== */

let bookJoshua =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (!bookJoshua) {

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

  ];


  /* MOSES */

  if (
    nodeExists(
      source,
      "moses"
    )
  ) {

    relations.push({
      targetType:
        "person",

      targetSlug:
        "moses",

      relationType:
        "RELATED_PERSON",

      label:
        "모세",
    });
  }


  /* JERICHO */

  if (
    nodeExists(
      source,
      "jericho"
    )
  ) {

    relations.push({
      targetType:
        "place",

      targetSlug:
        "jericho",

      relationType:
        "RELATED_PLACE",

      label:
        "여리고",
    });
  }


  /* CANAAN */

  if (
    nodeExists(
      source,
      "canaan"
    )
  ) {

    relations.push({
      targetType:
        "place",

      targetSlug:
        "canaan",

      relationType:
        "RELATED_PLACE",

      label:
        "가나안",
    });
  }


  /* SHECHEM */

  if (
    nodeExists(
      source,
      "shechem"
    )
  ) {

    relations.push({
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


  const bookNode = `

  /* =====================================================
     BOOK — JOSHUA
     ===================================================== */

  {
    type: "book",

    slug: "book-of-joshua",

    titleKo: "여호수아",

    titleEn: "Joshua",

    eyebrow:
      "BIBLE · OLD TESTAMENT · HISTORICAL BOOKS",

    summary:
      "모세 이후 여호수아가 이스라엘 공동체를 이끌고 요단강을 건너 가나안에 들어가며, 정복과 땅의 분배, 세겜에서의 언약 갱신으로 이어지는 이야기입니다.",

    overview:
      "여호수아서는 모세의 죽음 이후 여호수아가 지도자로 세워지는 장면에서 시작합니다. 이스라엘 공동체는 요단강을 건너 가나안으로 들어가고, 여리고와 아이를 비롯한 여러 사건을 지나갑니다. 후반부에는 각 지파의 땅 분배가 기록되며 마지막에는 여호수아의 고별과 세겜에서의 언약 갱신이 전개됩니다.",

    biblicalContext:
      "SCRAPTURA에서 여호수아서는 모세와 광야 시대에서 가나안 시대를 연결하는 핵심 Book Node입니다. Person Joshua를 중심으로 요단강, 여리고, 세겜과 여러 가나안 지역의 이야기를 연결하는 기반이 됩니다.",


    /* =================================================
       BOOK JOURNEY
       ================================================= */

    bookSections: [

      {
        number:
          "01",

        title:
          "AFTER MOSES",

        scripture:
          "Joshua 1",

        description:
          "모세의 죽음 이후 여호수아가 이스라엘 공동체를 이끌 지도자로 등장하며 새로운 시대가 시작됩니다.",
      },


      {
        number:
          "02",

        title:
          "CROSSING THE JORDAN",

        scripture:
          "Joshua 3–4",

        description:
          "이스라엘 공동체가 요단강을 건너면서 광야 여정에서 가나안 진입 단계로 이동합니다.",
      },


      {
        number:
          "03",

        title:
          "JERICHO",

        scripture:
          "Joshua 5:13–6:27",

        description:
          "여리고 사건은 여호수아서 초기 가나안 진입 이야기의 대표적인 장면입니다.",
      },


      {
        number:
          "04",

        title:
          "AI & COVENANT",

        scripture:
          "Joshua 7–8",

        description:
          "아이 성과 관련된 사건과 그 이후의 전투, 그리고 에발산에서의 언약 관련 장면이 이어집니다.",
      },


      {
        number:
          "05",

        title:
          "THE GIBEONITES",

        scripture:
          "Joshua 9",

        description:
          "기브온 주민들과 이스라엘 지도자들 사이의 사건이 전개됩니다.",
      },


      {
        number:
          "06",

        title:
          "THE SOUTHERN CAMPAIGN",

        scripture:
          "Joshua 10",

        description:
          "여호수아서 10장에서는 가나안 남부 지역을 배경으로 여러 전투가 이어집니다.",
      },


      {
        number:
          "07",

        title:
          "THE NORTHERN CAMPAIGN",

        scripture:
          "Joshua 11–12",

        description:
          "북부 지역의 전투와 여호수아 시대 정복 이야기의 한 구간이 정리됩니다.",
      },


      {
        number:
          "08",

        title:
          "THE LAND",

        scripture:
          "Joshua 13–21",

        description:
          "여호수아서 후반부에서는 각 지파에게 땅이 분배되는 과정과 도피성, 레위인의 성읍 등이 기록됩니다.",
      },


      {
        number:
          "09",

        title:
          "THE EASTERN TRIBES",

        scripture:
          "Joshua 22",

        description:
          "요단 동쪽 지파들이 돌아가는 과정에서 제단을 둘러싼 갈등과 해명이 전개됩니다.",
      },


      {
        number:
          "10",

        title:
          "THE FINAL COVENANT",

        scripture:
          "Joshua 23–24",

        description:
          "여호수아는 마지막 권면을 전하고 세겜에서 공동체와 함께 언약을 재확인합니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 1–24",
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
    bookNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "BOOK — JOSHUA 실제 Node 추가"
  );

}
else {

  console.log(
    "BOOK — JOSHUA 이미 존재"
  );
}


/* =====================================================
   VERIFY BOOK
   ===================================================== */

bookJoshua =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (!bookJoshua) {

  throw new Error(
    "Book Joshua 실제 노드 생성 실패"
  );
}


/* =====================================================
   JOSHUA PERSON → BOOK
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {
    targetType:
      "book",

    targetSlug:
      "book-of-joshua",

    relationType:
      "RELATED_BOOK",

    label:
      "여호수아",
  }
);


/* =====================================================
   EXISTING PLACE BACKLINKS
   ===================================================== */

if (
  nodeExists(
    source,
    "jericho"
  )
) {

  source = addRelation(
    source,
    "jericho",
    {
      targetType:
        "book",

      targetSlug:
        "book-of-joshua",

      relationType:
        "RELATED_BOOK",

      label:
        "여호수아",
    }
  );
}


if (
  nodeExists(
    source,
    "canaan"
  )
) {

  source = addRelation(
    source,
    "canaan",
    {
      targetType:
        "book",

      targetSlug:
        "book-of-joshua",

      relationType:
        "RELATED_BOOK",

      label:
        "여호수아",
    }
  );
}


if (
  nodeExists(
    source,
    "shechem"
  )
) {

  source = addRelation(
    source,
    "shechem",
    {
      targetType:
        "book",

      targetSlug:
        "book-of-joshua",

      relationType:
        "RELATED_BOOK",

      label:
        "여호수아",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


if (
  !finalBook ||
  !finalJoshua
) {

  throw new Error(
    "최종 Book Joshua 검증 실패"
  );
}


const validations = [

  [
    "Book Joshua actual slug",

    /^[ \t]*slug:\s*"book-of-joshua"\s*,?\s*$/m
      .test(
        finalBook.content
      ),
  ],

  [
    "Book Joshua Type",

    finalBook.content.includes(
      'type: "book"'
    ),
  ],

  [
    "Book Journey",

    finalBook.content.includes(
      "bookSections: ["
    ),
  ],

  [
    "Book → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalBook.content
      ),
  ],

  [
    "Joshua → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalJoshua.content
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
  "SCRAPTURA BOOK JOSHUA PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "BOOK — JOSHUA"
);

console.log(
  "Book Journey 10 sections"
);

console.log(
  "Joshua → Book of Joshua"
);

console.log(
  "Book of Joshua → Joshua"
);

console.log(
  "Jericho / Canaan / Shechem 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);