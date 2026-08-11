import { profile, proofCards } from "@/src/content/profile"
import styles from "./FlipCardGrid.module.css"

const cards = [
  ...proofCards,
  { label: "设计者", value: profile.name, description: profile.title },
]

export function FlipCardGrid() {
  return (
    <section aria-labelledby="proof-heading" className={styles.section}>
      <div className={styles.header}>
        <p>PROFILE NOTES · 04</p>
        <h2 id="proof-heading">翻过来，看看现在的进度。</h2>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <article className={styles.card} key={card.label} tabIndex={0}>
            <span className={styles.srOnly}>
              {card.label}：{card.value}。{card.description}
            </span>
            <div aria-hidden="true" className={styles.inner}>
              <div className={`${styles.face} ${styles.front}`}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <small>FOCUS / HOVER</small>
              </div>
              <div className={`${styles.face} ${styles.back}`}>
                <span>{card.label}</span>
                <p>{card.description}</p>
                <small>BACK · {card.value}</small>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
