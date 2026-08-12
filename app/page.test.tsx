import { render, screen } from "@testing-library/react"
import HomePage from "./page"

it("renders the portfolio shell title", () => {
  render(<HomePage />)
  expect(screen.getByRole("heading", { level: 1, name: "平面设计师 / 品牌视觉设计" })).toBeInTheDocument()
})

it("keeps the page footer outside the main landmark", () => {
  render(<HomePage />)
  expect(screen.getByRole("main")).not.toContainElement(screen.getByRole("contentinfo"))
})

it("shows all five cases in one homepage work row", () => {
  render(<HomePage />)
  const grid = screen.getByTestId("project-grid")

  expect(grid).toHaveAttribute("data-layout", "homepage-row")
  expect(grid.querySelectorAll("article")).toHaveLength(5)
})

it("does not render the profile notes card section", () => {
  render(<HomePage />)

  expect(screen.queryByRole("heading", { name: "翻过来，看看现在的进度。" })).not.toBeInTheDocument()
  expect(screen.queryByText("PROFILE NOTES · 04")).not.toBeInTheDocument()
})

it("uses a direct and natural contact invitation", () => {
  render(<HomePage />)

  expect(screen.getByRole("heading", { name: "有项目想聊？一起把想法做成好设计。" })).toBeInTheDocument()
  expect(screen.queryByText("有一个值得认真对待的视觉问题？")).not.toBeInTheDocument()
})
