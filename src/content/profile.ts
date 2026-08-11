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
  title: "平面设计师 / 品牌视觉设计",
  bio: "专注品牌视觉、IP 全案与赛事物料设计，让创意从画面延伸到真实场景。",
  contactLinks: [
    { label: "Email", href: "mailto:hyh2107567710@163.com" },
    { label: "简历", href: "/何宇航-个人简历.pdf" },
  ],
}

export const services: Service[] = [
  { title: "品牌与 IP", description: "角色设定、Logo、色彩规范、表情与周边延展。" },
  { title: "赛事主视觉", description: "赛事 KV、核心视觉元素与应用规范。" },
  { title: "宣传海报", description: "活动海报、传播物料与版式设计。" },
  { title: "物料落地", description: "工装、精神堡垒、票证及现场制作协同。" },
]

export const proofCards: ProofCard[] = [
  { label: "精选作品", value: "05", description: "已收录五个精选作品案例。" },
  { label: "量产交付", value: "200+", description: "赛事工装与志愿者马甲成品交付。" },
  { label: "赛事执行", value: "04", description: "金骑士杯已执行四站赛事。" },
]

export const navItems: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#work" },
  { label: "Contact", href: "/#contact" },
]
