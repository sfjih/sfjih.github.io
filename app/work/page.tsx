import type { Metadata } from "next"
import { SiteFooter } from "@/src/components/footer/SiteFooter"
import { ProjectGrid } from "@/src/components/projects/ProjectGrid"
import styles from "@/src/components/work/WorkDetailRenderer.module.css"
import { projects } from "@/src/content/projects"

export const metadata: Metadata = {
  title: "作品 | Visual Designer",
  description: "视觉设计、品牌视觉、角色系统与动态实验作品。",
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
            一组仍在持续整理的视觉实践：从图像系统、角色语言，到动态内容实验。
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
