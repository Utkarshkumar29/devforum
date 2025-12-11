import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../axios/axiosInstance";

// ----------------------------
// Types
// ----------------------------

// Post slug item
export interface PostSlug {
  slug: string;
  [key: string]: unknown;
}

// Full post detail
export interface FullPost {
  slug: string;
  [key: string]: unknown;
}

// Thunk args
interface FetchSlugsArgs {
  page: number;
  limit: number;
}

// API response for list
interface FetchSlugsResponse {
  posts: PostSlug[];
  page: number;
  totalPages: number;
  limit: number;
}

interface FetchDetailsArgs {
  slug: string;
}

interface UpdatePostArgs {
  slug: string;
  updatedData: Record<string, unknown>;
}

// ----------------------------
// Thunks
// ----------------------------

export const fetchPostSlugs = createAsyncThunk<
  FetchSlugsResponse,
  FetchSlugsArgs
>("posts/fetchPosts", async ({ page, limit }) => {
  const res = await axiosPrivate.get("/posts/getPosts", {
    params: { page, limit },
  });

  const data = res.data;

  return {
    posts: data.results as PostSlug[],
    page: data.current_page_number ?? data.page_number,
    totalPages: data.total_pages,
    limit: data.per_page,
  };
});

export const fetchPostDetails = createAsyncThunk<FullPost, FetchDetailsArgs>(
  "posts/fetchPostDetails",
  async ({ slug }) => {
    const response = await axiosPrivate.get(`/posts/singlePost/${slug}`);
    return response.data.result.post as FullPost;
  }
);

export const updatePost = createAsyncThunk<FullPost, UpdatePostArgs>(
  "posts/updatePost",
  async ({ slug, updatedData }) => {
    const res = await axiosPrivate.put(
      `/posts/editPost/${slug}`,
      updatedData
    );
    return res.data.result.post as FullPost;
  }
);

// ----------------------------
// Slice
// ----------------------------

interface PostState {
  posts: PostSlug[];
  postDetails: Record<string, FullPost>;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  hasMore: boolean;
  creatingPost: boolean;
}

const initialState: PostState = {
  posts: [],
  postDetails: {},
  page: 1,
  limit: 5,
  totalPages: 1,
  loading: false,
  hasMore: true,
  creatingPost: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    nextPage: (state) => {
      state.page += 1;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    },
    addNewPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    setCreatingPost(state, action) {
      state.creatingPost = action.payload;
    },
    deletePost(state, action) {
      state.posts=state.posts.filter((post)=>post.slug==action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostSlugs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostSlugs.fulfilled, (state, action) => {
        const { posts, page, totalPages, limit } = action.payload;

        state.page = page;
        state.totalPages = totalPages;
        state.limit = limit;
        state.hasMore = page < totalPages;

        if (page === 1) state.posts = posts;
        else state.posts = [...state.posts, ...posts];
      })

      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        const fullPost = action.payload;
        state.postDetails[fullPost.slug] = fullPost;
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
      });
  },
});

export const {
  nextPage,
  resetPosts,
  addNewPost,
  setCreatingPost,
  deletePost
} = postSlice.actions;

export default postSlice.reducer;
