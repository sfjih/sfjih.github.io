# 作品集真实内容填充 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不重做 Majd 网站骨架的前提下，把 50 个已确认媒体副本与五个真实作品案例填入 `/`、`/work` 和 `/work/[slug]`，并保持现有动效、响应式与无障碍行为。

**Architecture:** 继续以 `src/content/projects.ts` 作为唯一内容源，五个案例共享现有 `ProjectGrid`、`ProjectCard` 和 `WorkDetailRenderer`。本阶段只生成 `public/works/<slug>/` 下的网页副本、替换项目数据，并在真实媒体暴露裁切问题时把详情媒体从 `cover` 最小调整为 `contain`；不新增页面模板、依赖、长期素材脚本或内容系统。

**Tech Stack:** Next.js 16 App Router、React、TypeScript、Motion、CSS Modules、Vitest、Testing Library、Playwright；本机已有 Sharp 仅用于一次性图片副本优化，本机已有 FFmpeg 仅用于一次性视频副本压缩。

## Global Constraints

- 正式项目根目录固定为 `E:\CodexWorkspaces\01_Projects_项目工作区\作品集网站`；实际改动在隔离工作区 `.worktrees\portfolio-real-content` 的 `codex/portfolio-real-content` 分支完成。
- 保留现有米白黑色 Majd 页面骨架、`/`、`/work`、`/work/[slug]`、Sticky Avatar、标题入场、Quote、卡片 hover、导航、页面切换和既有断点；不重新设计网站。
- 首页严格为：耿耿全案设计、金骑士杯赛事主视觉、宣传海报设计、赛事物料设计与现场落地。
- `/work` 严格为以上四项加最后一项 AIGC / SLG 个人练习；第五项必须显示“个人练习 / 非商业项目”。
- slug 固定为 `genggeng-brand-system`、`golden-knight-key-visual`、`promotional-posters`、`event-materials`、`slg-aigc-practice`。
- 耿耿唯一来源为 `C:\Users\HE\Desktop\gengengyuhuai\全案设计目前已完成素材\已完成_FD7014改色版\耿耿全案`。
- 金骑士、宣传海报和赛事物料唯一来源为 `E:\CodexWorkspaces\01_Projects_项目工作区\hyh-visual-designer-portfolio\public\assets\works\event-materials`。
- SLG 唯一来源为 `C:\Users\HE\Documents\个人简历网站，slg广告`。
- 三个来源全程只读：不修改、移动、覆盖、重命名或删除源文件；只在正式项目生成独立网页副本。
- 不使用 `C:\Users\HE\Documents\ip全案设计` 的耿耿素材，不引入跨案例素材，不虚构客户反馈、增长、曝光、获奖或其他效果数据。
- SLG 使用实际媒体事实：8 张关键帧，视频 `22.166667s`、`1080×1920`、24fps；不得继续写“约 30 秒”或“01–07”。
- 不新增博客、CMS、筛选器、简历模块、部署或远端推送；不修改个人资料、联系方式或现有非作品模块。
- 功能与修复严格 RED → GREEN；每个任务一次实现、一次独立任务复核，完成后做全分支复核与 verification-before-completion。

---

## File Map

```text
public/works/
├─ genggeng-brand-system/       # 17 张 WebP
├─ golden-knight-key-visual/    # 1 张 WebP
├─ promotional-posters/         # 4 张 WebP
├─ event-materials/             # 15 张 WebP
└─ slg-aigc-practice/           # 12 张 WebP + 1 个 MP4
src/content/projects.ts         # 五个案例、固定顺序、详情区块
app/work/page.tsx               # 作品列表真实说明
app/work/[slug]/page.tsx        # 真实封面替代文本
src/components/work/WorkDetailRenderer.module.css # 仅在真实图像裁切失败时改 contain
tests/content/project-media.test.ts               # 50 个媒体副本存在性
tests/content/projects.test.ts                    # 顺序、slug、边界、替代文本
tests/components/ProjectCard.test.tsx             # 真实首卡路由
tests/e2e/portfolio.spec.ts                        # 五页内容和媒体回归
README.md                                          # 真实内容与只读来源说明
```

