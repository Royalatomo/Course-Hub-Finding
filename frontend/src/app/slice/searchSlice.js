import { createSlice } from "@reduxjs/toolkit";
const commentSlice = createSlice({
  name: "search",
  initialState: "",

  reducers: {
    updateSearch: (state, action) => {
      state = action.payload.search;
      return state;
    },
  },
});

export const { updateSearch } = commentSlice.actions;
export default commentSlice.reducer;
