'use client'
import Image from "next/image"
import orangeBg from "../../public/template-asset-b2537329.png"
import review from "../../public/template-asset-1f3b3c3b.png"
import post from "../../public/template-asset-297c0098.png"
import girl from "../../public/template-asset-23027c53.jpeg"
import Tick from "../../public/template-asset-cd0bda93.png"
import Msg from "../../public/template-asset-7800b6b5.png"
import { motion } from "framer-motion"

const DiverseSection = () => {
    return (
        <div className=" max-w-[1920px] flex justify-center items-center py-[100px] ">
            <div className=" flex flex-col gap-10 w-full  justify-center items-center ">
                <span className="  font-bold text-[35px] leading-[40px] text-[#D9D9D9] ">DevForum offers diverse services, fostering collaboration,<br /> knowledge sharing, and career advancement within the developer<br /> community. </span>
                <div className=" flex w-full  max-w-[1300px] gap-4 ">
                    <motion.div 
                        className=" relative  max-w-[423px] w-full h-auto bg-[#EF927B] rounded-[60px]  flex justify-center items-center "
                        initial={{ opacity: 0, x:-40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.7 }}
                    >
                        <Image src={orangeBg} alt="OrangeBg Error" className=" absolute " />
                        <Image src={review} alt="" className=" z-10 right-0 top-50 absolute " width={300} height={300} />
                        <Image src={post} alt="" className=" z-10 right-10 bottom-50 absolute " width={350} height={290} />
                    </motion.div>
                    <div className=" grid grid-cols-2 gap-4 ">
                        <motion.div 
                            className=" relative bg-[#7371EE] w-[423px] h-[400px] rounded-[60px] "
                            initial={{opacity:0,y:40}}
                            whileInView={{opacity:1,y:0}}
                            viewport={{once:true,amount:0.7}}
                        >
                            <div className=" absolute top-20 left-10 -rotate-12  max-w-[263px] w-full h-[72px] bg-[#111] text-[20px] font-semibold leading-[30px] rounded-[20px] flex justify-center items-center ">Find Jobs</div>
                            <div className=" shadow-2xl absolute top-40 left-10 w-full flex flex-col max-w-[350px] h-[100px] flex justify-center items-left bg-[#111] rounded-[20px] px-[25px] py-[10px] z-10 ">
                                <span className=" text-[20px] font-semibold leading-[30px]">Share Posts</span>
                                <span className=" text-[14px] leading-[24px] text-left ">Engage, learn, and grow.</span>
                            </div>
                            <div className=" shadow-2xs absolute top-70 left-30 rotate-12 w-full max-w-[263px] h-[72px] bg-[#111] text-[20px] font-semibold leading-[30px] rounded-[20px] flex justify-center items-center ">Find Jobs</div>
                        </motion.div>
                        <motion.div 
                            className=" relative bg-[#f3d2d2ff] w-[423px] h-[400px] rounded-[60px] flex items-center justify-center flex-col "
                            initial={{opacity:0,x:40}}
                            whileInView={{opacity:1,x:0}}
                            viewport={{once:true,amount:0.7}}
                        >
                            <span className=" text-[45px] leading-[55px] text-black font-bold ">Incredible<br /> platform,<br /> seamless </span>
                            <Image
                                src={girl}
                                alt="Error"
                                className="w-[136px] h-[136px] rounded-full object-cover"
                            />
                        </motion.div>
                        <motion.div 
                            className=" relative bg-[#f3d2d2ff] w-[423px] h-[400px] rounded-[60px] flex items-center justify-center flex-col "
                            initial={{opacity:0,x:40}}
                            whileInView={{opacity:1,x:0}}
                            viewport={{once:true,amount:0.7}}
                        >
                            <div className=" z-20 -rotate-12 shadow-2xl rounded-[16px] flex justify-center items-center bg-[#D9D9D9] w-[250px] h-[60px] text-[20px] font-semibold leading-[30px] text-black ">Send Messages</div>
                            <div className=" z-10 bg-[#f3d2d2ff] flex items-center justify-center w-[385px] h-[100px] shadow-2xl rounded-[16px] ">
                                <div className=" w-[60px] h-[60px] rounded-full p-[10px] bg-[#D9D9D9] flex justify-center items-center "><Image src={Tick} alt="Error"/></div>
                                <div className=" text-[30px] font-semibold leading-[40px] text-black">Build Network</div>
                            </div>
                            <div className=" -z-[9px] flex -rotate-12 shadow-2xl rounded-[16px] flex justify-center items-center bg-[#D9D9D9] w-[250px] h-[60px] text-[20px] font-semibold leading-[30px] text-black ">Read Articles</div>
                            <div className=" ml-20 bg-[#f3d2d2ff] flex justify-center items-center w-[235px] h-[60px] shadow-2xl rounded-[16px] gap-4 ">
                                <div className=" bg-[#71BC8F] p-[10px] w-[40px] h-[40px] rounded-full "><Image src={Msg} alt="Error"/></div>
                                <div className=" text-[20px] font-semibold leading-[30px] text-black">Edit Profile</div>
                            </div>
                        </motion.div>
                        <motion.div 
                            className=" relative bg-[#71BC8F] w-[423px] h-[400px] rounded-[60px] flex items-center justify-center flex-col "
                            initial={{opacity:0,y:40}}
                            whileInView={{opacity:1,y:0}}
                            viewport={{once:true,amount:0.7}}
                        >
                            <div className=" absolute top-20 shadow-2xl bg-[#7371EE] max-w-[385px] w-[133px] h-[52px] p-[5px] text-white rounded-[180px] font-bold text-[18px] leading-[28px] flex items-center justify-center  ">Lie Anna</div>
                            <div className=" absolute left-10 shadow-2xl bg-[#FCCE37] max-w-[385px] w-[133px] h-[52px] p-[5px] text-black rounded-[180px] font-bold text-[18px] leading-[28px] flex items-center justify-center  ">Jabrile jack</div>
                            <div className=" absolute top-70 shadow-2xl bg-white min-w-[133px] w-full max-w-[185px] h-[52px] p-[5px] text-black rounded-[180px] font-bold text-[18px] leading-[28px] flex items-center justify-center whitespace-nowrap  ">Johnson Smith</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiverseSection