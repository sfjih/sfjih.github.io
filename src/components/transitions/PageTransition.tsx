"use client"

import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "motion/react"
import { usePathname } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import styles from "./PageTransition.module.css"

type PageTransitionProps = {
  children: ReactNode
}

type AnimatedPageProps = PageTransitionProps & {
  reduced: boolean
}

function AnimatedPage({ children, reduced }: AnimatedPageProps) {
  const pageControls = useAnimationControls()

  useEffect(() => {
    pageControls.set({ opacity: 0, y: reduced ? 0 : 12 })
    void pageControls.start({
      opacity: 1,
      transition: { duration: reduced ? 0.12 : 0.75, ease: [0.22, 1, 0.36, 1] },
      y: 0,
    })

    return () => pageControls.stop()
  }, [pageControls, reduced])

  return (
    <motion.div
      animate={pageControls}
      className={styles.page}
      exit={{ opacity: 0, y: -10 }}
      initial={false}
    >
      {children}
    </motion.div>
  )
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

      <AnimatePresence initial={false} mode="wait">
        <AnimatedPage key={pathname} reduced={reduced}>{children}</AnimatedPage>
      </AnimatePresence>
    </div>
  )
}
