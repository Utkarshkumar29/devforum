"use client"

import Image from "next/image"
import { Fragment, useState } from "react"
import { useSelector } from "react-redux"
import { Description, Dialog, DialogDescription, DialogTitle, Textarea, Transition, TransitionChild } from "@headlessui/react"
import axios from "axios"

const UploadFeed = () => {
    const userDetails = useSelector((state) => state.userDetails)
    const [createPost, setCreatePost] = useState(false)
    const [addImageModal, setAddImageModal] = useState(false)
    const [imageArray, setImageArray] = useState([])
    const [imageArrayIndex,setImageArrayIndex]=useState(0)

    const [description,setDescription]=useState("")

    const handleCreatePostClose = () => {
        setCreatePost(false)
    }

    const handleImages = (files) => {
        const fileArray = Array.from(files)
        const imagePreview = fileArray.map((file) => ({
            file,
            preview: URL.createObjectURL(file)
        }))
        setImageArray((prev) => [...prev, ...imagePreview])
    }

    const handleNextImage=()=>{
        console.log(imageArrayIndex,imageArray.length)
        if(imageArrayIndex < imageArray.length){
            setImageArrayIndex(prev=>prev+1)
        }
    }
    const handlePrevImage=()=>{
        if(imageArrayIndex >= 0){
            setImageArrayIndex(prev=>prev-1)
        }
    }

    const handleCreatePost=async()=>{
        try {
            const response=await axios.post('/api/posts/createPost',description)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <>
            <div className=" w-full max-w-[700px] bg-[#23253c] rounded-[8px] border border-[#2c2b47] px-[24px] py-[16px] ">
                <div className=" flex items-center justify-center gap-6 border-b border-[#2c2b47] pb-[16px] ">
                    {/*<Image src={userDetails?.user?.photo_url} width={60} height={60} className=" rounded-full " alt="Profile Error"/>*/}
                    <input onClick={() => setCreatePost(true)} className=" outline-none px-[16px] py-[4px] rounded-[16px] text-[#4f4f5a] w-full bg-[#1e2035] h-[44px] " placeholder=" What's on your mind developer? " />
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
                    <div onClick={handleCreatePost} className=" cursor-pointer flex justify-center items-center bg-[#7d42f5] px-[24px] py-[6px] rounded-[8px] font-semibold ">Post</div>
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
                        <div className=" fixed inset-0 black/90 flex justify-center items-center ">
                            <div className="w-[700px] max-h-[500px] bg-[#23253c] rounded-2xl overflow-y-auto">
                                <DialogTitle>
                                    <div className=" border-b border-[#2c2b47] border border-[#2c2b47] rounded-2xl flex justify-between px-[24px] py-[24px] ">
                                        <span className=" text-[20px] leading-[24px] font-semibold ">Create Post</span>
                                        <i onClick={handleCreatePostClose} className=" cursor-pointer fa-solid fa-xmark"></i>
                                    </div>
                                </DialogTitle>
                                <Description as="div" className={" h-full w-full "}>
                                    <div className=" w-full h-full p-[34px] flex gap-6 flex-col ">
                                        <textarea
                                            value={description}
                                            onChange={(e)=>setDescription(e.target.value)}
                                            placeholder="Write what's on your mind"
                                            className="w-full min-h-[200px] p-[34px] rounded-2xl outline-none bg-[#1e2035] text-start align-top resize-none"
                                        />
                                        <div className=" flex flex-row justify-between gap-4">
                                            <div onClick={() => {
                                                setCreatePost(false)
                                                setAddImageModal(true)
                                            }} className=" w-full flex justify-center items-center cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                                                <i className="fa-solid fa-image text-[#614fae]  "></i>
                                                <span className=" text-[#614fae] ">Image</span>
                                            </div>
                                            <div className=" w-full flex justify-center items-center cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                                                <i className="fa-solid fa-video text-[#614fae]  "></i>
                                                <span className=" text-[#614fae] ">Video</span>
                                            </div>
                                            <div className=" w-full flex justify-center items-center cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                                                <i className="fa-solid fa-file text-[#614fae]  "></i>
                                                <span className=" text-[#614fae] ">File</span>
                                            </div>
                                            <div className=" w-full flex justify-center items-center cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                                                <i className="fa-solid fa-poll text-[#614fae]  "></i>
                                                <span className=" text-[#614fae] ">Poll</span>
                                            </div>
                                        </div>
                                    </div>
                                </Description>
                            </div>
                        </div>
                    </TransitionChild>
                </Dialog>
            </Transition>

            <Transition show={addImageModal} as={Fragment}>
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
                        <div className=" fixed inset-0 black/90 flex justify-center items-center ">
                            <div className="w-[700px] max-h-[500px] bg-[#23253c] rounded-2xl overflow-y-auto">
                                <DialogTitle>
                                    <div className=" border-b border-[#2c2b47] border border-[#2c2b47] rounded-2xl flex justify-between px-[24px] py-[24px] ">
                                        <span className=" text-[20px] leading-[24px] font-semibold ">Upload Images</span>
                                        <i onClick={() => setAddImageModal(false)} className=" cursor-pointer fa-solid fa-xmark"></i>
                                    </div>
                                </DialogTitle>
                                <Description as="div" className={" h-full w-full "}>
                                    <div className=" w-full h-full p-[34px] flex gap-6 flex-col ">
                                        <div
                                            className=" cursor-pointer border border-dashed border-[#2c2b47] w-full h-[150px] flex flex-col justify-center items-center rounded-3xl bg-[#1e2035] "
                                            onClick={() => document.getElementById("imageUpload")?.click()}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const files = e.dataTransfer.files[0];
                                                console.log("Dropped file:", file);
                                                handleImages(files)
                                            }}
                                        >
                                            <input className="hidden" id="imageUpload" type="file" onChange={(e) => handleImages(e.target.files)} />
                                            <span className=" text-[20px] ">Click to upload a video</span>
                                            <span>Drag or Drop</span>
                                        </div>
                                        {imageArray.length > 0 && (
                                            <div className=" flex justify-center items-center ">
                                                <div

                                                        className=" flex relative w-[70%] aspect-square rounded-xl overflow-hidden"
                                                    >
                                                        <i onClick={handlePrevImage} className="fa-solid fa-arrow-left"></i>
                                                        
                                                        <img
                                                            src={imageArray[imageArrayIndex]?.preview}
                                                            alt={`upload-${imageArray[imageArrayIndex]}`}
                                                            className="object-cover w-full h-full rounded-xl"
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                setImageArray((prev) => prev.filter((_, i) => i !== imageArrayIndex))
                                                            }
                                                            className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                                                        >
                                                            ✕
                                                        </button>
                                                        <i onClick={handleNextImage} className="fa-solid fa-arrow-right"></i>
                                                    </div>
                                            </div>
                                        )}

                                    </div>
                                </Description>
                            </div>
                        </div>
                    </TransitionChild>
                </Dialog>
            </Transition>
        </>
    )
}

export default UploadFeed