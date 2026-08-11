import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { expect, it } from "vitest"
import { profile, proofCards, services } from "@/src/content/profile"

it("publishes the approved real profile, contact, services, and proof facts", () => {
  expect(profile).toMatchObject({
    title: "平面设计师 / 品牌视觉设计",
    bio: "专注品牌视觉、IP 全案与赛事物料设计，让创意从画面延伸到真实场景。",
  })
  expect(profile.contactLinks).toEqual([
    { label: "Email", href: "mailto:hyh2107567710@163.com" },
    { label: "简历", href: "/何宇航-个人简历.pdf" },
  ])
  expect(services).toEqual([
    { title: "品牌与 IP", description: "角色设定、Logo、色彩规范、表情与周边延展。" },
    { title: "赛事主视觉", description: "赛事 KV、核心视觉元素与应用规范。" },
    { title: "宣传海报", description: "活动海报、传播物料与版式设计。" },
    { title: "物料落地", description: "工装、精神堡垒、票证及现场制作协同。" },
  ])
  expect(proofCards).toEqual([
    { label: "精选作品", value: "05", description: "已收录五个精选作品案例。" },
    { label: "量产交付", value: "200+", description: "赛事工装与志愿者马甲成品交付。" },
    { label: "赛事执行", value: "04", description: "金骑士杯已执行四站赛事。" },
  ])
  expect(existsSync(resolve(process.cwd(), "public", "何宇航-个人简历.pdf"))).toBe(true)
  expect(JSON.stringify({ profile, proofCards, services })).not.toMatch(/占位|整理中|placeholder@example\.com/)
})
