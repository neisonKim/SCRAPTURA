"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../lib/firebase";

import styles from "./page.module.css";


export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [userEmail, setUserEmail] =
    useState("");


  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          /*
           * NOT LOGGED IN
           */
          if (!user || !user.email) {
            router.replace(
              "/admin/login"
            );

            return;
          }


          try {
            /*
             * OPERATOR CHECK
             */
            const operatorRef = doc(
              db,
              "operators",
              user.email
            );

            const operatorSnapshot =
              await getDoc(
                operatorRef
              );


            if (
              !operatorSnapshot.exists()
            ) {
              await signOut(auth);

              router.replace(
                "/admin/login"
              );

              return;
            }


            const operator =
              operatorSnapshot.data();


            /*
             * PERMISSION CHECK
             */
            if (
              operator.active !== true ||
              operator.role !== "admin"
            ) {
              await signOut(auth);

              router.replace(
                "/admin/login"
              );

              return;
            }


            /*
             * ADMIN VERIFIED
             */
            setUserEmail(user.email);
            setLoading(false);

          } catch (error) {
            console.error(error);

            await signOut(auth);

            router.replace(
              "/admin/login"
            );
          }
        }
      );


    return () => {
      unsubscribe();
    };
  }, [router]);


  const handleLogout =
    async () => {
      await signOut(auth);

      router.replace(
        "/admin/login"
      );
    };


  if (loading) {
    return (
      <main className={styles.loadingPage}>
        관리자 권한을 확인하고 있습니다.
      </main>
    );
  }


  return (
    <main className={styles.page}>

      <header className={styles.adminHeader}>

        <div>
          <small>
            SCRAPTURA
          </small>

          <h1>
            Administration
          </h1>
        </div>


        <div className={styles.account}>

          <span>
            {userEmail}
          </span>

          <button
            type="button"
            onClick={handleLogout}
          >
            LOGOUT
          </button>

        </div>

      </header>


      <section className={styles.intro}>

        <small>
          CONTENT MANAGEMENT
        </small>

        <h2>
          SCRAPTURA 콘텐츠 관리
        </h2>

        <p>
          성경 이야기, 인물, 장소,
          시대와 성경책을 관리합니다.
        </p>

      </section>


      <section className={styles.grid}>

        <article className={styles.card}>
          <span>01</span>
          <small>STORIES</small>
          <h3>이야기</h3>
          <p>
            성경의 주요 사건과
            이야기 콘텐츠를 관리합니다.
          </p>
        </article>


        <article className={styles.card}>
          <span>02</span>
          <small>PEOPLE</small>
          <h3>인물</h3>
          <p>
            성경 인물과 Character Journey를
            관리합니다.
          </p>
        </article>


        <article className={styles.card}>
          <span>03</span>
          <small>PLACES</small>
          <h3>장소</h3>
          <p>
            성경의 도시와 지역,
            주요 장소를 관리합니다.
          </p>
        </article>


        <article className={styles.card}>
          <span>04</span>
          <small>TIMELINE</small>
          <h3>시대</h3>
          <p>
            성경의 시대와 역사적 흐름을
            관리합니다.
          </p>
        </article>


        <article className={styles.card}>
          <span>05</span>
          <small>BIBLE</small>
          <h3>성경</h3>
          <p>
            성경책과 각 책의 주요 흐름을
            관리합니다.
          </p>
        </article>


        <article className={styles.card}>
          <span>06</span>
          <small>VISUAL</small>
          <h3>Visual</h3>
          <p>
            시각 자료와 Visual Scripture
            콘텐츠를 관리합니다.
          </p>
        </article>

      </section>

    </main>
  );
}