"use client"

import Image from "next/image"
import { Fragment, useState } from "react"
import { useSelector } from "react-redux"
import { Dialog, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
 
const UploadFeed=()=>{
    const userDetails = useSelector((state) => state.userDetails)
    const [createPost,setCreatePost]=useState(false)

    const handleCreatePostClose=()=>{
        setCreatePost(false)
    }
    
    return(
        <>
        <div className=" w-full max-w-[700px] bg-[#23253c] rounded-[8px] border border-[#2c2b47] px-[24px] py-[16px] ">
            <div className=" flex items-center justify-center gap-6 border-b border-[#2c2b47] pb-[16px] ">
                {/*<Image src={userDetails?.user?.photo_url} width={60} height={60} className=" rounded-full " alt="Profile Error"/>*/}
                <input onClick={()=>setCreatePost(true)} className=" outline-none px-[16px] py-[4px] rounded-[16px] text-[#4f4f5a] w-full bg-[#1e2035] h-[44px] " placeholder=" What's on your mind developer? "/>
            </div>
            <div className=" justify-between flex pt-[16px] ">
                <div className=" flex flex-row justify-center gap-4">
                    <div className=" cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                        <i className="fa-solid fa-image text-[#614fae]  "></i>
                        <span className=" text-[#614fae] ">Image</span>
                    </div>
                    <div className=" cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                        <i className="fa-solid fa-video text-[#614fae]  "></i>
                        <span className=" text-[#614fae] ">Video</span>
                    </div>
                    <div className=" cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                        <i className="fa-solid fa-file text-[#614fae]  "></i>
                        <span className=" text-[#614fae] ">File</span>
                    </div>
                    <div className=" cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                        <i className="fa-solid fa-poll text-[#614fae]  "></i>
                        <span className=" text-[#614fae] ">Poll</span>
                    </div>
                </div>
                <div className=" cursor-pointer flex justify-center items-center bg-[#7d42f5] px-[24px] py-[6px] rounded-[8px] font-semibold ">Post</div>
            </div>
        </div>

        <Transition show={createPost} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleCreatePostClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className=" fixed inset-0 black/30 flex justify-center items-center ">
                        <div className="w-[500px] h-[500px] bg-gray-800 rounded-2xl ">
                        <DialogTitle>
                            <div className=" flex justify-between px-[24px] py-[16px] ">
                                <span className=" text-[20px] leading-[24px] font-semibold ">Create Post</span>
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                        </DialogTitle>
                        </div>
                    </div>       
                </TransitionChild>
            </Dialog>
        </Transition>
        </>
    )
}

export default UploadFeed