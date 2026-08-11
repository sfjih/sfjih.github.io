import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SiteNav } from "@/src/components/navigation/SiteNav"

it("opens and closes the navigation panel", async () => {
  const user = userEvent.setup()
  render(<SiteNav />)
  const button = screen.getByRole("button", { name: /打开导航/i })
  expect(button).toHaveAttribute("aria-expanded", "false")
  await user.click(button)
  expect(button).toHaveAttribute("aria-expanded", "true")
  expect(screen.getByRole("link", { name: "作品" })).toBeVisible()
})