---

### Task 1: 复制并网页优化 50 个已选媒体

**Files:**
- Create: `tests/content/project-media.test.ts`
- Create: `public/works/genggeng-brand-system/*.webp`
- Create: `public/works/golden-knight-key-visual/*.webp`
- Create: `public/works/promotional-posters/*.webp`
- Create: `public/works/event-materials/*.webp`
- Create: `public/works/slg-aigc-practice/*.webp`
- Create: `public/works/slg-aigc-practice/final-video.mp4`

**Interfaces:**
- Produces: 五个稳定的 `/works/<slug>/...` 媒体目录，供 Task 2 的 `projects.ts` 直接引用。
- Produces: 50 个非空媒体文件；49 个图片副本为 WebP，SLG 成片为带 `faststart` 的 H.264/AAC MP4。

- [ ] **Step 1: 在 SDD 报告目录记录来源基线**

对三组已选文件记录相对路径、长度、`LastWriteTimeUtc` 和 SHA-256。耿耿应为 17 项、赛事应为 20 项、SLG 应为 13 项；任一缺失立即以 BLOCKED 返回，不创建部分输出。SLG 的 `.git` 目录不完整，赛事目录也不是 Git 仓库，因此最终以哈希与元数据相等作为只读证据，不把 `fatal: not a git repository` 误报为干净状态。

- [ ] **Step 2: 写媒体存在性失败测试**

`tests/content/project-media.test.ts` 用字面量数组列出以下网页路径，并断言每个 `public` 文件存在且 `stat.size > 0`：

```ts
const expectedMedia = [
  "/works/genggeng-brand-system/cover.webp",
  "/works/genggeng-brand-system/character-turnaround.webp",
  "/works/genggeng-brand-system/color-system.webp",
  "/works/genggeng-brand-system/logo-system.webp",
  "/works/genggeng-brand-system/character-introduction.webp",
  "/works/genggeng-brand-system/expressions.webp",
  "/works/genggeng-brand-system/costume-pilot-painter.webp",
  "/works/genggeng-brand-system/costume-detective-magician.webp",
  "/works/genggeng-brand-system/badges.webp",
  "/works/genggeng-brand-system/phone-cases.webp",
  "/works/genggeng-brand-system/stationery.webp",
  "/works/genggeng-brand-system/merchandise-overview.webp",
  "/works/genggeng-brand-system/city-walk.webp",
  "/works/genggeng-brand-system/art-time.webp",
  "/works/genggeng-brand-system/park-time.webp",
  "/works/genggeng-brand-system/reading-time.webp",
  "/works/genggeng-brand-system/rainy-walk.webp",
  "/works/golden-knight-key-visual/event-kv.webp",
  "/works/promotional-posters/event-poster.webp",
  "/works/promotional-posters/company-poster.webp",
  "/works/promotional-posters/investment-cover.webp",
  "/works/promotional-posters/planning-cover.webp",
  "/works/event-materials/totem-render.webp",
  "/works/event-materials/totem-photo.webp",
  "/works/event-materials/apparel-long.webp",
  "/works/event-materials/apparel-pattern.webp",
  "/works/event-materials/apparel-short.webp",
  "/works/event-materials/medal.webp",
  "/works/event-materials/ticket.webp",
  "/works/event-materials/sash.webp",
  "/works/event-materials/name-card.webp",
  "/works/event-materials/group-photo.webp",
  "/works/event-materials/maintenance-record.webp",
  "/works/event-materials/onsite-01.webp",
  "/works/event-materials/onsite-02.webp",
  "/works/event-materials/onsite-03.webp",
  "/works/event-materials/onsite-04.webp",
  "/works/slg-aigc-practice/collection.webp",
  "/works/slg-aigc-practice/protagonist.webp",
  "/works/slg-aigc-practice/architecture.webp",
  "/works/slg-aigc-practice/enemy-faction.webp",
  ...Array.from({ length: 8 }, (_, index) =>
    `/works/slg-aigc-practice/keyframe-${String(index + 1).padStart(2, "0")}.webp`,
  ),
  "/works/slg-aigc-practice/final-video.mp4",
]
```

