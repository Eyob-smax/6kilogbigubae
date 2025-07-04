import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Admin } from "../../types";
import { extractError } from "../../util/utils";

import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../../api/api";
interface AdminState {
  admins: Admin[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  admins: [],
  loading: false,
  error: null,
};

export const fetchAdmins = createAsyncThunk<
  Admin[],
  void,
  { rejectValue: string }
>("admin/fetchAdmins", async (_, { rejectWithValue }) => {
  try {
    return await getRequest<Admin[]>("/admin");
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const addAdmin = createAsyncThunk<Admin, Admin, { rejectValue: string }>(
  "admin/addAdmin",
  async (adminData, { rejectWithValue }) => {
    try {
      return await postRequest<Admin, Admin>("/admin", adminData);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const updateAdmin = createAsyncThunk<
  Admin,
  { id: string; adminData: Partial<Admin> },
  { rejectValue: string }
>("admin/updateAdmin", async ({ id, adminData }, { rejectWithValue }) => {
  try {
    return await putRequest<Admin, Partial<Admin>>(`/admin/${id}`, adminData);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const deleteAdmin = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteAdmin", async (id, { rejectWithValue }) => {
  try {
    await deleteRequest(`/admin/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

// Slice

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Admins
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdmins.fulfilled,
        (state, action: PayloadAction<Admin[]>) => {
          state.loading = false;
          state.admins = action.payload;
        }
      )
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch admins";
      })
      .addCase(addAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdmin.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.loading = false;
        state.admins.push(action.payload);
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add admin";
      })
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.loading = false;
        const index = state.admins.findIndex(
          (admin) => admin.id === action.payload.id
        );
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update admin";
      })

      // Delete Admin
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAdmin.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.admins = state.admins.filter(
            (admin) => admin.id !== action.payload
          );
        }
      )
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete admin";
      });
  },
});

export default adminSlice.reducer;
