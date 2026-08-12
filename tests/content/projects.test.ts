import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import {
  getFeaturedProjects,
  getHomepageProjects,
  getProjectBySlug,
  projects,
  type Project,
} from "@/src/content/projects"

const expectedSlugs = [
  "genggeng-brand-system",
  "golden-knight-key-visual",
  "promotional-posters",
  "event-materials",
  "slg-aigc-practice",
]

function getMediaPaths(project: Project) {
  return [
    project.cover,
    ...project.sections.flatMap((section) => {
      switch (section.type) {
        case "image":
          return [section.src]
        case "imagePair":
          return section.images.map(({ src }) => src)
        case "mediaGrid":
          return section.images.map(({ src }) => src)
        case "video":
          return [section.poster, section.src]
        case "facts":
        case "text":
          return []
      }
    }),
  ]
}

describe("project content", () => {
  it("keeps the approved five projects in their fixed order", () => {
    expect(projects.map(({ slug }) => slug)).toEqual(expectedSlugs)
    expect(projects.map(({ title }) => title)).toEqual([
      "耿耿全案设计",
      "金骑士杯赛事主视觉",
      "宣传海报设计",
      "赛事物料设计与现场落地",
      "AIGC / SLG 个人练习",
    ])
  })

  it("returns only the first four projects as featured work", () => {
    expect(getFeaturedProjects().map(({ slug }) => slug)).toEqual(expectedSlugs.slice(0, 4))
    expect(projects.at(-1)).toMatchObject({
      category: "个人练习 / 非商业项目",
      featured: false,
    })
  })

  it("shows all five projects in the homepage work row, including the personal SLG practice", () => {
    expect(getHomepageProjects().map(({ slug }) => slug)).toEqual(expectedSlugs)
  })

  it("keeps the GengGeng case in the exact 01-to-17 source-file sequence", () => {
    const project = getProjectBySlug("genggeng-brand-system")
    const orderedImages = project?.sections.flatMap((section) => {
      if (section.type === "image") return [section.src]
      if (section.type === "imagePair") return section.images.map(({ src }) => src)
      return []
    })

    expect(orderedImages).toEqual(
      Array.from(
        { length: 17 },
        (_, index) => `/works/genggeng-brand-system/sequence/${String(index + 1).padStart(2, "0")}.png`,
      ),
    )
  })

  it("keeps both personal SLG cases with compact settings and keyframe galleries", () => {
    const project = getProjectBySlug("slg-aigc-practice")
    const galleries = project?.sections.filter((section) => section.type === "mediaGrid") ?? []

    expect(galleries.map((section) => section.heading)).toEqual(expect.arrayContaining([
      "案例一｜冰雪生存 SLG",
      "案例二｜BenBen SLG",
    ]))
    expect(galleries.filter((section) => section.variant === "keyframes")).toHaveLength(2)
    expect(galleries.find((section) => section.heading.includes("案例二｜BenBen SLG") && section.variant === "keyframes")?.images)
      .toHaveLength(10)
  })

  it("finds every approved project by slug", () => {
    expect(expectedSlugs.map((slug) => getProjectBySlug(slug)?.slug)).toEqual(expectedSlugs)
  })

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("missing")).toBeUndefined()
  })

  it("references existing local media and gives every content image useful alt text", () => {
    const mediaPaths = projects.flatMap(getMediaPaths)

    expect(new Set(mediaPaths).size).toBeGreaterThanOrEqual(68)
    for (const mediaPath of mediaPaths) {
      expect(mediaPath, `invalid public media path: ${mediaPath}`).toMatch(/^\/works\//)
      expect(existsSync(resolve(process.cwd(), "public", mediaPath.slice(1))), mediaPath).toBe(true)
    }

    const imageAlts = projects.flatMap((project) =>
      project.sections.flatMap((section) => {
        if (section.type === "image") return [section.alt]
        if (section.type === "imagePair") return section.images.map(({ alt }) => alt)
        if (section.type === "mediaGrid") return section.images.map(({ alt }) => alt)
        return []
      }),
    )

    expect(imageAlts.length).toBeGreaterThan(0)
    imageAlts.forEach((alt) => expect(alt.trim()).not.toBe(""))
  })

  it("keeps key visual, poster, and event-material media in separate projects", () => {
    const scopedProjects = [
      "golden-knight-key-visual",
      "promotional-posters",
      "event-materials",
    ].flatMap((slug) => {
      const project = getProjectBySlug(slug)
      return project ? [project] : []
    })

    expect(scopedProjects).toHaveLength(3)
    const pathSets = scopedProjects.map((project) => new Set(getMediaPaths(project)))

    for (let leftIndex = 0; leftIndex < pathSets.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < pathSets.length; rightIndex += 1) {
        expect([...pathSets[leftIndex]].filter((path) => pathSets[rightIndex].has(path))).toEqual([])
      }
    }
  })

  it("uses the approved event covers without a group-photo material cover", () => {
    expect(getProjectBySlug("golden-knight-key-visual")?.cover).toBe(
      "/works/golden-knight-key-visual/kv-poster.webp",
    )
    expect(getProjectBySlug("promotional-posters")?.cover).toBe(
      "/works/promotional-posters/february-event-cover.webp",
    )
    expect(getProjectBySlug("event-materials")?.cover).toBe(
      "/works/event-materials/apparel-short.webp",
    )
  })

  it("keeps every source image from the Golden Knight key-visual folder in that project only", () => {
    const keyVisual = getProjectBySlug("golden-knight-key-visual")
    const materials = getProjectBySlug("event-materials")
    const keyVisualPaths = keyVisual ? getMediaPaths(keyVisual) : []
    const materialPaths = materials ? getMediaPaths(materials) : []

    expect(keyVisualPaths).toEqual(expect.arrayContaining([
      "/works/golden-knight-key-visual/kv-poster.webp",
      "/works/golden-knight-key-visual/onsite-application.webp",
      "/works/golden-knight-key-visual/medal.webp",
      "/works/golden-knight-key-visual/name-card.webp",
      "/works/golden-knight-key-visual/ticket.webp",
      "/works/golden-knight-key-visual/sash.webp",
    ]))
    expect(materialPaths).not.toEqual(expect.arrayContaining([
      "/works/event-materials/medal.webp",
      "/works/event-materials/name-card.webp",
      "/works/event-materials/ticket.webp",
      "/works/event-materials/sash.webp",
    ]))
  })

  it("contains no placeholder project data", () => {
    const content = JSON.stringify(projects)

    expect(content).not.toContain("占位")
    expect(content).not.toMatch(
      /visual-campaign-alpha|character-system-study|event-identity-study|aigc-motion-experiment/,
    )
  })
})
