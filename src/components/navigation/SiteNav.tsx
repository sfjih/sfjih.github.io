"use client"

import Link from "next/link"
import { useState } from "react"
import { navItems } from "@/src/content/profile"
import styles from "./SiteNav.module.css"

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav
      aria-label="全局导航"
      className={`${styles.shell} ${isOpen ? styles.open : ""}`}
    >
      <div className={styles.bar}>
        <Link className={styles.signature} href="/" onClick={() => setIsOpen(false)}>
          <span aria-hidden="true" className={styles.mark} />
          <span>HYH · PORTFOLIO</span>
        </Link>

        <button
          aria-controls="site-menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? "关闭导航" : "打开导航"}
          className={styles.toggle}
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span aria-hidden="true" className={styles.toggleLabel}>
            {isOpen ? "CLOSE" : "MENU"}
          </span>
          <span aria-hidden="true" className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}>
            <span />
            <span />
          </span>
        </button>
      </div>

      {isOpen ? (
        <ul className={styles.menu} id="site-menu">
          {navItems.map((item, index) => (
            <li className={styles.item} key={`${item.href}-${item.label}`}>
              <Link className={styles.link} href={item.href} onClick={() => setIsOpen(false)}>
                <span aria-hidden="true" className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
                <span aria-hidden="true" className={styles.arrow}>
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  )
}
