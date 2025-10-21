import axios from "axios"

const server_url=process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
const base_url=`${server_url}/api`

const instance=axios.create({
    baseURL:base_url
})

instance.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem("token")
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

instance.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        if(error.response && (error.response.status==401 || error.response.status==403)){
            localStorage.removeItem("token")
            window.location.href="/"
        }
    }
)

export default instance