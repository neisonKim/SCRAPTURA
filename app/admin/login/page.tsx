"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
  googleProvider,
} from "../../../lib/firebase";

import styles from "./page.module.css";


export default function AdminLoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");


  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");


      /*
       * GOOGLE LOGIN
       */
      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const user = result.user;


      /*
       * EMAIL CHECK
       */
      if (!user.email) {
        await signOut(auth);

        throw new Error(
          "Google 계정의 이메일을 확인할 수 없습니다."
        );
      }


      /*
       * OPERATOR DOCUMENT
       */
      const operatorRef = doc(
        db,
        "operators",
        user.email
      );

      const operatorSnapshot =
        await getDoc(operatorRef);


      /*
       * REGISTERED CHECK
       */
      if (!operatorSnapshot.exists()) {
        await signOut(auth);

        throw new Error(
          "등록되지 않은 운영자 계정입니다."
        );
      }


      const operator =
        operatorSnapshot.data();


      /*
       * ACTIVE CHECK
       */
      if (operator.active !== true) {
        await signOut(auth);

        throw new Error(
          "비활성화된 운영자 계정입니다."
        );
      }


      /*
       * ADMIN CHECK
       */
      if (operator.role !== "admin") {
        await signOut(auth);

        throw new Error(
          "관리자 권한이 없습니다."
        );
      }


      /*
       * SUCCESS
       */
      router.replace("/admin");

    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErrorMessage(
          error.message
        );
      } else {
        setErrorMessage(
          "로그인 중 오류가 발생했습니다."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className={styles.page}>

      <section className={styles.loginCard}>

        <div className={styles.brand}>
          SCRAPTURA
        </div>

        <small className={styles.eyebrow}>
          ADMINISTRATION
        </small>

        <h1>
          관리자 로그인
        </h1>

        <p className={styles.description}>
          SCRAPTURA 콘텐츠를 관리하려면
          등록된 Google 관리자 계정으로
          로그인하세요.
        </p>

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading
            ? "권한 확인 중..."
            : "Google로 로그인"}
        </button>

        {errorMessage && (
          <div className={styles.error}>
            {errorMessage}
          </div>
        )}

      </section>

    </main>
  );
}