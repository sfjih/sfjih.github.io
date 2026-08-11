import { ContactSection } from "@/src/components/contact/ContactSection"
import { SiteFooter } from "@/src/components/footer/SiteFooter"
import { HeroBio } from "@/src/components/hero/HeroBio"
import { ProjectGrid } from "@/src/components/projects/ProjectGrid"
import { FlipCardGrid } from "@/src/components/proof/FlipCardGrid"
import { ScrollColorQuote } from "@/src/components/quote/ScrollColorQuote"
import { ServiceList } from "@/src/components/services/ServiceList"
import { getFeaturedProjects } from "@/src/content/projects"

export default function HomePage() {
  return (
    <>
      <main>
        <HeroBio />
        <ScrollColorQuote text="设计不是装饰，而是让复杂的信息变得清楚、可信、值得停留。" />
        <ServiceList />
        <ProjectGrid projects={getFeaturedProjects()} showHeading />
        <FlipCardGrid />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
