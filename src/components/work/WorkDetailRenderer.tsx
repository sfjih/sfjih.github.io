"use client"

import Image from "next/image"
import { useState } from "react"
import type { ProjectSection } from "@/src/content/projects"
import styles from "./WorkDetailRenderer.module.css"

type WorkDetailRendererProps = {
  sections: ProjectSection[]
}

type MediaImageProps = {
  alt: string
  sizes: string
  src: string
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div aria-label={label} className={styles.mediaPlaceholder} role="img">
      <span aria-hidden="true">MEDIA / PENDING</span>
      <p>作品媒体整理中</p>
    </div>
  )
}

function MediaImage({ alt, sizes, src }: MediaImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <MediaPlaceholder label={`${alt}（媒体整理中）`} />
  }

  return (
    <Image
      alt={alt}
      fill
      onError={() => setHasError(true)}
      sizes={sizes}
      src={src}
    />
  )
}

function MediaVideo({ poster, src, title }: Extract<ProjectSection, { type: "video" }>) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <MediaPlaceholder label={`${title}（媒体整理中）`} />
  }

  return (
    <video
      aria-label={title}
      className={styles.video}
      controls
      onError={() => setHasError(true)}
      playsInline
      poster={poster}
      preload="metadata"
    >
      <source src={src} type="video/mp4" />
      您的浏览器暂不支持视频播放。
    </video>
  )
}

function renderSection(section: ProjectSection, index: number) {
  switch (section.type) {
    case "text":
      return (
        <section className={styles.textSection} key={`text-${index}`}>
          <p className={styles.sectionIndex}>{String(index + 1).padStart(2, "0")}</p>
          <div>
            <h2>{section.heading}</h2>
            <p className={styles.bodyCopy}>{section.body}</p>
          </div>
        </section>
      )
    case "image":
      return (
        <figure className={styles.figure} key={`image-${index}`}>
          <div className={styles.singleMedia}>
            <MediaImage alt={section.alt} sizes="(max-width: 809px) 100vw, 1180px" src={section.src} />
          </div>
          {section.caption ? <figcaption>{section.caption}</figcaption> : null}
        </figure>
      )
    case "imagePair":
      return (
        <section aria-label="项目图片组" className={styles.imagePair} key={`image-pair-${index}`}>
          {section.images.map((image, imageIndex) => (
            <div className={styles.pairedMedia} key={`${image.src}-${imageIndex}`}>
              <MediaImage
                alt={image.alt}
                sizes="(max-width: 809px) 100vw, 50vw"
                src={image.src}
              />
            </div>
          ))}
        </section>
      )
    case "video":
      return (
        <section aria-label={section.title} className={styles.videoFrame} key={`video-${index}`}>
          <MediaVideo {...section} />
        </section>
      )
    case "facts":
      return (
        <section aria-label="项目事实" className={styles.facts} key={`facts-${index}`}>
          <p className={styles.sectionIndex}>{String(index + 1).padStart(2, "0")}</p>
          <dl>
            {section.items.map((item) => (
              <div key={`${item.label}-${item.value}`}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )
    default: {
      const unreachable: never = section
      return unreachable
    }
  }
}

export function WorkDetailRenderer({ sections }: WorkDetailRendererProps) {
  return <div className={styles.renderer}>{sections.map(renderSection)}</div>
}
