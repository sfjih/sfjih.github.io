import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import { SiteNav } from "@/src/components/navigation/SiteNav"
import { PageTransition } from "@/src/components/transitions/PageTransition"
import "@/src/styles/globals.css"

const archivo = Archivo({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Visual Designer",
  description: "A visual designer portfolio.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={archivo.className}>
        <SiteNav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
