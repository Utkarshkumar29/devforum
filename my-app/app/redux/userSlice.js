import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "UserDetails",
  initialState: {
    user: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    clearUser: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
  },
});

export const { addUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
