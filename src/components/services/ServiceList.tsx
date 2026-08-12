import { ScrollColorQuote } from "@/src/components/quote/ScrollColorQuote"
import { services } from "@/src/content/profile"
import styles from "./ServiceList.module.css"

export function ServiceList() {
  return (
    <section aria-labelledby="services-heading" className={styles.section} id="services">
      <div className={styles.intro}>
        <p className={styles.kicker}>SERVICES · 02</p>
        <ScrollColorQuote
          text="设计不是装饰，而是让复杂的信息变得清楚、可信、值得停留。"
          variant="heading"
        />
      </div>

      <h2 className={styles.srOnly} id="services-heading">服务方向</h2>
      <ol className={styles.list}>
        {services.map((service, index) => (
          <li className={styles.item} key={service.title}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
