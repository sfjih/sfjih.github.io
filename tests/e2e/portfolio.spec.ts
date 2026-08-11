import { expect, test, type Page } from "@playwright/test"

const baseURL = "http://127.0.0.1:3000"
const expectedProjects = [
  ["耿耿全案设计", "/work/genggeng-brand-system", 17],
  ["金骑士杯赛事主视觉", "/work/golden-knight-key-visual", 3],
  ["宣传海报设计", "/work/promotional-posters", 5],
  ["赛事物料设计与现场落地", "/work/event-materials", 15],
  ["AIGC / SLG 个人练习", "/work/slg-aigc-practice", 12],
] as const
const validDetailRoute = expectedProjects[0][1]
type ProjectExpectation = (typeof expectedProjects)[number]

async function expectProjectOrder(page: Page, expected: readonly ProjectExpectation[]) {
  const links = page.getByTestId("project-grid").getByRole("link")
  await expect(links).toHaveCount(expected.length)

  for (const [index, [title, route]] of expected.entries()) {
    await expect(links.nth(index)).toHaveAttribute("aria-label", `${title}，查看项目`)
    await expect(links.nth(index)).toHaveAttribute("href", route)
  }
}

async function expectLoadedImages(page: Page, expectedCount: number) {
  const images = page.locator("main img")
  await expect(images).toHaveCount(expectedCount)

  for (let index = 0; index < expectedCount; index += 1) {
    const image = images.nth(index)
    await image.scrollIntoViewIfNeeded()
    await expect.poll(() => image.evaluate((element) => {
      const media = element as HTMLImageElement
      return {
        complete: media.complete,
        naturalHeight: media.naturalHeight,
        naturalWidth: media.naturalWidth,
      }
    })).toMatchObject({
      complete: true,
      naturalHeight: expect.any(Number),
      naturalWidth: expect.any(Number),
    })
    expect(await image.evaluate((element) => (element as HTMLImageElement).naturalHeight))
      .toBeGreaterThan(0)
    expect(await image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
  }
}

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
    const front = document.querySelector<HTMLImageElement>('img[alt="何宇航证件照，黑白正面"]')
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

test("homepage shows exactly the four approved commercial projects", async ({ page }) => {
  await page.goto("/")

  await expectProjectOrder(page, expectedProjects.slice(0, 4))
  await expect(page.getByText("AIGC / SLG 个人练习", { exact: true })).toHaveCount(0)
})

test("work archive shows all five projects in the approved order", async ({ page }) => {
  await page.goto("/work")

  await expectProjectOrder(page, expectedProjects)
})

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

test("all navigation items reach their exact homepage landmarks", async ({ page }) => {
  for (const target of [
    { id: "about", label: "About", origin: "/" },
    { id: "services", label: "Services", origin: "/work" },
    { id: "work", label: "Projects", origin: validDetailRoute },
    { id: "contact", label: "Contact", origin: "/" },
  ] as const) {
    await test.step(`${target.label} from ${target.origin}`, async () => {
      await page.goto(target.origin)
      await waitForPageEntry(page)
      await openNavigation(page)

      await page.getByRole("link", { name: target.label }).click()

      await expect(page).toHaveURL(`${baseURL}/#${target.id}`)
      await expect(page.locator(`#${target.id}`)).toBeVisible()
    })
  }
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

  const project = page.getByRole("link", { name: "耿耿全案设计，查看项目" })
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

test("client route transition exposes an intermediate state before settling", async ({ page }) => {
  await page.goto("/work")
  await waitForPageEntry(page)

  await page.evaluate(() => {
    const samples: Array<{ opacity: number; translateY: number }> = []
    ;(window as typeof window & { __pageTransitionSamples?: typeof samples })
      .__pageTransitionSamples = samples

    let framesRemaining = 180
    const capture = () => {
      const pageContent = document.querySelector("main")?.parentElement
      if (pageContent) {
        const style = getComputedStyle(pageContent)
        const transform = style.transform
        samples.push({
          opacity: Number(style.opacity),
          translateY: transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42,
        })
      }

      framesRemaining -= 1
      if (framesRemaining > 0) requestAnimationFrame(capture)
    }

    requestAnimationFrame(capture)
  })

  await page.getByRole("link", { name: "耿耿全案设计，查看项目" }).click()
  await expect(page).toHaveURL(`${baseURL}${validDetailRoute}`)
  await waitForPageEntry(page)

  const samples = await page.evaluate(() => (
    (window as typeof window & {
      __pageTransitionSamples?: Array<{ opacity: number; translateY: number }>
    }).__pageTransitionSamples ?? []
  ))

  expect(samples.some(({ opacity }) => opacity > 0.02 && opacity < 0.98)).toBe(true)
  expect(samples.some(({ translateY }) => Math.abs(translateY) > 0.5)).toBe(true)
  await expect(page.locator("main").locator("..")).toHaveCSS("opacity", "1")
  await expect.poll(async () => page.locator("main").locator("..").evaluate((element) => {
    const transform = getComputedStyle(element).transform
    return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42
  })).toBe(0)
  await expect(page.getByRole("heading", { level: 1, name: "耿耿全案设计" })).toBeVisible()
})

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 900 },
  { name: "phone", width: 390, height: 844 },
]) {
  test(`${viewport.name} hero keeps the title clear of the lower viewport`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await waitForPageEntry(page)

    const box = await page.getByRole("heading", { level: 1 }).boundingBox()
    expect(box).not.toBeNull()
    const center = (box?.y ?? 0) + (box?.height ?? 0) / 2
    expect(center).toBeGreaterThan(viewport.height * 0.28)
    expect(center).toBeLessThan(viewport.height * 0.66)
  })
}

