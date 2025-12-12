'use client'
import Image from "next/image"
import FeedComments from "./FeedComments"
import { Fragment, useEffect, useState } from "react"
import { axiosPrivate } from "@/app/axios/axiosInstance"
import { toast } from "react-toastify"
import { IPollOption, IPost } from "@/app/utils/types/post.types"
import { Dialog, DialogDescription, DialogPanel, DialogTitle, Menu, MenuItem, Transition, TransitionChild } from "@headlessui/react"
import { useDispatch, useSelector } from "react-redux"
import { deletePost, updatePostDescription } from "@/app/redux/feedPostslice"

interface PollOption {
    _id: string;
    optionText: string;
    votes: number;
}

const FeedPost = ({ post }: { post: IPost }) => {
    
    const [showComments, setShowComments] = useState(false)
    const [isPostLiked, setIsPostLiked] = useState(false)
    const [openReshare, setOpenReshare] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [newDescription, setNewDescription] = useState(post?.description)
    const [openEditor, setOpenEditor] = useState(false)
    const [isEditLoading, serIsEditLoading] = useState(false)
    const dispatch = useDispatch()
    const userDetails = useSelector((state) => state.userDetails)
console.log(post, "isha",userDetails.user.id)
    useEffect(() => {
        console.log(newDescription, "descriptiondescription")
    }, [newDescription])

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
    const handleVote = async (option: IPollOption) => {
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

    const handleDeletePost = async (slug: string) => {
        try {
            const response = await axiosPrivate.delete(`/posts/delete/${slug}`)
            if (response.data.success) {
                dispatch(deletePost(slug))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditPost = async (slug: string) => {
        try {
            serIsEditLoading(true)
            const data = { description: newDescription }
            const response = await axiosPrivate.patch(`/posts/editPost/${slug}`, data)
            if (response.data.success) {
                console.log("running")
                dispatch(updatePostDescription({ slug, description: newDescription }))
                setOpenEditor(false)
            }
        } catch (error) {
            console.log(error)
        } finally {
            serIsEditLoading(false)
        }
    }
    function timeAgo(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 5) return "Just now";
        if (seconds < 60) return `${seconds} sec ago`;

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hr ago`;

        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

        const months = Math.floor(days / 30);
        if (months < 12) return `${months} mo ago`;

        const years = Math.floor(months / 12);
        return `${years} yr ago`;
    }

    return (
        <>
            <div className=" w-full h-auto max-w-[700px] bg-[#1a1a1a] rounded-[8px] border border-[#262626] px-[24px] py-[16px] gap-4 flex flex-col ">
                <div className=" w-full flex justify-between ">
                    <div className=" flex gap-4 ">
                        <div>
                            <Image src={post?.user?.photo_url || "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"} alt="User" width={50} height={50} className="rounded-full" />
                        </div>
                        <div>
                            <p className=" font-semibold ">{post?.user?.display_name}<i className="fa-solid fa-check"></i></p>
                            <p className=" text-[#909090] ">{post?.createdAt ? timeAgo(post?.createdAt) : ""}</p>

                        </div>
                    </div>
                    <Menu as="div" className="relative">
                        <Menu.Button className="rotate-90 cursor-pointer ">...</Menu.Button>

                        <Menu.Items className="absolute right-2 mt-2 w-32 rounded-lg bg-[#1E2035] shadow-lg border-b border-[#262626]">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`w-full px-4 py-2 text-left rounded-tl-lg border-b border-[#262626] cursor-pointer ${active ? "bg-[#1E2035]" : ""
                                            }`}
                                        onClick={() => handleDeletePost(post?.slug)}
                                    >
                                        Delete Post
                                    </button>
                                )}
                            </Menu.Item>

                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`w-full px-4 py-2 text-left cursor-pointer ${active ? "bg-[#1E2035]" : ""
                                            }`}
                                        onClick={() => {
                                            setOpenEditor(true)
                                            setNewDescription(post?.description)
                                        }}
                                    >
                                        Edit Post
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>

                </div>
                <div>
                    <span>{post?.description}</span>
                </div>

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
                    <div className=" border border-[#262626] p-[24px] rounded-2xl ">
                        <span>Poll: {post?.poll?.poll_description}</span>
                        {post?.poll?.options && post?.poll?.options.map((option, index) => {
                            const vote = option.votes
                            const totalVotes: number = ((post?.poll?.options ?? []).reduce((acc, curr) => acc + (curr.votes ?? 0), 0)) || 0
                            const percent = totalVotes === 0 ? 0 : ((vote / totalVotes) * 100).toFixed(2)
                            return (
                                <div onClick={() => handleVote(option)} className="cursor-pointer w-full mt-3 bg-[#2a2a2a] rounded-lg h-[44px] relative overflow-hidden">
                                    {/* Progress bar */}
                                    <div
                                        className="h-full transition-all duration-300 "
                                        style={{
                                            width: `${percent}%`,
                                            backgroundColor: "#583871",
                                        }}
                                    ></div>

                                    {/* Text layer (always full width, does NOT shrink with bar) */}
                                    <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
                                        <span>{option.optionText}{post?.poll?.voters.includes(post.user._id) && <i className="fa-solid fa-check"></i>}</span>
                                        <span>{percent}%</span>
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


                <div className=" mb-2 border border-[#262626] "></div>
                <div className=" flex justify-between px-[12px] ">
                    {isPostLiked ? <i className="fa-solid fa-heart text-red-500 cursor-pointer" onClick={() => handleLikePost()}></i> : <i className={`fa-regular fa-heart cursor-pointer ${isPostLiked && "text-red-500"} `} onClick={() => handleLikePost()}></i>}
                    <p onClick={() => setShowComments(prev => !prev)} ><i className={`fa-regular fa-comment cursor-pointer ${showComments ? "text-white" : ""}`}></i></p>
                    <span onClick={() => setOpenReshare(true)}><i className="fa-solid fa-arrow-rotate-left cursor-pointer"></i></span>
                    <i className="fa-solid fa-share cursor-pointer"></i>
                </div>
                {showComments && (
                    <>
                        <FeedComments post={post} />
                    </>
                )}
            </div>

            <Transition show={openReshare} as={Fragment}>
                <Dialog as="div" className={"relative z-50"} onClose={() => setOpenReshare(false)}>

                    <TransitionChild
                        as={Fragment}
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        enter="ease-out duration-200"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className=" fixed inset-0 bg/black-50 " />
                    </TransitionChild>

                    <div></div>
                </Dialog>

            </Transition>

            <Transition show={openEditor} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setOpenEditor(false)} >

                    {/* BACKDROP */}
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50" />
                    </TransitionChild>

                    <div className="fixed inset-0 flex items-center justify-center p-4">

                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-[700px] max-h-[500px] bg-[#1a1a1a] rounded-2xl overflow-y-auto shadow-xl">

                                <DialogTitle>
                                    <div className="flex justify-between px-6 py-4 border-b border-[#262626]">
                                        <span className="text-[20px] font-semibold">Edit Post</span>
                                        <i onClick={() => setOpenEditor(false)} className="fa-solid fa-xmark cursor-pointer"></i>
                                    </div>
                                </DialogTitle>

                                <DialogDescription as="div" className="p-8 space-y-6">

                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        placeholder="Write what's on your mind"
                                        className="w-full min-h-[200px] p-6 rounded-2xl bg-[#2a2a2a] outline-none resize-none"
                                    />

                                </DialogDescription>

                                <div className=" flex gap-4 border border-[#262626] justify-end py-[16px] px-[24px] ">
                                    <button
                                        onClick={() => setOpenEditor(false)}
                                        className=" cursor-pointer text-[#7D42F5] border border-[#7D42F5] px-6 py-2 rounded-xl font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleEditPost(post?.slug)}
                                        className=" cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition"
                                    >
                                        {isEditLoading ? "Loading..." : "Save"}
                                    </button>
                                </div>

                            </DialogPanel>
                        </TransitionChild>

                    </div>

                </Dialog>
            </Transition>
        </>
    )
}

export default FeedPost