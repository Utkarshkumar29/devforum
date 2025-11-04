"use client";
import dream from "../../public/dream.jpeg";
import expertise from "../../public/expertise.jpeg";
import connect from "../../public/connect.jpeg";
import collaboration from "../../public/collaboration.jpeg";
import developer from "../../public/developers.jpeg";
import Image from "next/image";
import { motion } from "framer-motion";

const ExploreSection = () => {
  const data = [
    {
      img: dream,
      title: "Find Your Dream",
      description:
        "Discover exciting job opportunities tailored to your skills and career aspirations on DevForum today.",
    },
    {
      img: expertise,
      title: "Share Your Expertise ",
      description:
        "Contribute to the community by sharing your insights, projects, and knowledge with fellow developers. ",
    },
    {
      img: connect,
      title: "Connect With Developers ",
      description:
        "Expand your network and collaborate with talented developers from around the world on DevForum. ",
    },
  ];

  return (
    <div className=" max-w-[1950px] flex flex-col justify-center items-center gap-40 h-full ">
      <div className=" max-w-[1150px] flex flex-col gap-30 ">
        {data &&
          data.map((item, index) => {
            return (
              <div
                key={index}
                className={` flex flex-row gap-40 ${
                  index === 1 ? "flex-row-reverse" : "flex-row"
                } `}
              >
                <motion.div
                  initial={{ opacity: 0, x: 0 }}
                  whileInView={{ opacity: 1, x: 10 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src={item.img}
                    alt="Error"
                    width={450}
                    height={350}
                    className=" max-h-[400px] max-w-[400px] min-w-[400px] object-cover "
                  />
                </motion.div>
                <motion.div
                  className=" flex gap-2 flex-col justify-center "
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <span className=" text-[60px] font-bold text-[#FFFFFFFF] leading-[70px] ">
                    {item.title}
                  </span>
                  <span className=" pt-[24px] pb-[35px] text-[18px] leading-[26px] ">
                    {item.description}
                  </span>
                  <span className=" text-black bg-[#FFFFFF] w-[165px] h-[60px] rounded-[60px] flex justify-center items-center font-bold ">
                    Explore Jobs
                  </span>
                </motion.div>
              </div>
            );
          })}

          
      </div>
      <div className=" bg-[#151515] max-w-[1300px] w-full flex gap-40 h-[800px] pt-[100px] pb-[100px] px-[50px] rounded-3xl ">
          <motion.div 
            className=" h-full relative w-1/2 "
            initial={{opacity:0,x:0}}
            whileInView={{opacity:1,x:40}}
          >
            <Image src={collaboration} alt="Error" className=" absolute top-40  w-[300px] h-[500px] rounded-4xl object-fill "/>
            <Image src={developer} alt="Error" className=" absolute top-5 -right-5 w-[350px] h-[400px] rounded-4xl object-cover"/>
          </motion.div>
          <motion.div
                  className=" flex gap-2 flex-col justify-center w-1/2 "
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <span className=" text-[55px] font-bold text-[#FFFFFFFF] leading-[60px] ">
                    Seamless Collaboration For Developers 
                  </span>
                  <span className=" pt-[24px] pb-[35px] text-[18px] leading-[26px] ">
                    Our highlighted feature provides seamless collaboration, empowering developers to connect, share ideas, and build innovative solutions together effectively. 
                  </span>
                  <span className=" text-black bg-[#FFFFFF] w-[165px] h-[60px] rounded-[60px] flex justify-center items-center font-bold ">
                    Explore Jobs
                  </span>
                </motion.div>
      </div>
    </div>
  );
};

export default ExploreSection;
