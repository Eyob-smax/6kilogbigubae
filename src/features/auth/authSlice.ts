import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";
import { Admin } from "../../types";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

type TCurrentUserData = {
  username: string;
  studentid: string;
  isSuperAdmin: boolean;
};
interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  loading: boolean;
  error: string | null;
  currentUserData: null | TCurrentUserData;
}

const initialState: AuthState = {
  isAuthenticated: false,
  admin: null,
  loading: false,
  error: null,
  currentUserData: null,
};

export const loginAdmin = createAsyncThunk<
  { admin: Admin; token: string },
  { studentId: string; password: string },
  { rejectValue: string }
>("auth/loginAdmin", async ({ studentId, password }, { rejectWithValue }) => {
  try {
    console.log("Attempting login for studentId:", studentId);
    const response = await api.post("/admin/login", {
      studentid: studentId,
      adminpassword: password,
    });
    console.log("Login response:", response.data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(
      error.response?.data?.message || error.message || "Login failed"
    );
  }
});

export const logoutAdmin = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("/auth/logoutAdmin", async (_, { rejectWithValue }) => {
  try {
    await api.get("/logout");
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(
      error.response?.data?.message || error.message || "Logout failed"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, { payload }) => {
      state.currentUserData = payload;
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
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.admin = null;
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.error = null;

        (async () => {
          await Swal.fire({
            title: "Logged out",
            icon: "success",
            text: "You have been logged out successfully.",
          });
        })();
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { clearAuthError, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
