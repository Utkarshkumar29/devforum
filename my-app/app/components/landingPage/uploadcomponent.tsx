"use client";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/fireabase";

const UploadComponent = ({fileUrl,setFileUrl}) => {
  const [file, setFile] = useState<File | null>(null);
  
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileUpload = (file: File) => {
    const storageRef = ref(storage, `devforums/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setIsUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setFileUrl(url);
        setIsUploading(false);
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile)); // temp preview
      handleFileUpload(selectedFile);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar Circle */}
      <label
        htmlFor="file"
        className="relative w-24 h-24 rounded-full border border-white/30 bg-white/5 backdrop-blur-md flex items-center justify-center cursor-pointer hover:border-[#ff357a] transition-all duration-300 overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.15)]"
      >
        {fileUrl ? (
          <img
            src={fileUrl}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <i className="fa-solid fa-user text-white text-2xl opacity-70"></i>
        )}
        <input
          id="file"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Uploading Progress */}
      {isUploading && (
        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
          <div
            className="h-1 bg-gradient-to-r from-[#ff357a] to-[#fff172] transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* View Image Link */}
      {fileUrl && !isUploading && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#00ff0a] underline hover:text-[#fff172] transition-all"
        >
          View Image
        </a>
      )}
    </div>
  );
};

export default UploadComponent;
