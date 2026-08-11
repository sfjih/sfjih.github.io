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

export const projects: Project[] = [
  {
    slug: "genggeng-brand-system",
    title: "耿耿全案设计",
    category: "IP 全案 / 品牌视觉",
    year: "2026",
    role: "IP 设定 / 角色系统 / 品牌视觉延展",
    summary: "从角色系统、Logo 规范到周边与场景延展，建立耿耿 IP 的完整视觉表达。",
    cover: "/works/genggeng-brand-system/cover.webp",
    featured: true,
    sections: [
      {
        type: "text",
        heading: "项目定位",
        body: "以统一的角色语言为核心，向品牌标识、表情、服装、周边与生活场景展开，让 IP 形象在不同媒介中保持一致。",
      },
      {
        type: "image",
        src: "/works/genggeng-brand-system/character-turnaround.webp",
        alt: "耿耿角色二维转面与三维造型展示",
      },
      {
        type: "imagePair",
        images: [
          {
            src: "/works/genggeng-brand-system/color-system.webp",
            alt: "耿耿品牌标准色与辅助色系统",
          },
          {
            src: "/works/genggeng-brand-system/logo-system.webp",
            alt: "耿耿 Logo 字标与组合规范",
          },
        ],
      },
      {
        type: "image",
        src: "/works/genggeng-brand-system/character-introduction.webp",
        alt: "耿耿角色介绍与基础设定版面",
      },
      {
        type: "image",
        src: "/works/genggeng-brand-system/expressions.webp",
        alt: "耿耿角色表情与贴纸延展",
      },
      {
        type: "imagePair",
        images: [
          {
            src: "/works/genggeng-brand-system/costume-pilot-painter.webp",
            alt: "耿耿飞行员与画家职业服装设定",
          },
          {
            src: "/works/genggeng-brand-system/costume-detective-magician.webp",
            alt: "耿耿侦探与魔术师职业服装设定",
          },
        ],
      },
      {
        type: "imagePair",
        images: [
          {
            src: "/works/genggeng-brand-system/badges.webp",
            alt: "耿耿角色徽章与钥匙扣周边",
          },
          {
            src: "/works/genggeng-brand-system/phone-cases.webp",
            alt: "耿耿角色手机壳周边",
          },
        ],
      },
      {
        type: "imagePair",
        images: [
          {
            src: "/works/genggeng-brand-system/stationery.webp",
            alt: "耿耿角色文具与马克杯周边",
          },
          {
            src: "/works/genggeng-brand-system/merchandise-overview.webp",
            alt: "耿耿 IP 周边系列整体展示",
          },
        ],
      },
      {
        type: "imagePair",
        images: [
          {
            src: "/works/genggeng-brand-system/city-walk.webp",
            alt: "耿耿城市漫步场景插画",
          },
          {
            src: "/works/genggeng-brand-system/art-time.webp",
            alt: "耿耿艺术时光场景插画",
          },
        ],
      },
      {
        type: "imagePair",
        images: [
          {
            src: "/works/genggeng-brand-system/park-time.webp",
            alt: "耿耿公园时光场景插画",
          },
          {
            src: "/works/genggeng-brand-system/reading-time.webp",
            alt: "耿耿阅读时光场景插画",
          },
        ],
      },
      {
        type: "image",
        src: "/works/genggeng-brand-system/rainy-walk.webp",
        alt: "耿耿雨中漫步场景插画",
      },
    ],
  },
  {
    slug: "golden-knight-key-visual",
    title: "金骑士杯赛事主视觉",
    category: "赛事主视觉 / KV",
    year: "2025–2026",
    role: "赛事主视觉 / 视觉设计",
    summary: "围绕赛事主视觉完成构图、视觉元素、字体色彩与场景适配，建立统一的 KV 表达。",
    cover: "/works/golden-knight-key-visual/kv-poster.webp",
    featured: true,
    sections: [
      {
        type: "text",
        heading: "赛事背景",
        body: "金骑士杯赛事规划 6 站，已执行 4 站。主视觉需要在多站赛事与不同展示场景中保持识别一致。",
      },
      {
        type: "image",
        src: "/works/golden-knight-key-visual/kv-poster.webp",
        alt: "金骑士杯绿色赛事宣传主视觉 KV",
      },
      {
        type: "image",
        src: "/works/golden-knight-key-visual/onsite-application.webp",
        alt: "金骑士杯赛事主视觉现场应用",
      },
      {
        type: "text",
        heading: "主视觉逻辑",
        body: "画面以赛事构图为核心，统筹主视觉元素、字体和色彩，并为不同尺寸与场景保留可延展性。",
      },
      {
        type: "facts",
        items: [
          { label: "职责", value: "赛事主视觉 / 视觉设计" },
          { label: "项目周期", value: "2025–2026" },
        ],
      },
    ],
  },
  {
    slug: "promotional-posters",
    title: "宣传海报设计",
    category: "宣传海报 / 版式设计",
    year: "2025–2026",
    role: "海报设计 / 信息编排",
    summary: "覆盖赛事宣传、公司宣传、招商与策划文本四类内容，以版式建立清晰的信息层级。",
    cover: "/works/promotional-posters/february-event-cover.webp",
    featured: true,
    sections: [
      {
        type: "text",
        heading: "系列说明",
        body: "同一组平面实践分别处理赛事宣传、公司宣传、招商展示与策划文本，针对不同信息密度调整构图与阅读节奏。",
      },
      {
        type: "image",
        src: "/works/promotional-posters/february-event-cover.webp",
        alt: "二月赛事文本封面海报",
      },
      {
        type: "imagePair",
        images: [
          {
            src: "/works/promotional-posters/investment-cover.webp",
            alt: "招商文本封面版式设计",
          },
          {
            src: "/works/promotional-posters/planning-cover.webp",
            alt: "策划文本封面版式设计",
          },
        ],
      },
      {
        type: "image",
        src: "/works/promotional-posters/company-poster.webp",
        alt: "橙色与青绿色马术公司宣传海报",
      },
      {
        type: "facts",
        items: [
          { label: "构图", value: "根据载体比例组织主视觉与文字区域" },
          { label: "信息层级", value: "区分标题、核心信息与辅助内容" },
          { label: "文字排版", value: "适配宣传海报与文本封面的阅读顺序" },
        ],
      },
    ],
  },
  {
    slug: "event-materials",
    title: "赛事物料设计与现场落地",
    category: "赛事物料 / 现场落地",
    year: "2025–2026",
    role: "物料设计 / 打样沟通 / 供应商对接 / 现场执行",
    summary: "从物料设计、打样沟通到供应商对接与现场执行，15 天内推进赛事工装及志愿者马甲 200 余件成品交付。",
    cover: "/works/event-materials/apparel-short.webp",
    featured: true,
    sections: [
      {
        type: "text",
        heading: "从设计到落地",
        body: "项目涵盖空间导视、工装、奖牌、票证与现场应用，通过打样沟通、供应商对接和现场执行完成从画面到成品的转化。",
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/event-materials/totem-render.webp", alt: "赛事图腾装置效果图" },
          { src: "/works/event-materials/totem-photo.webp", alt: "赛事图腾装置现场实拍" },
        ],
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/event-materials/apparel-long.webp", alt: "赛事长款工装展示" },
          { src: "/works/event-materials/apparel-short.webp", alt: "赛事短款工装展示" },
        ],
      },
      {
        type: "image",
        src: "/works/event-materials/apparel-pattern.webp",
        alt: "赛事工装图案与版式细节",
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/event-materials/medal.webp", alt: "赛事奖牌设计与成品" },
          { src: "/works/event-materials/ticket.webp", alt: "赛事票券设计" },
        ],
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/event-materials/sash.webp", alt: "赛事授带物料设计" },
          { src: "/works/event-materials/name-card.webp", alt: "赛事工作证与姓名牌设计" },
        ],
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/event-materials/onsite-01.webp", alt: "赛事现场物料落地画面一" },
          { src: "/works/event-materials/onsite-02.webp", alt: "赛事现场物料落地画面二" },
        ],
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/event-materials/onsite-03.webp", alt: "赛事现场物料落地画面三" },
          { src: "/works/event-materials/onsite-04.webp", alt: "赛事现场物料落地画面四" },
        ],
      },
      {
        type: "image",
        src: "/works/event-materials/maintenance-record.webp",
        alt: "赛事物料现场维护记录",
      },
      {
        type: "facts",
        items: [
          { label: "交付周期", value: "15 天内" },
          { label: "成品数量", value: "赛事工装及志愿者马甲 200 余件" },
          { label: "执行范围", value: "设计 / 打样沟通 / 供应商对接 / 现场执行" },
        ],
      },
    ],
  },
  {
    slug: "slg-aigc-practice",
    title: "AIGC / SLG 个人练习",
    category: "个人练习 / 非商业项目",
    year: "2026",
    role: "创意策划 / 分镜 / 关键帧 / AI 视频 / 剪辑复盘",
    summary: "一项非商业 AIGC 个人练习，围绕冰雪生存 SLG 主题完成 8 张关键帧与约 22 秒竖屏成片。",
    cover: "/works/slg-aigc-practice/collection.webp",
    featured: false,
    sections: [
      {
        type: "text",
        heading: "个人练习 / 非商业项目",
        body: "以冰雪生存 SLG 为题进行创意策划、分镜、关键帧、AI 视频和剪辑复盘，完成从视觉设定到竖屏成片的全流程练习。",
      },
      {
        type: "facts",
        items: [
          { label: "成片时长", value: "22.17 秒" },
          { label: "画面规格", value: "1080×1920 / 24fps" },
          { label: "关键帧", value: "8 张" },
          { label: "职责", value: "创意策划 / 分镜 / 关键帧 / AI 视频 / 剪辑复盘" },
        ],
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/slg-aigc-practice/protagonist.webp", alt: "冰雪生存 SLG 主角设定" },
          { src: "/works/slg-aigc-practice/architecture.webp", alt: "冰雪生存 SLG 建筑与环境设定" },
        ],
      },
      {
        type: "image",
        src: "/works/slg-aigc-practice/enemy-faction.webp",
        alt: "冰雪生存 SLG 敌对阵营设定",
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/slg-aigc-practice/keyframe-01.webp", alt: "冰雪生存 SLG 关键帧一" },
          { src: "/works/slg-aigc-practice/keyframe-02.webp", alt: "冰雪生存 SLG 关键帧二" },
        ],
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/slg-aigc-practice/keyframe-03.webp", alt: "冰雪生存 SLG 关键帧三" },
          { src: "/works/slg-aigc-practice/keyframe-04.webp", alt: "冰雪生存 SLG 关键帧四" },
        ],
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/slg-aigc-practice/keyframe-05.webp", alt: "冰雪生存 SLG 关键帧五" },
          { src: "/works/slg-aigc-practice/keyframe-06.webp", alt: "冰雪生存 SLG 关键帧六" },
        ],
      },
      {
        type: "imagePair",
        images: [
          { src: "/works/slg-aigc-practice/keyframe-07.webp", alt: "冰雪生存 SLG 关键帧七" },
          { src: "/works/slg-aigc-practice/keyframe-08.webp", alt: "冰雪生存 SLG 关键帧八" },
        ],
      },
      {
        type: "video",
        src: "/works/slg-aigc-practice/final-video.mp4",
        poster: "/works/slg-aigc-practice/keyframe-01.webp",
        title: "冰雪生存 SLG AIGC 竖屏成片",
      },
    ],
  },
]

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured)
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}
