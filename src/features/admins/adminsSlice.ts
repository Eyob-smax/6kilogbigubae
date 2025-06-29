import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Admin } from "../../types";
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
    return await getRequest<Admin[]>("/admins");
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Failed to fetch admins"
    );
  }
});

export const addAdmin = createAsyncThunk<Admin, Admin, { rejectValue: string }>(
  "admin/addAdmin",
  async (adminData, { rejectWithValue }) => {
    try {
      return await postRequest<Admin, Admin>("/admins", adminData);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to add admin"
      );
    }
  }
);

export const updateAdmin = createAsyncThunk<
  Admin,
  { id: string; adminData: Partial<Admin> },
  { rejectValue: string }
>("admin/updateAdmin", async ({ id, adminData }, { rejectWithValue }) => {
  try {
    return await putRequest<Admin, Partial<Admin>>(`/admins/${id}`, adminData);
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Failed to update admin"
    );
  }
});

export const deleteAdmin = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteAdmin", async (id, { rejectWithValue }) => {
  try {
    await deleteRequest(`/admins/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Failed to delete admin"
    );
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
