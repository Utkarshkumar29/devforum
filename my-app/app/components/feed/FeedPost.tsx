'use client'
import Image from "next/image"
import FeedComments from "./FeedComments"
import { useEffect, useState } from "react"
import { axiosPrivate } from "@/app/axios/axiosInstance"

const FeedPost=({post})=>{
    const [showComments, setShowComments]=useState(false)
    const [isPostLiked,setIsPostLiked]=useState(false)

    const handleLikePost=async()=>{
        try {
            const response=await axiosPrivate.post(`/posts/like/${post.slug}`,{reactionType:"love"})
            setIsPostLiked(true)
        } catch (error) {
            console.log(error)
        }
    }
    
    return(
        <div className=" w-full h-auto max-w-[700px] bg-[#23253c] rounded-[8px] border border-[#2c2b47] px-[24px] py-[16px] gap-4 flex flex-col ">
            <div className=" w-full flex justify-between ">
                    <div className=" flex gap-4 ">
                        <div>
                            <Image src={post?.user?.photo_url} alt="USer" width={50} height={50} className="rounded-full"/>
                        </div>
                        <div>
                            <p>{post?.user?.display_name}</p>
                            <p>{post?.createdAt}</p>
                        </div>
                    </div>
                    <div className="">...</div>
            </div>  
            <div>
                <span>{post?.description}</span>    
            </div>
            <div className=" my-2 border border-[#2c2b47] "></div>
            <div className=" flex justify-between px-[12px] ">
                {isPostLiked ? <i className="fa-solid fa-heart text-red-500 cursor-pointer"></i>:<i class={`fa-regular fa-heart cursor-pointer ${isPostLiked && "text-red-500"} `} onClick={()=>handleLikePost()}></i>}
                <p onClick={()=>setShowComments(prev=>!prev)} ><i className={`fa-regular fa-comment cursor-pointer ${showComments ? "text-white" : ""}`}></i></p>
                <i class="fa-solid fa-arrow-rotate-left cursor-pointer"></i>
                <i class="fa-solid fa-share cursor-pointer"></i>
            </div>
            {showComments && (
                <>
                    <FeedComments post={post}/>
                </>
            )}
        </div>
    )
}

export default FeedPost