import Navbar from "./components/landingPage/navbar";
import HeroSection from "./components/landingPage/heroSection";
import AboutSection from "./components/landingPage/aboutSection";
import DiverseSection from "./components/landingPage/diverseSection";
import ServicesSection from "./components/landingPage/servicesSection";
import ExploreSection from "./components/landingPage/exploreSection";
import GridSections from "./components/landingPage/girdSection";
import CollaborationSection from "./components/landingPage/collaborationSection";
import FrequentlySection from "./components/landingPage/FrequentlySection";
import FooterSection from "./components/landingPage/FooterSection";

export default function Home() {

  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <AboutSection/>
      <DiverseSection/>
      <ServicesSection/>
      <ExploreSection/>
      <GridSections/>
      <CollaborationSection/>
      <FrequentlySection/>
      <FooterSection/>
    </div>
  );
}
