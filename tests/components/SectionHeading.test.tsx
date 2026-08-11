import { act, render, waitFor } from "@testing-library/react"
import { hydrateRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { SectionHeading } from "@/src/components/motion/SectionHeading"

class ControlledIntersectionObserver implements IntersectionObserver {
  static latest: ControlledIntersectionObserver | undefined

  readonly root = null
  readonly rootMargin = "0px"
  readonly scrollMargin = "0px"
  readonly thresholds = [0]

  private readonly callback: IntersectionObserverCallback
  private target: Element | undefined

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    ControlledIntersectionObserver.latest = this
  }

  disconnect() {}

  observe(target: Element) {
    this.target = target
  }

  takeRecords() {
    return []
  }

  trigger(isIntersecting: boolean) {
    if (!this.target) throw new Error("Section heading was not observed")

    const bounds = this.target.getBoundingClientRect()
    this.callback(
      [{
        boundingClientRect: bounds,
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: isIntersecting ? bounds : new DOMRectReadOnly(),
        isIntersecting,
        rootBounds: null,
        target: this.target,
        time: performance.now(),
      }],
      this,
    )
  }

  unobserve(target: Element) {
    if (this.target === target) this.target = undefined
  }
}

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

it("hydrates visible SSR text into observer-driven entry motion and returns it to visible", async () => {
  const observerDescriptor = Object.getOwnPropertyDescriptor(globalThis, "IntersectionObserver")
  const serverMarkup = renderToString(<SectionHeading text="Hydrated heading" />)
  const container = document.createElement("div")
  container.innerHTML = serverMarkup
  document.body.append(container)
  const firstWord = container.querySelector("span")
  let root: Root | undefined

  if (!(firstWord instanceof HTMLElement)) throw new Error("SSR heading word is missing")
  expect(getComputedStyle(firstWord).opacity).toBe("1")

  try {
    ControlledIntersectionObserver.latest = undefined
    Object.defineProperty(globalThis, "IntersectionObserver", {
      configurable: true,
      value: ControlledIntersectionObserver,
    })

    await act(async () => {
      root = hydrateRoot(container, <SectionHeading text="Hydrated heading" />)
    })

    await waitFor(() => expect(firstWord).toHaveStyle({
      filter: "blur(10px)",
      opacity: "0",
      transform: "translateY(10px)",
    }))

    await act(async () => {
      ControlledIntersectionObserver.latest?.trigger(true)
    })

    await waitFor(() => expect(firstWord).toHaveStyle({
      filter: "blur(0px)",
      opacity: "1",
      transform: "none",
    }), { timeout: 3_000 })
  } finally {
    await act(async () => root?.unmount())
    container.remove()
    ControlledIntersectionObserver.latest = undefined

    if (observerDescriptor) {
      Object.defineProperty(globalThis, "IntersectionObserver", observerDescriptor)
    } else {
      Reflect.deleteProperty(globalThis, "IntersectionObserver")
    }
  }
})
