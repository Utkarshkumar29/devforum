"use client"

import Image from "next/image"
import { Fragment, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Description, Dialog, DialogDescription, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { axiosPrivate } from "@/app/axios/axiosInstance"
import { uploadFileToFirebase } from "@/app/utils/uploadtoFirebase"
import { addNewPost, setCreatingPost } from "@/app/redux/feedPostslice"

const UploadFeed = () => {
    const dispatch = useDispatch()
    const userDetails = useSelector((state) => state.userDetails)
    const [createPost, setCreatePost] = useState(false)
    const [addImageModal, setAddImageModal] = useState(false)
    const [addVideoModal, setAddVideoModal] = useState(false)
    const [addFileModal, setAddFileModal] = useState(false)
    const [addPollModal, setAddPollModal] = useState(false)
    const [imageArray, setImageArray] = useState([])
    const [imageArrayIndex, setImageArrayIndex] = useState(0)
    const [document, setDocument] = useState(null)
    const [videoPreview, setVideoPreview] = useState(null)
    const [poll_description, setPoll_Description] = useState(null)
    const [isRepost, setIsRepost] = useState(false)
    const [pollOptions, setPollOptions] = useState(["", ""])
    const [repostUserId, setRepostUserId] = useState(null)
    const [repostDescription, setRepostDescription] = useState(null)
    const [description, setDescription] = useState("")
    const imageInputRef = useRef(null)
    const videoInputRef = useRef(null)
    const [openSchedulePost, setOpenSchedulePost] = useState(false)
    const [date, setDate] = useState(null)
    const [time, setTime] = useState(null)
    const [isLaoding,setIsLoading]=useState(false)

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileObj, setFileObj] = useState<File | null>(null);

    const handleCreatePostClose = () => {
        setCreatePost(false)
    }

    const handleImages = (files) => {
        setIsLoading(true)
        const fileArray = Array.from(files)
        const imagePreview = fileArray.map((file) => ({
            file,
            preview: URL.createObjectURL(file)
        }))
        setImageArray((prev) => [...prev, ...imagePreview])
    }

    const handleVideo = async (files: FileList | File[]) => {
        setIsLoading(true)
        const file = Array.isArray(files) ? files[0] : files?.[0]
        if (!file) return

        try {
            const videoURL = await uploadFileToFirebase(file)
            setVideoPreview(videoURL)
        } catch (err) {
            console.error("Error uploading file:", err)
        }
    }

    const handleFile = async (file) => {
        setIsLoading(true)
        console.log(file[0], "paper")
        if (!file) return;
        setFileName(file[0].name)
        try {
            const fileUrl = await uploadFileToFirebase(file)
            setFileObj(fileUrl)
        } catch (error) {
            console.error("Error uploading file:", error)
        }
    }

    const handleNextImage = () => {
        setImageArrayIndex((prev) => (prev + 1) % imageArray.length);
    }

    const handlePrevImage = () => {
        setImageArrayIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
    }


    const handleImageModalclose = () => {
        setAddImageModal(false)
        setImageArray([])
        setDescription("")
    }

    const handleAddOptions = (e) => {
        e.preventDefault()
        setPollOptions((prev) => [...prev, ""])
    }

    const handleSchedulePost = () => {
        //setAddImageModal(false)
        setOpenSchedulePost(true)
    }

    const handleCreatePost = async (e) => {
        setIsLoading(true)
        e.preventDefault();

        dispatch(setCreatingPost(true))

        try {
            const uploadedImages: string[] = []
            if (imageArray.length > 0) {
                for (const imgObj of imageArray) {
                    const url = await uploadFileToFirebase(imgObj.file);
                    uploadedImages.push(url);
                }
            }

            let schedule_time = null;
            if (date && time) {
                schedule_time = new Date(`${date}T${time}`);
            }

            const body = {
                description,
                imageArray: uploadedImages,
                document: fileObj,
                video: videoPreview,
                poll_description,
                pollOptions,
                isRepost,
                repostUserId,
                repostDescription,
                schedule_time,
            };

            const response = await axiosPrivate.post("/posts/createPost", body);
            setIsLoading(false)
            console.log(response, "responseresponse")
            dispatch(addNewPost(response.data.post))
            setAddImageModal(false)
            setCreatePost(false)
            setTime(null)
            setDate(null)
            setDescription("")
            setAddFileModal(false)
            setAddImageModal(false)
            setAddPollModal(false)
            setAddVideoModal(false)
            setImageArray([])
            setImageArrayIndex(0)
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setCreatingPost(false)); // 👈 stop loader
            setIsLoading(false)
        }
    };



    return (
        <>
            <div className=" w-full max-w-[700px] bg-[#23253c] rounded-[8px] border border-[#2c2b47] px-[24px] py-[16px] ">
                <div className=" flex items-center justify-center gap-6 border-b border-[#2c2b47] pb-[16px] ">
                    {/*<Image src={userDetails?.user?.photo_url} width={60} height={60} className=" rounded-full " alt="Profile Error"/>*/}
                    <input onClick={() => setCreatePost(true)} className=" outline-none px-[16px] py-[4px] rounded-[16px] text-[#4f4f5a] w-full bg-[#1e2035] h-[44px] " placeholder=" What's on your mind developer? " />
                </div>
                <div className=" justify-between flex pt-[16px] ">
                    <div className=" flex flex-row justify-center gap-4">
                        <div onClick={() => setAddImageModal(true)} className=" cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                            <i className="fa-solid fa-image text-[#614fae]  "></i>
                            <span className=" text-[#614fae] ">Image</span>
                        </div>
                        <div onClick={() => setAddVideoModal(true)} className=" cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                            <i className="fa-solid fa-video text-[#614fae]  "></i>
                            <span className=" text-[#614fae] ">Video</span>
                        </div>
                        <div onClick={() => setAddFileModal(true)} className=" cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
                            <i className="fa-solid fa-file text-[#614fae]  "></i>
                            <span className=" text-[#614fae] ">File</span>
                        </div>
                        <div onClick={() => setAddPollModal(true)} className=" cursor-pointer border border-[#4b497c] bg-[#2d294c] p-[8px] rounded-[8px] flex gap-2 items-center">
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
                                    {time && date && (
                                            <div className="cursor-pointer border-[#2c2b47] w-full px-[24px] py-[16px] rounded-2xl bg-[#1e2035] flex justify-between items-center ">
                                                <span>Posting on {date} at {time}</span>
                                                <button className=" cursor-pointer text-[#7D42F5] border border-[#7D42F5] px-[24px] py-[2px] rounded-xl font-medium">Edit</button>
                                            </div>
                                    )}

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

                                <div className=" flex gap-4 border border-[#2c2b47] justify-end py-[16px] px-[24px] ">
                                    <button
                                        onClick={handleSchedulePost}
                                        className=" cursor-pointer text-[#7D42F5] border border-[#7D42F5] px-6 py-2 rounded-xl font-medium"
                                    >
                                        Schedule Post
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        className=" cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition"
                                    >
                                        {isLaoding ? "Loading...":"Post"}
                                    </button>
                                </div>

                            </DialogPanel>
                        </TransitionChild>

                    </div>

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
                                        <i onClick={() => handleImageModalclose()} className="fa-solid fa-xmark cursor-pointer"></i>
                                    </div>
                                </DialogTitle>

                                <Description as="div" className="space-y-6">

                                    <form onSubmit={handleCreatePost} className=" w-full h-full p-[34px] flex gap-6 flex-col overflow-y-auto max-h-[400px] ">
                                        {time && date && (
                                            <div className="cursor-pointer border-[#2c2b47] w-full px-[24px] py-[16px] rounded-2xl bg-[#1e2035] flex justify-between items-center ">
                                                <span>Posting on {date} at {time}</span>
                                                <button className=" cursor-pointer text-[#7D42F5] border border-[#7D42F5] px-[24px] py-[2px] rounded-xl font-medium">Edit</button>
                                            </div>
                                        )}

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
                                                        <i className={`fa-solid fa-arrow-left `} />
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
                                                        <i className={`fa-solid fa-arrow-right `} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </form>

                                </Description>

                                <div className=" border border-[#2c2b47] flex justify-end py-[16px] px-[24px] gap-4 ">
                                    <button
                                        onClick={handleSchedulePost}
                                        className=" cursor-pointer text-[#7D42F5] border border-[#7D42F5] px-6 py-2 rounded-xl font-medium"
                                    >
                                        Schedule Post
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        className=" cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition"
                                    >
                                        {isLaoding ? "Loading...":"Post"}
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
                                        <i onClick={() => setAddVideoModal(false)} className="fa-solid fa-xmark cursor-pointer"></i>
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
                                        {isLaoding ? "Loading...":"Post"}
                                    </button>
                                </div>

                            </DialogPanel>
                        </TransitionChild>

                    </div>

                </Dialog>
            </Transition>

            <Transition show={addFileModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddFileModal(false)}>

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
                                        <span className="text-[20px] font-semibold">Upload File</span>
                                        <i onClick={() => setAddFileModal(false)} className="fa-solid fa-xmark cursor-pointer"></i>
                                    </div>
                                </DialogTitle>

                                <Description as="div" className="space-y-6">

                                    <form className="w-full h-full p-[34px] flex gap-6 flex-col overflow-y-auto max-h-[400px]">

                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Write what's on your mind"
                                            className="w-full min-h-[100px] p-6 rounded-2xl bg-[#1e2035] outline-none resize-none"
                                        />

                                        <div
                                            className="cursor-pointer border border-dashed border-[#2c2b47] w-full min-h-[150px] flex flex-col justify-center items-center rounded-3xl bg-[#1e2035]"
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const file = e.dataTransfer.files[0];
                                                if (file) handleFile([file]);
                                            }}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.csv,.json"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files) handleFile(e.target.files);
                                                }}
                                            />

                                            <span className="text-[20px]">Click to upload a file</span>
                                            <span>Drag or Drop</span>
                                        </div>

                                        {fileName && (
                                            <div className="p-4 bg-[#1e2035] rounded-xl text-white mt-2">
                                                Uploaded File: <strong>{fileName}</strong>
                                            </div>
                                        )}

                                    </form>
                                </Description>

                                <div className="border border-[#2c2b47] flex justify-end py-[16px] px-[24px]">
                                    <button
                                        onClick={handleCreatePost}
                                        className="cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition"
                                    >
                                        {isLaoding ? "Loading...":"Post"}
                                    </button>
                                </div>

                            </DialogPanel>

                        </TransitionChild>

                    </div>

                </Dialog>
            </Transition>

            <Transition show={addPollModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddFileModal(false)}>

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
                                        <span className="text-[20px] font-semibold">Upload Poll</span>
                                        <i onClick={() => setAddPollModal(false)} className="fa-solid fa-xmark cursor-pointer"></i>
                                    </div>
                                </DialogTitle>

                                <Description as="div" className="space-y-6">

                                    <form className="w-full h-full p-[34px] flex gap-6 flex-col overflow-y-auto max-h-[400px]">

                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Write what's on your mind"
                                            className="w-full min-h-[100px] p-6 rounded-2xl bg-[#1e2035] outline-none resize-none"
                                        />

                                        <div>
                                            <div>
                                                <span>Poll Question</span>
                                                <input type="text" className=" w-full mt-2 p-3 rounded-lg bg-[#1e2035] outline-none " value={poll_description} onChange={(e) => setPoll_Description(e.target.value)} />
                                            </div>

                                            <div className=" flex flex-col gap-4 mt-4 w-full ">
                                                <span>Poll Options</span>
                                                {pollOptions.map((option, index) => {
                                                    return (
                                                        <div className=" flex flex-col gap-1 " key={index}>
                                                            <span>Option {index + 1}</span>
                                                            <input
                                                                value={option}
                                                                onChange={(e) => {
                                                                    const update = [...pollOptions]
                                                                    update[index] = e.target.value
                                                                    setPollOptions(update)
                                                                }}
                                                                type="text" placeholder="Option" className=" min-w-full mt-2 p-3 rounded-lg bg-[#1e2035] outline-none " />
                                                        </div>
                                                    )
                                                })}
                                                {pollOptions.length < 4 && (<div><button onClick={handleAddOptions} className=" border border-[#7D42F5] text-[#7D42F5] rounded-2xl px-[16px] py-[8px] cursor-pointer ">Add Option</button></div>)}
                                            </div>
                                        </div>

                                    </form>
                                </Description>

                                <div className="border border-[#2c2b47] flex justify-end py-[16px] px-[24px]">
                                    <button
                                        onClick={handleCreatePost}
                                        className="cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition"
                                    >
                                        {isLaoding ? "Loading...":"Post"}
                                    </button>
                                </div>

                            </DialogPanel>

                        </TransitionChild>

                    </div>

                </Dialog>
            </Transition>

            <Transition show={openSchedulePost} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddFileModal(false)}>

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
                                        <span className="text-[20px] font-semibold">Schedule Post for later</span>
                                        <i onClick={() => setOpenSchedulePost(false)} className="fa-solid fa-xmark cursor-pointer"></i>
                                    </div>
                                </DialogTitle>

                                <Description as="div" className="space-y-6">

                                    <form className="w-full h-full p-[34px] flex gap-6 flex-col overflow-y-auto max-h-[400px]">

                                        <div className=" flex flex-col ">
                                            <label>Date</label>
                                            <input onChange={(e) => setDate(e.target.value)} type="Date" className="  cursor-pointer border border-dashed border-[#2c2b47] w-full px-[24px] py-[16px] rounded-3xl bg-[#1e2035] " />
                                        </div>

                                        <div className=" flex flex-col ">
                                            <label>Time</label>
                                            <input onChange={(e) => setTime(e.target.value)} type="time" className="  cursor-pointer border border-dashed border-[#2c2b47] w-full px-[24px] py-[16px] rounded-3xl bg-[#1e2035] " />
                                        </div>

                                    </form>
                                </Description>

                                <div className="border border-[#2c2b47] flex justify-end py-[16px] px-[24px]">
                                    <button
                                        onClick={() => {
                                            //setAddImageModal(true)
                                            setOpenSchedulePost(false)
                                        }}
                                        className="cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition"
                                    >
                                        Next
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