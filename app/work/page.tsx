import type { Metadata } from "next"
import { SiteFooter } from "@/src/components/footer/SiteFooter"
import { ProjectGrid } from "@/src/components/projects/ProjectGrid"
import styles from "@/src/components/work/WorkDetailRenderer.module.css"
import { projects } from "@/src/content/projects"

export const metadata: Metadata = {
  title: "作品 | Visual Designer",
  description: "IP 全案、赛事主视觉、宣传海报、赛事物料与 AIGC 个人练习。",
}

export default function WorkPage() {
  return (
    <>
      <main className={styles.listingMain}>
        <header className={styles.listingHero}>
          <div>
            <p className={styles.listingKicker}>ARCHIVE · 2026</p>
            <h1>
              作品<span>档案</span>
            </h1>
          </div>
          <p className={styles.listingIntro}>
            以平面视觉为核心，收录 IP 全案、赛事主视觉、宣传海报与现场物料落地，并补充 AIGC 个人练习。
          </p>
        </header>
        <div className={styles.listingGrid}>
          <ProjectGrid projects={projects} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
