import axios from "axios"

const baseURL= "https://devforum-gateway.onrender.com/api"

export const axiosPublic=axios.create({
    baseURL:baseURL,
    withCredentials:true,
    headers:{
        "Content-Type": "application/json"
    }
})

export const axiosPrivate=axios.create({
    baseURL:baseURL,
    withCredentials:true,
    headers:{
        "Content-Type": "application/json"
    }
})

axiosPrivate.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem("accessToken")
        console.log(token,"please")
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

