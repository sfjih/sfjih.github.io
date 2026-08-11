"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"

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
  const canObserve = typeof IntersectionObserver !== "undefined"
  const staticHeading = reduced || !canObserve
  const words = text.split(" ")
  const sharedProps = {
    className,
    initial: staticHeading ? false : "hidden",
    variants: containerVariants,
    viewport: { once: true },
    whileInView: staticHeading ? undefined : "visible",
  } as const

  const content = words.map((word, index) => (
    <motion.span
      aria-hidden="true"
      key={`${word}-${index}`}
      variants={staticHeading ? undefined : wordVariants}
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
