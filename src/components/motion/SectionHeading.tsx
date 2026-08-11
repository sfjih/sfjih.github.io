"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"
import { useEffect, useState } from "react"

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

const fallbackContainerVariants: Variants = {
  hidden: {},
  visible: {},
}

const fallbackWordVariants: Variants = {
  hidden: wordVariants.hidden,
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      duration: 0.12,
    },
    y: 0,
  },
}

export function SectionHeading({ as = "h2", className, text }: SectionHeadingProps) {
  const reduced = useReducedMotion() ?? false
  const [observerSupport, setObserverSupport] = useState<"pending" | "supported" | "unsupported">(
    "pending",
  )

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setObserverSupport(typeof IntersectionObserver === "undefined" ? "unsupported" : "supported")
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const fallback = !reduced && observerSupport === "unsupported"
  const animateOnView = !reduced && observerSupport === "supported"
  const words = text.split(" ")
  const sharedProps = {
    animate: fallback ? "visible" : undefined,
    className,
    initial: reduced ? false : "hidden",
    variants: fallback ? fallbackContainerVariants : containerVariants,
    viewport: { once: true },
    whileInView: animateOnView ? "visible" : undefined,
  } as const

  const content = words.map((word, index) => (
    <motion.span
      aria-hidden="true"
      key={`${word}-${index}`}
      variants={reduced ? undefined : fallback ? fallbackWordVariants : wordVariants}
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
