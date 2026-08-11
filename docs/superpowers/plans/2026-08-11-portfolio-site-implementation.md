# 作品集网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在新项目中完成一套可运行、可测试、可响应式浏览的 Majd 风格个人作品集网站骨架，包含首页、作品列表、作品详情和核心滚动/交互动效，暂用本地占位内容。

**Architecture:** 使用 Next.js App Router 承担页面与动态路由，`src/content` 保存可替换的资料与作品数据，`src/components` 按区块和单一交互拆分。Motion 只用于需要滚动映射、编排或页面切换的部分，其余 hover、3D 卡片和响应式布局优先使用 CSS。

**Tech Stack:** Node.js 24、Next.js、React、TypeScript、Motion for React、CSS Modules、Vitest、Testing Library、Playwright

## Global Constraints

- 项目根目录固定为 `E:\CodexWorkspaces\01_Projects_项目工作区\作品集网站`。
- 来源项目 `C:\Users\HE\Documents\个人简历网站，slg广告` 与 `C:\Users\HE\Documents\ip全案设计` 全程只读；本阶段不复制正式作品素材。
- 首版只实现 `/`、`/work`、`/work/[slug]`；不实现博客、CMS、登录、数据库或真实表单提交。
- 视觉使用 `#FAF7F3` 背景、`#111111` 主文字、Archivo 优先字体和 `1180px` Desktop 最大内容宽度。
- 断点固定为 Desktop `>=1280px`、Tablet `>=810px` 且 `<=1279px`、Phone `<=809px`。
- Sticky Avatar 固定实现 `200vh` 外层、`100vh` sticky 容器、`scale 0.5→1`、`translateY 114→0`、`rotateY 0→180`。
- 所有长动效必须为 `prefers-reduced-motion` 提供短淡入或无动画降级。
- 首版作品内容使用清晰标记的本地占位数据，不把模板作者的身份、文字或项目冒充为用户作品。
- 每个任务完成后运行该任务列出的测试；最终必须执行 lint、unit test、build 和 Playwright。

---

## File Map

```text
作品集网站/
├─ app/
│  ├─ layout.tsx                 # 全局 metadata、字体和 PageTransition
│  ├─ page.tsx                   # 首页区块组合
│  ├─ not-found.tsx              # 不存在作品的友好页面
│  └─ work/
│     ├─ page.tsx                # 作品列表
│     └─ [slug]/page.tsx         # 动态作品详情
├─ public/
│  └─ placeholders/
│     ├─ avatar-front.svg
│     ├─ avatar-back.svg
│     └─ project-01.svg ... project-04.svg
├─ src/
│  ├─ components/
│  │  ├─ navigation/SiteNav.tsx + SiteNav.module.css
│  │  ├─ transitions/PageTransition.tsx + PageTransition.module.css
│  │  ├─ hero/HeroBio.tsx + HeroBio.module.css
│  │  ├─ hero/StickyAvatar.tsx + StickyAvatar.module.css
│  │  ├─ motion/SectionHeading.tsx
│  │  ├─ quote/ScrollColorQuote.tsx + ScrollColorQuote.module.css
│  │  ├─ services/ServiceList.tsx + ServiceList.module.css
│  │  ├─ projects/ProjectCard.tsx + ProjectGrid.tsx + Projects.module.css
│  │  ├─ proof/FlipCardGrid.tsx + FlipCardGrid.module.css
│  │  ├─ contact/ContactSection.tsx + ContactSection.module.css
│  │  ├─ footer/SiteFooter.tsx + SiteFooter.module.css
│  │  └─ work/WorkDetailRenderer.tsx + WorkDetailRenderer.module.css
│  ├─ content/profile.ts          # 导航、简介、服务、能力和联系数据
│  ├─ content/projects.ts         # Project 类型、占位项目和查询函数
│  ├─ styles/globals.css          # reset、变量、断点、通用排版
│  └─ test/setup.ts               # jest-dom 注册与 Motion mock
├─ tests/
│  ├─ content/projects.test.ts
│  ├─ components/SiteNav.test.tsx
│  ├─ components/ProjectCard.test.tsx
│  ├─ components/WorkDetailRenderer.test.tsx
│  └─ e2e/portfolio.spec.ts
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ playwright.config.ts
├─ tsconfig.json
└─ vitest.config.ts
```

