import { createSlice, current } from "@reduxjs/toolkit";

const initialState ={
    currentUser:null,
    console:null,
    loading: false,
    
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading = true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error=null;
        },
        signInFailure:(state,action)=>{
            state.error = action.payload,
            state.loading = false
        },
        updateUserStart: (state)=>{
            state.loading=true;
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload,
            state.loading = false,
            state.error=null
        },
        updateUserfailure: (state,action)=>{
            state.error=action.payload,
            state.loading= false
        },
        deleteUserStart:(state)=>{
            state.loading = false
        },
        deleteUserSuccess:(state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure:(state, action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        signoutUserStart:(state)=>{
            state.loading = false
        },
        signoutUserSuccess:(state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signoutUserFailure:(state, action)=>{
            state.error = action.payload;
            state.loading = false;
        }
    },
});

export const {
    updateUserStart,
    updateUserSuccess,
    updateUserfailure,
    signInStart,
    signInSuccess,
    signInFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutUserStart,
    signoutUserSuccess,
    signoutUserFailure
} = userSlice.actions;
export default userSlice.reducer;