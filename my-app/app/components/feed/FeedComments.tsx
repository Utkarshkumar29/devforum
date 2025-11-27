'use client'
import { axiosPrivate } from "@/app/axios/axiosInstance"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const FeedComments=({post})=>{
    const userDetails=useSelector((state:any)=>state.user)
    const [commentText,setCommentText]=useState("")
    const [commentPage,setCommentPage]=useState(1)
    
    const handleAddComment=async()=>{
        try {
            const response=await axiosPrivate.post(`/posts/addComment/${post?.slug}`,{commentText})
            
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }


    const fetchComments=async()=>{
        try {
            const reponse=await axiosPrivate.get(`/posts/getComments/${post?.slug}?page=${commentPage}`)
            console.log(reponse)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchComments()
    },[commentPage])

    return(
        <div className=" flex border border-[#2c2b47] p-4 rounded-[8px] mt-4 h-auto gap-2 ">
            <Image src={post?.user?.photo_url} alt="User" width={20} height={20} className=" max-h-[20px] rounded-full " />
            <div className=" flex w-full flex-col ">
                <textarea onChange={(e)=>setCommentText(e.target.value)} type="textarea" className=" w-full outline-none bg-[#181621] border border-[#2c2b47] p-[24px] rounded-[8px] h-[100px] " placeholder="Add a comment...." />
                <div className=" flex justify-end mt-3 ">
                    <button className=" bg-[#7D42F5] px-4 py-2 rounded-[8px] " onClick={handleAddComment}>Post Comment</button>
                </div>
            </div>
        </div>
    )
}

export default FeedComments