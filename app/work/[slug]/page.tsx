import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteFooter } from "@/src/components/footer/SiteFooter"
import { WorkDetailRenderer } from "@/src/components/work/WorkDetailRenderer"
import styles from "@/src/components/work/WorkDetailRenderer.module.css"
import { getProjectBySlug, projects } from "@/src/content/projects"

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return { title: "作品未找到 | Visual Designer" }
  }

  return {
    title: `${project.title} | Visual Designer`,
    description: project.summary,
  }
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const projectIndex = projects.findIndex((item) => item.slug === project.slug)
  const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length]
  const nextProject = projects[(projectIndex + 1) % projects.length]

  return (
    <>
      <main className={styles.detailMain}>
        <header className={styles.detailHeader}>
          <div>
            <p className={styles.eyebrow}>CASE STUDY · {project.year}</p>
            <h1 className={styles.detailTitle}>{project.title}</h1>
          </div>
          <dl className={styles.detailMeta}>
            <div>
              <dt>类别</dt>
              <dd>{project.category}</dd>
            </div>
            <div>
              <dt>年份</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>职责</dt>
              <dd>{project.role}</dd>
            </div>
          </dl>
        </header>

        <div className={styles.projectHeroMedia}>
          <Image
            alt={`${project.title}项目封面`}
            fill
            priority
            sizes="100vw"
            src={project.cover}
          />
        </div>

        <div className={styles.detailContent}>
          <section aria-labelledby="project-summary" className={styles.summary}>
            <h2 id="project-summary">项目简介</h2>
            <p>{project.summary}</p>
          </section>
          <WorkDetailRenderer sections={project.sections} />
        </div>

        <nav aria-label="作品浏览" className={styles.detailNavigation}>
          <Link className={styles.projectNavLink} href={`/work/${previousProject.slug}`}>
            <span className={styles.navLabel}>← 上一个项目</span>
            <strong>{previousProject.title}</strong>
          </Link>
          <Link className={styles.returnLink} href="/work">
            返回全部作品
          </Link>
          <Link className={styles.projectNavLink} href={`/work/${nextProject.slug}`}>
            <span className={styles.navLabel}>下一个项目 →</span>
            <strong>{nextProject.title}</strong>
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </>
  )
}
