# 作品集网站

这是一个基于 Next.js 的视觉设计师作品集，已填充五项真实作品内容，并保留经过验证的响应式布局、页面动效和本地自动化检查。

## 本地启动

需要 Node.js 和 npm。在项目根目录执行：

```bash
npm install
npm run dev
```

开发服务启动后访问 `http://localhost:3000`。生产模式可以通过 `npm run build` 后执行 `npm run start` 启动。

## 页面

- `/`：首页，包含个人简介、滚动引言、服务、精选作品、翻转卡片和联系占位区域。
- `/work`：作品列表。
- `/work/genggeng-brand-system`：耿耿全案设计。
- `/work/golden-knight-key-visual`：金骑士杯赛事主视觉。
- `/work/promotional-posters`：宣传海报设计。
- `/work/event-materials`：赛事物料设计与现场落地。
- `/work/slg-aigc-practice`：AIGC / SLG 个人练习，明确标注为个人练习 / 非商业项目。

首版不包含博客、CMS、登录、数据库或真实表单提交。

## 内容维护

- `src/content/profile.ts`：个人资料、服务、证明卡片和导航项。
- `src/content/projects.ts`：作品列表、详情页模块和项目元数据。
- `public/works/`：五项作品的网页优化图片与视频副本。

首页固定展示前四项作品；`/work` 按上述顺序展示全部五项，AIGC / SLG 个人练习固定最后。

## 完整验证

交付前依次执行：

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
git diff --check
```

`test:e2e` 使用 Playwright Chromium 启动生产构建，并检查桌面、平板和手机视口、路由以及 reduced-motion 降级。

## 来源项目规则

以下三个素材来源始终为只读：

- `C:\Users\HE\Desktop\gengengyuhuai\全案设计目前已完成素材\已完成_FD7014改色版\耿耿全案`
- `E:\CodexWorkspaces\01_Projects_项目工作区\hyh-visual-designer-portfolio\public\assets\works\event-materials`
- `C:\Users\HE\Documents\个人简历网站，slg广告`

不在来源目录内修改、删除、重命名或初始化 Git；网页使用的副本只在本项目 `public/works/` 内维护。
