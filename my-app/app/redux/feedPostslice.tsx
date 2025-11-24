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
            posts:data.results,
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
        nextPage:(state)=>{
            state.page+=1
        },
        resetPosts:(state)=>{
            state.posts=[]
            state.page=1
            state.hasMore=true
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchPost.pending,(state)=>{
            state.loading=true
        })
        .addCase(fetchPost.fulfilled,(state,action)=>{
            const { posts,page,totalPages,limit }=action.payload

            state.page=page
            state.totalPages=totalPages
            state.limit=limit
            state.hasMore=page<totalPages
            
            if(page==1){
                state.posts=posts
            }else{
                state.posts = [...state.posts, ...posts]
            }
        })
        .addCase(fetchPost.rejected, (state) => {
            state.loading = false;
        })
        .addCase(updatePost.pending,(state)=>{
            state.loading=true
        })
        .addCase(updatePost.fulfilled,(state,action)=>{
            const updatedPost=action.payload

            const index=state.posts.findIndex(
                (post)=> post.slug==updatedPost.slug
            )

             if (index !== -1) {
                state.posts[index] = {
                    ...state.posts[index],
                    ...updatedPost,
                    id: updatedPost._id?.toString() || state.posts[index].id,
                }
            }
        })
    }
})

export const { nextPage,resetPosts } = postSlice.actions
export default postSlice.reducer