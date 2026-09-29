import fs from "node:fs";
import path from "node:path";

const filePath = path.join(
  process.cwd(),
  "data",
  "content.ts"
);

if (!fs.existsSync(filePath)) {
  throw new Error("data/content.ts를 찾을 수 없습니다.");
}

let source = fs.readFileSync(filePath, "utf8");


/* =====================================================
   이미 존재하는지 확인
   ===================================================== */

if (
  /type:\s*"place"[\s\S]{0,200}slug:\s*"shechem"/
    .test(source)
) {
  console.log("세겜 Place 노드가 이미 존재합니다.");
  process.exit(0);
}


/* =====================================================
   백업
   ===================================================== */

const backupPath = path.join(
  process.cwd(),
  "data",
  "content.before-shechem.ts"
);

fs.writeFileSync(
  backupPath,
  source,
  "utf8"
);


/* =====================================================
   SHECHEM NODE
   ===================================================== */

const shechemNode = `

  /* =====================================================
     PLACE — SHECHEM
     ===================================================== */

  {
    type: "place",

    slug: "shechem",

    titleKo: "세겜",

    titleEn: "Shechem",

    eyebrow:
      "PLACES · CANAAN · PATRIARCHAL JOURNEY",

    summary:
      "아브람이 가나안에 들어온 뒤 도착한 주요 장소 가운데 하나로, 창세기 족장 이야기에서 반복적으로 등장하는 중요한 지역입니다.",

    overview:
      "세겜은 창세기 12장에서 아브람이 가나안에 들어온 뒤 도착한 첫 주요 장소 가운데 하나입니다. 아브람은 세겜의 모레 상수리나무 부근까지 이동하며 이곳에서 제단을 세웁니다. 이후 세겜은 야곱과 그의 가족 이야기에서도 다시 등장합니다.",

    biblicalContext:
      "세겜은 창세기 족장들의 이동을 연결하는 중요한 장소입니다. 아브라함의 가나안 진입 과정에서 등장하고, 이후 야곱의 귀환과 그의 가족 이야기에서도 다시 등장합니다.",

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
        targetType: "person",
        targetSlug: "abraham",
        relationType: "RELATED_PERSON",
        label: "아브라함",
      },

      {
        targetType: "story",
        targetSlug: "call-of-abraham",
        relationType: "RELATED_STORY",
        label: "아브라함의 부르심",
      },

      {
        targetType: "place",
        targetSlug: "canaan",
        relationType: "RELATED_PLACE",
        label: "가나안",
      },

      {
        targetType: "book",
        targetSlug: "genesis",
        relationType: "RELATED_BOOK",
        label: "창세기",
      },
    ],
  },
`;


/* =====================================================
   nodes 배열 끝 찾기
   ===================================================== */

const getNodePosition =
  source.lastIndexOf(
    "export const getNode"
  );

if (getNodePosition === -1) {
  throw new Error(
    "export const getNode를 찾을 수 없습니다."
  );
}

const beforeGetNode =
  source.slice(
    0,
    getNodePosition
  );

const arrayEnd =
  beforeGetNode.lastIndexOf(
    "];"
  );

if (arrayEnd === -1) {
  throw new Error(
    "nodes 배열 끝을 찾을 수 없습니다."
  );
}


/* =====================================================
   삽입
   ===================================================== */

source =
  source.slice(
    0,
    arrayEnd
  ) +
  shechemNode +
  "\n" +
  source.slice(
    arrayEnd
  );


/* =====================================================
   검증
   ===================================================== */

if (
  !source.includes(
    'slug: "shechem"'
  )
) {
  throw new Error(
    "세겜 삽입 실패"
  );
}


/* =====================================================
   저장
   ===================================================== */

fs.writeFileSync(
  filePath,
  source,
  "utf8"
);

console.log("");
console.log("==================================");
console.log("SHECHEM INSERT COMPLETE");
console.log("==================================");
console.log("PLACE — SHECHEM 추가 완료");
console.log("slug: shechem 생성 완료");
console.log("기존 content.ts 유지");
console.log(
  "백업:",
  backupPath
);