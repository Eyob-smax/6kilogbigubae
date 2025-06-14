// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getRequest, postRequest, putRequest, deleteRequest } from '../../api/api';
import { User } from '../../types';

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

// Helper for uniform error extraction
const extractError = (err: any): string =>
  err?.response?.data?.message || err?.message || 'Unexpected error occurred';

// Thunks using centralized `api.ts`

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await getRequest<User[]>('/users');
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const addUser = createAsyncThunk<User, User, { rejectValue: string }>(
  'user/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await postRequest<User, User>('/users', userData);
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const updateUser = createAsyncThunk<User, { id: string; userData: Partial<User> }, { rejectValue: string }>(
  'user/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      return await putRequest<User, Partial<User>>(`/users/${id}`, userData);
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  'user/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await deleteRequest(`/users/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  }
);

//  Slice

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })

      // Add User
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add user';
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user';
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete user';
      });
  },
});

export default userSlice.reducer;
