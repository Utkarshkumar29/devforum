'use client'
import { useState } from "react"
import {auth, googleProvider, githubProvider, signInWithPopup} from "../../firebase/fireabase"
import { useRouter } from "next/navigation"
import UploadComponent from "@/app/components/landingPage/uploadcomponent"
import axios from "axios"
import { axiosPublic } from "@/app/axios/axiosInstance"


const SignUp=()=>{
    const router=useRouter()
    const [user,setUser]=useState<any>("")
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [display_name,setDisplayName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPasswrod]=useState("")
    
    const handleGoogleSignIn = async () => {
  try {
    const response = await signInWithPopup(auth, googleProvider)
    const user = response.user
    console.log("Google Login Success:", response)

    const result = await axiosPublic.post('/user/signUp', {
      email: response.user.email,
      display_name: response.user.displayName,
      photo_url: response.user.photoURL,
      password: null,
      authProvider:"google"
    })

    console.log(result, "tokentoken")
    localStorage.setItem("accessToken", result.data.token)
    router.push('/pages/feed')
  } catch (error) {
    console.log(error)
  }
}


    const handleGithubLogin=async()=>{
        try {
            const response=await signInWithPopup(auth,githubProvider)
            const user=response.user
            console.log("Google Login Success:", user)
            setUser(user)
            router.push('/pages/feed')
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogin=async()=>{
        try {
            const data={
                email,
                display_name,
                password,
                photo_url:fileUrl
            }
            const response=await axios.post('/api/user/signUp',data)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className=" max-w-[1920px] flex justify-center items-center min-h-screen ">
            <div className=" group relative max-w-[1350px]">
                <div 
                    style={{borderRadius:"38% 62% 63% 37% / 41% 44% 56% 59%"}}
                    className=" rounded-4xl transition-all duration-500 group-hover:border-[6px] group-hover:border-[#00ff0a] group-hover:[filter:drop-shadow(0_0_20px_#00ff0a)] ring absolute inset-0 translate-[-50%] border border-white w-[650px] h-[650px]"></div>
                <div
                    style={{borderRadius:"38% 42% 63% 37% / 26% 44% 36% 56%"}}
                    className="rounded-4xl transition-all duration-500 group-hover:border-[6px] group-hover:border-[#ff0057] group-hover:[filter:drop-shadow(0_0_20px_#ff0057)] ring-reverse absolute inset-0 translate-[-50%] border border-white w-[650px] h-[650px]"></div>
                <div
                    style={{borderRadius:"38% 62% 63% 57% / 41% 84% 56% 59%"}} 
                    className=" rounded-4xl transition-all duration-500 group-hover:border-[6px] group-hover:border-[#fffd44] group-hover:[filter:drop-shadow(0_0_20px_#fffd44)] ring absolute inset-0 translate-[-50%] border border-white w-[650px] h-[650px]"></div>
            </div>
            <div className=" py-[24px] backdrop-blur-[15px] rounded-4xl flex flex-col gap-[8px] justify-center items-center absolute w-[500px] h-auto ">
                <span className=" text-white text-[44px] leading-[64px] ">Sign Up</span>
               <div className=" w-full max-w-[270px] flex justify-center items-center border border-white px-6 py-4 rounded-2xl bg-transparent">
                <UploadComponent setFileUrl={setFileUrl} fileUrl={fileUrl}/>
                </div>
                <div className=" border border-white px-[24px] py-[16px] rounded-[16px] ">
                    <input value={display_name} onChange={(e)=>setDisplayName(e.target.value)} className=" outline-none " type="text" placeholder="Username"/>
                    <i className="fa-solid fa-user"></i>
                </div>
                <div className=" border border-white px-[24px] py-[16px] rounded-[16px] ">
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} className=" outline-none " type="email" placeholder="Email"/>
                    <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="  border border-white px-[24px] py-[16px] rounded-[16px] ">
                    <input value={password} onChange={(e)=>setPasswrod(e.target.value)} className=" outline-none " type="password" placeholder="Password"/>
                    <i className="fa-solid fa-lock"></i>
                </div>
                <div className="  border border-white px-[24px] py-[16px] rounded-[16px] ">
                    <input className=" outline-none " type="password" placeholder="Confirm Password"/>
                    <i className="fa-solid fa-lock"></i>
                </div>
                <button onClick={handleLogin} className=" max-w-[260px] cursor-pointer transition-all duration-400 shadow-[0_4px_15px_rgba(255,53,122,0.4)] focus:outline-none text-white font-medium text-[20px] w-full bg-linear-to-tr from-[#ff357a] to-[#fff172] px-[25px] py-[10px] rounded-[50px] hover:scale-105 ">Sign Up</button>
                <p>or Sign in with</p>
                <div className=" flex gap-[16px] ">
                    <i onClick={handleGoogleSignIn} className=" cursor-pointer fa-brands fa-google text-3xl hover:scale-105 transis "></i>
                    <i onClick={handleGithubLogin} className=" cursor-pointer fa-brands fa-github text-3xl hover:scale-105"></i>
                </div>
                <div className=" max-w-[260px] flex justify-between w-full ">
                    <span className=" hover:text-[#ff357a] transition-all duration-150 scale-105 cursor-pointer ">Forgot Password?</span>
                    <span className=" hover:text-[#ff357a] transition-all duration-150 scale-105 cursor-pointer ">Login</span>
                </div>
            </div>
        </div>
    )
}

export default SignUp