- [ ] **Step 3: 运行 RED**

Run: `npm run test -- tests/content/project-media.test.ts`

Expected: FAIL，并明确列出第一个缺失的 `/works/...` 文件。

- [ ] **Step 4: 生成项目内网页副本**

只在该任务的忽略报告目录放置一次性转换代码，不提交脚本、不改依赖。每张源图只读解码，输出到上面的 `public/works` 路径：`fit: "inside"`、最大 `2400×2400`、禁止放大、WebP quality `82`；透明的 `event-kv-february.png` 保留 alpha。输出映射严格按文件语义：耿耿 17 项依次对应规格中的 17 个源文件；金骑士对应 `event-kv-february.png`；宣传海报对应四个 `event-*` 海报文件；赛事物料对应 15 个 `material-*`、`apparel-*`、`onsite-*` 文件；SLG 对应 collection、3 个 story、8 个 keyframe。

SLG 视频使用本机 FFmpeg 从只读源生成项目副本：

```powershell
ffmpeg -i '<source>\public\portfolio\frozen-wasteland\final-video.mp4' -map 0:v:0 -map 0:a:0 -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart 'public\works\slg-aigc-practice\final-video.mp4'
```

不得覆盖源视频；若 FFmpeg 返回非零，停止并保留原始错误。

- [ ] **Step 5: 运行 GREEN 与媒体探测**

Run: `npm run test -- tests/content/project-media.test.ts`

Expected: 50/50 路径存在且非空。再用 Sharp metadata 检查 49 张 WebP 可解码，用 `ffprobe` 检查目标视频为 H.264/AAC、1080×1920、约 22.17 秒，且目标视频小于源文件 60,625,827 bytes。

- [ ] **Step 6: 复核来源未变并提交**

重新生成三组来源元数据/SHA-256，与 Step 1 基线逐项比较，Expected: 0 differences。提交：

```bash
git add public/works tests/content/project-media.test.ts
git commit -m "feat: add optimized portfolio media"
```

---

### Task 2: 一次性替换五个项目内容数据

**Files:**
- Modify: `src/content/projects.ts`
- Modify: `app/work/page.tsx`
- Modify: `app/work/[slug]/page.tsx`
- Modify: `tests/content/projects.test.ts`
- Modify: `tests/components/ProjectCard.test.tsx`

**Interfaces:**
- Consumes: Task 1 的 50 个 `/works/...` 路径。
- Produces: 固定五项目 `projects` 数组、四项目 `getFeaturedProjects()`、五个详情页和现有组件可直接渲染的 `text/image/imagePair/video/facts` 区块。

- [ ] **Step 1: 写内容边界失败测试**

在 `tests/content/projects.test.ts` 用字面量断言：

```ts
expect(projects.map(({ slug }) => slug)).toEqual([
  "genggeng-brand-system",
  "golden-knight-key-visual",
  "promotional-posters",
  "event-materials",
  "slg-aigc-practice",
])
expect(projects.map(({ title }) => title)).toEqual([
  "耿耿全案设计",
  "金骑士杯赛事主视觉",
  "宣传海报设计",
  "赛事物料设计与现场落地",
  "AIGC / SLG 个人练习",
])
expect(getFeaturedProjects().map(({ slug }) => slug)).toEqual(
  projects.slice(0, 4).map(({ slug }) => slug),
)
expect(projects.at(-1)?.category).toBe("个人练习 / 非商业项目")
```

测试还需从 `cover`、`image`、`imagePair`、`video.poster`、`video.src` 收集路径，断言：全部文件存在；所有 image alt 非空；金骑士、宣传海报、赛事物料三个路径集合两两无交集；SLG 不是 featured；旧 slug 和“占位”文案不存在。

更新 `ProjectCard.test.tsx`，断言第一张卡链接到 `/work/genggeng-brand-system`。

