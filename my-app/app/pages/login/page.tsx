'use client'
import { auth, googleProvider, githubProvider, signInWithPopup } from "../../firebase/fireabase"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { addUser } from "@/app/redux/userSlice"
import { axiosPublic } from "@/app/axios/axiosInstance"

const Login = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const handleGoogleSignIn = async () => {
        try {
            const response = await signInWithPopup(auth, googleProvider);
            const user = response.user;

            const loginPayload = {
                email: user.email,
                password: null,
                authProvider: "google",
            };

            // Login through API Gateway -> User Service
            const result = await axiosPublic.post("/users/login",loginPayload);

            // Save token
            localStorage.setItem("accessToken", result.data.token);

            // Save backend user (not Firebase user)
            const backendUser = result.data.user;

            dispatch(addUser(backendUser));

            console.log("Login success:", backendUser);

            router.push("/pages/feed");
        } catch (error: any) {
            console.error(error);

            // If backend rejects because email is local account
            if (error?.response?.data?.message) {
                alert(error.response.data.message);
            }
        }
    };



    const handleGithubLogin = async () => {
        try {
            const response = await signInWithPopup(auth, githubProvider)
            const user = response.user
            console.log("Google Login Success:", user)
            router.push('/pages/feed')
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <div className=" max-w-[1920px] flex justify-center items-center min-h-screen ">
            <div className=" group relative max-w-[1350px]">
                <div
                    style={{ borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%" }}
                    className="transition-all duration-500 group-hover:border-[6px] group-hover:border-[#00ff0a] group-hover:[filter:drop-shadow(0_0_20px_#00ff0a)] ring absolute inset-0 translate-[-50%] border border-white w-[600px] h-[600px]"></div>
                <div
                    style={{ borderRadius: "38% 42% 63% 37% / 26% 44% 36% 56%" }}
                    className="transition-all duration-500 group-hover:border-[6px] group-hover:border-[#ff0057] group-hover:[filter:drop-shadow(0_0_20px_#ff0057)] ring-reverse absolute inset-0 translate-[-50%] border border-white w-[600px] h-[600px]"></div>
                <div
                    style={{ borderRadius: "38% 62% 63% 57% / 41% 84% 56% 59%" }}
                    className="transition-all duration-500 group-hover:border-[6px] group-hover:border-[#fffd44] group-hover:[filter:drop-shadow(0_0_20px_#fffd44)] ring absolute inset-0 translate-[-50%] border border-white w-[600px] h-[600px]"></div>
            </div>
            <div className="  backdrop-blur-[15px] rounded-4xl flex flex-col gap-[16px] justify-center items-center absolute w-[500px] h-[500px] ">
                <span className=" text-white text-[44px] leading-[64px] ">Login</span>
                <div className=" border border-white px-[24px] py-[16px] rounded-[16px] ">
                    <input className=" outline-none " type="text" placeholder="Username" />
                    <i className="fa-solid fa-user"></i>
                </div>
                <div className="  border border-white px-[24px] py-[16px] rounded-[16px] ">
                    <input className=" outline-none " type="password" placeholder="Password" />
                    <i className="fa-solid fa-lock"></i>
                </div>
                <button className=" max-w-[260px] cursor-pointer transition-all duration-400 shadow-[0_4px_15px_rgba(255,53,122,0.4)] focus:outline-none text-white font-medium text-[20px] w-full bg-linear-to-tr from-[#ff357a] to-[#fff172] px-[25px] py-[10px] rounded-[50px] hover:scale-105 ">Sign Up</button>
                <p>or Sign in with</p>
                <div className=" flex gap-[16px] ">
                    <i onClick={handleGoogleSignIn} className=" cursor-pointer fa-brands fa-google text-3xl hover:scale-105 transis "></i>
                    <i onClick={handleGithubLogin} className=" cursor-pointer fa-brands fa-github text-3xl hover:scale-105"></i>
                </div>
                <div className=" max-w-[260px] flex justify-between w-full ">
                    <span className=" hover:text-[#ff357a] transition-all duration-150 scale-105 cursor-pointer ">Forgot Password?</span>
                    <span className=" hover:text-[#ff357a] transition-all duration-150 scale-105 cursor-pointer ">Sign Up</span>
                </div>
            </div>
        </div>
    )
}

export default Login