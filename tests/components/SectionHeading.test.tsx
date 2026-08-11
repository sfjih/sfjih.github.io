import { render, waitFor } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { SectionHeading } from "@/src/components/motion/SectionHeading"

it("keeps its initial markup deterministic before observer fallback mounts", async () => {
  const observerDescriptor = Object.getOwnPropertyDescriptor(globalThis, "IntersectionObserver")

  try {
    Reflect.deleteProperty(globalThis, "IntersectionObserver")
    const withoutObserver = renderToString(<SectionHeading text="Deterministic heading" />)

    expect(withoutObserver).not.toMatch(/opacity:0|blur\(10px\)|translateY\(10px\)/)

    Object.defineProperty(globalThis, "IntersectionObserver", {
      configurable: true,
      value: function IntersectionObserver() {},
    })
    const withObserver = renderToString(<SectionHeading text="Deterministic heading" />)

    expect(withObserver).toBe(withoutObserver)

    Reflect.deleteProperty(globalThis, "IntersectionObserver")
    const { getByText } = render(<SectionHeading text="Fallback heading" />)
    await waitFor(() => expect(getByText("Fallback")).toBeVisible())
  } finally {
    if (observerDescriptor) {
      Object.defineProperty(globalThis, "IntersectionObserver", observerDescriptor)
    } else {
      Reflect.deleteProperty(globalThis, "IntersectionObserver")
    }
  }
})
