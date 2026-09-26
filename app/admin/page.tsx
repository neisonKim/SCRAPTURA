import Link from "next/link";

import styles from "./page.module.css";

const adminCards = [
  {
    number: "01",
    label: "STORIES",
    title: "이야기",
    description:
      "성경의 주요 사건과 이야기 콘텐츠를 관리합니다.",
    href: "/admin/contents?type=story",
  },
  {
    number: "02",
    label: "PEOPLE",
    title: "인물",
    description:
      "성경 인물과 Character Journey를 관리합니다.",
    href: "/admin/contents?type=person",
  },
  {
    number: "03",
    label: "PLACES",
    title: "장소",
    description:
      "성경의 도시와 지역, 주요 장소를 관리합니다.",
    href: "/admin/contents?type=place",
  },
  {
    number: "04",
    label: "TIMELINE",
    title: "시대",
    description:
      "성경의 시대와 역사적 흐름을 관리합니다.",
    href: "/admin/contents?type=period",
  },
  {
    number: "05",
    label: "BIBLE",
    title: "성경",
    description:
      "성경책과 각 책의 주요 흐름을 관리합니다.",
    href: "/admin/contents?type=book",
  },
  {
    number: "06",
    label: "VISUAL",
    title: "Visual",
    description:
      "시각 자료와 Visual Scripture 콘텐츠를 관리합니다.",
    href: "/admin/contents?type=visual",
  },
] as const;

export default function AdminPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>

        <header className={styles.header}>
          <small>CONTENT MANAGEMENT</small>

          <h1>
            SCRAPTURA 콘텐츠 관리
          </h1>

          <p>
            성경 이야기, 인물, 장소, 시대와
            성경책을 관리합니다.
          </p>
        </header>

        <section className={styles.grid}>
          {adminCards.map((card) => (
            <Link
              className={styles.card}
              href={card.href}
              key={card.label}
            >
              <span className={styles.number}>
                {card.number}
              </span>

              <div className={styles.cardBody}>
                <small>
                  {card.label}
                </small>

                <h2>
                  {card.title}
                </h2>

                <p>
                  {card.description}
                </p>
              </div>

              <span className={styles.arrow}>
                MANAGE →
              </span>
            </Link>
          ))}
        </section>

      </div>
    </main>
  );
}