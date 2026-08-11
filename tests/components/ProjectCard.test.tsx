import { render, screen } from "@testing-library/react"
import { ProjectCard } from "@/src/components/projects/ProjectCard"
import { projects } from "@/src/content/projects"

it("links a project card to its detail route", () => {
  render(<ProjectCard project={projects[0]} />)
  expect(screen.getByRole("link", { name: /耿耿全案设计/i })).toHaveAttribute(
    "href",
    "/work/genggeng-brand-system",
  )
})

it("renders the cover supplied by the project data", () => {
  const project = {
    ...projects[0],
    slug: "visual-campaign-alpha",
    cover: "/works/genggeng-brand-system/cover.webp",
  }
  const { container } = render(<ProjectCard project={project} />)
  const renderedSrc = container.querySelector("img")?.getAttribute("src")
  const sourcePath = renderedSrc
    ? new URL(renderedSrc, "http://localhost").searchParams.get("url") ?? renderedSrc
    : null

  expect(sourcePath).toBe("/works/genggeng-brand-system/cover.webp")
})
