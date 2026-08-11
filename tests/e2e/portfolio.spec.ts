import { expect, test, type Page } from "@playwright/test"

const baseURL = "http://127.0.0.1:3000"
const validDetailRoute = "/work/visual-campaign-alpha"

async function waitForPageEntry(page: Page) {
  const pageContent = page.locator("main").locator("..")
  await expect(pageContent).toHaveCSS("opacity", "1")
  await expect.poll(async () => pageContent.evaluate((element) => {
    const transform = getComputedStyle(element).transform
    return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42
  })).toBe(0)
}

async function openNavigation(page: Page) {
  await page.getByRole("button", { name: "打开导航" }).click()
  await expect(page.getByRole("button", { name: "关闭导航" })).toHaveAttribute(
    "aria-expanded",
    "true",
  )
}

async function animationFrame(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  }))
}

async function readAvatarTransform(page: Page) {
  return page.evaluate(() => {
    const front = document.querySelector<HTMLImageElement>('img[alt="头像正面占位图"]')
    const faces = front?.parentElement
    const avatar = faces?.parentElement

    if (!avatar || !faces) {
      throw new Error("Sticky avatar transform carriers are missing")
    }

    const avatarMatrix = new DOMMatrixReadOnly(getComputedStyle(avatar).transform)
    const facesMatrix = new DOMMatrixReadOnly(getComputedStyle(faces).transform)

    return {
      rotateCosine: facesMatrix.m11,
      scale: avatarMatrix.m11,
      translateY: avatarMatrix.m42,
    }
  })
}

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

for (const viewport of [
  { name: "desktop", width: 1440, expectedWidth: 320 },
  { name: "phone", width: 375, expectedWidth: 335 },
]) {
  test(`${viewport.name} navigation keeps its closed and open geometry`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: 900 })
    await page.goto("/")
    await waitForPageEntry(page)

    const navigation = page.getByRole("navigation", { name: "全局导航" })
    await expect.poll(async () => Math.round((await navigation.boundingBox())?.width ?? 0))
      .toBe(viewport.expectedWidth)
    await expect.poll(async () => Math.round((await navigation.boundingBox())?.height ?? 0)).toBe(60)

    await openNavigation(page)
    await expect.poll(async () => Math.round((await navigation.boundingBox())?.height ?? 0)).toBe(259)

    for (const [label, href] of [
      ["About", "/#about"],
      ["Services", "/#services"],
      ["Projects", "/#work"],
      ["Contact", "/#contact"],
    ] as const) {
      await expect(page.getByRole("link", { name: label })).toHaveAttribute("href", href)
    }
  })
}

test("homepage and work navigation reach exact homepage landmarks", async ({ page }) => {
  await page.goto("/")
  await waitForPageEntry(page)
  await openNavigation(page)
  await page.getByRole("link", { name: "Services" }).click()
  await expect(page).toHaveURL(`${baseURL}/#services`)
  await expect(page.locator("#services")).toBeVisible()

  await page.goto("/work")
  await waitForPageEntry(page)
  await openNavigation(page)
  await page.getByRole("link", { name: "About" }).click()
  await expect(page).toHaveURL(`${baseURL}/#about`)
  await expect(page.locator("#about")).toBeVisible()
})

test("desktop project grid keeps the specified 16px gap", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")

  const projectGrid = page.getByTestId("project-grid")
  await expect(projectGrid).toBeVisible()
  await expect(projectGrid).toHaveCSS("gap", "16px")
})

test("normal motion maps the sticky avatar at the start, midpoint, and end", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await waitForPageEntry(page)

  const range = await page.evaluate(() => {
    const bio = document.querySelector("#about")
    if (!bio) throw new Error("About landmark is missing")
    const bioTop = bio.getBoundingClientRect().top + scrollY
    return { end: bioTop, start: bioTop - innerHeight }
  })

  await page.evaluate((scrollY) => scrollTo(0, scrollY), range.start)
  await animationFrame(page)
  let state = await readAvatarTransform(page)
  expect(state.scale).toBeCloseTo(0.5, 2)
  expect(state.translateY).toBeCloseTo(114, 0)
  expect(state.rotateCosine).toBeCloseTo(1, 2)

  await page.evaluate((scrollY) => scrollTo(0, scrollY), (range.start + range.end) / 2)
  await animationFrame(page)
  state = await readAvatarTransform(page)
  expect(state.scale).toBeCloseTo(0.75, 2)
  expect(state.translateY).toBeCloseTo(57, 0)
  expect(state.rotateCosine).toBeCloseTo(0, 2)

  await page.evaluate((scrollY) => scrollTo(0, scrollY), range.end)
  await animationFrame(page)
  state = await readAvatarTransform(page)
  expect(state.scale).toBeCloseTo(1, 2)
  expect(state.translateY).toBeCloseTo(0, 0)
  expect(state.rotateCosine).toBeCloseTo(-1, 2)
})

