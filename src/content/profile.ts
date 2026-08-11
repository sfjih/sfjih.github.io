export type Profile = {
  name: string
  title: string
  bio: string
  contactLinks: Array<{ label: string; href: string }>
}

export type Service = {
  title: string
  description: string
}

export type ProofCard = {
  label: string
  value: string
  description: string
}

export type NavItem = {
  label: string
  href: string
}

export const profile: Profile = {
  name: "何宇航",
  title: "视觉设计师 / AIGC 内容设计",
  bio: "作品内容正在整理。",
  contactLinks: [
    { label: "Email", href: "mailto:placeholder@example.com" },
    { label: "简历", href: "#resume" },
  ],
}

export const services: Service[] = [
  { title: "视觉设计", description: "本地占位服务说明。" },
  { title: "AIGC 内容", description: "本地占位服务说明。" },
  { title: "动态素材", description: "本地占位服务说明。" },
  { title: "品牌与 IP", description: "本地占位服务说明。" },
]

export const proofCards: ProofCard[] = [
  { label: "案例", value: "04", description: "可替换的作品案例占位。" },
  { label: "服务", value: "04", description: "可替换的服务方向占位。" },
  { label: "状态", value: "整理中", description: "正式作品内容将陆续补充。" },
]

export const navItems: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "作品", href: "/work" },
  { label: "关于", href: "#about" },
  { label: "联系", href: "#contact" },
]
