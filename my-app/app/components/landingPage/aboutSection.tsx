"use client";
import Image from "next/image";
import aboutSectionImg from "../../../public/aboutSection.svg";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <div className=" max-w-[1980px] flex justify-center items-center pb-[100px] pt-[30px] ">
      <div className=" flex justify-between items-center px-[50px] min-h-[600px] max-w-[1300px] bg-[#71BC8F] w-full rounded-[50px] gap-[50px] ">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Image
            src={aboutSectionImg}
            className=" max-w-[650px] max-h-[600px] "
            alt="Error"
          />
        </motion.div>
        <div className=" flex flex-col gap-6  ">
          <span className=" text-white font-bold text-[60px] leading-[70px] ">
            About DevForum
          </span>
          <span className=" text-white text-[18px] leading-[26px] font-medium ">
            DevForum is a vibrant community where developers connect, share
            knowledge, and discover opportunities. Join us to shape tomorrow's
            tech landscape.{" "}
          </span>
          <span className=" rounded-[100px] text-black text-[18px] leading-[28px] font-bold bg-white max-w-[165px] h-[60px] px-[42px] py-[10px] whitespace-nowrap flex items-center justify-center  ">
            Learn More
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
