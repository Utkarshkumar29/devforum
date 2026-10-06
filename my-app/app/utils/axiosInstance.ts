import axios from "axios"

const server_url =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

const base_url = `${server_url}/api`

const instance = axios.create({
    baseURL: base_url,
})

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 ||
                error.response.status === 403)
        ) {
            localStorage.removeItem("token")

            // Axios interceptor is outside React component scope,
            // so useRouter() cannot be used here.
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.href = "/"
        }

        return Promise.reject(error)
    }
)

export default instance