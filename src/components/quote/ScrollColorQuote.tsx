"use client"

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react"
import { useRef } from "react"
import styles from "./ScrollColorQuote.module.css"

type ScrollColorQuoteProps = {
  text: string
}

type QuoteWordProps = {
  index: number
  progress: MotionValue<number>
  reduced: boolean
  total: number
  word: string
}

function QuoteWord({ index, progress, reduced, total, word }: QuoteWordProps) {
  const color = useTransform(
    progress,
    [index / total, (index + 1) / total],
    ["rgba(17,17,17,.18)", "#111111"],
  )

  return (
    <motion.span aria-hidden="true" style={{ color: reduced ? "#111111" : color }}>
      {word}
    </motion.span>
  )
}

export function ScrollColorQuote({ text }: ScrollColorQuoteProps) {
  const quoteRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const words = Array.from(text)
  const { scrollYProgress } = useScroll({
    target: quoteRef,
    offset: ["start end", "end start"],
  })

  return (
    <section className={styles.scene} ref={quoteRef}>
      <div className={styles.sticky}>
        <p className={styles.quote}>
          <span className={styles.srOnly}>{text}</span>
          {words.map((word, index) => (
            <QuoteWord
              index={index}
              key={`${word}-${index}`}
              progress={scrollYProgress}
              reduced={reduced}
              total={words.length}
              word={word}
            />
          ))}
        </p>
      </div>
    </section>
  )
}
