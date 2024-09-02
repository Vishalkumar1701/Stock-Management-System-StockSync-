import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    error : null,
    loading : false
}

const merchantSlice = createSlice({
    name: 'merchant',
    initialState,
    reducers:{
        logInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        logInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        logInFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        deleteFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logOutSuccess : (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading= false;
        },
    },
});

export const { logInStart, logInSuccess, logInFailure , updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure, logOutSuccess} = merchantSlice.actions;

export default merchantSlice.reducer;