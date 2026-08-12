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
        </div>
      ) : (
        <h2 className={styles.srOnly} id="projects-heading">选择作品</h2>
      )}
      {showHeading && <span className={styles.srOnly} id="projects-heading">选择作品</span>}

      <div
        className={`${styles.grid} ${showHeading ? styles.homepageRow : ""}`}
        data-layout={showHeading ? "homepage-row" : "archive-grid"}
        data-testid="project-grid"
      >
        {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
      </div>
    </section>
  )
}
