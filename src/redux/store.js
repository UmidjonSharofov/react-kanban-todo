import { configureStore } from '@reduxjs/toolkit'
import {modalReducer} from "./features/modalSlice.js";
export const store = configureStore({
  reducer: {
   modal:modalReducer
  },
})
