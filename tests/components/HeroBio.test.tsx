import { render, screen } from "@testing-library/react"
import { HeroBio } from "@/src/components/hero/HeroBio"

it("exposes hero and bio anchors with two avatar faces", () => {
  const { container } = render(<HeroBio />)
  expect(container.querySelector("#hero-section")).toBeInTheDocument()
  expect(container.querySelector("#bio-section")).toBeInTheDocument()
  expect(screen.getByAltText("头像正面占位图")).toBeInTheDocument()
  expect(screen.getByAltText("头像背面占位图")).toBeInTheDocument()
})
