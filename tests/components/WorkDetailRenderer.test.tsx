import { render, screen } from "@testing-library/react"
import { WorkDetailRenderer } from "@/src/components/work/WorkDetailRenderer"

it("renders text, image and facts sections", () => {
  render(
    <WorkDetailRenderer
      sections={[
        { type: "text", heading: "项目背景", body: "这是一段占位说明。" },
        { type: "image", src: "/placeholders/project-01.svg", alt: "项目占位视觉" },
        { type: "facts", items: [{ label: "职责", value: "视觉设计" }] },
      ]}
    />,
  )

  expect(screen.getByRole("heading", { name: "项目背景" })).toBeInTheDocument()
  expect(screen.getByAltText("项目占位视觉")).toBeInTheDocument()
  expect(screen.getByText("视觉设计")).toBeInTheDocument()
})

it("renders an SLG keyframe gallery as a compact multi-column group", () => {
  render(
    <WorkDetailRenderer
      sections={[
        {
          type: "mediaGrid",
          heading: "案例一｜冰雪生存 SLG",
          label: "关键帧",
          variant: "keyframes",
          images: [
            { src: "/works/slg-aigc-practice/keyframe-01.webp", alt: "关键帧一" },
            { src: "/works/slg-aigc-practice/keyframe-02.webp", alt: "关键帧二" },
          ],
        },
      ]}
    />,
  )

  expect(screen.getByRole("heading", { name: "案例一｜冰雪生存 SLG" })).toBeInTheDocument()
  expect(screen.getByLabelText("案例一｜冰雪生存 SLG 关键帧")).toHaveAttribute("data-variant", "keyframes")
})
