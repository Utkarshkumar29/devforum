import { createSlice } from "@reduxjs/toolkit"

const userSlice=createSlice({
    name:"UserDetails",
    initialState:{
        user:null
    },
    reducers:{
        addUser:(state,action)=>{
            state.user=action.payload
        },
        clearUser:()=>{
            return []
        }
    }
})

export const { addUser, clearUsers } = userSlice.actions
export default userSlice.reducer