'use client'

import { axiosPrivate } from "@/app/axios/axiosInstance"
import Image from "next/image"
import { useEffect, useState } from "react"

interface UserInfo {
    _id: string
    display_name: string
    photo_url: string
}

interface Comment {
    _id: string
    text: string
    user: UserInfo
    createdAt: string
}

interface PostType {
    slug: string
    user: UserInfo
}

const FeedComments = ({ post }: { post: PostType }) => {
    const [commentText, setCommentText] = useState("")
    const [commentPage, setCommentPage] = useState(1)
    const [userComments, setUserComments] = useState<Comment[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [nextCommentUrl, setNextCommentUrl] = useState<string | null>(null)

    const handleAddComment = async () => {
        try {
            const response = await axiosPrivate.post(
                `/posts/addComment/${post?.slug}`,
                { commentText }
            )

            setCommentText("")
            setUserComments((prev) => [
                response.data.comment,
                ...prev,
            ])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchComments = async (url: string) => {
        try {
            const response = await axiosPrivate.get(url)

            setUserComments((prev) => [
                ...prev,
                ...response.data.comments,
            ])

            setCommentPage(response.data.page)
            setTotalPages(response.data.totalPages)
            setNextCommentUrl(response.data.nextUrl ?? null)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const loadInitialComments = async () => {
            try {
                const response = await axiosPrivate.get(
                    `/posts/getComments/${post?.slug}?page=1`
                )

                setUserComments(response.data.comments)
                setCommentPage(response.data.page)
                setTotalPages(response.data.totalPages)
                setNextCommentUrl(response.data.nextUrl ?? null)
            } catch (error) {
                console.log(error)
            }
        }

        loadInitialComments()
    }, [post?.slug])

    return (
        <div className="flex flex-col gap-4 border border-[#262626] p-4 rounded-[8px] mt-4 h-auto">
            <div className="flex gap-2">
                <Image
                    src={post?.user?.photo_url}
                    alt="User"
                    width={20}
                    height={20}
                    className="max-h-[20px] rounded-full border border-purple-600"
                />

                <div className="flex w-full flex-col">
                    <textarea
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full outline-none bg-[#181621] border border-[#262626] p-[24px] rounded-[8px] h-[100px]"
                        placeholder="Add a comment...."
                    />

                    <div className="flex justify-end mt-3">
                        <button
                            className="bg-[#7D42F5] px-4 py-2 rounded-[8px]"
                            onClick={handleAddComment}
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {userComments.length > 0 &&
                    userComments.map((comment) => (
                        <div
                            className="flex gap-2"
                            key={comment._id}
                        >
                            <Image
                                src={comment?.user?.photo_url}
                                alt="User"
                                width={20}
                                height={20}
                                className="max-h-[20px] rounded-full border border-purple-600"
                            />

                            <div className="bg-[#252235] w-full h-full px-[24px] py-[16px] rounded-[8px]">
                                <span>
                                    {comment?.user?.display_name}
                                </span>

                                <p className="text-gray-400">
                                    {comment?.text}
                                </p>
                            </div>
                        </div>
                    ))}

                {commentPage < totalPages && nextCommentUrl && (
                    <div className="flex w-full justify-center items-center mt-4">
                        <button
                            onClick={() =>
                                fetchComments(nextCommentUrl)
                            }
                            className="text-[#7D42F5] cursor-pointer"
                        >
                            Load More Comments....
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FeedComments