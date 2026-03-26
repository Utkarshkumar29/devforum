"use client"

import Image from "next/image"
import { Fragment, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Description, Dialog, DialogDescription, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { axiosPrivate } from "@/app/axios/axiosInstance"
import { uploadFileToFirebase } from "@/app/utils/uploadtoFirebase"
import { addNewPost, setCreatingPost } from "@/app/redux/feedPostslice"
import PostEditor from "./PostEditor"

// ─────────────────────────────────────────────────────────────────────────────
// AiWriterBlock — OUTSIDE UploadFeed so its identity is stable across renders
// ─────────────────────────────────────────────────────────────────────────────

interface AiWriterBlockProps {
    showAiInput: boolean
    setShowAiInput: (v: boolean) => void
    aiPrompt: string
    setAiPrompt: (v: string) => void
    aiLoading: boolean
    aiError: string | null
    setAiError: (v: string | null) => void
    description: string
    handleAiGenerate: () => void
}

const AiWriterBlock = ({
    showAiInput, setShowAiInput, aiPrompt, setAiPrompt,
    aiLoading, aiError, setAiError, description, handleAiGenerate,
}: AiWriterBlockProps) => (
    <div className="rounded-2xl bg-[#2a2a2a] border border-[#3a2a5a] p-4">
        <button
            type="button"
            onClick={() => { setShowAiInput(!showAiInput); setAiError(null) }}
            className="flex items-center gap-2 text-[#a053de] text-sm font-medium hover:text-[#b97de8] transition cursor-pointer"
        >
            <i className="fa-solid fa-wand-magic-sparkles" />
            {showAiInput ? "Close AI Writer" : "✨ Write with AI"}
        </button>

        {showAiInput && (
            <div className="mt-3 flex flex-col gap-2">
                <p className="text-[#666] text-xs">Describe what you want to post about and Gemini will write it for you.</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => { setAiPrompt(e.target.value); setAiError(null) }}
                        onKeyDown={(e) => { if (e.key === "Enter" && !aiLoading) handleAiGenerate() }}
                        placeholder="e.g. I just fixed a tricky async bug in Node.js"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#3a2a5a] outline-none text-sm placeholder:text-[#444] text-white focus:border-[#7D42F5] transition"
                    />
                    <button
                        type="button"
                        onClick={handleAiGenerate}
                        disabled={aiLoading || !aiPrompt.trim()}
                        className="flex items-center gap-2 bg-[#7D42F5] hover:bg-[#6c37d6] disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap cursor-pointer"
                    >
                        {aiLoading ? (
                            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />Generating...</>
                        ) : (
                            <><i className="fa-solid fa-bolt" />Generate</>
                        )}
                    </button>
                </div>
                {aiError && (
                    <p className="text-rose-400 text-xs flex items-center gap-1 mt-1">
                        <i className="fa-solid fa-circle-exclamation" />{aiError}
                    </p>
                )}
                {!aiLoading && (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {["Just shipped a new feature 🚀", "Debugging war story", "What I learned this week", "Open source contribution"].map((chip) => (
                            <button key={chip} type="button" onClick={() => { setAiPrompt(chip); setAiError(null) }}
                                className="px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#3a2a5a] text-[#a053de] text-xs hover:bg-[#3a2a5a] transition cursor-pointer">
                                {chip}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )}

        {!showAiInput && description && (
            <p className="text-[#555] text-xs mt-2 flex items-center gap-1.5">
                <i className="fa-solid fa-check text-[#a053de]" />AI text applied — you can edit it freely below
            </p>
        )}
    </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// ModalFooter — OUTSIDE UploadFeed so it never remounts
// ─────────────────────────────────────────────────────────────────────────────

interface ModalFooterProps {
    showSchedule?: boolean
    onSchedule: () => void
    onPost: (e: React.MouseEvent) => void
    isLoading: boolean
}

const ModalFooter = ({ showSchedule = true, onSchedule, onPost, isLoading }: ModalFooterProps) => (
    <div className="border border-[#262626] flex justify-end py-[16px] px-[24px] gap-4">
        {showSchedule && (
            <button type="button" onClick={onSchedule}
                className="cursor-pointer text-[#7D42F5] border border-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#7D42F5]/10 transition">
                Schedule Post
            </button>
        )}
        <button type="button" onClick={onPost} disabled={isLoading}
            className="cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />}
            {isLoading ? "Posting..." : "Post"}
        </button>
    </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// UploadFeed
// ─────────────────────────────────────────────────────────────────────────────

const UploadFeed = () => {
    const dispatch = useDispatch()
    const userDetails = useSelector((state: any) => state.userDetails)

    const [createPost, setCreatePost] = useState(false)
    const [addImageModal, setAddImageModal] = useState(false)
    const [addVideoModal, setAddVideoModal] = useState(false)
    const [addFileModal, setAddFileModal] = useState(false)
    const [addPollModal, setAddPollModal] = useState(false)
    const [imageArray, setImageArray] = useState<{ file: File; preview: string }[]>([])
    const [imageArrayIndex, setImageArrayIndex] = useState(0)
    const [videoPreview, setVideoPreview] = useState<string | null>(null)
    const [poll_description, setPoll_Description] = useState<string>("")
    const [isRepost] = useState(false)
    const [pollOptions, setPollOptions] = useState(["", ""])
    const [repostUserId] = useState(null)
    const [repostDescription] = useState(null)
    const [description, setDescription] = useState("")
    const imageInputRef = useRef<HTMLInputElement | null>(null)
    const videoInputRef = useRef<HTMLInputElement | null>(null)
    const [openSchedulePost, setOpenSchedulePost] = useState(false)
    const [date, setDate] = useState<string | null>(null)
    const [time, setTime] = useState<string | null>(null)
    const [isLaoding, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [fileObj, setFileObj] = useState<string | null>(null)
    const [aiPrompt, setAiPrompt] = useState("")
    const [aiLoading, setAiLoading] = useState(false)
    const [showAiInput, setShowAiInput] = useState(false)
    const [aiError, setAiError] = useState<string | null>(null)

    const aiWriterProps = {
        showAiInput, setShowAiInput, aiPrompt, setAiPrompt,
        aiLoading, aiError, setAiError, description, handleAiGenerate,
    }

    const resetAll = () => {
        setAddImageModal(false); setCreatePost(false); setTime(null); setDate(null)
        setDescription(""); setAddFileModal(false); setAddPollModal(false)
        setAddVideoModal(false); setImageArray([]); setImageArrayIndex(0)
        setVideoPreview(null); setFileObj(null); setFileName(null)
        setShowAiInput(false); setAiPrompt(""); setAiError(null)
        setPoll_Description(""); setPollOptions(["", ""])
    }

    const handleCreatePostClose = () => {
        setCreatePost(false); setShowAiInput(false); setAiPrompt(""); setAiError(null)
    }

    const handleImages = (files: FileList | File[]) => {
        const fileArray = Array.from(files)
        setImageArray((prev) => [...prev, ...fileArray.map((file) => ({ file, preview: URL.createObjectURL(file) }))])
    }

    const handleVideo = async (files: FileList | File[]) => {
        setIsLoading(true)
        const file = Array.isArray(files) ? files[0] : files?.[0]
        if (!file) return
        try { setVideoPreview(await uploadFileToFirebase(file)) }
        catch (err) { console.error("Error uploading video:", err) }
        finally { setIsLoading(false) }
    }

    const handleFile = async (file: FileList | File[]) => {
        setIsLoading(true)
        if (!file) return
        setFileName((file as any)[0].name)
        try { setFileObj(await uploadFileToFirebase(file)) }
        catch (error) { console.error("Error uploading file:", error) }
        finally { setIsLoading(false) }
    }

    const handleNextImage = () => setImageArrayIndex((prev) => (prev + 1) % imageArray.length)
    const handlePrevImage = () => setImageArrayIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length)
    const handleImageModalclose = () => { setAddImageModal(false); setImageArray([]); setDescription("") }
    const handleAddOptions = (e: React.MouseEvent) => { e.preventDefault(); setPollOptions((prev) => [...prev, ""]) }
    const handleSchedulePost = () => setOpenSchedulePost(true)

    const handleCreatePost = async (e: React.MouseEvent | React.FormEvent) => {
        e.preventDefault()
        if (!description || description.trim().length === 0) { alert("Please write something before posting."); return }
        setIsLoading(true)
        dispatch(setCreatingPost(true))
        try {
            const uploadedImages: string[] = []
            for (const imgObj of imageArray) uploadedImages.push(await uploadFileToFirebase(imgObj.file))
            const body = {
                description, imageArray: uploadedImages, document: fileObj, video: videoPreview,
                poll_description, pollOptions, isRepost, repostUserId, repostDescription,
                schedule_time: date && time ? new Date(`${date}T${time}`) : null,
            }
            dispatch(addNewPost((await axiosPrivate.post("/posts/createPost", body)).data.post))
            resetAll()
        } catch (error) { console.error("Create post error:", error) }
        finally { dispatch(setCreatingPost(false)); setIsLoading(false) }
    }

    async function handleAiGenerate() {
        if (!aiPrompt.trim()) return
        setAiLoading(true); setAiError(null)
        try {
            const res = await axiosPrivate.post("/posts/generate-post-text", { prompt: aiPrompt.trim() })
            const generatedText = res.data.text || res.data.response || ""
            if (!generatedText) { setAiError("No text was generated. Try a different prompt."); return }
            // ✅ Flows into ExternalValuePlugin inside PostEditor → shows in editor
            setDescription(generatedText)
            setShowAiInput(false)
            setAiPrompt("")
        } catch (err: any) {
            setAiError(err?.response?.data?.error || "AI generation failed. Please try again.")
        } finally { setAiLoading(false) }
    }

    return (
        <>
            {/* ── Feed input bar ───────────────────────── */}
            <div className="w-full max-w-[700px] bg-[#1a1a1a] rounded-[16px] border border-[#262626] px-[24px] py-[16px]">
                <div className="flex items-center justify-center gap-3 border-b border-[#262626] pb-[12px]">
                    <Image src={userDetails?.user?.photo_url || "/default-avatar.png"} width={40} height={40} className="rounded-full" alt="Profile" />
                    <input onClick={() => setCreatePost(true)} readOnly
                        className="outline-none px-[16px] py-[4px] rounded-[16px] text-[#666666] w-full h-[44px] bg-transparent cursor-pointer"
                        placeholder="What's on your mind developer?" />
                </div>
                <div className="justify-between items-center flex pt-[16px]">
                    <div className="flex flex-row justify-center gap-4">
                        <div onClick={() => setAddImageModal(true)} className="cursor-pointer"><i className="fa-solid fa-image text-[#a053de]" /></div>
                        <div onClick={() => setAddVideoModal(true)} className="cursor-pointer"><i className="fa-solid fa-video text-[#a053de]" /></div>
                        <div onClick={() => setAddFileModal(true)} className="cursor-pointer"><i className="fa-solid fa-file text-[#a053de]" /></div>
                        <div onClick={() => setAddPollModal(true)} className="cursor-pointer"><i className="fa-solid fa-poll text-[#a053de]" /></div>
                    </div>
                </div>
            </div>

            {/* ── Create Post Modal ────────────────────── */}
            <Transition show={createPost} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleCreatePostClose}>
                    <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/50" />
                    </TransitionChild>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <DialogPanel className="w-[700px] max-h-[600px] bg-[#1a1a1a] rounded-2xl overflow-y-auto shadow-xl">
                                <DialogTitle>
                                    <div className="flex justify-between px-6 py-4 border-b border-[#262626]">
                                        <span className="text-[20px] font-semibold text-white">Create Post</span>
                                        <i onClick={handleCreatePostClose} className="fa-solid fa-xmark cursor-pointer text-white" />
                                    </div>
                                </DialogTitle>
                                <DialogDescription as="div" className="p-6 space-y-4">
                                    {time && date && (
                                        <div className="border-[#262626] w-full px-[24px] py-[16px] rounded-2xl bg-[#2a2a2a] flex justify-between items-center">
                                            <span className="text-sm text-white">Posting on {date} at {time}</span>
                                            <button type="button" onClick={() => setOpenSchedulePost(true)} className="cursor-pointer text-[#7D42F5] border border-[#7D42F5] px-[24px] py-[2px] rounded-xl font-medium text-sm">Edit</button>
                                        </div>
                                    )}
                                    <AiWriterBlock {...aiWriterProps} />
                                    {/* PostEditor has ExternalValuePlugin inside — AI text appears here ✅ */}
                                    <PostEditor value={description} setValue={setDescription} />
                                </DialogDescription>
                                <ModalFooter onSchedule={handleSchedulePost} onPost={handleCreatePost} isLoading={isLaoding} />
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>

            {/* ── Upload Images Modal ──────────────────── */}
            <Transition show={addImageModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleImageModalclose}>
                    <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/50" />
                    </TransitionChild>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <DialogPanel className="w-[700px] h-auto bg-[#1a1a1a] rounded-2xl overflow-y-auto shadow-xl">
                                <DialogTitle>
                                    <div className="flex justify-between px-6 py-4 border-b border-[#262626]">
                                        <span className="text-[20px] font-semibold text-white">Upload Images</span>
                                        <i onClick={handleImageModalclose} className="fa-solid fa-xmark cursor-pointer text-white" />
                                    </div>
                                </DialogTitle>
                                <Description as="div">
                                    <div className="w-full h-full p-[34px] flex gap-5 flex-col overflow-y-auto max-h-[450px]">
                                        {time && date && (
                                            <div className="border-[#262626] w-full px-[24px] py-[16px] rounded-2xl bg-[#2a2a2a] flex justify-between items-center">
                                                <span className="text-sm text-white">Posting on {date} at {time}</span>
                                                <button type="button" onClick={() => setOpenSchedulePost(true)} className="cursor-pointer text-[#7D42F5] border border-[#7D42F5] px-[24px] py-[2px] rounded-xl font-medium text-sm">Edit</button>
                                            </div>
                                        )}
                                        <AiWriterBlock {...aiWriterProps} />
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write what's on your mind"
                                            className="w-full min-h-[100px] p-6 rounded-2xl bg-[#2a2a2a] outline-none resize-none text-white placeholder:text-[#555]" />
                                        <div className="cursor-pointer border border-dashed border-[#262626] w-full min-h-[150px] flex flex-col justify-center items-center rounded-3xl bg-[#2a2a2a] hover:border-[#7D42F5] transition"
                                            onClick={() => imageInputRef.current?.click()} onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) handleImages(e.dataTransfer.files) }}>
                                            <input ref={imageInputRef} accept="image/*" className="hidden" type="file" multiple onChange={(e) => { if (e.target.files) handleImages(e.target.files) }} />
                                            <i className="fa-solid fa-cloud-arrow-up text-[#a053de] text-2xl mb-2" />
                                            <span className="text-[16px] text-white">Click to upload images</span>
                                            <span className="text-[#555] text-sm">or drag and drop</span>
                                        </div>
                                        {imageArray.length > 0 && (
                                            <div className="flex h-[400px] justify-center items-center">
                                                <div className="items-center gap-4 flex relative h-auto aspect-square rounded-xl overflow-hidden">
                                                    <div onClick={imageArray.length > 1 ? handlePrevImage : undefined} className={imageArray.length <= 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}>
                                                        <i className="fa-solid fa-arrow-left text-white" />
                                                    </div>
                                                    <div className="relative">
                                                        <Image src={imageArray[imageArrayIndex]?.preview} alt={`upload-${imageArrayIndex}`} className="object-cover w-[500px] h-[400px] rounded-xl" width={500} height={400} />
                                                        <button type="button" onClick={() => setImageArray((prev) => prev.filter((_, i) => i !== imageArrayIndex))} className="absolute top-3 right-3 bg-black/60 text-white w-[32px] h-[32px] rounded-full hover:bg-black/80 flex items-center justify-center">✕</button>
                                                        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">{imageArrayIndex + 1} / {imageArray.length}</span>
                                                    </div>
                                                    <div onClick={imageArray.length > 1 ? handleNextImage : undefined} className={imageArray.length <= 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}>
                                                        <i className="fa-solid fa-arrow-right text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Description>
                                <ModalFooter onSchedule={handleSchedulePost} onPost={handleCreatePost} isLoading={isLaoding} />
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>

            {/* ── Upload Video Modal ───────────────────── */}
            <Transition show={addVideoModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddVideoModal(false)}>
                    <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/50" />
                    </TransitionChild>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <DialogPanel className="w-[700px] h-auto bg-[#1a1a1a] rounded-2xl overflow-y-auto shadow-xl">
                                <DialogTitle>
                                    <div className="flex justify-between px-6 py-4 border-b border-[#262626]">
                                        <span className="text-[20px] font-semibold text-white">Upload Video</span>
                                        <i onClick={() => setAddVideoModal(false)} className="fa-solid fa-xmark cursor-pointer text-white" />
                                    </div>
                                </DialogTitle>
                                <Description as="div">
                                    <div className="w-full h-full p-[34px] flex gap-5 flex-col overflow-y-auto max-h-[450px]">
                                        <AiWriterBlock {...aiWriterProps} />
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write what's on your mind"
                                            className="w-full min-h-[100px] p-6 rounded-2xl bg-[#2a2a2a] outline-none resize-none text-white placeholder:text-[#555]" />
                                        <div className="cursor-pointer border border-dashed border-[#262626] w-full min-h-[150px] flex flex-col justify-center items-center rounded-3xl bg-[#2a2a2a] hover:border-[#7D42F5] transition"
                                            onClick={() => videoInputRef.current?.click()} onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleVideo([file]) }}>
                                            <input ref={videoInputRef} accept="video/*" className="hidden" type="file" onChange={(e) => { if (e.target.files) handleVideo(e.target.files) }} />
                                            <i className="fa-solid fa-film text-[#a053de] text-2xl mb-2" />
                                            <span className="text-[16px] text-white">Click to upload a video</span>
                                            <span className="text-[#555] text-sm">or drag and drop</span>
                                        </div>
                                        {videoPreview && (
                                            <div className="relative">
                                                <video src={videoPreview} controls className="w-full max-h-[300px] rounded-xl mt-2" />
                                                <button type="button" onClick={() => setVideoPreview(null)} className="absolute top-4 right-2 bg-black/60 text-white w-[32px] h-[32px] rounded-full hover:bg-black/80 flex items-center justify-center">✕</button>
                                            </div>
                                        )}
                                    </div>
                                </Description>
                                <ModalFooter showSchedule={false} onSchedule={handleSchedulePost} onPost={handleCreatePost} isLoading={isLaoding} />
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>

            {/* ── Upload File Modal ────────────────────── */}
            <Transition show={addFileModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddFileModal(false)}>
                    <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/50" />
                    </TransitionChild>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <DialogPanel className="w-[700px] h-auto bg-[#1a1a1a] rounded-2xl overflow-y-auto shadow-xl">
                                <DialogTitle>
                                    <div className="flex justify-between px-6 py-4 border-b border-[#262626]">
                                        <span className="text-[20px] font-semibold text-white">Upload File</span>
                                        <i onClick={() => setAddFileModal(false)} className="fa-solid fa-xmark cursor-pointer text-white" />
                                    </div>
                                </DialogTitle>
                                <Description as="div">
                                    <div className="w-full h-full p-[34px] flex gap-5 flex-col overflow-y-auto max-h-[450px]">
                                        <AiWriterBlock {...aiWriterProps} />
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write what's on your mind"
                                            className="w-full min-h-[100px] p-6 rounded-2xl bg-[#2a2a2a] outline-none resize-none text-white placeholder:text-[#555]" />
                                        <div className="cursor-pointer border border-dashed border-[#262626] w-full min-h-[150px] flex flex-col justify-center items-center rounded-3xl bg-[#2a2a2a] hover:border-[#7D42F5] transition"
                                            onClick={() => fileInputRef.current?.click()} onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleFile([file]) }}>
                                            <input ref={fileInputRef} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.csv,.json" type="file" className="hidden" onChange={(e) => { if (e.target.files) handleFile(e.target.files) }} />
                                            <i className="fa-solid fa-file-arrow-up text-[#a053de] text-2xl mb-2" />
                                            <span className="text-[16px] text-white">Click to upload a file</span>
                                            <span className="text-[#555] text-sm">PDF, DOC, PPT, XLS, ZIP and more</span>
                                        </div>
                                        {fileName && (
                                            <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-xl text-white">
                                                <div className="flex items-center gap-3">
                                                    <i className="fa-solid fa-file-circle-check text-[#a053de]" />
                                                    <span className="text-sm truncate max-w-[400px]">{fileName}</span>
                                                </div>
                                                <button type="button" onClick={() => { setFileName(null); setFileObj(null) }} className="text-[#666] hover:text-white transition">
                                                    <i className="fa-solid fa-xmark" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </Description>
                                <ModalFooter showSchedule={false} onSchedule={handleSchedulePost} onPost={handleCreatePost} isLoading={isLaoding} />
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>

            {/* ── Upload Poll Modal ────────────────────── */}
            <Transition show={addPollModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddPollModal(false)}>
                    <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/50" />
                    </TransitionChild>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <DialogPanel className="w-[700px] h-auto bg-[#1a1a1a] rounded-2xl overflow-y-auto shadow-xl">
                                <DialogTitle>
                                    <div className="flex justify-between px-6 py-4 border-b border-[#262626]">
                                        <span className="text-[20px] font-semibold text-white">Create Poll</span>
                                        <i onClick={() => setAddPollModal(false)} className="fa-solid fa-xmark cursor-pointer text-white" />
                                    </div>
                                </DialogTitle>
                                <Description as="div">
                                    <div className="w-full h-full p-[34px] flex gap-5 flex-col overflow-y-auto max-h-[450px]">
                                        <AiWriterBlock {...aiWriterProps} />
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write what's on your mind"
                                            className="w-full min-h-[100px] p-6 rounded-2xl bg-[#2a2a2a] outline-none resize-none text-white placeholder:text-[#555]" />
                                        <div>
                                            <span className="text-white text-sm font-medium">Poll Question</span>
                                            <input type="text" className="w-full mt-2 p-3 rounded-lg bg-[#2a2a2a] outline-none text-white placeholder:text-[#555] border border-[#333] focus:border-[#7D42F5] transition"
                                                placeholder="What do you want to ask?" value={poll_description} onChange={(e) => setPoll_Description(e.target.value)} />
                                            <div className="flex flex-col gap-3 mt-4 w-full">
                                                <span className="text-white text-sm font-medium">Poll Options</span>
                                                {pollOptions.map((option, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <span className="text-[#555] text-sm w-20">Option {index + 1}</span>
                                                        <input value={option} onChange={(e) => { const update = [...pollOptions]; update[index] = e.target.value; setPollOptions(update) }}
                                                            type="text" placeholder={`Option ${index + 1}`}
                                                            className="flex-1 p-3 rounded-lg bg-[#2a2a2a] outline-none text-white placeholder:text-[#555] border border-[#333] focus:border-[#7D42F5] transition" />
                                                        {pollOptions.length > 2 && (
                                                            <button type="button" onClick={() => setPollOptions((prev) => prev.filter((_, i) => i !== index))} className="text-[#666] hover:text-rose-400 transition">
                                                                <i className="fa-solid fa-xmark" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                {pollOptions.length < 4 && (
                                                    <button type="button" onClick={handleAddOptions} className="self-start border border-[#7D42F5] text-[#7D42F5] rounded-2xl px-[16px] py-[8px] cursor-pointer text-sm hover:bg-[#7D42F5]/10 transition">
                                                        + Add Option
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Description>
                                <ModalFooter showSchedule={false} onSchedule={handleSchedulePost} onPost={handleCreatePost} isLoading={isLaoding} />
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>

            {/* ── Schedule Post Modal ──────────────────── */}
            <Transition show={openSchedulePost} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setOpenSchedulePost(false)}>
                    <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/50" />
                    </TransitionChild>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <DialogPanel className="w-[700px] h-auto bg-[#1a1a1a] rounded-2xl overflow-y-auto shadow-xl">
                                <DialogTitle>
                                    <div className="flex justify-between px-6 py-4 border-b border-[#262626]">
                                        <span className="text-[20px] font-semibold text-white">Schedule Post</span>
                                        <i onClick={() => setOpenSchedulePost(false)} className="fa-solid fa-xmark cursor-pointer text-white" />
                                    </div>
                                </DialogTitle>
                                <Description as="div">
                                    <div className="w-full h-full p-[34px] flex gap-6 flex-col">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-white text-sm font-medium">Date</label>
                                            <input onChange={(e) => setDate(e.target.value)} type="date" value={date ?? ""} className="cursor-pointer border border-[#333] w-full px-[24px] py-[16px] rounded-2xl bg-[#2a2a2a] text-white outline-none focus:border-[#7D42F5] transition" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-white text-sm font-medium">Time</label>
                                            <input onChange={(e) => setTime(e.target.value)} type="time" value={time ?? ""} className="cursor-pointer border border-[#333] w-full px-[24px] py-[16px] rounded-2xl bg-[#2a2a2a] text-white outline-none focus:border-[#7D42F5] transition" />
                                        </div>
                                    </div>
                                </Description>
                                <div className="border border-[#262626] flex justify-end py-[16px] px-[24px] gap-3">
                                    <button type="button" onClick={() => { setDate(null); setTime(null) }} className="cursor-pointer text-[#666] border border-[#333] px-6 py-2 rounded-xl font-medium text-sm hover:border-[#555] transition">Clear</button>
                                    <button type="button" onClick={() => setOpenSchedulePost(false)} className="cursor-pointer bg-[#7D42F5] px-6 py-2 rounded-xl font-medium hover:bg-[#6c37d6] transition">Confirm</button>
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