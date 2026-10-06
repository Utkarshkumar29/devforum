'use client'
import Image from "next/image"
import { axiosPrivate } from "@/app/axios/axiosInstance"
import { toast } from "react-toastify"
import { IPollOption, IPost } from "@/app/utils/types/post.types"

const ReSharePost = ({ post }: { post: IPost }) => {

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
            <div className=" w-full h-auto max-w-[700px] bg-[#1a1a1a] rounded-[16px] border border-[#262626] px-[24px] py-[16px] gap-4 flex flex-col ">
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
                    

                </div>
                <div>
                    <span className=" text-[#FFFFFFF] font-semibold ">{post?.description}</span>
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
                                <div key={index} onClick={() => handleVote(option)} className="cursor-pointer w-full mt-3 bg-[#2a2a2a] rounded-lg h-[44px] relative overflow-hidden">
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
            </div>
        </>
    )
}

export default ReSharePost