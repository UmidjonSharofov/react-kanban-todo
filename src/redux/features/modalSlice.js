import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  isOpen: false,
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen =true
    },
    closeModal: (state, action) => {
      state.isOpen =false
    },
  },
})


export const modalReducer = modalSlice.reducer;
export const { openModal, closeModal } = modalSlice.actions;
