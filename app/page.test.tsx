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
