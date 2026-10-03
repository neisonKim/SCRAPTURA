import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import admin from "firebase-admin";


/* =====================================================
   PATH
   ===================================================== */

const projectRoot =
  process.cwd();

const bibleBooksDir =
  path.join(
    projectRoot,
    "data",
    "bible",
    "books"
  );


/* =====================================================
   FIREBASE ADMIN
   ===================================================== */

function initializeFirebase() {

  if (
    admin.apps.length >
    0
  ) {

    return admin.app();

  }


  const projectId =
    process.env.FIREBASE_PROJECT_ID;

  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL;

  const privateKey =
    process.env.FIREBASE_PRIVATE_KEY
      ?.replace(
        /\\n/g,
        "\n"
      );


  if (
    !projectId ||
    !clientEmail ||
    !privateKey
  ) {

    throw new Error(
      [
        "",
        "Firebase Admin 환경변수가 없습니다.",
        "",
        "필요한 환경변수:",
        "FIREBASE_PROJECT_ID",
        "FIREBASE_CLIENT_EMAIL",
        "FIREBASE_PRIVATE_KEY",
        "",
      ].join(
        "\n"
      )
    );

  }


  return admin.initializeApp({

    credential:
      admin.credential.cert({

        projectId,

        clientEmail,

        privateKey,

      }),

  });

}


initializeFirebase();


const db =
  admin.firestore();


/* =====================================================
   VALID CONTENT TYPES
   ===================================================== */

const VALID_TYPES =
  new Set([
    "story",
    "person",
    "place",
    "period",
    "book",
    "visual",
  ]);


const VALID_RELATION_TYPES =
  new Set([
    "RELATED_PERSON",
    "RELATED_PLACE",
    "RELATED_PERIOD",
    "RELATED_BOOK",
    "RELATED_STORY",
  ]);


/* =====================================================
   LOAD JSON FILES
   ===================================================== */

function getJsonFiles() {

  if (
    !fs.existsSync(
      bibleBooksDir
    )
  ) {

    throw new Error(
      `Bible books directory not found: ${bibleBooksDir}`
    );

  }


  return fs
    .readdirSync(
      bibleBooksDir
    )
    .filter(
      (
        fileName
      ) =>
        fileName.endsWith(
          ".json"
        )
    )
    .sort();

}


/* =====================================================
   READ FILE
   ===================================================== */

function readBibleFile(
  fileName
) {

  const filePath =
    path.join(
      bibleBooksDir,
      fileName
    );


  const raw =
    fs.readFileSync(
      filePath,
      "utf8"
    );


  const data =
    JSON.parse(
      raw
    );


  if (
    Array.isArray(
      data
    )
  ) {

    return data;

  }


  if (
    Array.isArray(
      data.nodes
    )
  ) {

    return data.nodes;

  }


  throw new Error(
    `${fileName}: nodes 배열을 찾을 수 없습니다.`
  );

}


/* =====================================================
   NORMALIZE SLUG
   ===================================================== */

function normalizeSlug(
  value
) {

  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase();

}


/* =====================================================
   VALIDATE NODE
   ===================================================== */

function validateNode(
  node,
  sourceFile
) {

  if (
    !node ||
    typeof node !==
      "object"
  ) {

    throw new Error(
      `${sourceFile}: 잘못된 Node입니다.`
    );

  }


  if (
    !VALID_TYPES.has(
      node.type
    )
  ) {

    throw new Error(
      `${sourceFile}: 잘못된 type → ${node.type}`
    );

  }


  const slug =
    normalizeSlug(
      node.slug
    );


  if (
    !slug
  ) {

    throw new Error(
      `${sourceFile}: slug가 없습니다.`
    );

  }


  if (
    !node.titleKo ||
    !node.titleEn
  ) {

    throw new Error(
      `${sourceFile}: ${slug}의 titleKo/titleEn이 없습니다.`
    );

  }


  if (
    node.relations !==
      undefined
  ) {

    if (
      !Array.isArray(
        node.relations
      )
    ) {

      throw new Error(
        `${sourceFile}: ${slug} relations는 배열이어야 합니다.`
      );

    }


    for (
      const relation
      of node.relations
    ) {

      if (
        !VALID_TYPES.has(
          relation.targetType
        )
      ) {

        throw new Error(
          `${sourceFile}: ${slug}의 잘못된 targetType → ${relation.targetType}`
        );

      }


      if (
        !VALID_RELATION_TYPES.has(
          relation.relationType
        )
      ) {

        throw new Error(
          `${sourceFile}: ${slug}의 잘못된 relationType → ${relation.relationType}`
        );

      }


      if (
        !normalizeSlug(
          relation.targetSlug
        )
      ) {

        throw new Error(
          `${sourceFile}: ${slug} relation targetSlug가 없습니다.`
        );

      }

    }

  }


  return {

    ...node,

    slug,

  };

}


