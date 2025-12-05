'use client'
import Image from "next/image"
import FeedComments from "./FeedComments"
import { useState } from "react"
import { axiosPrivate } from "@/app/axios/axiosInstance"
import { toast } from "react-toastify"

interface PollOption {
  _id: string;
  optionText: string;
  votes: number;
}

const FeedPost = ({ post }: { post: any }) => {
    const [showComments, setShowComments] = useState(false)
    const [isPostLiked, setIsPostLiked] = useState(false)

    const handleLikePost = async () => {
        try {
            const response = await axiosPrivate.post(`/posts/like/${post.slug}`, { reactionType: "love" })
            if (response.data.message == "Reaction removed") {
                setIsPostLiked(false)
            } else {
                setIsPostLiked(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    //const [pollLoading, setPollLoading] = useState(false)
    const handleVote = async (option: PollOption) => {
        try {
            //setPollLoading(true)
            const optionId = option._id
            const response = await axiosPrivate.post(`/posts/vote/${post.slug}`, { optionId })
            if (response.status == 200) {
                toast.success("Vote added!")
            } else if (response.status == 400) {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            //setPollLoading(false)
        }
    }

    return (
        <div className=" w-full h-auto max-w-[700px] bg-[#23253c] rounded-[8px] border border-[#2c2b47] px-[24px] py-[16px] gap-4 flex flex-col ">
            <div className=" w-full flex justify-between ">
                <div className=" flex gap-4 ">
                    <div>
                        <Image src={post?.user?.photo_url || "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpgplus.unsplash.com"} alt="User" width={50} height={50} className="rounded-full" />
                    </div>
                    <div>
                        <p>{post?.user?.display_name}</p>
                        <p>
                            {post?.createdAt
                                ? new Date(post.createdAt).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : ""}
                        </p>

                    </div>
                </div>
                <div className="">...</div>
            </div>
            <div>
                <span>{post?.description}</span>
            </div>

            <div>
                {post?.imageArray && post?.imageArray.map((img, index) => {
                    console.log(img, "thene")
                    return (
                        <Image src={img} alt="Error" key={index} width={200} height={200} className=" w-full h-auto rounded-2xl " />
                    )
                })}

                {post?.document && (
                    <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(post?.document)}&embedded=true`}
                        className="w-full h-[600px] rounded-xl"
                    />
                )}

                {post?.poll?.poll_description && (
                    <div className=" border border-[#2c2b47] p-[24px] rounded-2xl ">
                        <span>Poll: {post?.poll?.poll_description}</span>
                        {post?.poll?.options && post?.poll?.options.map((option, index) => {
                            const vote = option.votes
                            const totalVotes = post?.poll?.options.reduce((acc, curr) => acc + curr.votes, 0)
                            const percent = totalVotes === 0 ? 0 : ((vote / totalVotes) * 100).toFixed(2)
                            return (
                                <div
                                    key={index}
                                    className="mt-3 cursor-pointer"
                                    onClick={() => handleVote(option)}
                                >

                                    <div className="flex justify-between mb-1">
                                        <span>{option.optionText}</span>
                                        <span className="text-sm text-gray-300">{percent}%</span>
                                    </div>

                                    <div className="w-full bg-[#2b2d42] rounded-lg h-3 overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-300"
                                            style={{
                                                width: `${percent}%`,
                                                backgroundColor: "#8e8ba1"
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {post?.video && (
                    <video
                        src={post?.video}
                        controls
                        className="w-full rounded-xl max-h-[400px]"
                    />
                )}
            </div>

            <div className=" my-2 border border-[#2c2b47] "></div>
            <div className=" flex justify-between px-[12px] ">
                {isPostLiked ? <i className="fa-solid fa-heart text-red-500 cursor-pointer" onClick={() => handleLikePost()}></i> : <i className={`fa-regular fa-heart cursor-pointer ${isPostLiked && "text-red-500"} `} onClick={() => handleLikePost()}></i>}
                <p onClick={() => setShowComments(prev => !prev)} ><i className={`fa-regular fa-comment cursor-pointer ${showComments ? "text-white" : ""}`}></i></p>
                <i className="fa-solid fa-arrow-rotate-left cursor-pointer"></i>
                <i className="fa-solid fa-share cursor-pointer"></i>
            </div>
            {showComments && (
                <>
                    <FeedComments post={post} />
                </>
            )}
        </div>
    )
}

export default FeedPost