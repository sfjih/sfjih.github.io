import { render } from "@testing-library/react"
import { ScrollColorQuote } from "@/src/components/quote/ScrollColorQuote"

it("renders one animated unit per Chinese character", () => {
  const { container } = render(<ScrollColorQuote text="设计清晰" />)

  const animatedUnits = container.querySelectorAll('p span[aria-hidden="true"]')

  expect(animatedUnits).toHaveLength(4)
  expect(Array.from(animatedUnits, (unit) => unit.textContent).join("")).toBe("设计清晰")
})

it("exposes the complete quote once as real accessibility text", () => {
  const { container } = render(<ScrollColorQuote text="设计清晰" />)
  const paragraph = container.querySelector("p")
  const accessibleTextNodes = container.querySelectorAll('p > span:not([aria-hidden="true"])')

  expect(paragraph).not.toHaveAttribute("aria-label")
  expect(accessibleTextNodes).toHaveLength(1)
  expect(accessibleTextNodes[0]).toHaveTextContent("设计清晰")
  expect(accessibleTextNodes[0].childNodes).toHaveLength(1)
  expect(accessibleTextNodes[0].firstChild?.nodeType).toBe(Node.TEXT_NODE)
  expect(container.querySelectorAll('p > span[aria-hidden="true"]')).toHaveLength(4)
})
