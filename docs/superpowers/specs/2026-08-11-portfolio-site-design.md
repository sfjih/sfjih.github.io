# 作品集网站设计说明

日期：2026-08-11  
状态：已获用户确认  
项目目录：`E:\CodexWorkspaces\01_Projects_项目工作区\作品集网站`

## 1. 目标

新建一套可独立维护的个人作品集网站，首版高度还原 Majd Framer 模板的米白黑色极简视觉、页面结构、滚动行为和交互动效。先完成可运行的网站骨架，再从以下两个只读来源项目中复制个人资料与作品素材：

- `C:\Users\HE\Documents\个人简历网站，slg广告`
- `C:\Users\HE\Documents\ip全案设计`

来源项目不移动、不重命名、不覆盖、不修改。新网站中的素材使用独立副本。

## 2. 首版范围

包含：

- 首页 `/`
- 作品列表 `/work`
- 动态作品详情 `/work/[slug]`
- 桌面、平板、手机响应式布局
- 导航展开、页面切换、滚动触发、sticky、hover 和 3D 翻转动效
- 独立的数据层与资源目录，便于后续逐项填充作品

暂不包含：

- 博客列表和文章详情
- CMS 后台
- 联系表单真实邮件提交
- 登录、管理后台、数据库
- 对旧项目内容或已锁定 IP 资产的编辑

## 3. 技术方案

- Next.js App Router
- React + TypeScript
- Motion for React，用于滚动映射、页面过渡和复杂交互
- CSS Modules 与全局设计变量
- Vitest + Testing Library，验证数据、组件和关键交互
- Playwright，验证主要路由、断点和动效载体

选择 Next.js 而不是单页 Vite，是为了让作品详情拥有稳定 URL、便于后续 SEO、静态生成和部署，同时保持与现有 React 素材数据的迁移兼容性。

## 4. 视觉方向

首版使用用户确认的方案 A：

- 高度保持 Majd 的米白黑色极简风
- 背景 `#FAF7F3`
- 主文字 `#111111`
- 展示字体优先 Archivo；加载失败时使用宽体无衬线回退
- 主内容最大宽度 `1180px`
- 卡片使用 `16px` 或 `20px` 圆角
- 大标题使用紧凑字距、宽幅占位和高对比层级
- 不在首版壳体中直接导入耿耿的橙色品牌系统；作品填充阶段再让 IP 案例自身带出 `#FD7014`

视觉复刻不复制模板作者的文字、身份、项目内容或品牌名称，只复刻布局规律和交互机制。

## 5. 信息架构

### 首页

从上到下：

1. Floating Navigation
2. Hero & Bio
3. Quote
4. Services
5. Featured Projects
6. Testimonials / Capabilities Proof
7. Contact
8. Footer

首页作品卡首版使用本地占位数据，数据接口按真实作品字段设计。后续优先填充：

1. 冰雪生存 SLG 买量广告
2. 耿耿 IP 全案
3. 金骑士杯赛事视觉物料
4. AIGC 关键帧与视频生产流程

### 作品列表

- 全宽 Hero
- 响应式项目网格
- 每个项目显示标题、类别、年份、封面和链接
- Desktop 两列，Phone 一列

### 作品详情

- 项目标题和元信息
- Hero 媒体
- 项目简介
- 可复用内容区块：大图、双图、文字、视频、结果/职责
- 前后项目导航
- 没有对应媒体时显示设计过的占位块，不出现破图

## 6. 组件边界

- `SiteNav`：胶囊导航展开、锚点和路由入口
- `PageTransition`：路由级淡出、位移与进入编排
- `HeroSection`：标题、辅助信息与首屏布局
- `StickyAvatar`：双层头像、滚动缩放、位移和 Y 轴翻转
- `BioSection`：个人简介和文本按钮
- `ScrollColorQuote`：滚动逐字变色
- `SectionHeading`：逐词模糊入场
- `ServiceList`：四条能力卡
- `ProjectGrid` / `ProjectCard`：响应式项目展示和图片 hover
- `FlipCardGrid` / `FlipCard`：四张 3D 正反面卡
- `ContactSection`：联系信息和视觉表单
- `SiteFooter`：结束信息和大字标
- `WorkDetailRenderer`：按内容区块类型渲染作品详情

每个组件只负责一个交互或内容职责，页面只组合组件，不在路由文件内堆叠复杂动画逻辑。

## 7. 数据模型

作品数据集中放在 `src/content/projects.ts`，核心字段为：

