import { profile } from "@/src/content/profile"
import styles from "./ContactSection.module.css"

export function ContactSection() {
  return (
    <section aria-labelledby="contact-heading" className={styles.section} id="contact">
      <div className={styles.copy}>
        <p>CONTACT · 05</p>
        <h2 id="contact-heading">有一个值得认真对待的视觉问题？</h2>
        <span>{profile.name} · {profile.title}</span>
      </div>

      <form aria-describedby="contact-status" aria-label="联系表单（尚未接入）" className={styles.form}>
        <label>
          <span>你的称呼</span>
          <input autoComplete="name" name="name" placeholder="姓名 / 团队" type="text" />
        </label>
        <label>
          <span>联系邮箱</span>
          <input autoComplete="email" name="email" placeholder="name@example.com" type="email" />
        </label>
        <label>
          <span>想聊的内容</span>
          <textarea name="message" placeholder="简单介绍项目、时间和期待。" rows={5} />
        </label>
        <button aria-describedby="contact-status" type="button">联系功能将在内容阶段接入</button>
        <p className={styles.status} id="contact-status">联系功能将在内容阶段接入</p>
      </form>
    </section>
  )
}