test("homepage uses real profile content and a two-tone scrolling portrait", async ({ page }) => {
  await page.goto("/")
  await waitForPageEntry(page)

  await expect(page.getByRole("heading", { level: 1, name: "平面设计师 / 品牌视觉设计" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:hyh2107567710@163.com",
  )
  await expect(page.getByRole("link", { name: "简历" })).toHaveAttribute("href", "/何宇航-个人简历.pdf")
  await expect(page.getByText(/占位|整理中|placeholder@example\.com/)).toHaveCount(0)

  const front = page.getByAltText("何宇航证件照，黑白正面")
  const back = page.getByAltText("何宇航证件照，彩色背面")
  await expect(front).toHaveAttribute("src", /portrait\.webp/)
  await expect(back).toHaveAttribute("src", /portrait\.webp/)
  await expect(front).toHaveCSS("filter", "grayscale(1)")
  await expect(back).toHaveCSS("filter", "none")
})

for (const viewport of [
  { name: "desktop", width: 1440, height: 900, mediaGap: 32 },
  { name: "phone", width: 390, height: 844, mediaGap: 16 },
]) {
  test(`${viewport.name} keeps consecutive detail media compact`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/work/genggeng-brand-system")
    await waitForPageEntry(page)

    const gaps = await page.evaluate(() => {
      const renderer = document.querySelector('[class*="renderer"]')
      if (!renderer) throw new Error("Project renderer is missing")
      const children = Array.from(renderer.children)
      const isMedia = (element: Element) => element.matches("figure, section[aria-label='项目图片组']")
      return children.slice(1).flatMap((element, index) => {
        const previous = children[index]
        if (!isMedia(previous) || !isMedia(element)) return []
        return [element.getBoundingClientRect().top - previous.getBoundingClientRect().bottom]
      })
    })

    expect(gaps.length).toBeGreaterThan(0)
    expect(Math.max(...gaps)).toBeLessThanOrEqual(viewport.mediaGap + 1)
  })
}

test("every project card reaches its exact detail route and heading", async ({ page }) => {
  for (const [title, route] of expectedProjects) {
    await test.step(title, async () => {
      await page.goto("/work")
      await waitForPageEntry(page)
      await page.getByRole("link", { name: `${title}，查看项目` }).click()

      await expect(page).toHaveURL(`${baseURL}${route}`)
      await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible()

      await page.getByRole("link", { name: "返回全部作品" }).click()
      await expect(page).toHaveURL(`${baseURL}/work`)
      await expect(page.getByRole("heading", { level: 1, name: /作品\s*档案/ })).toBeVisible()
    })
  }
})

test("every detail route loads all of its real images", async ({ page }) => {
  for (const [title, route, imageCount] of expectedProjects) {
    await test.step(title, async () => {
      await page.goto(route)
      await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible()
      await expectLoadedImages(page, imageCount)
      await expect(page.getByText(/占位|整理中|placeholder@example\.com/)).toHaveCount(0)
    })
  }
})

test("detail images preserve their full source composition", async ({ page }) => {
  await page.goto("/work/promotional-posters")

  const images = page.locator("main img")
  await expect(images).toHaveCount(5)
  for (let index = 0; index < await images.count(); index += 1) {
    await expect(images.nth(index)).toHaveCSS("object-fit", "contain")
  }
})

test("SLG detail exposes its non-commercial label and safe video controls", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/work/slg-aigc-practice")

  await expect(page.getByText("个人练习 / 非商业项目", { exact: true }).first()).toBeVisible()

  const video = page.locator('video[aria-label="冰雪生存 SLG AIGC 竖屏成片"]')
  await video.scrollIntoViewIfNeeded()
  await expect(video).toHaveAttribute("controls", "")
  await expect(video).toHaveAttribute("poster", "/works/slg-aigc-practice/keyframe-01.webp")
  await expect(video).not.toHaveAttribute("autoplay", /.*/)
  await expect(video).toHaveCSS("object-fit", "contain")
  expect(await video.evaluate((element) => (element as HTMLVideoElement).autoplay)).toBe(false)
  expect(await video.evaluate((element) => (element as HTMLVideoElement).error)).toBeNull()
  await expect.poll(() => video.evaluate((element) => {
    const media = element as HTMLVideoElement
    return { height: media.videoHeight, width: media.videoWidth }
  })).toEqual({ height: 1920, width: 1080 })
  await expect(video.locator("source")).toHaveAttribute(
    "src",
    "/works/slg-aigc-practice/final-video.mp4",
  )
})

test("reduced motion collapses the sticky avatar scene into visible normal flow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await waitForPageEntry(page)

  const state = await page.evaluate(() => {
    const front = document.querySelector<HTMLImageElement>('img[alt="何宇航证件照，黑白正面"]')
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
