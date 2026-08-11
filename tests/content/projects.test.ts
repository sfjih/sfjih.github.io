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
