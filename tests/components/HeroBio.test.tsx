import { render, screen } from "@testing-library/react"
import { HeroBio } from "@/src/components/hero/HeroBio"

it("exposes hero and bio anchors with the real portrait on both flip faces", () => {
  const { container } = render(<HeroBio />)
  expect(container.querySelector("#hero-section")).toBeInTheDocument()
  expect(container.querySelector("#about")).toBeInTheDocument()
  expect(screen.getByAltText("何宇航证件照，黑白正面")).toHaveAttribute("src", expect.stringContaining("portrait.webp"))
  expect(screen.getByAltText("何宇航证件照，彩色背面")).toHaveAttribute("src", expect.stringContaining("portrait.webp"))
})
