import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";
import { Admin, DEFAULT_PERMISSIONS, Permissions } from "../../types";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import type { RootState } from "../../app/store";

export type TCurrentUserData = {
  username: string;
  studentid: string;
  isSuperAdmin: boolean;
  permissions: Permissions;
};

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type CurrentUserResponse = {
  success: boolean;
  user?: {
    studentid: string;
    adminusername: string;
    isAuthenticated: boolean;
    isSuperAdmin: boolean;
    role?: "Super Admin" | "Admin";
    permissions?: Permissions;
  };
};

type AuthSessionPayload = {
  admin: Admin;
  currentUserData: TCurrentUserData;
};

interface AuthState {
  hasInitialized: boolean;
  status: AuthStatus;
  isAuthenticated: boolean;
  admin: Admin | null;
  loading: boolean;
  error: string | null;
  currentUserData: TCurrentUserData | null;
}

const initialState: AuthState = {
  hasInitialized: false,
  status: "idle",
  isAuthenticated: false,
  admin: null,
  loading: false,
  error: null,
  currentUserData: null,
};

const extractErrorMessage = (
  err: unknown,
  fallback = "Something went wrong",
) => {
  const error = err as AxiosError<{ message?: string }>;
  return error.response?.data?.message || error.message || fallback;
};

const showLogoutSuccess = async () => {
  await Swal.fire({
    title: "Logged out",
    icon: "success",
    text: "You have been logged out successfully.",
  });
};

const buildSessionPayload = (
  user?: CurrentUserResponse["user"],
): AuthSessionPayload => {
  if (!user?.isAuthenticated) {
    throw new Error("No active session found");
  }

  const permissions = user.permissions || {
    ...DEFAULT_PERMISSIONS,
  };

  return {
    admin: {
      studentid: user.studentid,
      adminusername: user.adminusername,
      isSuperAdmin: !!user.isSuperAdmin,
      role: user.role || (user.isSuperAdmin ? "Super Admin" : "Admin"),
      permissions,
    },
    currentUserData: {
      username: user.adminusername,
      studentid: user.studentid,
      isSuperAdmin: !!user.isSuperAdmin,
      permissions,
    },
  };
};

const applyAuthenticatedState = (
  state: AuthState,
  payload: AuthSessionPayload,
) => {
  state.status = "authenticated";
  state.isAuthenticated = true;
  state.admin = payload.admin;
  state.currentUserData = payload.currentUserData;
  state.error = null;
};

const resetAuthState = (state: AuthState) => {
  state.status = "unauthenticated";
  state.isAuthenticated = false;
  state.admin = null;
  state.currentUserData = null;
};

export const fetchCurrentUser = createAsyncThunk<
  AuthSessionPayload,
  void,
  { rejectValue: string; state: RootState }
>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CurrentUserResponse>("/auth/current");
      return buildSessionPayload(response.data.user);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Authentication failed"));
    }
  },
  {
    condition: (_, { getState }) => {
      const { status, hasInitialized, loading } = getState().auth;
      return !hasInitialized && status === "idle" && !loading;
    },
  },
);

export const loginAdmin = createAsyncThunk<
  AuthSessionPayload,
  { studentId: string; password: string },
  { rejectValue: string }
>("auth/loginAdmin", async ({ studentId, password }, { rejectWithValue }) => {
  try {
    const normalizedStudentId = studentId.trim();
    const normalizedPassword = password.trim();

    await api.post("/admin/login", {
      studentid: normalizedStudentId,
      adminpassword: normalizedPassword,
    });

    const currentUserResponse =
      await api.get<CurrentUserResponse>("/auth/current");
    return buildSessionPayload(currentUserResponse.data.user);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, "Login failed"));
  }
});

export const logoutAdmin = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logoutAdmin", async (_, { rejectWithValue }) => {
  try {
    await api.post("/auth/logout");
    await showLogoutSuccess();
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, "Logout failed"));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      state.hasInitialized = true;
      state.loading = false;
      state.error = null;
      resetAuthState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        if (!state.hasInitialized && state.status === "idle") {
          state.status = "loading";
        }
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.hasInitialized = true;
        state.loading = false;
        applyAuthenticatedState(state, action.payload);
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.hasInitialized = true;
        state.loading = false;
        state.error = null;
        resetAuthState(state);
      })
      .addCase(loginAdmin.pending, (state) => {
        state.hasInitialized = true;
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.hasInitialized = true;
        state.loading = false;
        applyAuthenticatedState(state, action.payload);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.hasInitialized = true;
        state.loading = false;
        state.error = action.payload || "Login failed";
        resetAuthState(state);
      })

      .addCase(logoutAdmin.pending, (state) => {
        state.hasInitialized = true;
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.hasInitialized = true;
        state.loading = false;
        state.error = null;
        resetAuthState(state);
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.hasInitialized = true;
        state.status = state.isAuthenticated
          ? "authenticated"
          : "unauthenticated";
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { clearAuthError, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
