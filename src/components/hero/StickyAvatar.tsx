"use client"

import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import type { RefObject } from "react"
import styles from "./StickyAvatar.module.css"

type StickyAvatarProps = {
  bioRef: RefObject<HTMLElement | null>
}

export function StickyAvatar({ bioRef }: StickyAvatarProps) {
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({
    target: bioRef,
    offset: ["start end", "start start"],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1])
  const y = useTransform(scrollYProgress, [0, 1], [114, 0])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 180])

  return (
    <div className={styles.sticky}>
      <motion.div
        className={styles.avatar}
        style={{ scale: reduced ? 1 : scale, y: reduced ? 0 : y }}
      >
        <motion.div className={styles.faces} style={{ rotateY: reduced ? 0 : rotateY }}>
          <Image
            alt="何宇航证件照，黑白正面"
            className={`${styles.face} ${styles.front}`}
            fill
            priority
            sizes="(max-width: 809px) 181px, 400px"
            src="/portrait.webp"
          />
          <Image
            alt="何宇航证件照，彩色背面"
            className={`${styles.face} ${styles.back}`}
            fill
            priority
            sizes="(max-width: 809px) 181px, 400px"
            src="/portrait.webp"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
