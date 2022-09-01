import { configureStore } from "@reduxjs/toolkit";
import favlistReducer from "./slice/favlistSlice";
import searchReducer from "./slice/searchSlice";

const store = configureStore({
  reducer: {
    favlist: favlistReducer,
    search: searchReducer,
  },
});

export default store;
