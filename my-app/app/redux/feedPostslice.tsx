import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../axios/axiosInstance";

export const fetchPostSlugs=createAsyncThunk(
    "posts/fetchPosts",
    async({page,limit})=>{
        const res=await axiosPrivate.get('/posts/getPosts',{
            params:{ page,limit }
        })
        const data=res.data
        console.log("Fetched Posts Data:", data);
        return {
            posts:data.results,
            page: data.current_page_number ?? data.page_number,
            totalPages: data.total_pages,
            limit: data.per_page,
        }
    }
)

export const fetchPostDetails=createAsyncThunk(
    "posts/fetchPostDetails",
    async({slug})=>{
        const response=await axiosPrivate.get(`/posts/singlePost/${slug}`)
        console.log(response,"fetched details")
        return response.data.result.post
    }
)

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ slug, updatedData }) => {
    const res = await axiosPrivate.put(`/posts/editPost/${slug}`, updatedData)
    return res.data.result.post
  }
)

const postSlice=createSlice({
    name:"posts",
    initialState: {
        posts: [],
        postDetails:{},
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
        .addCase(fetchPostSlugs.pending,(state)=>{
            state.loading=true
        })
        .addCase(fetchPostSlugs.fulfilled,(state,action)=>{
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
        .addCase(fetchPostSlugs.rejected, (state) => {
            state.loading = false;
        })
        .addCase(fetchPostDetails.pending,(state)=>{
            state.loading=true
        })
        .addCase(fetchPostDetails.fulfilled,(state,action)=>{
            const fullPost = action.payload;
            state.postDetails[fullPost.slug] = fullPost;
        })
        .addCase(updatePost.pending,(state)=>{
            state.loading=true
        })
        .addCase(updatePost.fulfilled, (state, action) => {
            const updatedPost = action.payload;

            const index = state.posts.findIndex(
            (post) => post.slug === updatedPost.slug
            );

            if (index !== -1) {
            state.posts[index] = {
                ...state.posts[index],
                ...updatedPost,
            };
            }
        })
    }
})

export const { nextPage,resetPosts } = postSlice.actions
export default postSlice.reducer