import { render } from "@testing-library/react"
import { ScrollColorQuote } from "@/src/components/quote/ScrollColorQuote"

it("renders one animated unit per Chinese character", () => {
  const { container } = render(<ScrollColorQuote text="设计清晰" />)

  const animatedUnits = container.querySelectorAll('p span[aria-hidden="true"]')

  expect(animatedUnits).toHaveLength(4)
  expect(Array.from(animatedUnits, (unit) => unit.textContent).join("")).toBe("设计清晰")
})
