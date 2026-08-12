import { render } from "@testing-library/react"
import { ProjectGrid } from "@/src/components/projects/ProjectGrid"
import { getHomepageProjects } from "@/src/content/projects"

it("omits the selected-work slogan above the homepage grid", () => {
  const { container } = render(
    <ProjectGrid projects={getHomepageProjects()} showHeading />,
  )

  expect(container).not.toHaveTextContent("选择作品，不急着解释，先让画面说话。")
})
