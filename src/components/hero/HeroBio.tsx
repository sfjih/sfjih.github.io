"use client"

import { useRef } from "react"
import { profile } from "@/src/content/profile"
import { SectionHeading } from "@/src/components/motion/SectionHeading"
import { StickyAvatar } from "./StickyAvatar"
import avatarStyles from "./StickyAvatar.module.css"
import styles from "./HeroBio.module.css"

export function HeroBio() {
  const bioRef = useRef<HTMLElement>(null)

  return (
    <>
      <section className={styles.hero} id="hero-section">
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{profile.name} · PORTFOLIO</p>
          <SectionHeading as="h1" className={styles.heroTitle} text={profile.title} />
          <p className={styles.scrollNote}>SCROLL TO TURN THE PORTRAIT</p>
        </div>
      </section>

      <div className={avatarStyles.stickyWrap}>
        <StickyAvatar bioRef={bioRef} />
        <section className={styles.bio} id="bio-section" ref={bioRef}>
          <div className={styles.bioInner}>
            <p className={styles.eyebrow}>ABOUT · 01</p>
            <SectionHeading className={styles.bioTitle} text={profile.bio} />
          </div>
        </section>
      </div>
    </>
  )
}
