import { ContactSection } from "@/src/components/contact/ContactSection"
import { SiteFooter } from "@/src/components/footer/SiteFooter"
import { HeroBio } from "@/src/components/hero/HeroBio"
import { ProjectGrid } from "@/src/components/projects/ProjectGrid"
import { ServiceList } from "@/src/components/services/ServiceList"
import { getHomepageProjects } from "@/src/content/projects"

export default function HomePage() {
  return (
    <>
      <main>
        <HeroBio />
        <ServiceList />
        <ProjectGrid projects={getHomepageProjects()} showHeading />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
