// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../../api/api";
import { User } from "../../types";
import { extractError } from "../../util/utils";
import Swal from "sweetalert2";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

type TFetchResponse = {
  users: User[];
  success: boolean;
};

type TUpdateResponse = {
  success: boolean;
  updatedUser: User;
  message: string;
};

// ✅ Centralized success alert
const showSuccessAlert = (message: string) =>
  Swal.fire({
    icon: "success",
    title: "Operation Successful",
    text: message,
    timer: 300,
  });

// ✅ Thunks

export const fetchUsers = createAsyncThunk<
  TFetchResponse,
  void,
  { rejectValue: string }
>("user/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    return await getRequest<TFetchResponse>("/user");
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
  }
);

export const updateUser = createAsyncThunk<
  User,
  { id: string; userData: Partial<User> },
  { rejectValue: string }
>("user/updateUser", async ({ id, userData }, { rejectWithValue }) => {
  try {
    const res = await putRequest<TUpdateResponse, Partial<User>>(
      `/user/${id}`,
      userData
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
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
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
          user.studentid === action.payload.studentid ? action.payload : user
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
          (user) => user.studentid !== action.payload
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
