"use client"

import Image from "next/image"
import { Fragment, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Description, Dialog, DialogDescription, DialogPanel, DialogTitle, Textarea, Transition, TransitionChild } from "@headlessui/react"
import axios from "axios"
import { axiosPrivate } from "@/app/axios/axiosInstance"
import { uploadFileToFirebase } from "@/app/utils/uploadtoFirebase"

const UploadFeed = () => {
    const userDetails = useSelector((state) => state.userDetails)
    const [createPost, setCreatePost] = useState(false)
    const [addImageModal, setAddImageModal] = useState(false)
    const [addVideoModal, setAddVideoModal] = useState(false)
    const [imageArray, setImageArray] = useState([])
    const [imageArrayIndex, setImageArrayIndex] = useState(0)
    const [document,setDocument]=useState(null)
    const [videoPreview, setVideoPreview] = useState(null)
    const [poll_description,setPoll_Description]=useState(null)
    const [isRepost,setIsRepost]=useState(false)
    const [pollOptions,setPollOptions]=useState([])
    const [repostUserId,setRepostUserId]=useState(null)
    const [repostDescription,setRepostDescription]=useState(null)
    const [description, setDescription] = useState("")
    const imageInputRef = useRef(null)
    const videoInputRef=useRef(null)

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

    const handleVideo = (files: FileList | File[]) => {
        const file = Array.isArray(files) ? files[0] : files?.[0];
        if (!file) return;
        setVideoPreview(URL.createObjectURL(file));
    }

    const handleNextImage = () => {
        setImageArrayIndex((prev) => (prev + 1) % imageArray.length);
    }

    const handlePrevImage = () => {
        setImageArrayIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
    }

    const handleImageModalclose=()=>{
        setAddImageModal(false)
        setImageArray([])
        setDescription("")
    }

    const handleCreatePost = async (e: any) => {
    e.preventDefault();

    try {        
        let uploadedImages: string[] = [];
            if (imageArray.length > 0) {
            for (const imgObj of imageArray) {
                const url = await uploadFileToFirebase(imgObj.file);
                uploadedImages.push(url);
            }
        }

        let documentURL = null;
        if (document) {
            documentURL = await uploadFileToFirebase(document);
        }

        let videoURL=null
        if(videoPreview){
            videoURL=await uploadFileToFirebase(videoPreview)
        }

        const body: any = {
            description,
            imageArray: uploadedImages,
            document: documentURL,
            video: videoURL,
            poll_description,
            pollOptions,
            isRepost,
            repostUserId,
            repostDescription,
        }

        const response = await axiosPrivate.post("/posts/createPost", body);

        } catch (error) {
            console.log(error);
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
                        <div onClick={()=>setAddImageModal(true)} className=" cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                            <i className="fa-solid fa-image text-[#614fae]  "></i>
                            <span className=" text-[#614fae] ">Image</span>
                        </div>
                        <div onClick={()=>setAddVideoModal(true)} className=" cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
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
                            <DialogPanel className="w-[700px] max-h-[500px] bg-[#23253c] rounded-2xl overflow-y-auto shadow-xl">

                                <DialogTitle>
                                    <div className="flex justify-between px-6 py-4 border-b border-[#2c2b47]">
                                        <span className="text-[20px] font-semibold">Create Post</span>
                                        <i onClick={handleCreatePostClose} className="fa-solid fa-xmark cursor-pointer"></i>
                                    </div>
                                </DialogTitle>

                                <DialogDescription as="div" className="p-8 space-y-6">

                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Write what's on your mind"
                                        className="w-full min-h-[200px] p-6 rounded-2xl bg-[#1e2035] outline-none resize-none"
                                    />

                                    {/*<div className="flex gap-4 justify-evenly">
                                        <div
                                            onClick={() => { setCreatePost(false); setAddImageModal(true); }}
                                            className="w-full flex items-center justify-center gap-2 p-3 rounded-[8px] border border-[#4b497c] bg-[#2d294c] cursor-pointer"
                                        >
                                            <i className="fa-solid fa-image text-[#614fae]" />
                                            <span className="text-[#614fae]">Image</span>
                                        </div>

                                        <div className=" w-full flex items-center justify-center gap-2 p-3 rounded-[8px] border border-[#4b497c] bg-[#2d294c] cursor-pointer">
                                            <i className="fa-solid fa-video text-[#614fae]" />
                                            <span className="text-[#614fae]">Video</span>
                                        </div>

                                        <div className=" w-full flex items-center justify-center gap-2 p-3 rounded-[8px] border border-[#4b497c] bg-[#2d294c] cursor-pointer">
                                            <i className="fa-solid fa-file text-[#614fae]" />
                                            <span className="text-[#614fae]">File</span>
                                        </div>

                                        <div className=" w-full flex items-center justify-center gap-2 p-3 rounded-[8px] border border-[#4b497c] bg-[#2d294c] cursor-pointer">
                                            <i className="fa-solid fa-poll text-[#614fae]" />
                                            <span className="text-[#614fae]">Poll</span>
                                        </div>
                                    </div>*/}

                                </DialogDescription>

                                <div className=" border border-[#2c2b47] flex justify-end py-[16px] px-[24px] ">
                                    <button
                                        onClick={handleCreatePost}
                                        className=" cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition"
                                    >
                                        Post
                                    </button>
                                </div>

                            </DialogPanel>
                        </TransitionChild>

                    </div>

                </Dialog>
            </Transition>

            <Transition show={addImageModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleCreatePostClose}>

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
                            <DialogPanel className="w-[700px] h-auto bg-[#23253c] rounded-2xl overflow-y-auto shadow-xl">

                                <DialogTitle>
                                    <div className="flex justify-between px-6 py-4 border-b border-[#2c2b47]">
                                        <span className="text-[20px] font-semibold">Upload Images</span>
                                        <i onClick={()=>handleImageModalclose()} className="fa-solid fa-xmark cursor-pointer"></i>
                                    </div>
                                </DialogTitle>

                                <Description as="div" className="space-y-6">

                                    <form onSubmit={handleCreatePost} className=" w-full h-full p-[34px] flex gap-6 flex-col overflow-y-auto max-h-[400px] ">
                                        <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Write what's on your mind"
                                        className="w-full min-h-[100px] p-6 rounded-2xl bg-[#1e2035] outline-none resize-none"
                                    />

                                        <div
                                            className="  cursor-pointer border border-dashed border-[#2c2b47] w-full min-h-[150px] flex flex-col justify-center items-center rounded-3xl bg-[#1e2035] "
                                            onClick={() => imageInputRef.current?.click()}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const files = e.dataTransfer.files[0]
                                                console.log("Dropped file:", file)
                                                handleImages(files)
                                            }}
                                        >
                                            <input ref={imageInputRef} accept="image/*" className="hidden" id="imageUpload" type="file" onChange={(e) => handleImages(e.target.files)} />
                                            <span className=" text-[20px] ">Click to upload a video</span>
                                            <span>Drag or Drop</span>
                                        </div>
                                        {imageArray.length > 0 && (
                                            <div className=" flex h-[400px] justify-center items-center ">
                                                <div

                                                    className=" items-center gap-4 flex relative h-auto aspect-square rounded-xl overflow-hidden"
                                                >
                                                    <div
                                                        onClick={imageArray.length > 0 ? handlePrevImage : undefined}
                                                        className={` ${imageArray.length <= 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                                                    >
                                                        <i className={`fa-solid fa-arrow-left `}/>
                                                    </div>


                                                    <Image
                                                        src={imageArray[imageArrayIndex]?.preview}
                                                        alt={`upload-${imageArray[imageArrayIndex]}`}
                                                        className="object-cover w-[500px] h-[400px] rounded-xl"
                                                        width={100}
                                                        height={100}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            setImageArray((prev) => prev.filter((_, i) => i !== imageArrayIndex))
                                                        }
                                                        className="absolute top-24 right-10 bg-black/60 text-white p-2 w-[40px] h-[40px] rounded-full hover:bg-black/80"
                                                    >
                                                        ✕
                                                    </button>
                                                    <div
                                                        onClick={imageArray.length > 0 ? handleNextImage : undefined}
                                                        className={` ${imageArray.length <= 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                                                    >
                                                        <i className={`fa-solid fa-arrow-right `}/>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </form>

                                </Description>

                                <div className=" border border-[#2c2b47] flex justify-end py-[16px] px-[24px] ">
                                    <button
                                        onClick={handleCreatePost}
                                        className=" cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition"
                                    >
                                        Post
                                    </button>
                                </div>

                            </DialogPanel>
                        </TransitionChild>

                    </div>

                </Dialog>
            </Transition>

            <Transition show={addVideoModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleCreatePostClose}>

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
                            <DialogPanel className="w-[700px] h-auto bg-[#23253c] rounded-2xl overflow-y-auto shadow-xl">

                                <DialogTitle>
                                    <div className="flex justify-between px-6 py-4 border-b border-[#2c2b47]">
                                        <span className="text-[20px] font-semibold">Upload Videos</span>
                                        <i onClick={()=>setAddVideoModal(false)} className="fa-solid fa-xmark cursor-pointer"></i>
                                    </div>
                                </DialogTitle>

                                <Description as="div" className="space-y-6">

                                    <form onSubmit={handleCreatePost} className=" w-full h-full p-[34px] flex gap-6 flex-col overflow-y-auto max-h-[400px] ">
                                        <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Write what's on your mind"
                                        className="w-full min-h-[100px] p-6 rounded-2xl bg-[#1e2035] outline-none resize-none"
                                    />

                                        <div
                                            className="cursor-pointer border border-dashed border-[#2c2b47] w-full min-h-[150px] flex flex-col justify-center items-center rounded-3xl bg-[#1e2035]"
                                            onClick={() => videoInputRef.current?.click()}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const file = e.dataTransfer.files[0];
                                                if (file) handleVideo([file]);
                                            }}
                                            >
                                            <input
                                                ref={videoInputRef}
                                                accept="video/*"
                                                className="hidden"
                                                id="videoUpload"
                                                type="file"
                                                onChange={(e) => {
                                                if (e.target.files) handleVideo(e.target.files);
                                                }}
                                            />

                                            <span className="text-[20px]">Click to upload a video</span>
                                            <span>Drag or Drop</span>
                                            </div>

                                            {videoPreview && (
                                                <video
                                                    src={videoPreview}
                                                    controls
                                                    className="w-full max-h-[300px] rounded-xl mt-4"
                                                />
                                            )}
                                    </form>

                                </Description>

                                <div className=" border border-[#2c2b47] flex justify-end py-[16px] px-[24px] ">
                                    <button
                                        onClick={handleCreatePost}
                                        className=" cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition"
                                    >
                                        Post
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

export default UploadFeed