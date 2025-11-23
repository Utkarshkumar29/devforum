import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../axios/axiosInstance";

export const fetchPost=createAsyncThunk(
    "posts/fetchPosts",
    async({page,limit})=>{
        const res=await axiosPrivate.get('/api/posts/getPosts',{
            params:{ page,limit }
        })
        const data=res.data
        
        return {
            post:data.results,
            page: data.current_page_number ?? data.page_number,
            totalPages: data.total_pages,
            limit: data.per_page,
        }
    }
)

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ slug, updatedData }) => {
    const res = await axiosPrivate.put(`/api/posts/editPost/${slug}`, updatedData)
    return res.data.result.post
  }
)

const postSlice=createSlice({
    name:"posts",
    initialState: {
        posts: [],
        page: 1,
        limit: 5,
        totalPages: 1,
        loading: false,
        hasMore: true,
    },
  reducers:{

  }
})