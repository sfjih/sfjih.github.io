import { existsSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const expectedMedia = [
  "/works/genggeng-brand-system/cover.webp",
  "/works/genggeng-brand-system/character-turnaround.webp",
  "/works/genggeng-brand-system/color-system.webp",
  "/works/genggeng-brand-system/logo-system.webp",
  "/works/genggeng-brand-system/character-introduction.webp",
  "/works/genggeng-brand-system/expressions.webp",
  "/works/genggeng-brand-system/costume-pilot-painter.webp",
  "/works/genggeng-brand-system/costume-detective-magician.webp",
  "/works/genggeng-brand-system/badges.webp",
  "/works/genggeng-brand-system/phone-cases.webp",
  "/works/genggeng-brand-system/stationery.webp",
  "/works/genggeng-brand-system/merchandise-overview.webp",
  "/works/genggeng-brand-system/city-walk.webp",
  "/works/genggeng-brand-system/art-time.webp",
  "/works/genggeng-brand-system/park-time.webp",
  "/works/genggeng-brand-system/reading-time.webp",
  "/works/genggeng-brand-system/rainy-walk.webp",
  "/works/golden-knight-key-visual/kv-poster.webp",
  "/works/golden-knight-key-visual/onsite-application.webp",
  "/works/golden-knight-key-visual/medal.webp",
  "/works/golden-knight-key-visual/name-card.webp",
  "/works/golden-knight-key-visual/ticket.webp",
  "/works/golden-knight-key-visual/sash.webp",
  "/works/promotional-posters/february-event-cover.webp",
  "/works/promotional-posters/company-poster.webp",
  "/works/promotional-posters/investment-cover.webp",
  "/works/promotional-posters/planning-cover.webp",
  "/works/event-materials/totem-render.webp",
  "/works/event-materials/totem-photo.webp",
  "/works/event-materials/apparel-long.webp",
  "/works/event-materials/apparel-pattern.webp",
  "/works/event-materials/apparel-short.webp",
  "/works/event-materials/maintenance-record.webp",
  "/works/event-materials/onsite-01.webp",
  "/works/event-materials/onsite-02.webp",
  "/works/event-materials/onsite-03.webp",
  "/works/event-materials/onsite-04.webp",
  "/works/slg-aigc-practice/collection.webp",
  "/works/slg-aigc-practice/protagonist.webp",
  "/works/slg-aigc-practice/architecture.webp",
  "/works/slg-aigc-practice/enemy-faction.webp",
  ...Array.from({ length: 8 }, (_, index) =>
    `/works/slg-aigc-practice/keyframe-${String(index + 1).padStart(2, "0")}.webp`,
  ),
  "/works/slg-aigc-practice/final-video.mp4",
]

describe("project media", () => {
  it("keeps every selected project media file available and non-empty", () => {
    const publicRoot = join(process.cwd(), "public")
    const firstMissing = expectedMedia.find(
      (webPath) => !existsSync(join(publicRoot, webPath.slice(1))),
    )

    expect(firstMissing, `missing public media file: ${firstMissing}`).toBeUndefined()

    for (const webPath of expectedMedia) {
      expect(statSync(join(publicRoot, webPath.slice(1))).size, webPath).toBeGreaterThan(0)
    }
  })
})
