import { SectionHeading } from "@/src/components/motion/SectionHeading"
import { services } from "@/src/content/profile"
import styles from "./ServiceList.module.css"

export function ServiceList() {
  return (
    <section aria-labelledby="services-heading" className={styles.section} id="services">
      <div className={styles.intro}>
        <p className={styles.kicker}>SERVICES · 02</p>
        <SectionHeading
          as="h2"
          className={styles.heading}
          text="把视觉方向落实为清楚、连贯的内容体验。"
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
