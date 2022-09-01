import { createSlice } from "@reduxjs/toolkit";
const commentSlice = createSlice({
  name: "fav",
  initialState: JSON.parse(localStorage.getItem("favlist") || "[]"),

  reducers: {
    updateList: (state, action) => {
      state = action.payload.list;
      localStorage.setItem("favlist", JSON.stringify(action.payload.list));
      return state;
    },
  },
});

export const { updateList } = commentSlice.actions;
export default commentSlice.reducer;
