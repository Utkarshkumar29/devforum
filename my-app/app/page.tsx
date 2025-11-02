import Image from "next/image";
import UplaodComponent from "./components/uploadcomponent";
import ConnectionTesting from "./components/connectionTesting";
import Navbar from "./components/navbar";
import HeroSection from "./components/heroSection";

export default function Home() {

  return (
    <div>
      <Navbar/>
      <HeroSection/>
    </div>
  );
}
