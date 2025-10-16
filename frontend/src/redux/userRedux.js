import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
    accessToken: null, 
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = false;

    
      if (action.payload.accessToken) {
        localStorage.setItem("accessToken", action.payload.accessToken);
      }
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.accessToken = null; 
    },
    updateUserToken: (state, action) => {
      state.accessToken = action.payload; 
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserToken,
} = userSlice.actions;
export default userSlice.reducer;
