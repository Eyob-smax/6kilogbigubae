// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../../api/api";
import { getUsers } from "../../service/userApi";
import { User } from "../../types";
import { extractError } from "../../util/utils";
import Swal from "sweetalert2";

import { Pagination } from "../../types";

interface AnalyticsData {
  total: number;
  activeUsers: number;
  participating: number;
  participationRate: number;
  participationBreakdown: Record<string, number>;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  analytics: AnalyticsData | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  pagination: null,
  analytics: null,
};

// Request parameters for fetching users. matches frontend hook params.
export interface FetchUsersParams {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  batch?: number;
  participation?: string;
}

// response comes with additional pagination object

type TFetchResponse = {
  users: User[];
  success: boolean;
  pagination: Pagination;
};

type TUpdateResponse = {
  success: boolean;
  updatedUser: User;
  message: string;
};

// Centralized success alert
const showSuccessAlert = (message: string) =>
  Swal.fire({
    icon: "success",
    title: "Operation Successful",
    text: message,
    timer: 300,
  });

// Thunks

export const fetchUsers = createAsyncThunk<
  TFetchResponse,
  FetchUsersParams | undefined,
  { rejectValue: string }
>("user/fetchUsers", async (params, { rejectWithValue }) => {
  try {
    const p = params ?? {};
    // log for debugging
    console.debug("fetchUsers params", p);
    const res = (await getUsers(p)) as TFetchResponse;
    console.debug("fetchUsers result", {
      users: res.users.length,
      pagination: res.pagination,
    });

    // ensure we always have a pagination object so components can rely on it
    if (!res.pagination) {
      res.pagination = {
        totalUsers: res.users.length,
        totalPages: p.limit ? Math.ceil(res.users.length / p.limit) : 1,
        currentPage: p.page ?? 1,
        limit: p.limit ?? res.users.length,
        hasNext: false,
        hasPrev: false,
      } as Pagination;
    }
    if (
      p.limit &&
      (!res.pagination || res.pagination.totalUsers <= res.users.length)
    ) {
      
      let manualCount = 0;
      let pageNum = 1;
      const limit = p.limit as number;
      const maxPages = 1000; // safety cap in case backend loops forever

      while (pageNum <= maxPages) {
        const next = (await getUsers({
          ...p,
          page: pageNum,
        })) as TFetchResponse;
        if (next.users.length === 0) break;
        manualCount += next.users.length;
        pageNum += 1;
      }

      const totalPages = limit ? Math.ceil(manualCount / limit) : pageNum - 1;
      res.pagination = {
        ...((res.pagination as Pagination) || {}),
        totalUsers: manualCount,
        totalPages,
      };
    }

    return res;
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const fetchAnalytics = createAsyncThunk<
  AnalyticsData,
  void,
  { rejectValue: string }
>("user/fetchAnalytics", async (_, { rejectWithValue }) => {
  try {
    const res = await getRequest<{
      success: boolean;
      analytics: AnalyticsData;
    }>("/user/analytics");
    return res.analytics;
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const addUser = createAsyncThunk<User, User, { rejectValue: string }>(
  "user/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await postRequest<{ user: User }, User>("/user", userData);
      return res.user;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateUser = createAsyncThunk<
  User,
  { id: string; userData: Partial<User> },
  { rejectValue: string }
>("user/updateUser", async ({ id, userData }, { rejectWithValue }) => {
  try {
    const res = await putRequest<TUpdateResponse, Partial<User>>(
      `/user/${id}`,
      userData,
    );
    if (res.success && res.updatedUser) {
      return res.updatedUser;
    }
    return rejectWithValue(res.message || "Update failed");
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("user/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await deleteRequest(`/user/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const deleteAllUsers = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("user/deleteAll", async (_, { rejectWithValue }) => {
  try {
    await deleteRequest("/user");
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<TFetchResponse>) => {
          state.loading = false;
          state.users = action.payload.users;
          state.pagination = action.payload.pagination;
        },
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      });

    // analytics
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAnalytics.fulfilled,
        (state, action: PayloadAction<AnalyticsData>) => {
          state.loading = false;
          state.analytics = action.payload;
        },
      )
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch analytics";
      });

    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users = [...state.users, action.payload];
        showSuccessAlert("User added successfully");
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add user";
      });

    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user.studentid === action.payload.studentid ? action.payload : user,
        );
        showSuccessAlert("User updated successfully");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.studentid !== action.payload,
        );
        showSuccessAlert("User deleted successfully");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
      });

    builder
      .addCase(deleteAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllUsers.fulfilled, (state) => {
        state.loading = false;
        state.users = [];
        showSuccessAlert("All users deleted successfully");
      })
      .addCase(deleteAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete all users";
      });
  },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
