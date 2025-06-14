// store.ts
import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../features/admins/adminsSlice';
import userReducer from '../features/users/userSlice';
// If the file exists at a different path, update the import accordingly, for example:
 import authReducer from '../features/auth/authSlice';


export const store = configureStore({
  reducer: {
    admin: adminReducer,
    user: userReducer,
    auth: authReducer

  },
});

export type RootState =ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;