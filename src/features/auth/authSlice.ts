// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";
import { Admin } from "../../types";
import { AxiosError } from "axios";

interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  admin: null,
  token: null,
  loading: false,
  error: null,
};

// export const fetchCurrentAdmin = createAsyncThunk(
//   "auth/getCurrentAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/api/currentAdmin");
//       return response.data;
//     } catch (err) {
//       const { message } = err as Error;
//       return rejectWithValue(message);
//     }
//   }
// );

export const loginAdmin = createAsyncThunk<
  { admin: Admin; token: string },
  { studentId: string; password: string },
  { rejectValue: string }
>("auth/loginAdmin", async ({ studentId, password }, { rejectWithValue }) => {
  try {
    const response = await api.post("/admin/login", { studentId, password });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    const message =
      error.response?.data?.message || error.message || "Login failed";
    return rejectWithValue(message);
  }
});

export const logoutAdmin = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logoutAdmin", async (_, { rejectWithValue }) => {
  try {
    localStorage.removeItem("admin_token");
  } catch (err: any) {
    return rejectWithValue("Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        localStorage.setItem("admin_token", action.payload.token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
