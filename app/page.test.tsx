import { render, screen } from "@testing-library/react"
import HomePage from "./page"

it("renders the portfolio shell title", () => {
  render(<HomePage />)
  expect(screen.getByRole("heading", { level: 1, name: /视觉设计师/i })).toBeInTheDocument()
})