/* =====================================================
   LOAD ALL NODES
   ===================================================== */

function loadAllNodes() {

  const files =
    getJsonFiles();


  const nodes = [];


  for (
    const fileName
    of files
  ) {

    const fileNodes =
      readBibleFile(
        fileName
      );


    console.log(
      `READ  ${fileName} → ${fileNodes.length} nodes`
    );


    for (
      const rawNode
      of fileNodes
    ) {

      const node =
        validateNode(
          rawNode,
          fileName
        );


      nodes.push({

        ...node,

        sourceFile:
          fileName,

      });

    }

  }


  return nodes;

}


/* =====================================================
   DUPLICATE VALIDATION
   ===================================================== */

function validateDuplicates(
  nodes
) {

  const keys =
    new Set();


  for (
    const node
    of nodes
  ) {

    const key =
      `${node.type}__${node.slug}`;


    if (
      keys.has(
        key
      )
    ) {

      throw new Error(
        `중복 Node 발견 → ${key}`
      );

    }


    keys.add(
      key
    );

  }

}


/* =====================================================
   IMPORT
   ===================================================== */

async function importNodes(
  nodes
) {

  let successCount =
    0;


  for (
    const node
    of nodes
  ) {

    const documentId =
      `${node.type}__${node.slug}`;


    const {

      sourceFile,

      ...contentData

    } = node;


    await db
      .collection(
        "contents"
      )
      .doc(
        documentId
      )
      .set(

        {

          ...contentData,

          status:
            contentData.status ??
            "published",

          updatedAt:
            admin.firestore
              .FieldValue
              .serverTimestamp(),

          importMeta: {

            source:
              "SCRAPTURA_BIBLE_IMPORTER",

            sourceFile,

          },

        },

        {
          merge:
            true,
        }

      );


    successCount +=
      1;


    console.log(
      `IMPORT ${documentId}`
    );

  }


  return successCount;

}


/* =====================================================
   MAIN
   ===================================================== */

async function main() {

  console.log(
    ""
  );

  console.log(
    "========================================"
  );

  console.log(
    "SCRAPTURA BIBLE IMPORTER"
  );

  console.log(
    "========================================"
  );

  console.log(
    ""
  );


  const nodes =
    loadAllNodes();


  validateDuplicates(
    nodes
  );


  console.log(
    ""
  );

  console.log(
    `VALIDATION PASS → ${nodes.length} nodes`
  );

  console.log(
    ""
  );


  if (
    process.argv.includes(
      "--validate-only"
    )
  ) {

    console.log(
      "VALIDATE ONLY — Firestore에는 아무것도 쓰지 않았습니다."
    );

    return;

  }


  const imported =
    await importNodes(
      nodes
    );


  console.log(
    ""
  );

  console.log(
    "========================================"
  );

  console.log(
    `IMPORT COMPLETE → ${imported} nodes`
  );

  console.log(
    "========================================"
  );

}


main()
  .then(
    () => {

      process.exit(
        0
      );

    }
  )
  .catch(
    (
      error
    ) => {

      console.error(
        ""
      );

      console.error(
        "IMPORT FAILED"
      );

      console.error(
        error
      );

      process.exit(
        1
      );

    }
  );