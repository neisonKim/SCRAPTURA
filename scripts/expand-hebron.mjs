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
    "content.before-hebron-expand.ts"
  );


/* =====================================================
   FILE CHECK
   ===================================================== */

if (
  !fs.existsSync(
    contentPath
  )
) {
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
  "PERSON — ABRAHAM",
  "PLACE — BETHEL",
  "PLACE — HEBRON",
  "PLACE — MOUNT GILBOA",
  'slug: "abraham"',
  'slug: "bethel"',
  'slug: "hebron"',
  "export const getNode",
];


for (
  const marker
  of requiredMarkers
) {

  if (
    !source.includes(
      marker
    )
  ) {
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
   SECTION HELPER
   ===================================================== */

function getSection(
  fullSource,
  startMarker,
  endMarker
) {

  const start =
    fullSource.indexOf(
      startMarker
    );

  if (
    start === -1
  ) {
    throw new Error(
      `${startMarker} 시작 위치를 찾지 못했습니다.`
    );
  }


  let end;

  if (
    endMarker
  ) {

    end =
      fullSource.indexOf(
        endMarker,
        start
      );

  }
  else {

    end =
      fullSource.lastIndexOf(
        "\n];"
      );

  }


  if (
    end === -1
  ) {
    throw new Error(
      `${startMarker} 종료 위치를 찾지 못했습니다.`
    );
  }


  return {
    start,
    end,
    section:
      fullSource.slice(
        start,
        end
      ),
  };
}


/* =====================================================
   RELATION HELPER
   ===================================================== */

function addRelation(
  section,
  targetSlug,
  relationCode
) {

  if (
    section.includes(
      `targetSlug: "${targetSlug}"`
    )
  ) {
    return section;
  }


  const relationsStart =
    section.indexOf(
      "relations: ["
    );


  if (
    relationsStart === -1
  ) {
    throw new Error(
      `relations 배열을 찾지 못했습니다: ${targetSlug}`
    );
  }


  const relationsEnd =
    section.lastIndexOf(
      "\n    ],"
    );


  if (
    relationsEnd === -1 ||
    relationsEnd <
      relationsStart
  ) {
    throw new Error(
      `relations 종료 위치를 찾지 못했습니다: ${targetSlug}`
    );
  }


  return (
    section.slice(
      0,
      relationsEnd
    ) +
    "\n\n" +
    relationCode +
    section.slice(
      relationsEnd
    )
  );
}


/* =====================================================
   EXPAND HEBRON
   ===================================================== */

const hebronData =
  getSection(
    source,
    "PLACE — HEBRON",
    "PLACE — MOUNT GILBOA"
  );


let hebron =
  hebronData.section;


/* =====================================================
   EYEBROW
   ===================================================== */

hebron =
  hebron.replace(
    '"PLACES · ROYAL CITY"',
    '"PLACES · PATRIARCHAL & ROYAL CITY"'
  );


/* =====================================================
   SUMMARY
   ===================================================== */

hebron =
  hebron.replace(
    /summary:\s*\n\s*"[^"]*",/,
    `summary:
      "아브라함이 머물며 제단을 세우고 가족의 매장지를 마련한 장소이자, 훗날 다윗이 유다의 왕으로 세워져 통치한 성읍으로 족장 시대와 왕정 시대를 연결하는 중요한 장소입니다.",`
  );


/* =====================================================
   OVERVIEW
   ===================================================== */

hebron =
  hebron.replace(
    /overview:\s*\n\s*"[^"]*",/,
    `overview:
      "헤브론은 창세기에서 아브라함의 이동과 정착 이야기 속에 등장합니다. 아브라함은 헤브론 인근 마므레 지역에 머물며 제단을 세웠고, 이후 사라가 죽은 뒤 막벨라 밭과 굴을 매입합니다. 수백 년 뒤 사무엘하에서는 다윗이 헤브론으로 올라가 유다의 왕으로 세워지고 이곳에서 통치를 시작합니다.",`
  );


/* =====================================================
   BIBLICAL CONTEXT
   ===================================================== */

