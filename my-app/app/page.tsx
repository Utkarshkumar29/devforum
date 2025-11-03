import Image from "next/image";
import UplaodComponent from "./components/uploadcomponent";
import ConnectionTesting from "./components/connectionTesting";
import Navbar from "./components/navbar";
import HeroSection from "./components/heroSection";
import AboutSection from "./components/aboutSection";
import DiverseSection from "./components/diverseSection";
import ServicesSection from "./components/servicesSection";

export default function Home() {

  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <AboutSection/>
      <DiverseSection/>
      <ServicesSection/>
    </div>
  );
}
