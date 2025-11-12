"use client"

import Image from "next/image"
import { useSelector } from "react-redux"

const UploadFeed=()=>{
    const userDetails = useSelector((state) => state.userDetails)
    console.log(userDetails)
    return(
        <div className=" w-full max-w-[500px] bg-[#23253c] rounded-[8px] border border-[#2c2b47] px-[24px] py-[16px] ">
            <div className=" flex gap-6 ">
                <Image src={userDetails.user.photo_url} width={40} height={40} className=" rounded-full " alt="Profile Error"/>
                <input className=" px-[16px] py-[4px] rounded-[16px] text-[#4f4f5a] w-full bg-[#1e2035] h-[44px] " placeholder=" What's on your mind developer? "/>
            </div>
        </div>
    )
}

export default UploadFeed