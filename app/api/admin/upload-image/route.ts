import { NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";

import {
  adminAuth,
  adminDb,
} from "../../../../lib/firebaseAdmin";


export const runtime = "nodejs";


/*
 * =====================================
 * CLOUDINARY CONFIG
 * =====================================
 */

const cloudinaryUrl =
  process.env
    .CLOUDINARY_URL
    ?.trim();


if (!cloudinaryUrl) {
  throw new Error(
    "CLOUDINARY_URL 환경변수가 설정되지 않았습니다."
  );
}

/*
 * =====================================
 * UPLOAD SETTINGS
 * =====================================
 */

const MAX_FILE_SIZE =
  10 * 1024 * 1024;


const ALLOWED_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);


/*
 * =====================================
 * UTILS
 * =====================================
 */

function sanitizePathSegment(
  value: string
) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /[^a-z0-9_-]/g,
        ""
      ) || "unknown"
  );
}


function sanitizeFileName(
  value: string
) {
  const withoutExtension =
    value.replace(
      /\.[^/.]+$/,
      ""
    );

  return (
    withoutExtension
      .trim()
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /[^a-z0-9_-]/g,
        ""
      ) || `image-${Date.now()}`
  );
}


/*
 * =====================================
 * VERIFY ADMIN
 * =====================================
 */

async function verifyAdmin(
  request: Request
) {
  const authorization =
    request.headers.get(
      "authorization"
    );


  if (
    !authorization ||
    !authorization.startsWith(
      "Bearer "
    )
  ) {
    throw new Error(
      "UNAUTHORIZED"
    );
  }


  const idToken =
    authorization
      .slice(7)
      .trim();


  if (!idToken) {
    throw new Error(
      "UNAUTHORIZED"
    );
  }


  const decodedToken =
    await adminAuth
      .verifyIdToken(
        idToken
      );


  const email =
    decodedToken.email
      ?.trim()
      .toLowerCase();


  if (
    !email ||
    decodedToken.email_verified !== true
  ) {
    throw new Error(
      "UNAUTHORIZED"
    );
  }


  const operatorSnapshot =
    await adminDb
      .collection(
        "operators"
      )
      .doc(
        email
      )
      .get();


  if (
    !operatorSnapshot.exists
  ) {
    throw new Error(
      "FORBIDDEN"
    );
  }


  const operator =
    operatorSnapshot.data();


  if (
    operator?.active !== true ||
    operator?.role !== "admin"
  ) {
    throw new Error(
      "FORBIDDEN"
    );
  }


  return {
    uid: decodedToken.uid,
    email,
  };
}


/*
 * =====================================
 * CLOUDINARY UPLOAD
 * =====================================
 */

async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId: string
) {
  return new Promise<{
    secure_url: string;
    public_id: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
  }>(
    (
      resolve,
      reject
    ) => {
      const uploadStream =
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              public_id:
                publicId,
              resource_type:
                "image",
              overwrite:
                false,
            },
            (
              error,
              result
            ) => {
              if (
                error ||
                !result
              ) {
                reject(
                  error ||
                    new Error(
                      "Cloudinary 업로드 결과가 없습니다."
                    )
                );

                return;
              }


              resolve({
                secure_url:
                  result.secure_url,

                public_id:
                  result.public_id,

                width:
                  result.width,

                height:
                  result.height,

                format:
                  result.format,

                bytes:
                  result.bytes,
              });
            }
          );


      uploadStream.end(
        buffer
      );
    }
  );
}


/*
 * =====================================
 * POST
 * =====================================
 */

export async function POST(
  request: Request
) {
  try {

    /*
     * 관리자 인증
     */

    const admin =
      await verifyAdmin(
        request
      );


    /*
     * FormData
     */

    const formData =
      await request
        .formData();


    const file =
      formData.get(
        "file"
      );


    const contentType =
      String(
        formData.get(
          "contentType"
        ) ?? ""
      );


    const slug =
      String(
        formData.get(
          "slug"
        ) ?? ""
      );


    /*
     * 파일 검증
     */

    if (
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "이미지 파일이 없습니다.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      !ALLOWED_TYPES.has(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "JPG, PNG, WEBP 이미지만 업로드할 수 있습니다.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      file.size <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "빈 파일은 업로드할 수 없습니다.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "이미지는 최대 10MB까지 업로드할 수 있습니다.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      !slug.trim()
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Slug를 먼저 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * Cloudinary 경로
     */

    const safeContentType =
      sanitizePathSegment(
        contentType
      );


    const safeSlug =
      sanitizePathSegment(
        slug
      );


    const safeFileName =
      sanitizeFileName(
        file.name
      );


    const folder =
      [
        "scraptura",
        "content",
        safeContentType,
        safeSlug,
      ].join("/");


    const publicId =
      `${Date.now()}-${safeFileName}`;


    /*
     * File → Buffer
     */

    const arrayBuffer =
      await file
        .arrayBuffer();


    const buffer =
      Buffer.from(
        arrayBuffer
      );


    /*
     * Cloudinary Upload
     */

    const uploaded =
      await uploadToCloudinary(
        buffer,
        folder,
        publicId
      );


    /*
     * Result
     */

    return NextResponse.json(
      {
        ok: true,

        image: {
          url:
            uploaded
              .secure_url,

          publicId:
            uploaded
              .public_id,

          width:
            uploaded
              .width ??
            null,

          height:
            uploaded
              .height ??
            null,

          format:
            uploaded
              .format ??
            null,

          bytes:
            uploaded
              .bytes ??
            file.size,
        },

        uploadedBy:
          admin.email,
      },
      {
        status: 200,
      }
    );

    } catch (error) {

    console.error(
      "[SCRAPTURA Cloudinary Upload]",
      error
    );


    /*
     * =====================================
     * AUTH ERROR
     * =====================================
     */

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "로그인이 필요합니다.",
        },
        {
          status: 401,
        }
      );
    }


    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "이미지 업로드 권한이 없습니다.",
        },
        {
          status: 403,
        }
      );
    }


    /*
     * =====================================
     * REAL ERROR MESSAGE
     * =====================================
     */

    let errorMessage =
      "이미지 업로드 중 서버 오류가 발생했습니다.";


    if (
      error instanceof Error
    ) {
      errorMessage =
        error.message;
    }


    else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage =
        String(
          (
            error as {
              message?: unknown;
            }
          ).message ??
            errorMessage
        );
    }


    return NextResponse.json(
      {
        ok: false,
        message:
          errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}