hebron =
  hebron.replace(
    /biblicalContext:\s*\n\s*"[^"]*",/,
    `biblicalContext:
      "헤브론은 SCRAPTURA에서 여러 시대가 겹치는 대표적인 장소입니다. 창세기에서는 아브라함과 사라, 족장들의 이야기와 연결되고, 사무엘하에서는 다윗의 왕권 형성과 연결됩니다. 따라서 헤브론은 족장 시대의 가족 서사와 이스라엘 왕정의 형성을 하나의 지리적 공간에서 이어주는 장소입니다.",`
  );


/* =====================================================
   SCRIPTURE — GENESIS ADD
   ===================================================== */

if (
  !hebron.includes(
    '"Genesis 13:18"'
  )
) {

  const scriptureMarker =
    `    scripture: [
`;


  if (
    !hebron.includes(
      scriptureMarker
    )
  ) {
    throw new Error(
      "Hebron scripture 배열을 찾지 못했습니다."
    );
  }


  hebron =
    hebron.replace(
      scriptureMarker,
      `    scripture: [
      "Genesis 13:18",
      "Genesis 23:1–20",
`
    );

}


/* =====================================================
   HEBRON RELATIONS
   ===================================================== */

hebron =
  addRelation(
    hebron,
    "abraham",
`      {
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },`
  );


hebron =
  addRelation(
    hebron,
    "bethel",
`      {
        targetType: "place",
        targetSlug: "bethel",
        relationType: "RELATED_PLACE",
        label: "벧엘",
      },`
  );


hebron =
  addRelation(
    hebron,
    "call-of-abraham",
`      {
        targetType: "story",
        targetSlug: "call-of-abraham",
        relationType: "RELATED_STORY",
        label: "아브라함의 부르심",
      },`
  );


hebron =
  addRelation(
    hebron,
    "genesis",
`      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },`
  );


/* =====================================================
   WRITE HEBRON BACK
   ===================================================== */

source =
  source.slice(
    0,
    hebronData.start
  ) +
  hebron +
  source.slice(
    hebronData.end
  );


/* =====================================================
   BETHEL → HEBRON
   ===================================================== */

const bethelData =
  getSection(
    source,
    "PLACE — BETHEL",
    null
  );


let bethel =
  bethelData.section;


bethel =
  addRelation(
    bethel,
    "hebron",
`      {
        targetType: "place",
        targetSlug: "hebron",
        relationType: "RELATED_PLACE",
        label: "헤브론",
      },`
  );


source =
  source.slice(
    0,
    bethelData.start
  ) +
  bethel +
  source.slice(
    bethelData.end
  );


/* =====================================================
   VALIDATION
   ===================================================== */

const hebronValidation =
  getSection(
    source,
    "PLACE — HEBRON",
    "PLACE — MOUNT GILBOA"
  ).section;


const validations = [
  [
    "Genesis 13",
    hebronValidation.includes(
      '"Genesis 13:18"'
    ),
  ],

  [
    "Genesis 23",
    hebronValidation.includes(
      '"Genesis 23:1–20"'
    ),
  ],

  [
    "Abraham",
    hebronValidation.includes(
      'targetSlug: "abraham"'
    ),
  ],

  [
    "Bethel",
    hebronValidation.includes(
      'targetSlug: "bethel"'
    ),
  ],

  [
    "Genesis Book",
    hebronValidation.includes(
      'targetSlug: "genesis"'
    ),
  ],

  [
    "David Story Preserved",
    hebronValidation.includes(
      'targetSlug: "david-becomes-king"'
    ),
  ],

  [
    "Jerusalem Preserved",
    hebronValidation.includes(
      'targetSlug: "jerusalem"'
    ),
  ],
];


const failed =
  validations.filter(
    ([, result]) =>
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
  "===================================="
);
console.log(
  "SCRAPTURA HEBRON EXPANSION COMPLETE"
);
console.log(
  "===================================="
);
console.log(
  "Hebron → Abraham 시대 추가"
);
console.log(
  "Hebron → David 시대 유지"
);
console.log(
  "Bethel → Hebron 연결"
);
console.log(
  "Genesis 13 / Genesis 23 추가"
);
console.log(
  "기존 David / Jerusalem 관계 유지"
);
console.log(
  "백업:",
  backupPath
);