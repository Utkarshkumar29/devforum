import Image from "next/image";
import UplaodComponent from "./components/uploadcomponent";
import ConnectionTesting from "./components/connectionTesting";
import Navbar from "./components/navbar";
import HeroSection from "./components/heroSection";
import AboutSection from "./components/aboutSection";
import DiverseSection from "./components/diverseSection";
import ServicesSection from "./components/servicesSection";
import ExploreSection from "./components/exploreSection";
import GridSections from "./components/girdSection";
import CollaborationSection from "./components/collaborationSection";
import FrequentlySection from "./components/FrequentlySection";

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
      <ExploreSection/>
      <CollaborationSection/>
      <FrequentlySection/>
    </div>
  );
}
