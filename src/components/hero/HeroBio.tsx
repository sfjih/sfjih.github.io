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
    <div className={avatarStyles.stickyWrap}>
      <StickyAvatar bioRef={bioRef} />
      <section className={styles.hero} id="hero-section">
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{profile.name} · PORTFOLIO</p>
          <SectionHeading as="h1" className={styles.heroTitle} text={profile.title} />
        </div>
        <p className={styles.scrollNote}>SCROLL TO TURN THE PORTRAIT</p>
      </section>

        <section className={styles.bio} id="about" ref={bioRef}>
          <p className={styles.bioGreeting} data-testid="bio-greeting">你好！</p>
          <div className={styles.bioInner}>
            <div className={styles.bioLead}>
              <p className={styles.eyebrow}>ABOUT · 01</p>
              <p className={styles.bioRole}>{profile.title}</p>
            </div>
            <div aria-hidden="true" className={styles.bioPortraitSpace} />
            <div className={styles.bioCopy}>
              <SectionHeading className={styles.bioTitle} text={profile.bio} />
            </div>
          </div>
        </section>
    </div>
  )
}
