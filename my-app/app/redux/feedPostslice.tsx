import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../axios/axiosInstance";

// -------------------------
// Types
// -------------------------

interface FetchSlugsArgs {
  page: number;
  limit: number;
}

interface FetchSlugsResponse {
  posts: any[];
  page: number;
  totalPages: number;
  limit: number;
}

interface FetchDetailsArgs {
  slug: string;
}

interface UpdatePostArgs {
  slug: string;
  updatedData: Record<string, any>;
}

// -------------------------
// Thunks
// -------------------------

export const fetchPostSlugs = createAsyncThunk<
  FetchSlugsResponse,
  FetchSlugsArgs
>("posts/fetchPosts", async ({ page, limit }) => {
  const res = await axiosPrivate.get("/posts/getPosts", {
    params: { page, limit },
  });

  const data = res.data;

  return {
    posts: data.results,
    page: data.current_page_number ?? data.page_number,
    totalPages: data.total_pages,
    limit: data.per_page,
  };
});

export const fetchPostDetails = createAsyncThunk<any, FetchDetailsArgs>(
  "posts/fetchPostDetails",
  async ({ slug }) => {
    const response = await axiosPrivate.get(`/posts/singlePost/${slug}`);
    return response.data.result.post;
  }
);

export const updatePost = createAsyncThunk<any, UpdatePostArgs>(
  "posts/updatePost",
  async ({ slug, updatedData }) => {
    const res = await axiosPrivate.put(
      `/posts/editPost/${slug}`,
      updatedData
    );
    return res.data.result.post;
  }
);

// -------------------------
// Slice
// -------------------------

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [] as any[],
    postDetails: {} as Record<string, any>,
    page: 1,
    limit: 5,
    totalPages: 1,
    loading: false,
    hasMore: true,
    creatingPost: false,
  },
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
  },
  extraReducers: (builder) => {
    builder
      // FETCH SLUGS
      .addCase(fetchPostSlugs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostSlugs.fulfilled, (state, action) => {
        const { posts, page, totalPages, limit } = action.payload;

        state.page = page;
        state.totalPages = totalPages;
        state.limit = limit;
        state.hasMore = page < totalPages;

        if (page === 1) {
          state.posts = posts;
        } else {
          state.posts = [...state.posts, ...posts];
        }
      })
      .addCase(fetchPostSlugs.rejected, (state) => {
        state.loading = false;
      })

      // FETCH DETAILS
      .addCase(fetchPostDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        const fullPost = action.payload;
        state.postDetails[fullPost.slug] = fullPost;
      })

      // UPDATE POST
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
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
} = postSlice.actions;

export default postSlice.reducer;
