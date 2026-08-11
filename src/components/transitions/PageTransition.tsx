"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import styles from "./PageTransition.module.css"

type PageTransitionProps = {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const reduced = useReducedMotion() ?? false

  return (
    <div className={styles.stage}>
      {!reduced ? (
        <motion.div
          animate={{ scaleX: [0, 1, 1, 0] }}
          aria-hidden="true"
          className={styles.veil}
          initial={{ scaleX: 0 }}
          key={`veil-${pathname}`}
          transition={{
            delay: 0.35,
            duration: 1.45,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.32, 0.58, 1],
          }}
        />
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={styles.page}
          exit={{ opacity: 0, y: -10 }}
          initial={{ opacity: 0, y: 12 }}
          key={pathname}
          transition={{ duration: reduced ? 0.12 : 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