- [ ] **Step 2: 运行 RED**

Run: `npm run test -- tests/content/projects.test.ts tests/components/ProjectCard.test.tsx`

Expected: FAIL，实际仍返回旧四个占位 slug 和旧首卡链接。

- [ ] **Step 3: 用真实元数据替换 `projects`**

五项元数据固定为：

| slug | title | category | year | role | cover | featured |
|---|---|---|---|---|---|---|
| `genggeng-brand-system` | 耿耿全案设计 | IP 全案 / 品牌视觉 | 2026 | IP 设定 / 角色系统 / 品牌视觉延展 | `/works/genggeng-brand-system/cover.webp` | true |
| `golden-knight-key-visual` | 金骑士杯赛事主视觉 | 赛事主视觉 / KV | 2025–2026 | 赛事主视觉 / 视觉设计 | `/works/golden-knight-key-visual/event-kv.webp` | true |
| `promotional-posters` | 宣传海报设计 | 宣传海报 / 版式设计 | 2025–2026 | 海报设计 / 信息编排 | `/works/promotional-posters/event-poster.webp` | true |
| `event-materials` | 赛事物料设计与现场落地 | 赛事物料 / 现场落地 | 2025–2026 | 物料设计 / 打样沟通 / 供应商对接 / 现场执行 | `/works/event-materials/group-photo.webp` | true |
| `slg-aigc-practice` | AIGC / SLG 个人练习 | 个人练习 / 非商业项目 | 2026 | 创意策划 / 分镜 / 关键帧 / AI 视频 / 剪辑复盘 | `/works/slg-aigc-practice/collection.webp` | false |

摘要只使用已确认事实：耿耿说明角色系统、Logo、周边和场景延展；金骑士说明赛事主视觉的构图、视觉元素、字体色彩和场景适配；海报说明赛事宣传、公司宣传、招商与策划文本四类版式；物料明确“15 天内推进赛事工装及志愿者马甲 200 余件成品交付”；SLG 明确个人练习、8 张关键帧和约 22 秒成片。

- [ ] **Step 4: 用现有五类区块组织详情**

- 耿耿：`text` 项目定位 → character turnaround → color/logo pair → character introduction → expressions → 两张服装 pair → 两组周边 pair → 两组场景 pair → rainy walk；替代文本逐张描述实际画面。
- 金骑士：`text` 赛事背景（赛事规划 6 站、已执行 4 站）→ event KV → `text` 主视觉逻辑 → `facts` 职责与周期；不得引用四张宣传海报或线下物料。
- 宣传海报：`text` 系列说明 → event poster → investment/planning pair → company poster → `facts` 构图、信息层级与文字排版；不得引用 event KV 或物料。
- 赛事物料：`text` 从设计到落地 → totem render/photo pair → apparel long/short pair → apparel pattern → medal/ticket pair → sash/name-card pair → onsite 01/02 pair → onsite 03/04 pair → maintenance record → `facts` 15 天与 200 余件；group photo 已作为 hero。
- SLG：首个 `text` 标题必须是“个人练习 / 非商业项目” → `facts` 22.17 秒、1080×1920、24fps与职责 → protagonist/architecture pair → enemy faction → 四组 keyframe pair → `video`，poster 使用 `/works/slg-aigc-practice/keyframe-01.webp`，不得自动播放。

- [ ] **Step 5: 更新列表与详情的占位文案**

`app/work/page.tsx` 的 description 和 intro 改为平面设计优先的真实范围；`app/work/[slug]/page.tsx` 的 hero alt 改为 `${project.title}项目封面`。不修改页面结构、动效或导航。

- [ ] **Step 6: 运行 GREEN、全量 unit 与 build**

Run:

```bash
npm run test -- tests/content/projects.test.ts tests/components/ProjectCard.test.tsx
npm run test
npm run lint
npm run build
```

Expected: focused PASS；全量 Vitest 0 failures；lint exit 0；build 生成五个新 slug，不再生成四个旧 slug。

