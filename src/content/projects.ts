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
    slug: "visual-campaign-alpha",
    title: "视觉叙事练习",
    category: "视觉设计",
    year: "2026",
    role: "视觉设计",
    summary: "本地占位案例，用于展示首页作品卡片与详情页结构。",
    cover: "/placeholders/visual-campaign-alpha-cover.svg",
    featured: true,
    sections: [
      {
        type: "text",
        heading: "案例说明",
        body: "作品内容正在整理；此处仅保留可替换的占位内容。",
      },
      {
        type: "facts",
        items: [
          { label: "状态", value: "占位内容" },
          { label: "用途", value: "作品详情结构验证" },
        ],
      },
    ],
  },
  {
    slug: "character-system-study",
    title: "角色系统练习",
    category: "角色设计",
    year: "2026",
    role: "视觉设计",
    summary: "本地占位案例，用于展示角色系统类作品的信息层级。",
    cover: "/placeholders/character-system-study-cover.svg",
    featured: true,
    sections: [
      {
        type: "imagePair",
        images: [
          { src: "/placeholders/character-system-study-01.svg", alt: "角色系统占位图一" },
          { src: "/placeholders/character-system-study-02.svg", alt: "角色系统占位图二" },
        ],
      },
    ],
  },
  {
    slug: "event-identity-study",
    title: "活动识别练习",
    category: "品牌视觉",
    year: "2026",
    role: "视觉设计",
    summary: "本地占位案例，用于展示活动视觉识别项目的展示方式。",
    cover: "/placeholders/event-identity-study-cover.svg",
    featured: true,
    sections: [
      {
        type: "image",
        src: "/placeholders/event-identity-study-detail.svg",
        alt: "活动识别占位图",
        caption: "占位视觉，等待正式作品内容替换。",
      },
    ],
  },
  {
    slug: "aigc-motion-experiment",
    title: "AIGC 动态实验",
    category: "动态设计",
    year: "2026",
    role: "AIGC 内容设计",
    summary: "本地占位案例，用于验证动态作品模块的内容接口。",
    cover: "/placeholders/aigc-motion-experiment-cover.svg",
    featured: true,
    sections: [
      {
        type: "video",
        src: "/placeholders/aigc-motion-experiment.mp4",
        poster: "/placeholders/aigc-motion-experiment-poster.svg",
        title: "AIGC 动态实验占位视频",
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
