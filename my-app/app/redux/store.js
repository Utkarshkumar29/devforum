import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postsReducer from "./feedPostslice";

export const store = configureStore({
  reducer: {
    userDetails: userReducer,
    posts: postsReducer
  },
});
