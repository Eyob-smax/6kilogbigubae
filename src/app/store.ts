import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/admins/adminsSlice";
import userReducer from "../features/users/userSlice";
import authReducer from "../features/auth/authSlice";
import rolesReducer from "../features/roles/rolesSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    user: userReducer,
    auth: authReducer,
    roles: rolesReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
