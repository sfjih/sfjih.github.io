# 作品集网站骨架

这是一个基于 Next.js 的视觉设计师作品集首版骨架，已包含主要路由、响应式布局、核心动效和自动化验证。当前展示的项目名称、文案、图片和联系方式均为清晰标记的本地占位内容，不代表最终作品。

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
- `/work/[slug]`：作品详情，由本地项目数据生成。

首版不包含博客、CMS、登录、数据库或真实表单提交。

## 内容维护

- `src/content/profile.ts`：个人资料、服务、证明卡片和导航项。
- `src/content/projects.ts`：作品列表、详情页模块和项目元数据。
- `public/placeholders/`：首版专用占位素材。

下一阶段才会从经用户确认的 SLG 项目和 IP 项目中复制真实素材，并替换上述占位数据。

## 完整验证

交付前依次执行：

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

`test:e2e` 使用 Playwright Chromium 启动生产构建，并检查桌面、平板和手机视口、路由以及 reduced-motion 降级。

## 来源项目规则

以下两个来源项目在当前阶段始终为只读：

- `C:\Users\HE\Documents\个人简历网站，slg广告`
- `C:\Users\HE\Documents\ip全案设计`

不在来源目录内修改、删除、重命名或初始化 Git；不覆盖用户已有变更。当前首版不从来源项目复制正式作品素材。
