import Link from "next/link"
import { SiteFooter } from "@/src/components/footer/SiteFooter"
import styles from "@/src/components/work/WorkDetailRenderer.module.css"

export default function NotFound() {
  return (
    <>
      <main className={styles.notFoundMain}>
        <div className={styles.notFoundInner}>
          <p className={styles.notFoundCode}>404 · NOT FOUND</p>
          <div>
            <h1>这一页还没有被装订。</h1>
            <p className={styles.notFoundMessage}>
              你访问的页面不存在，或作品仍在整理中。可以回到作品档案继续浏览。
            </p>
            <Link className={styles.notFoundLink} href="/work">
              查看全部作品 →
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
