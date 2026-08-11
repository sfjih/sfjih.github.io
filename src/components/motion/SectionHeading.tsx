"use client"

import { motion, useAnimationControls, useReducedMotion, type Variants } from "motion/react"
import { useEffect, useRef } from "react"

type SectionHeadingProps = {
  as?: "h1" | "h2"
  className?: string
  text: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const wordVariants: Variants = {
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
    y: 10,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
    },
    y: 0,
  },
}

export function SectionHeading({ as = "h2", className, text }: SectionHeadingProps) {
  const reduced = useReducedMotion() ?? false
  const controls = useAnimationControls()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const heading = headingRef.current
    if (reduced || !heading || typeof IntersectionObserver === "undefined") return

    controls.set("hidden")
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      void controls.start("visible")
      observer.disconnect()
    })
    observer.observe(heading)

    return () => observer.disconnect()
  }, [controls, reduced])

  const words = text.split(" ")
  const sharedProps = {
    animate: controls,
    className,
    initial: false,
    ref: headingRef,
    variants: containerVariants,
  } as const

  const content = words.map((word, index) => (
    <motion.span
      aria-hidden="true"
      key={`${word}-${index}`}
      variants={reduced ? undefined : wordVariants}
    >
      {word}
      {index < words.length - 1 ? " " : ""}
    </motion.span>
  ))

  return as === "h1" ? (
    <motion.h1 aria-label={text} {...sharedProps}>{content}</motion.h1>
  ) : (
    <motion.h2 aria-label={text} {...sharedProps}>{content}</motion.h2>
  )
}
