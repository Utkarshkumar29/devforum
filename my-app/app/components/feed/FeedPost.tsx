'use client'
import Image from "next/image"
import FeedComments from "./FeedComments"
import { useEffect, useState } from "react"

const FeedPost=({post})=>{
    const [showComments, setShowComments]=useState(false)

    useEffect(()=>{
        console.log(showComments,'placed');
    },[showComments])
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
                <i class="fa-regular fa-heart cursor-pointer"></i>
                <p onClick={()=>setShowComments(prev=>!prev)} ><i className={`fa-regular fa-comment cursor-pointer ${showComments ? "text-white" : ""}`}></i>
</p>
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