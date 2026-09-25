"use client";

import {
  useRef,
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import {
  auth,
} from "../../lib/firebase";


type HeroImageUploaderProps = {
  value: string;
  onChange: (
    value: string
  ) => void;
  contentType: string;
  slug: string;
};


type UploadApiResponse = {
  ok: boolean;

  message?: string;

  image?: {
    url: string;
    publicId: string;
    width: number | null;
    height: number | null;
    format: string | null;
    bytes: number | null;
  };
};


const MAX_FILE_SIZE =
  10 * 1024 * 1024;


const ALLOWED_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);


export default function HeroImageUploader({
  value,
  onChange,
  contentType,
  slug,
}: HeroImageUploaderProps) {

  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );


  const abortControllerRef =
    useRef<AbortController | null>(
      null
    );


  const [
    uploading,
    setUploading,
  ] = useState(false);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  /*
   * =====================================
   * RESET FILE INPUT
   * =====================================
   */

  function resetFileInput() {
    if (
      inputRef.current
    ) {
      inputRef.current.value =
        "";
    }
  }


  /*
   * =====================================
   * CANCEL
   * =====================================
   */

  function handleCancelUpload() {
    abortControllerRef
      .current
      ?.abort();

    abortControllerRef.current =
      null;

    setUploading(false);

    setErrorMessage(
      "이미지 업로드가 취소되었습니다."
    );

    setSuccessMessage("");

    resetFileInput();
  }


  /*
   * =====================================
   * IMAGE SELECT
   * =====================================
   */

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    setErrorMessage("");
    setSuccessMessage("");


    /*
     * 파일 타입 검사
     */

    if (
      !ALLOWED_TYPES.has(
        file.type
      )
    ) {
      setErrorMessage(
        "JPG, PNG, WEBP 이미지만 업로드할 수 있습니다."
      );

      resetFileInput();

      return;
    }


    /*
     * 파일 크기 검사
     */

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      setErrorMessage(
        "이미지는 최대 10MB까지 업로드할 수 있습니다."
      );

      resetFileInput();

      return;
    }


    /*
     * Slug 검사
     */

    const normalizedSlug =
      slug
        .trim()
        .toLowerCase();


    if (
      !normalizedSlug
    ) {
      setErrorMessage(
        "이미지를 업로드하기 전에 Slug를 먼저 입력해주세요."
      );

      resetFileInput();

      return;
    }


    /*
     * 로그인 확인
     */

    const currentUser =
      auth.currentUser;


    if (
      !currentUser
    ) {
      setErrorMessage(
        "관리자 로그인이 필요합니다."
      );

      resetFileInput();

      return;
    }


    /*
     * Upload 시작
     */

    const controller =
      new AbortController();


    abortControllerRef.current =
      controller;


    setUploading(true);


    try {

      /*
       * Firebase ID Token
       */

      const idToken =
        await currentUser
          .getIdToken(
            true
          );


      /*
       * FormData
       */

      const formData =
        new FormData();


      formData.append(
        "file",
        file
      );


      formData.append(
        "contentType",
        contentType
          .trim()
          .toLowerCase() ||
          "content"
      );


      formData.append(
        "slug",
        normalizedSlug
      );


      /*
       * SCRAPTURA Upload API
       */

      const response =
        await fetch(
          "/api/admin/upload-image",
          {
            method:
              "POST",

            headers: {
              Authorization:
                `Bearer ${idToken}`,
            },

            body:
              formData,

            signal:
              controller.signal,
          }
        );


      let result:
        UploadApiResponse;


      try {
        result =
          (await response.json()) as
            UploadApiResponse;
      } catch {
        throw new Error(
          "업로드 서버의 응답을 읽을 수 없습니다."
        );
      }


      /*
       * API Error
       */

      if (
        !response.ok ||
        !result.ok ||
        !result.image?.url
      ) {
        throw new Error(
          result.message ||
            `이미지 업로드에 실패했습니다. (${response.status})`
        );
      }


      /*
       * Hero Image URL 변경
       */

      onChange(
        result.image.url
      );


      setSuccessMessage(
        "이미지가 Cloudinary에 업로드되었습니다."
      );


    } catch (error) {

      if (
        error instanceof DOMException &&
        error.name ===
          "AbortError"
      ) {
        setErrorMessage(
          "이미지 업로드가 취소되었습니다."
        );

        return;
      }


      console.error(
        "[HeroImageUploader]",
        error
      );


      if (
        error instanceof Error
      ) {
        setErrorMessage(
          error.message
        );
      } else {
        setErrorMessage(
          "이미지 업로드에 실패했습니다."
        );
      }

    } finally {

      abortControllerRef.current =
        null;

      setUploading(false);

      resetFileInput();
    }
  }


  /*
   * =====================================
   * REMOVE HERO IMAGE
   * =====================================
   */

  function handleRemoveImage() {
    if (
      uploading
    ) {
      return;
    }


    onChange("");

    setSuccessMessage(
      "Hero Image 연결을 제거했습니다."
    );

    setErrorMessage("");

    resetFileInput();
  }


  /*
   * =====================================
   * RENDER
   * =====================================
   */

  return (
    <section
      style={{
        marginTop: "14px",
        padding: "18px",
        border:
          "1px solid rgba(194, 157, 92, 0.28)",
        borderRadius: "10px",
        background:
          "rgba(15, 24, 20, 0.72)",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >

        <div>

          <div
            style={{
              color:
                "#f4ead8",
              fontSize:
                "14px",
              fontWeight:
                700,
            }}
          >
            Hero Image Upload
          </div>


          <div
            style={{
              marginTop:
                "5px",
              color:
                "rgba(244,234,216,0.62)",
              fontSize:
                "12px",
              lineHeight:
                1.6,
            }}
          >
            JPG · PNG · WEBP
            / 최대 10MB
          </div>

        </div>


        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >

          {!uploading ? (

            <label
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                minHeight:
                  "38px",
                padding:
                  "0 16px",
                border:
                  "1px solid rgba(194,157,92,0.5)",
                borderRadius:
                  "7px",
                background:
                  "rgba(194,157,92,0.12)",
                color:
                  "#e7c98d",
                fontSize:
                  "13px",
                fontWeight:
                  700,
                cursor:
                  "pointer",
              }}
            >

              이미지 업로드

              <input
                ref={
                  inputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleFileChange
                }
                style={{
                  display:
                    "none",
                }}
              />

            </label>

          ) : (

            <button
              type="button"
              onClick={
                handleCancelUpload
              }
              style={{
                minHeight:
                  "38px",
                padding:
                  "0 16px",
                border:
                  "1px solid rgba(255,120,120,0.4)",
                borderRadius:
                  "7px",
                background:
                  "rgba(255,90,90,0.08)",
                color:
                  "#ffb3b3",
                fontSize:
                  "13px",
                fontWeight:
                  700,
                cursor:
                  "pointer",
              }}
            >
              업로드 취소
            </button>

          )}


          {value && (

            <button
              type="button"
              onClick={
                handleRemoveImage
              }
              disabled={
                uploading
              }
              style={{
                minHeight:
                  "38px",
                padding:
                  "0 16px",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                borderRadius:
                  "7px",
                background:
                  "rgba(255,255,255,0.04)",
                color:
                  "rgba(255,255,255,0.72)",
                fontSize:
                  "13px",
                cursor:
                  uploading
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              이미지 제거
            </button>

          )}

        </div>

      </div>


      {uploading && (

        <div
          style={{
            marginTop:
              "16px",
            padding:
              "12px 14px",
            borderRadius:
              "7px",
            background:
              "rgba(194,157,92,0.08)",
            color:
              "#e7c98d",
            fontSize:
              "13px",
          }}
        >
          Cloudinary에
          이미지를 업로드하고
          있습니다...
        </div>

      )}


      {errorMessage && (

        <div
          style={{
            marginTop:
              "14px",
            padding:
              "11px 13px",
            borderRadius:
              "7px",
            background:
              "rgba(180,50,50,0.1)",
            border:
              "1px solid rgba(255,100,100,0.22)",
            color:
              "#ffb6b6",
            fontSize:
              "13px",
            lineHeight:
              1.6,
          }}
        >
          {errorMessage}
        </div>

      )}


      {successMessage && (

        <div
          style={{
            marginTop:
              "14px",
            padding:
              "11px 13px",
            borderRadius:
              "7px",
            background:
              "rgba(68,140,92,0.1)",
            border:
              "1px solid rgba(110,190,135,0.22)",
            color:
              "#b8e2c4",
            fontSize:
              "13px",
          }}
        >
          {successMessage}
        </div>

      )}


      {value && (

        <div
          style={{
            marginTop:
              "18px",
          }}
        >

          <div
            style={{
              marginBottom:
                "8px",
              color:
                "rgba(244,234,216,0.58)",
              fontSize:
                "11px",
              fontWeight:
                700,
              letterSpacing:
                "0.08em",
              textTransform:
                "uppercase",
            }}
          >
            Current Preview
          </div>


          <div
            style={{
              overflow:
                "hidden",
              width:
                "100%",
              maxWidth:
                "520px",
              borderRadius:
                "9px",
              border:
                "1px solid rgba(255,255,255,0.08)",
              background:
                "#090d0b",
            }}
          >

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                value
              }
              alt="Hero image preview"
              style={{
                display:
                  "block",
                width:
                  "100%",
                maxHeight:
                  "300px",
                objectFit:
                  "cover",
              }}
            />

          </div>


          <div
            style={{
              marginTop:
                "8px",
              color:
                "rgba(255,255,255,0.45)",
              fontSize:
                "11px",
              lineHeight:
                1.5,
              wordBreak:
                "break-all",
            }}
          >
            {value}
          </div>

        </div>

      )}

    </section>
  );
}