```ts
type Project = {
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

`ProjectSection` 使用可判别联合类型，支持：

- `text`
- `image`
- `imagePair`
- `video`
- `facts`

个人资料、服务和联系方式集中放在 `src/content/profile.ts`。页面组件不直接写死真实履历，方便后续替换。

## 8. 动效规范

### Sticky Avatar

- Desktop 外层：`height: 200vh`
- Sticky 容器：`top: 0; height: 100vh`
- Desktop 头像：`400×456px`
- Phone 头像：约 `181×206.5px`
- 滚动映射：`scale 0.5 → 1`
- Y 位移：`114px → 0`
- Y 轴旋转：`0° → 180°`
- Front/Back 基础旋转相差 `180°`
- 动画时间观感：约 `2s`，bounce `0`

### Avatar 入场

- 初始 `opacity: 0`
- 初始 `translateY(10px)`
- 时长 `1.6s`
- 延迟 `1s`

### 大标题

- 按单词拆分
- 初始 `opacity: 0`
- 初始 `blur(10px)`
- 初始 `translateY(10px)`
- 时长 `1.8s`
- 单词错峰 `0.05s`
- 只在首次进入视口时播放

### Quote

- 外层 `150vh`
- 内容 `position: sticky; top: 0; height: 100vh`
- 文字变色滚动区间模拟 `top 30% → top 1%`
- 逐词平滑插值

### Project Card

- 图片裁切层保持固定
- hover 时内层图片居中缩放至约 `1.04`
- 标题和箭头响应 hover，但不引入额外弹跳

### Navigation

- Desktop：`320×60px → 320×259px`
- Phone：可用宽度约 `335px`，高度 `60px → 259px`
- 展开时逐项显示 About、Services、Projects、Contact

### 页面切换

- 使用 AnimatePresence 编排退出和进入
- 视觉总时长接近参考站约 2 秒的换页观感
- 路由完成后处理 URL hash 与滚动位置
- 尊重 `prefers-reduced-motion`，降级为短淡入淡出

## 9. 响应式规则

断点与参考项目保持一致：

- Desktop：`1280px` 及以上
- Tablet：`810px–1279px`
- Phone：`0–809px`

主要变化：

- Desktop 主容器最大宽度 `1180px`
- Phone 统一左右内边距 `20px`
- Phone 的 Projects、Flip Cards 全部改为单列
- Projects 顶部间距 Desktop `120px`，Phone `80px`
- Phone Bio 改为纵向，顶部间距 `100px`，列间距 `40px`
- Contact 从双列改为单列
- 导航宽度从固定 320px 改为视口减去 40px

## 10. 素材迁移规则

首版壳体完成并验证后，才开始复制个人素材。

### SLG / 简历来源

可读取：

- `src/data/resume.ts`
- `src/data/projects.ts`
- `public/portfolio/frozen-wasteland/`
- `public/何宇航-个人简历.pdf`
- 已确认的个人头像候选图

### IP 来源

只复制已确认或用户指定的展示资产，优先：

- `accepted_pages/01.主视觉.png`
- `accepted_pages/02.3d2d视角.png`
- `accepted_pages/04.logo-design-combination.png`
- `accepted_pages/05.character-introduction.png`
- `accepted_pages/06.expression-extension.png`
- `accepted_pages/12.small-peripheral-design.png`
- `accepted_pages/color card.png`

不得修改这些源文件。第13页仍是 revision 状态，除非用户明确要求，否则不作为首批正式作品素材。

## 11. 错误与降级

- 图片加载失败：使用带项目名称的比例占位块
- 视频不支持自动播放：显示 poster 和播放按钮
- JavaScript 或 Motion 不可用：页面内容仍按正常文档流展示
- `prefers-reduced-motion`：禁用 3D 翻转和长滚动插值
- 空作品详情：路由返回 404，不渲染空模板

## 12. 验证标准

- `npm run lint` 无错误
- `npm run test` 全部通过
- `npm run build` 成功
- Playwright 验证 `/`、`/work` 和至少一个 `/work/[slug]`
- 1440px、1024px、390px 三种视口下无横向溢出
- Sticky Avatar、Quote、导航和项目 hover 可运行
- reduced-motion 模式可访问
- Lighthouse 基础检查无明显可访问性问题
- 原两个来源项目的 Git 状态与素材文件不被修改

## 13. 交付顺序

1. 搭建项目与设计变量
2. 建立数据模型和占位内容
3. 完成首页结构
4. 完成核心滚动与交互动效
5. 完成作品列表和详情模板
6. 完成响应式与无障碍降级
7. 通过自动化和浏览器视觉验证
8. 再进入个人作品素材迁移与内容填充

