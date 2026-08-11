import { profile } from "@/src/content/profile"
import styles from "./SiteFooter.module.css"

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p>{profile.name} · VISUAL PORTFOLIO</p>
      <nav aria-label="页脚联系链接">
        {profile.contactLinks.map((link) => (
          <a href={link.href} key={link.label}>{link.label}</a>
        ))}
      </nav>
      <p>© {new Date().getFullYear()} · 何宇航</p>
    </footer>
  )
}
