import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/admins/adminsSlice";
import userReducer from "../features/users/userSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    user: userReducer,
    auth: authReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
