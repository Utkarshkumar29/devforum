'use client'
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "../firebase/fireabase"

const UplaodComponent=()=>{
    const [file,setFile]=useState(null)
      const [fileUrl, setFileUrl] = useState(null)
      const [progress,setProgress]=useState(0)
    
      const handleSubmit=(e: React.FormEvent<HTMLFormElement>)=>{
        
        e.preventDefault()
        try {
          if(!file){
            console.log("Please select a file")
            return
          }
          const storageRef=ref(storage,`devforums/${file.name}`)
          const uploadTask=uploadBytesResumable(storageRef,file)
    
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(progress);
            },
            (error) => {
              console.error("File upload error:", error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setFileUrl(downloadURL);
            }
          );
        } catch (error) {
          console.log(error)
        }
      }

    return(
        <form onSubmit={handleSubmit}>
        <label className=" text-white ">File</label>
        <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
        <button className=" text-white ">Submit</button>
        {fileUrl && (
        <div>
          <p>File uploaded successfully!</p>
          <a href={fileUrl} target="_blank">View file</a>
        </div>
      )}
      </form>
    )
}

export default UplaodComponent