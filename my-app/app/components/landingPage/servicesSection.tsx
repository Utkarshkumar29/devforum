'use client'
import {motion} from "framer-motion"

const ServicesSection = () => {
    return(
        <div className=" max-w-[1920px] flex pb-[65px] justify-center ">
            <div className=" max-w-[1100px] w-full ">
                <motion.div 
                    className=" max-w-[700px] h-[172px] text-[90px] leading-[100px] font-bold border border-white p-2.5 w-full flex justify-center items-center text-center rounded-[100px] rounded-bl-none "
                    initial={{opacity:0,x:-80}}
                    whileInView={{opacity:1,x:0}}
                    viewport={{once:true,amount:0.7}}
                    transition={{duration:1,ease:"easeOut"}}
                >Servies</motion.div>
                <motion.div 
                    className=" max-w-[800px] h-[172px] text-[90px] leading-[100px] font-bold text-black bg-white p-2.5 w-full flex justify-center items-center text-center rounded-[100px] rounded-bl-none "
                    initial={{opacity:0,x:80}}
                    whileInView={{opacity:1,x:0}}
                    viewport={{once:true,amount:0.7}}
                    transition={{duration:1,ease:"easeOut"}}
                >For You</motion.div>
                <div className=" text-[18px] leading-[28px] text-[#D9D9D9] pt-[24px] pb-[35px] ">DevForum offers diverse services, fostering collaboration, knowledge sharing, and career<br/> advancement within the developer community. </div>
            </div>
        </div>
    )
}

export default ServicesSection;