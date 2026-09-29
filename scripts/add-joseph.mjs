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
  "content.before-joseph.ts"
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
   GENESIS → JOSEPH
   ===================================================== */

source = addRelation(
  source,
  "genesis",
  {
    targetType:
      "person",

    targetSlug:
      "joseph",

    relationType:
      "RELATED_PERSON",

    label:
      "요셉",
  }
);


/* =====================================================
   JACOB → JOSEPH
   ===================================================== */

source = addRelation(
  source,
  "jacob",
  {
    targetType:
      "person",

    targetSlug:
      "joseph",

    relationType:
      "RELATED_PERSON",

    label:
      "요셉",
  }
);


/* =====================================================
   EGYPT → JOSEPH
   존재할 때만 추가
   ===================================================== */

if (
  findNodeRange(
    source,
    "egypt"
  )
) {

  source = addRelation(
    source,
    "egypt",
    {
      targetType:
        "person",

      targetSlug:
        "joseph",

      relationType:
        "RELATED_PERSON",

      label:
        "요셉",
    }
  );
}


/* =====================================================
   HEBRON → JOSEPH
   존재할 때만 추가
   ===================================================== */

if (
  findNodeRange(
    source,
    "hebron"
  )
) {

  source = addRelation(
    source,
    "hebron",
    {
      targetType:
        "person",

      targetSlug:
        "joseph",

      relationType:
        "RELATED_PERSON",

      label:
        "요셉",
    }
  );
}


/* =====================================================
   PERSON — JOSEPH
   ===================================================== */

const josephExists =
  findNodeRange(
    source,
    "joseph"
  );


if (!josephExists) {

  const relations = [];


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


  if (
    findNodeRange(
      source,
      "egypt"
    )
  ) {

    relations.push({
      targetType:
        "place",

      targetSlug:
        "egypt",

      relationType:
        "RELATED_PLACE",

      label:
        "이집트",
    });
  }


  if (
    findNodeRange(
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


  const josephNode = `

  /* =====================================================
     PERSON — JOSEPH
     ===================================================== */

  {
    type: "person",

    slug: "joseph",

    titleKo: "요셉",

    titleEn: "Joseph",

    eyebrow:
      "PEOPLE · PATRIARCHAL FAMILY · GENESIS 37–50",

    summary:
      "야곱의 아들 가운데 한 사람으로, 형제들에 의해 이집트로 팔려간 뒤 이집트의 통치 체계 안에서 높은 지위에 오르고 가족을 기근에서 구하는 인물입니다.",

    overview:
      "요셉의 이야기는 창세기 후반부의 중심 서사입니다. 야곱의 가족 안에서 시작된 갈등은 요셉이 이집트로 팔려가는 사건으로 이어지고, 요셉은 종과 죄수의 위치를 거쳐 파라오의 꿈을 해석한 뒤 이집트의 식량 정책을 담당하는 높은 지위에 오릅니다. 이후 기근 때문에 이집트로 내려온 형제들과 다시 만나면서 아브라함에서 시작된 족장 가족의 이야기가 이집트로 이동합니다.",

    biblicalContext:
      "요셉 서사는 창세기의 족장 이야기와 출애굽기의 배경을 연결합니다. 야곱의 가족이 가나안에서 이집트로 이동하게 되는 과정을 설명하며, 창세기 마지막 부분에서 이스라엘 가족이 이집트에 거주하게 되는 역사적·서사적 배경을 형성합니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number: "01",

        title:
          "THE DREAMS",

        scripture:
          "Genesis 37:1–11",

        description:
          "요셉은 자신의 가족과 관련된 꿈을 이야기하며 형제들과의 갈등이 더욱 깊어집니다.",
      },


      {
        number: "02",

        title:
          "THE PIT",

        scripture:
          "Genesis 37:12–24",

        description:
          "형제들을 찾아간 요셉은 붙잡혀 옷을 빼앗기고 구덩이에 던져집니다.",
      },


      {
        number: "03",

        title:
          "SOLD TO EGYPT",

        scripture:
          "Genesis 37:25–36",

        description:
          "요셉은 상인들에게 넘겨지고 결국 이집트로 이동하게 됩니다.",
      },


      {
        number: "04",

        title:
          "POTIPHAR'S HOUSE",

        scripture:
          "Genesis 39:1–20",

        description:
          "이집트에서 보디발의 집에 들어간 요셉은 신뢰를 얻지만 이후 사건으로 인해 감옥에 갇히게 됩니다.",
      },


      {
        number: "05",

        title:
          "THE PRISON",

        scripture:
          "Genesis 39:21–40:23",

        description:
          "감옥에서 요셉은 함께 수감된 사람들의 꿈을 해석하며 이후 파라오 앞에 서게 되는 계기를 얻게 됩니다.",
      },


      {
        number: "06",

        title:
          "PHARAOH'S DREAMS",

        scripture:
          "Genesis 41:1–36",

        description:
          "요셉은 파라오의 꿈을 해석하고 풍년과 기근에 대비하기 위한 계획을 제시합니다.",
      },


      {
        number: "07",

        title:
          "GOVERNOR OF EGYPT",

        scripture:
          "Genesis 41:37–57",

        description:
          "요셉은 이집트의 식량 관리와 기근 대비를 담당하는 높은 지위에 오르게 됩니다.",
      },


      {
        number: "08",

        title:
          "THE BROTHERS RETURN",

        scripture:
          "Genesis 42–44",

        description:
          "가나안의 기근으로 인해 요셉의 형제들이 곡식을 구하기 위해 이집트로 내려오면서 가족의 이야기가 다시 연결됩니다.",
      },


      {
        number: "09",

        title:
          "RECONCILIATION",

        scripture:
          "Genesis 45",

        description:
          "요셉은 자신의 정체를 형제들에게 밝히고 가족과 화해합니다.",
      },


      {
        number: "10",

        title:
          "JACOB COMES TO EGYPT",

        scripture:
          "Genesis 46–47",

        description:
          "야곱과 그의 가족이 이집트로 이동하면서 족장 가족의 생활 무대가 가나안에서 이집트로 확장됩니다.",
      },


      {
        number: "11",

        title:
          "THE FINAL YEARS",

        scripture:
          "Genesis 50:15–26",

        description:
          "야곱이 죽은 뒤 요셉은 형제들을 안심시키고 생애 마지막까지 이집트에 머뭅니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Genesis 37",
      "Genesis 39–41",
      "Genesis 42–47",
      "Genesis 50",
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


  if (getNodePosition === -1) {
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
    josephNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PERSON — JOSEPH 추가 완료"
  );

}
else {

  console.log(
    "PERSON — JOSEPH 이미 존재"
  );
}


/* =====================================================
   VALIDATION
   ===================================================== */

const joseph =
  findNodeRange(
    source,
    "joseph"
  );


if (!joseph) {
  throw new Error(
    "Joseph 노드 생성 검증 실패"
  );
}


const validations = [
  [
    "Joseph person",
    joseph.content.includes(
      'type: "person"'
    ),
  ],

  [
    "Jacob relation",
    joseph.content.includes(
      'targetSlug: "jacob"'
    ),
  ],

  [
    "Genesis relation",
    joseph.content.includes(
      'targetSlug: "genesis"'
    ),
  ],

  [
    "Character Journey",
    joseph.content.includes(
      "characterJourney: ["
    ),
  ],

  [
    "Genesis → Joseph",
    findNodeRange(
      source,
      "genesis"
    )
      ?.content
      .includes(
        'targetSlug: "joseph"'
      ),
  ],

  [
    "Jacob → Joseph",
    findNodeRange(
      source,
      "jacob"
    )
      ?.content
      .includes(
        'targetSlug: "joseph"'
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
  "===================================="
);
console.log(
  "SCRAPTURA JOSEPH PATCH COMPLETE"
);
console.log(
  "===================================="
);
console.log(
  "Genesis → Joseph"
);
console.log(
  "Jacob → Joseph"
);
console.log(
  "PERSON — JOSEPH"
);
console.log(
  "Egypt 존재 시 양방향 연결"
);
console.log(
  "Hebron 존재 시 연결"
);
console.log(
  "기존 데이터 유지"
);
console.log(
  "백업:",
  backupPath
);