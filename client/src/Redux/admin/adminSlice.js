import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentadminUser : null,
    error : null,
    loading : false
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers:{
        AdminlogInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        AdminlogInSuccess: (state, action) => {
            state.currentadminUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        AdminlogInFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        AdminupdateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        AdminupdateSuccess: (state, action) => {
            state.currentadminUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        AdminupdateFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        AdmindeleteStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        AdmindeleteSuccess: (state, action) => {
            state.currentadminUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        AdmindeleteFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        AdminlogOutSuccess : (state) => {
            state.currentadminUser = null;
            state.error = null;
            state.loading= false;
        },
    },
});

export const { AdminlogInStart, AdminlogInSuccess, AdminlogInFailure , AdminupdateStart, AdminupdateSuccess, AdminupdateFailure, AdmindeleteStart, AdmindeleteSuccess, AdmindeleteFailure, AdminlogOutSuccess} = adminSlice.actions;

export default adminSlice.reducer;