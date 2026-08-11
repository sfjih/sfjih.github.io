import { render, screen } from "@testing-library/react"
import { ProjectCard } from "@/src/components/projects/ProjectCard"
import { projects } from "@/src/content/projects"

it("links a project card to its detail route", () => {
  render(<ProjectCard project={projects[0]} />)
  expect(screen.getByRole("link", { name: /视觉叙事练习/i })).toHaveAttribute(
    "href",
    "/work/visual-campaign-alpha",
  )
})
