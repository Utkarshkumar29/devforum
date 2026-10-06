'use client'

import { useEffect } from "react"

const ConnectionTesting=()=>{

    const getApi=async()=>{
        try {
            
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