import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Admin } from "../../types";
import { extractError } from "../../util/utils";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../../api/api";
import Swal from "sweetalert2";

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

interface AsyncThunkConfig {
  rejectValue: string;
}

// ----------------------
// 🔔 Helpers for alerts
// ----------------------
const showSuccess = (msg: string) =>
  Swal.fire({
    icon: "success",
    title: "Operation Successful",
    text: msg,
  });

const showError = (msg: string) =>
  Swal.fire({
    icon: "error",
    title: "Operation Failed",
    text: msg,
  });

// ----------------------
// Thunks
// ----------------------
export const fetchAdmins = createAsyncThunk<Admin[], void, AsyncThunkConfig>(
  "admin/fetchAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest<{
        success: boolean;
        message: string;
        admins?: Admin[];
      }>("/admin");

      if (res.success && Array.isArray(res.admins)) {
        return res.admins;
      }
      return rejectWithValue(res.message || "Failed to fetch admins");
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const addAdmin = createAsyncThunk<
  void,
  Partial<Admin>,
  AsyncThunkConfig
>("admin/addAdmin", async (adminData, { rejectWithValue, dispatch }) => {
  try {
    const res = await postRequest<
      { success: boolean; message: string; admin?: Admin },
      Partial<Admin>
    >("/admin/register", adminData);

    if (res.success) {
      await showSuccess("Admin added successfully");
      dispatch(fetchAdmins());
      return;
    }
    return rejectWithValue(res.message || "Failed to add admin");
  } catch (err) {
    await showError("Failed to add admin");
    return rejectWithValue(extractError(err));
  }
});

export const updateAdmin = createAsyncThunk<
  Admin,
  { id: string; adminData: Partial<Admin> },
  AsyncThunkConfig
>(
  "admin/updateAdmin",
  async ({ id, adminData }, { rejectWithValue, dispatch }) => {
    try {
      const res = await putRequest<
        { success: boolean; message?: string; updatedAdmin?: Admin },
        Partial<Admin>
      >(`/admin/${id}`, adminData);

      if (res.success && res.updatedAdmin) {
        await showSuccess("Admin updated successfully");
        dispatch(fetchAdmins());
        return res.updatedAdmin;
      }
      return rejectWithValue(res.message || "Can't edit admin");
    } catch (err) {
      await showError("Failed to update admin");
      return rejectWithValue(extractError(err));
    }
  }
);

export const deleteAdmin = createAsyncThunk<string, string, AsyncThunkConfig>(
  "admin/deleteAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await deleteRequest(`/admin/${id}`);
      await showSuccess("Admin deleted successfully");
      return id;
    } catch (err) {
      await showError("Failed to delete admin");
      return rejectWithValue(extractError(err));
    }
  }
);

// ----------------------
// Slice
// ----------------------
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
          state.admins = action.payload.map((admin) => ({
            ...admin,
            adminpassword: "", // 🚨 avoid leaking password
          }));
        }
      )
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch admins";
      })

      // Add Admin
      .addCase(addAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add admin";
      })

      // Update Admin
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.loading = false;
        const index = state.admins.findIndex(
          (admin) => admin.studentid === action.payload.studentid
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
            (admin) => admin.studentid !== action.payload
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
