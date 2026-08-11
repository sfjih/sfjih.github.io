import { expect, test } from "@playwright/test"

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 900 },
  { name: "phone", width: 390, height: 844 },
]) {
  test(`${viewport.name} homepage has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/")

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )

    expect(overflow).toBe(false)
  })
}

test("desktop project grid keeps the specified 16px gap", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")

  const projectGrid = page.getByTestId("project-grid")
  await expect(projectGrid).toBeVisible()
  await expect(projectGrid).toHaveCSS("gap", "16px")
})

test("navigation opens and work route resolves", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")

  await page.getByRole("button", { name: /打开导航/i }).click()
  await expect(page.getByRole("link", { name: "作品" })).toBeVisible()
  await page.getByRole("link", { name: "作品" }).click()

  await expect(page).toHaveURL(/\/work/)
})

test("project card opens a detail page", async ({ page }) => {
  await page.goto("/work")
  await page.getByRole("link", { name: /视觉叙事练习/i }).click()

  await expect(page).toHaveURL(/\/work\/visual-campaign-alpha/)
})

test("reduced motion keeps content accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expect(page.locator("main")).toBeVisible()
})