- [ ] **Step 7: 提交内容批次**

```bash
git add src/content/projects.ts app/work tests/content/projects.test.ts tests/components/ProjectCard.test.tsx
git commit -m "feat: fill portfolio project content"
```

---

### Task 3: 内容回归、真实媒体视觉检查与交付说明

**Files:**
- Modify: `tests/e2e/portfolio.spec.ts`
- Modify only after a failing real-media assertion: `src/components/work/WorkDetailRenderer.module.css`
- Modify: `README.md`

**Interfaces:**
- Consumes: 五项目数据与 50 个媒体副本。
- Produces: 首页 4 项、作品列表 5 项、五详情页、视频降级和三视口的最终回归证据。

- [ ] **Step 1: 写真实内容 E2E 失败测试**

把旧 `validDetailRoute` 和旧标题断言替换为新内容，并新增：

```ts
const expectedProjects = [
  ["耿耿全案设计", "/work/genggeng-brand-system"],
  ["金骑士杯赛事主视觉", "/work/golden-knight-key-visual"],
  ["宣传海报设计", "/work/promotional-posters"],
  ["赛事物料设计与现场落地", "/work/event-materials"],
  ["AIGC / SLG 个人练习", "/work/slg-aigc-practice"],
] as const
```

测试必须验证：首页精确四卡且无 SLG；`/work` 精确五卡且 SLG 最后；五张卡逐一打开精确 URL 与 H1；SLG 页首屏可见“个人练习 / 非商业项目”；所有详情媒体加载成功；视频有 `controls`、`poster`、无 `autoplay`；未知 slug 仍为 404；现有导航、Sticky Avatar、Quote、hover、键盘翻面、no-JS 和 reduced-motion 测试继续保留。

- [ ] **Step 2: 运行 RED 并只修真实缺陷**

Run: `npm run test:e2e`

Expected: 若旧选择器、详情图片裁切或媒体路径有问题，Playwright 精确指出对应路由。只允许以下最小修复：更新旧选择器；将详情页 `.projectHeroMedia img`、`.singleMedia img`、`.pairedMedia img` 的 `object-fit` 从 `cover` 改为 `contain`，确保竖版海报和长页不被裁掉。ProjectCard 的 4:3 hover 封面继续保持 `cover`，不得修改现有动效参数。

- [ ] **Step 3: 运行桌面、平板、手机视觉验收**

用 Playwright 在 1440×900、1024×900、390×844 检查 `/`、`/work` 和五个详情页：无横向溢出；首页/列表顺序正确；详情长图完整可见；双图在手机单列；SLG 视频为竖屏且 controls 可用；既有导航尺寸、Sticky Avatar、Quote、hover、翻面和页面切换不回归。截图写入本计划的 SDD 忽略目录，不提交截图。

- [ ] **Step 4: 更新 README**

README 改为“真实作品内容已填充”，列出五个 slug、首页/作品列表固定顺序、`public/works` 目录、三个只读来源、SLG 非商业标签和完整验证命令；删除“下一阶段才复制真实素材”的旧说明。不得增加部署、CMS 或简历维护文档。

- [ ] **Step 5: 运行最终 verification-before-completion**

在当前 HEAD 新鲜运行：

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
git diff --check
git status --short --branch
```

Expected: lint 0；Vitest 0 failures；build 五个新详情 slug；Playwright 0 failures；diff-check 0；仅预期提交，无临时文件。

- [ ] **Step 6: 给出三个来源只读证据并提交**

再次采集三组已选源文件的相对路径、长度、时间和 SHA-256，与 Task 1 基线比较，Expected: 0 differences。分别记录：耿耿目录无源写入；赛事目录不是 Git 仓库；SLG 的空 `.git` 不是有效仓库。提交：

```bash
git add README.md tests/e2e/portfolio.spec.ts src/components/work/WorkDetailRenderer.module.css
git commit -m "test: verify real portfolio content"
```

若 CSS 无需修改，不把它加入提交。最终报告必须列出三个来源的只读对比结果、媒体数量与测试结果。
