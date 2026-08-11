import type { Metadata } from "next"
import "@/src/styles/globals.css"

export const metadata: Metadata = {
  title: "Visual Designer",
  description: "A visual designer portfolio.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