---

### Task 1: 初始化 Next.js、测试与设计变量

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/test/setup.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/page.test.tsx`
- Create: `src/styles/globals.css`
- Create: `.gitignore`

**Interfaces:**
- Produces: 可运行的 `npm run dev`、`npm run lint`、`npm run test`、`npm run build`、`npm run test:e2e`。
- Produces: 全站 CSS 变量 `--paper`、`--ink`、`--line`、`--content-max`、`--page-pad`。

- [ ] **Step 1: 创建依赖清单和脚本**

`package.json` 必须包含：

```json
{
  "name": "portfolio-site",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "clsx": "latest",
    "motion": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@eslint/eslintrc": "latest",
    "@playwright/test": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "jsdom": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: 安装依赖并记录锁文件**

Run: `npm install`

Expected: exit `0`，生成 `package-lock.json`。如果网络或包下载失败，停止并报告原始错误，不改用来源不明的镜像。

- [ ] **Step 3: 写最小页面测试**

在 `app/page.test.tsx` 中创建：

```tsx
import { render, screen } from "@testing-library/react"
import HomePage from "./page"

it("renders the portfolio shell title", () => {
  render(<HomePage />)
  expect(screen.getByRole("heading", { level: 1, name: /视觉设计师/i })).toBeInTheDocument()
})
```

- [ ] **Step 4: 运行测试并确认失败**

Run: `npm run test -- app/page.test.tsx`

Expected: FAIL，因为首页尚未输出“视觉设计师”。

- [ ] **Step 5: 完成 Next.js 配置、根布局与最小首页**

`tsconfig.json` 必须启用严格模式，并配置 `"@/*": ["./*"]` 路径别名，使计划中的 `@/src/...` 导入保持一致。

`app/page.tsx` 暂时只返回：

```tsx
export default function HomePage() {
  return <main><h1>视觉设计师</h1></main>
}
```

`src/styles/globals.css` 至少定义：

```css
:root {
  --paper: #faf7f3;
  --ink: #111111;
  --muted: #77736f;
  --line: rgba(17, 17, 17, 0.16);
  --content-max: 1180px;
  --page-pad: 20px;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--paper); }
body { margin: 0; background: var(--paper); color: var(--ink); overflow-x: clip; }
a { color: inherit; text-decoration: none; }
button, input, textarea { font: inherit; }
```

- [ ] **Step 6: 运行基础验证**

Run: `npm run test -- app/page.test.tsx && npm run lint && npm run build`

Expected: test PASS、lint exit `0`、build exit `0`。

- [ ] **Step 7: 提交基础工程**

```bash
git add package.json package-lock.json tsconfig.json next-env.d.ts next.config.ts eslint.config.mjs vitest.config.ts playwright.config.ts app src .gitignore
git commit -m "chore: initialize portfolio application"
```

---

### Task 2: 建立个人资料与作品数据模型

**Files:**
- Create: `src/content/profile.ts`
- Create: `src/content/projects.ts`
- Create: `tests/content/projects.test.ts`

**Interfaces:**
- Produces: `Project`, `ProjectSection`, `projects`, `getFeaturedProjects()`, `getProjectBySlug(slug)`。
- Produces: `profile`, `services`, `proofCards`, `navItems`。

- [ ] **Step 1: 写数据查询失败测试**

```ts
import { describe, expect, it } from "vitest"
import { getFeaturedProjects, getProjectBySlug } from "@/src/content/projects"

describe("project content", () => {
  it("finds a project by slug", () => {
    expect(getProjectBySlug("visual-campaign-alpha")?.title).toBe("视觉叙事练习")
  })

  it("returns exactly four featured projects", () => {
    expect(getFeaturedProjects()).toHaveLength(4)
  })

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("missing")).toBeUndefined()
  })
})
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm run test -- tests/content/projects.test.ts`

Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现可判别内容模型与四个占位项目**

`ProjectSection` 精确类型：

```ts
export type ProjectSection =
  | { type: "text"; heading: string; body: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "imagePair"; images: Array<{ src: string; alt: string }> }
  | { type: "video"; src: string; poster: string; title: string }
  | { type: "facts"; items: Array<{ label: string; value: string }> }

export type Project = {
  slug: string
  title: string
  category: string
  year: string
  role: string
  summary: string
  cover: string
  featured: boolean
  sections: ProjectSection[]
}
```

四个占位项目 slug 固定为：

- `visual-campaign-alpha`
- `character-system-study`
- `event-identity-study`
- `aigc-motion-experiment`

第一个标题固定为“视觉叙事练习”，四个项目均设 `featured: true`。

- [ ] **Step 4: 写资料数据**

`profile.ts` 使用明确占位说明：姓名用“何宇航”，职位用“视觉设计师 / AIGC 内容设计”，简介说明“作品内容正在整理”，联系方式先只保留 Email 和简历入口标签。`services` 固定四项：视觉设计、AIGC 内容、动态素材、品牌与 IP。

- [ ] **Step 5: 运行数据测试**

Run: `npm run test -- tests/content/projects.test.ts`

Expected: 3 tests PASS。

- [ ] **Step 6: 提交内容模型**

```bash
git add src/content tests/content
git commit -m "feat: add portfolio content model"
```

---

### Task 3: 实现全局导航与页面过渡

**Files:**
- Create: `src/components/navigation/SiteNav.tsx`
- Create: `src/components/navigation/SiteNav.module.css`
- Create: `src/components/transitions/PageTransition.tsx`
- Create: `src/components/transitions/PageTransition.module.css`
- Create: `tests/components/SiteNav.test.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `navItems` from `src/content/profile.ts`。
- Produces: `<SiteNav />` 和 `<PageTransition>{children}</PageTransition>`。

- [ ] **Step 1: 写导航交互失败测试**

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SiteNav } from "@/src/components/navigation/SiteNav"

it("opens and closes the navigation panel", async () => {
  const user = userEvent.setup()
  render(<SiteNav />)
  const button = screen.getByRole("button", { name: /打开导航/i })
  expect(button).toHaveAttribute("aria-expanded", "false")
  await user.click(button)
  expect(button).toHaveAttribute("aria-expanded", "true")
  expect(screen.getByRole("link", { name: "作品" })).toBeVisible()
})
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm run test -- tests/components/SiteNav.test.tsx`

Expected: FAIL，组件不存在。

- [ ] **Step 3: 实现 SiteNav**

要求：

- client component
- button 包含 `aria-expanded` 和 `aria-controls="site-menu"`
- Desktop 关闭 `320×60px`，展开 `320×259px`
- Phone 宽 `calc(100vw - 40px)`，最大 `335px`
- 关闭菜单后链接不可聚焦；使用条件渲染避免隐藏链接进入 Tab 顺序
- 点击锚点或路由链接后自动收起

- [ ] **Step 4: 实现 PageTransition**

使用 `usePathname()` 作为 motion 容器 key：

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: reduced ? 0.12 : 0.75, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

外层加一段约 `0.4s` 的背景遮罩错峰，使整体换页观感接近 2 秒，但内容不应被锁死超过 2.2 秒。

- [ ] **Step 5: 运行测试和 lint**

Run: `npm run test -- tests/components/SiteNav.test.tsx && npm run lint`

Expected: PASS，0 lint errors。

- [ ] **Step 6: 提交导航与过渡**

```bash
git add app/layout.tsx src/components/navigation src/components/transitions tests/components/SiteNav.test.tsx
git commit -m "feat: add navigation and page transitions"
```

---

### Task 4: 实现 Hero、Bio、Sticky Avatar 与 Quote

**Files:**
- Create: `public/placeholders/avatar-front.svg`
- Create: `public/placeholders/avatar-back.svg`
- Create: `src/components/hero/HeroBio.tsx`
- Create: `src/components/hero/HeroBio.module.css`
- Create: `src/components/hero/StickyAvatar.tsx`
- Create: `src/components/hero/StickyAvatar.module.css`
- Create: `src/components/motion/SectionHeading.tsx`
- Create: `src/components/quote/ScrollColorQuote.tsx`
- Create: `src/components/quote/ScrollColorQuote.module.css`
- Create: `tests/components/HeroBio.test.tsx`

**Interfaces:**
- Consumes: `profile` from `src/content/profile.ts`。
- Produces: `<HeroBio />` 与 `<ScrollColorQuote text="..." />`。

- [ ] **Step 1: 写结构失败测试**

```tsx
import { render, screen } from "@testing-library/react"
import { HeroBio } from "@/src/components/hero/HeroBio"

it("exposes hero and bio anchors with two avatar faces", () => {
  const { container } = render(<HeroBio />)
  expect(container.querySelector("#hero-section")).toBeInTheDocument()
  expect(container.querySelector("#bio-section")).toBeInTheDocument()
  expect(screen.getByAltText("头像正面占位图")).toBeInTheDocument()
  expect(screen.getByAltText("头像背面占位图")).toBeInTheDocument()
})
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm run test -- tests/components/HeroBio.test.tsx`

Expected: FAIL，组件不存在。

- [ ] **Step 3: 实现 StickyAvatar**

使用 `useScroll({ target: bioRef, offset: ["start end", "start start"] })`，再创建：

```ts
const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1])
const y = useTransform(scrollYProgress, [0, 1], [114, 0])
const rotateY = useTransform(scrollYProgress, [0, 1], [0, 180])
```

CSS 必须落实：

- `.stickyWrap { position: relative; height: 200vh; }`
- `.sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }`
- `.avatar { width: 400px; height: 456px; perspective: 1200px; }`
- Phone `.avatar { width: 181.14px; height: 206.5px; }`
- Front / Back absolute 叠层、圆角 `20px`、基础 rotateY 相差 180°

- [ ] **Step 4: 实现 HeroBio 与 SectionHeading**

Hero 与 Bio 各为 `100vh`。`SectionHeading` 将字符串按空格拆分，用每词 `opacity 0`、`blur(10px)`、`translateY(10px)` 入场；时长 `1.8s`，stagger `0.05s`，`viewport={{ once: true }}`。

- [ ] **Step 5: 实现 ScrollColorQuote**

外层 `150vh`，内部 `100vh` sticky。将句子拆词，根据总滚动进度为每词生成局部 `useTransform`，颜色从 `rgba(17,17,17,.18)` 插值到 `#111111`。组件语义保持一个 `<p>`，每个词 span 设置 `aria-hidden`，完整句子写入 `aria-label`。

- [ ] **Step 6: 运行组件测试**

Run: `npm run test -- tests/components/HeroBio.test.tsx && npm run lint`

Expected: PASS，0 lint errors。

- [ ] **Step 7: 提交首屏与滚动组件**

```bash
git add public/placeholders/avatar-*.svg src/components/hero src/components/motion src/components/quote tests/components/HeroBio.test.tsx
git commit -m "feat: recreate hero and scroll interactions"
```

---

### Task 5: 完成首页内容区块与微交互

**Files:**
- Create: `public/placeholders/project-01.svg`
- Create: `public/placeholders/project-02.svg`
- Create: `public/placeholders/project-03.svg`
- Create: `public/placeholders/project-04.svg`
- Create: `src/components/services/ServiceList.tsx`
- Create: `src/components/services/ServiceList.module.css`
- Create: `src/components/projects/ProjectCard.tsx`
- Create: `src/components/projects/ProjectGrid.tsx`
- Create: `src/components/projects/Projects.module.css`
- Create: `src/components/proof/FlipCardGrid.tsx`
- Create: `src/components/proof/FlipCardGrid.module.css`
- Create: `src/components/contact/ContactSection.tsx`
- Create: `src/components/contact/ContactSection.module.css`
- Create: `src/components/footer/SiteFooter.tsx`
- Create: `src/components/footer/SiteFooter.module.css`
- Create: `tests/components/ProjectCard.test.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `services`, `proofCards`, `profile`, `getFeaturedProjects()`。
- Produces: 完整首页组合和可复用 `<ProjectCard project={project} />`。

- [ ] **Step 1: 写 ProjectCard 失败测试**

```tsx
import { render, screen } from "@testing-library/react"
import { ProjectCard } from "@/src/components/projects/ProjectCard"
import { projects } from "@/src/content/projects"

it("links a project card to its detail route", () => {
  render(<ProjectCard project={projects[0]} />)
  expect(screen.getByRole("link", { name: /视觉叙事练习/i }))
    .toHaveAttribute("href", "/work/visual-campaign-alpha")
})
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm run test -- tests/components/ProjectCard.test.tsx`

Expected: FAIL，组件不存在。

- [ ] **Step 3: 实现服务、项目与 Flip Cards**

要求：

- Services 固定四张 `120px` 高列表卡，间距 `16px`
- Desktop Project Grid 两列，gap `16px`；Phone 一列
- ProjectCard 图片层 hover 缩放 `1.04`，过渡 `700ms cubic-bezier(.22,1,.36,1)`
- Flip Cards Desktop 四列，Phone 一列；hover 与键盘 focus-within 时 `rotateY(180deg)`
- 每张翻面卡提供可见标题和不依赖 hover 的屏幕阅读器文本

- [ ] **Step 4: 实现 Contact 与 Footer**

Contact Desktop 双列，表单最大宽 `500px`；Phone 单列。表单提交按钮使用 `type="button"` 并显示“联系功能将在内容阶段接入”，避免伪造成功提交。

- [ ] **Step 5: 组合完整首页**

`app/page.tsx` 顺序固定：

```tsx
<HeroBio />
<ScrollColorQuote text="设计不是装饰，而是让复杂的信息变得清楚、可信、值得停留。" />
<ServiceList />
<ProjectGrid projects={getFeaturedProjects()} showHeading />
<FlipCardGrid />
<ContactSection />
<SiteFooter />
```

- [ ] **Step 6: 运行首页测试与构建**

Run: `npm run test && npm run lint && npm run build`

Expected: all unit tests PASS、lint exit `0`、build exit `0`。

- [ ] **Step 7: 提交完整首页**

```bash
git add app/page.tsx public/placeholders/project-*.svg src/components/services src/components/projects src/components/proof src/components/contact src/components/footer tests/components/ProjectCard.test.tsx
git commit -m "feat: build portfolio home sections"
```

---

### Task 6: 实现作品列表与动态详情页

**Files:**
- Create: `app/work/page.tsx`
- Create: `app/work/[slug]/page.tsx`
- Create: `app/not-found.tsx`
- Create: `src/components/work/WorkDetailRenderer.tsx`
- Create: `src/components/work/WorkDetailRenderer.module.css`
- Create: `tests/components/WorkDetailRenderer.test.tsx`

**Interfaces:**
- Consumes: `projects`, `getProjectBySlug(slug)` 和 `ProjectSection`。
- Produces: 静态生成的详情路由和完整内容区块渲染器。

- [ ] **Step 1: 写 renderer 失败测试**

```tsx
import { render, screen } from "@testing-library/react"
import { WorkDetailRenderer } from "@/src/components/work/WorkDetailRenderer"

it("renders text, image and facts sections", () => {
  render(<WorkDetailRenderer sections={[
    { type: "text", heading: "项目背景", body: "这是一段占位说明。" },
    { type: "image", src: "/placeholders/project-01.svg", alt: "项目占位视觉" },
    { type: "facts", items: [{ label: "职责", value: "视觉设计" }] }
  ]} />)
  expect(screen.getByRole("heading", { name: "项目背景" })).toBeInTheDocument()
  expect(screen.getByAltText("项目占位视觉")).toBeInTheDocument()
  expect(screen.getByText("视觉设计")).toBeInTheDocument()
})
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm run test -- tests/components/WorkDetailRenderer.test.tsx`

Expected: FAIL，renderer 不存在。

- [ ] **Step 3: 实现 WorkDetailRenderer**

使用 `switch(section.type)` 穷尽渲染五种区块；default 分支调用：

```ts
const unreachable: never = section
return unreachable
```

图片使用 Next `<Image>`；视频必须有 `controls`、`playsInline` 和 poster，不自动播放。

- [ ] **Step 4: 实现列表和详情路由**

详情页导出：

```ts
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
}
```

页面通过 `getProjectBySlug` 查询；未找到时调用 `notFound()`。作品列表复用 `ProjectGrid`，详情页末尾显示返回全部作品链接。

- [ ] **Step 5: 运行路由相关测试与构建**

Run: `npm run test -- tests/components/WorkDetailRenderer.test.tsx && npm run build`

Expected: test PASS；build 输出 `/work` 和四个静态详情路由，无 TypeScript 错误。

- [ ] **Step 6: 提交作品路由**

```bash
git add app/work app/not-found.tsx src/components/work tests/components/WorkDetailRenderer.test.tsx
git commit -m "feat: add work listing and detail routes"
```

---

### Task 7: 验证响应式、可访问性和核心行为

**Files:**
- Create: `tests/e2e/portfolio.spec.ts`
- Modify: relevant component CSS modules only when a failing E2E check identifies a defect

**Interfaces:**
- Consumes: running Next app from all earlier tasks。
- Produces: Desktop、Tablet、Phone 三视口回归保护。

- [ ] **Step 1: 写失败的 E2E 断点测试**

```ts
import { expect, test } from "@playwright/test"

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 900 },
  { name: "phone", width: 390, height: 844 }
]) {
  test(`${viewport.name} homepage has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow).toBe(false)
  })
}

test("navigation opens and work route resolves", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await page.getByRole("button", { name: /打开导航/i }).click()
  await expect(page.getByRole("link", { name: "作品" })).toBeVisible()
  await page.getByRole("link", { name: "作品" }).click()
  await expect(page).toHaveURL(/\/work/)
})

test("project card opens a detail page", async ({ page }) => {
  await page.goto("/work")
  await page.getByRole("link", { name: /视觉叙事练习/i }).click()
  await expect(page).toHaveURL(/\/work\/visual-campaign-alpha/)
})
```

- [ ] **Step 2: 安装 Playwright Chromium**

Run: `npx playwright install chromium`

Expected: exit `0`。如果下载被阻断，停止并保留 unit/build 已通过的证据，明确报告未完成的浏览器验证。

- [ ] **Step 3: 运行 E2E 并记录真实失败**

Run: `npm run test:e2e`

Expected: 若有溢出、链接命名或路由失败，测试明确指出对应视口和断言。

- [ ] **Step 4: 只修复测试揭示的问题**

允许调整：宽度、padding、grid、focus 样式、ARIA 标签、路由 href。不得借此重写已确认视觉方向或加入博客/CMS。

- [ ] **Step 5: 验证 reduced motion**

在 E2E 中增加：

```ts
test("reduced motion keeps content accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expect(page.locator("main")).toBeVisible()
})
```

- [ ] **Step 6: 提交 E2E 与响应式修复**

```bash
git add tests/e2e src app
git commit -m "test: verify responsive portfolio behavior"
```

---

### Task 8: 最终验证与首版交付

**Files:**
- Modify: `README.md`
- Modify: only files required by final verification failures

**Interfaces:**
- Produces: 可交给内容填充阶段的稳定网站骨架。

- [ ] **Step 1: 写 README**

README 必须包含：

- 本地启动：`npm install`、`npm run dev`
- 完整验证：`npm run lint`、`npm run test`、`npm run build`、`npm run test:e2e`
- 页面：`/`、`/work`、`/work/[slug]`
- 内容文件：`src/content/profile.ts`、`src/content/projects.ts`
- 来源项目只读规则
- 当前仍为占位内容，下一阶段才复制真实素材

- [ ] **Step 2: 运行完整验证**

Run:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

Expected: 所有命令 exit `0`，Vitest 0 failures，Next build 成功，Playwright 全部通过。

- [ ] **Step 3: 检查来源项目未被修改**

Run:

```powershell
git -C 'C:\Users\HE\Documents\个人简历网站，slg广告' status --short
git -C 'C:\Users\HE\Documents\ip全案设计' status --short
```

Expected: 记录输出用于对比；本任务不得新增由本项目造成的变更。已有用户变更不清理、不覆盖。

- [ ] **Step 4: 浏览器视觉检查**

用 Chrome 检查 1440×900 与 390×844：

- 导航 60px → 259px
- Avatar sticky、缩放与翻转
- Quote 逐字变色
- Project hover 约 1.04 倍
- Flip Card 可通过 hover 和键盘触发
- `/work` 和详情页切换

- [ ] **Step 5: 提交交付文档与必要修复**

```bash
git add README.md app src tests public package.json package-lock.json
git commit -m "docs: hand off portfolio shell"
```

- [ ] **Step 6: 报告首版状态**

最终报告必须区分：

- 已完成：网站骨架、路由、响应式、核心动效、自动化验证
- 尚未开始：真实作品素材复制与文案填充
- 下一步：从 SLG 项目和 IP 项目复制经确认的素材到本项目，再替换占位数据
