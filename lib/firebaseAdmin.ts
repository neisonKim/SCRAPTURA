import "server-only";

import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import {
  getAuth,
} from "firebase-admin/auth";

import {
  getFirestore,
} from "firebase-admin/firestore";


const projectId =
  process.env
    .FIREBASE_ADMIN_PROJECT_ID
    ?.trim();


const clientEmail =
  process.env
    .FIREBASE_ADMIN_CLIENT_EMAIL
    ?.trim();


const privateKey =
  process.env
    .FIREBASE_ADMIN_PRIVATE_KEY
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
      "Firebase Admin 환경변수가 설정되지 않았습니다.",
      "",
      "FIREBASE_ADMIN_PROJECT_ID",
      "FIREBASE_ADMIN_CLIENT_EMAIL",
      "FIREBASE_ADMIN_PRIVATE_KEY",
    ].join("\n")
  );
}


const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential:
          cert({
            projectId,
            clientEmail,
            privateKey,
          }),
      });


export const adminAuth =
  getAuth(
    adminApp
  );


export const adminDb =
  getFirestore(
    adminApp
  );


export {
  adminApp,
};