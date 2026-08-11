import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SiteNav } from "@/src/components/navigation/SiteNav"

it("opens and closes the navigation panel", async () => {
  const user = userEvent.setup()
  render(<SiteNav />)
  const openButton = screen.getByRole("button", { name: "打开导航" })

  expect(openButton).toHaveAttribute("aria-expanded", "false")
  await user.click(openButton)

  const closeButton = screen.getByRole("button", { name: "关闭导航" })
  expect(closeButton).toHaveAttribute("aria-expanded", "true")

  for (const [label, href] of [
    ["About", "/#about"],
    ["Services", "/#services"],
    ["Projects", "/#work"],
    ["Contact", "/#contact"],
  ] as const) {
    expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href)
  }

  await user.click(closeButton)

  expect(screen.getByRole("button", { name: "打开导航" })).toHaveAttribute(
    "aria-expanded",
    "false",
  )
  expect(screen.queryByRole("link", { name: "Projects" })).not.toBeInTheDocument()
})
