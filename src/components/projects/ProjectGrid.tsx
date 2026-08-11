import { SectionHeading } from "@/src/components/motion/SectionHeading"
import type { Project } from "@/src/content/projects"
import { ProjectCard } from "./ProjectCard"
import styles from "./Projects.module.css"

type ProjectGridProps = {
  projects: Project[]
  showHeading?: boolean
}

export function ProjectGrid({ projects, showHeading = false }: ProjectGridProps) {
  return (
    <section aria-labelledby="projects-heading" className={styles.section} id="work">
      {showHeading ? (
        <div className={styles.intro}>
          <p className={styles.kicker}>SELECTED WORK · 03</p>
          <SectionHeading
            as="h2"
            className={styles.heading}
            text="选择作品，不急着解释，先让画面说话。"
          />
        </div>
      ) : (
        <h2 className={styles.srOnly} id="projects-heading">选择作品</h2>
      )}
      {showHeading && <span className={styles.srOnly} id="projects-heading">选择作品</span>}

      <div className={styles.grid}>
        {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
      </div>
    </section>
  )
}
