import fs from "node:fs";
import path from "node:path";


const contentPath =
  path.join(
    process.cwd(),
    "data",
    "content.ts"
  );

const backupPath =
  path.join(
    process.cwd(),
    "data",
    "content.before-shechem.ts"
  );


/* =====================================================
   FILE CHECK
   ===================================================== */

if (!fs.existsSync(contentPath)) {
  throw new Error(
    "data/content.ts 파일을 찾을 수 없습니다."
  );
}


let source =
  fs.readFileSync(
    contentPath,
    "utf8"
  );


/* =====================================================
   SAFETY CHECK
   ===================================================== */

const requiredMarkers = [
  "export type ContentType",
  "export const nodes: ContentNode[] = [",
  "PERSON — ABRAHAM",
  "STORY — ABRAHAM'S CALL",
  "PLACE — CANAAN",
  'slug: "abraham"',
  'slug: "call-of-abraham"',
  'slug: "canaan"',
  "export const getNode",
];


for (const marker of requiredMarkers) {
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
   HELPER
   ===================================================== */

function updateSection(
  text,
  startMarker,
  endMarker,
  updater
) {
  const start =
    text.indexOf(startMarker);

  if (start === -1) {
    throw new Error(
      `${startMarker} 영역을 찾지 못했습니다.`
    );
  }

  const end =
    endMarker
      ? text.indexOf(
          endMarker,
          start
        )
      : text.lastIndexOf(
          "\n];"
        );

  if (end === -1) {
    throw new Error(
      `${startMarker} 종료 위치를 찾지 못했습니다.`
    );
  }

  const section =
    text.slice(
      start,
      end
    );

  const updated =
    updater(section);

  return (
    text.slice(0, start) +
    updated +
    text.slice(end)
  );
}


/* =====================================================
   ABRAHAM → SHECHEM
   ===================================================== */

source =
  updateSection(
    source,
    "PERSON — ABRAHAM",
    "STORY — ABRAHAM'S CALL",
    (section) => {

      if (
        section.includes(
          'targetSlug: "shechem"'
        )
      ) {
        console.log(
          "Abraham → Shechem 관계가 이미 존재합니다."
        );

        return section;
      }


      const canaanRelation = `      {
        targetType: "place",
        targetSlug: "canaan",
        relationType: "RELATED_PLACE",
        label: "가나안",
      },
`;


      if (
        !section.includes(
          canaanRelation
        )
      ) {
        throw new Error(
          "Abraham → Canaan 관계를 찾지 못했습니다."
        );
      }


      const replacement =
`${canaanRelation}
      {
        targetType: "place",
        targetSlug: "shechem",
        relationType: "RELATED_PLACE",
        label: "세겜",
      },
`;


      console.log(
        "Abraham → Shechem 관계 추가"
      );


      return section.replace(
        canaanRelation,
        replacement
      );
    }
  );


/* =====================================================
   ABRAHAM'S CALL → SHECHEM
   ===================================================== */

source =
  updateSection(
    source,
    "STORY — ABRAHAM'S CALL",
    "PLACE — CANAAN",
    (section) => {

      if (
        section.includes(
          'targetSlug: "shechem"'
        )
      ) {
        console.log(
          "Abraham's Call → Shechem 관계가 이미 존재합니다."
        );

        return section;
      }


      const canaanRelation = `      {
        targetType: "place",
        targetSlug: "canaan",
        relationType: "RELATED_PLACE",
        label: "가나안",
      },
`;


      if (
        !section.includes(
          canaanRelation
        )
      ) {
        throw new Error(
          "Abraham's Call → Canaan 관계를 찾지 못했습니다."
        );
      }


      const replacement =
`${canaanRelation}
      {
        targetType: "place",
        targetSlug: "shechem",
        relationType: "RELATED_PLACE",
        label: "세겜",
      },
`;


      console.log(
        "Abraham's Call → Shechem 관계 추가"
      );


      return section.replace(
        canaanRelation,
        replacement
      );
    }
  );


/* =====================================================
   CANAAN → SHECHEM
   ===================================================== */

source =
  updateSection(
    source,
    "PLACE — CANAAN",
    null,
    (section) => {

      if (
        section.includes(
          'targetSlug: "shechem"'
        )
      ) {
        console.log(
          "Canaan → Shechem 관계가 이미 존재합니다."
        );

        return section;
      }


      const hebronRelation = `      {
        targetType: "place",
        targetSlug: "hebron",
        relationType: "RELATED_PLACE",
        label: "헤브론",
      },
`;


      if (
        !section.includes(
          hebronRelation
        )
      ) {
        throw new Error(
          "Canaan → Hebron 관계를 찾지 못했습니다."
        );
      }


      const replacement =
`      {
        targetType: "place",
        targetSlug: "shechem",
        relationType: "RELATED_PLACE",
        label: "세겜",
      },

${hebronRelation}`;


      console.log(
        "Canaan → Shechem 관계 추가"
      );


      return section.replace(
        hebronRelation,
        replacement
      );
    }
  );


/* =====================================================
   PLACE — SHECHEM
   ===================================================== */

if (
  !source.includes(
    'slug: "shechem"'
  )
) {

  const shechemNode = `

  /* =====================================================
     PLACE — SHECHEM
     ===================================================== */

  {
    type: "place",

    slug: "shechem",

    titleKo:
      "세겜",

    titleEn:
      "Shechem",

    eyebrow:
      "PLACES · CANAAN · PATRIARCHAL JOURNEY",

    summary:
      "아브람이 가나안에 들어온 뒤 도착한 주요 장소 가운데 하나로, 창세기 족장 이야기에서 반복적으로 등장하는 중요한 지역입니다.",

    overview:
      "세겜은 창세기 12장에서 아브람이 가나안에 들어온 뒤 도착한 첫 주요 장소 가운데 하나입니다. 아브람은 세겜의 모레 상수리나무 부근까지 이동하며, 이곳에서 제단을 세웁니다. 이후 세겜은 야곱과 그의 가족 이야기에서도 다시 등장합니다.",

    biblicalContext:
      "세겜은 창세기에서 여러 족장의 이야기가 교차하는 장소입니다. 아브라함의 가나안 진입 과정에서 등장하고, 이후 야곱이 가나안으로 돌아온 뒤 머무는 장소로도 기록됩니다. 따라서 세겜은 아브라함에서 야곱으로 이어지는 족장 시대의 지리적 연결점으로 볼 수 있습니다.",


    keyEvent: {

      title:
        "Abraham Reaches Shechem",

      scripture:
        "Genesis 12:6–7",

      description:
        "아브람은 가나안에 들어와 세겜의 모레 상수리나무 부근까지 이동하고 그곳에서 제단을 세웁니다.",

    },


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Genesis 12:6–7",
      "Genesis 33:18–20",
      "Genesis 34",
      "Genesis 35:4",
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
          "story",

        targetSlug:
          "call-of-abraham",

        relationType:
          "RELATED_STORY",

        label:
          "아브라함의 부르심",
      },


      {
        targetType:
          "place",

        targetSlug:
          "canaan",

        relationType:
          "RELATED_PLACE",

        label:
          "가나안",
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


  const endMarker =
`

];


/* =====================================================
   GET CONTENT`;


  const insertIndex =
    source.lastIndexOf(
      endMarker
    );


  if (insertIndex === -1) {
    throw new Error(
      "nodes 배열의 끝을 찾지 못했습니다."
    );
  }


  source =
    source.slice(
      0,
      insertIndex
    ) +
    shechemNode +
    source.slice(
      insertIndex
    );


  console.log(
    "PLACE — SHECHEM 추가"
  );
}
else {
  console.log(
    "PLACE — SHECHEM이 이미 존재합니다."
  );
}


/* =====================================================
   VALIDATION
   ===================================================== */

const validations = [
  [
    "Abraham",
    source.includes(
      'slug: "abraham"'
    ),
  ],

  [
    "Abraham's Call",
    source.includes(
      'slug: "call-of-abraham"'
    ),
  ],

  [
    "Canaan",
    source.includes(
      'slug: "canaan"'
    ),
  ],

  [
    "Shechem",
    source.includes(
      'slug: "shechem"'
    ),
  ],

  [
    "Shechem Relation",
    source.includes(
      'targetSlug: "shechem"'
    ),
  ],

  [
    "getNode",
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
   WRITE
   ===================================================== */

fs.writeFileSync(
  contentPath,
  source,
  "utf8"
);


console.log("");
console.log(
  "====================================="
);
console.log(
  "SCRAPTURA SHECHEM PATCH COMPLETE"
);
console.log(
  "====================================="
);
console.log(
  "Abraham → Shechem"
);
console.log(
  "Abraham's Call → Shechem"
);
console.log(
  "Canaan → Shechem"
);
console.log(
  "PLACE — SHECHEM"
);
console.log(
  "기존 content.ts 전체 구조 유지"
);