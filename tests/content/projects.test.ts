import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import {
  getFeaturedProjects,
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

  it("finds every approved project by slug", () => {
    expect(expectedSlugs.map((slug) => getProjectBySlug(slug)?.slug)).toEqual(expectedSlugs)
  })

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("missing")).toBeUndefined()
  })

  it("references existing local media and gives every content image useful alt text", () => {
    const mediaPaths = projects.flatMap(getMediaPaths)

    expect(new Set(mediaPaths)).toHaveLength(50)
    for (const mediaPath of mediaPaths) {
      expect(mediaPath, `invalid public media path: ${mediaPath}`).toMatch(/^\/works\//)
      expect(existsSync(resolve(process.cwd(), "public", mediaPath.slice(1))), mediaPath).toBe(true)
    }

    const imageAlts = projects.flatMap((project) =>
      project.sections.flatMap((section) => {
        if (section.type === "image") return [section.alt]
        if (section.type === "imagePair") return section.images.map(({ alt }) => alt)
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

  it("contains no placeholder project data", () => {
    const content = JSON.stringify(projects)

    expect(content).not.toContain("占位")
    expect(content).not.toMatch(
      /visual-campaign-alpha|character-system-study|event-identity-study|aigc-motion-experiment/,
    )
  })
})