test("quote color progresses from the first character to the last", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await waitForPageEntry(page)

  const quoteText = "设计不是装饰，而是让复杂的信息变得清楚、可信、值得停留。"
  const quote = page.getByText(quoteText, { exact: true }).locator("xpath=ancestor::section")
  const units = quote.locator('p > span[aria-hidden="true"]')
  const range = await quote.evaluate((element) => {
    const top = element.getBoundingClientRect().top + scrollY
    return { end: top + element.getBoundingClientRect().height, start: top - innerHeight }
  })

  await page.evaluate((scrollY) => scrollTo(0, scrollY), (range.start + range.end) / 2)
  await animationFrame(page)

  await expect(units.first()).toHaveCSS("color", "rgb(17, 17, 17)")
  await expect(units.last()).not.toHaveCSS("color", "rgb(17, 17, 17)")

  await page.evaluate((scrollY) => scrollTo(0, scrollY), range.end)
  await animationFrame(page)
  await expect(units.last()).toHaveCSS("color", "rgb(17, 17, 17)")
})

test("project hover reveals its cue and scales the image", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/work")
  await waitForPageEntry(page)

  const project = page.getByRole("link", { name: "视觉叙事练习，查看项目" })
  await project.hover()

  await expect(project.locator("img")).toHaveCSS("transform", /matrix\(1\.04/)
  await expect(project.locator("text=VIEW")).toHaveCSS("opacity", "1")
})

test("keyboard focus flips a proof card", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await waitForPageEntry(page)

  const card = page.locator('section[aria-labelledby="proof-heading"] article').first()
  await card.focus()

  await expect.poll(async () => card.locator('[aria-hidden="true"]').evaluate((element) => {
    const transform = getComputedStyle(element).transform
    return new DOMMatrixReadOnly(transform).m11
  })).toBe(-1)
})

test("page transition settles in a visible state", async ({ page }) => {
  await page.goto("/work")
  await waitForPageEntry(page)

  await expect(page.locator("main").locator("..")).toBeVisible()
  await expect(page.getByRole("heading", { level: 1, name: /作品\s*档案/ })).toBeVisible()
})

test("project routes use exact destinations and page landmarks", async ({ page }) => {
  await page.goto("/work")
  await waitForPageEntry(page)

  await page.getByRole("link", { name: "视觉叙事练习，查看项目" }).click()

  await expect(page).toHaveURL(`${baseURL}${validDetailRoute}`)
  await expect(page.getByRole("heading", { level: 1, name: "视觉叙事练习" })).toBeVisible()

  await page.getByRole("link", { name: "返回全部作品" }).click()
  await expect(page).toHaveURL(`${baseURL}/work`)
  await expect(page.getByRole("heading", { level: 1, name: /作品\s*档案/ })).toBeVisible()
})

test("reduced motion collapses the sticky avatar scene into visible normal flow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await waitForPageEntry(page)

  const state = await page.evaluate(() => {
    const front = document.querySelector<HTMLImageElement>('img[alt="头像正面占位图"]')
    const faces = front?.parentElement
    const avatar = faces?.parentElement
    const stage = avatar?.parentElement
    const scene = stage?.parentElement
    const bio = document.querySelector<HTMLElement>("#about, #bio-section")

    if (!scene || !stage || !avatar || !faces || !bio) {
      throw new Error("Reduced-motion avatar structure is incomplete")
    }

    return {
      avatarTransform: getComputedStyle(avatar).transform,
      bioVisible: bio.getBoundingClientRect().height > 0,
      facesTransform: getComputedStyle(faces).transform,
      sceneHeight: scene.getBoundingClientRect().height,
      stagePosition: getComputedStyle(stage).position,
      stageVisible: stage.getBoundingClientRect().height > 0,
    }
  })

  expect(state.sceneHeight).toBeLessThan(900 * 1.7)
  expect(state.stagePosition).toBe("relative")
  expect(state.avatarTransform).toBe("none")
  expect(state.facesTransform).toBe("none")
  expect(state.stageVisible).toBe(true)
  expect(state.bioVisible).toBe(true)
  const reducedQuote = page
    .getByText("设计不是装饰，而是让复杂的信息变得清楚、可信、值得停留。", {
      exact: true,
    })
    .locator("xpath=ancestor::section")
  await expect(reducedQuote).toBeVisible()
  await expect(reducedQuote.locator('p > span[aria-hidden="true"]').first()).toHaveCSS(
    "color",
    "rgb(17, 17, 17)",
  )
})

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false })

  for (const route of ["/", "/work", validDetailRoute]) {
    test(`${route} keeps its server-rendered content visible`, async ({ page }) => {
      const response = await page.goto(route)

      expect(response?.ok()).toBe(true)
      await expect(page.locator("main")).toBeVisible()
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      await expect(page.locator("main").locator("..")).toHaveCSS("opacity", "1")

      if (route === "/") {
        const headingWord = page.getByRole("heading", { level: 1 }).locator("span").first()
        await expect(headingWord).toHaveCSS("opacity", "1")
        await expect(headingWord).toHaveCSS("filter", "none")
      }
    })
  }
})

test("an unknown work slug returns the portfolio 404", async ({ page }) => {
  const response = await page.goto("/work/unknown-portfolio-slug")

  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { level: 1, name: "这一页还没有被装订。" })).toBeVisible()
})
