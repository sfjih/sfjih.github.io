import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/src/content/projects"
import styles from "./Projects.module.css"

type ProjectCardProps = {
  project: Project
}

const placeholderBySlug: Record<string, string> = {
  "visual-campaign-alpha": "/placeholders/project-01.svg",
  "character-system-study": "/placeholders/project-02.svg",
  "event-identity-study": "/placeholders/project-03.svg",
  "aigc-motion-experiment": "/placeholders/project-04.svg",
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cover = placeholderBySlug[project.slug] ?? project.cover

  return (
    <article className={styles.card}>
      <Link
        aria-label={`${project.title}，查看项目`}
        className={styles.cardLink}
        href={`/work/${project.slug}`}
      >
        <div className={styles.media}>
          <Image alt="" fill sizes="(max-width: 809px) 100vw, 50vw" src={cover} />
          <span className={styles.viewCue} aria-hidden="true">VIEW</span>
        </div>
        <div className={styles.meta}>
          <div>
            <p>{project.category}</p>
            <h3>{project.title}</h3>
          </div>
          <span>{project.year}</span>
        </div>
      </Link>
    </article>
  )
}
