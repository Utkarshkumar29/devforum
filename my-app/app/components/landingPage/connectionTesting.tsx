'use client'

import { useEffect } from "react"
import instance from "../../utils/axiosInstance"

const ConnectionTesting=()=>{

    const getApi=async()=>{
        try {
            const response=await instance.get('/test')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getApi()
    })

    return(
        <></>
    )
}

export default ConnectionTesting