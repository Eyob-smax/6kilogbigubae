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

// Thunks using centralized `api.ts`

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
      return res?.user as User;
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
    const res = await putRequest<
      { success: boolean; updatedUser: User; message: string },
      Partial<User>
    >(`/user/${id}`, userData);
    console.log("Update response:", userData);
    if (res?.success && res.updatedUser) {
      return res?.updatedUser;
    } else {
      return rejectWithValue(res.message || "Update failed");
    }
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

export const deleteAllUsers = createAsyncThunk(
  "user/deleteAll",
  async (_, { rejectWithValue }) => {
    try {
      return await deleteRequest("/user");
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

//  Slice

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
      // Fetch Users
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
      })

      // Add User
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
        Swal.fire({
          icon: "success",
          title: "Operation Successful",
          text: "User added successfully ",
        });
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to add user";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user?.studentid === action.payload?.studentid
        );
        if (index !== -1) {
          state.users[index] = action.payload;
          Swal.fire({
            icon: "success",
            title: "Operation Successful",
            text: "User updated successfully ",
          });
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user?.studentid !== action.payload
        );
        Swal.fire({
          icon: "success",
          title: "Operation Successful",
          text: "User deleted successfully ",
        });
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
      })
      .addCase(deleteAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllUsers.fulfilled, (state) => {
        state.users = [];
      })
      .addCase(deleteAllUsers.rejected, (state, { payload }) => {
        state.error = payload as string | null;
      });
  },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
