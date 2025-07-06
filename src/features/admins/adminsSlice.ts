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
// assuming you have this

interface AsyncThunkConfig {
  rejectValue: string;
}

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
  Admin | undefined,
  Partial<Admin>,
  AsyncThunkConfig
>("admin/addAdmin", async (adminData, { rejectWithValue, dispatch }) => {
  try {
    const res = await postRequest<
      { success: boolean; message: string; admin?: Admin },
      Partial<Admin>
    >("/admin/register", adminData);

    if (res.success) {
      dispatch(fetchAdmins());
      return;
    }

    return rejectWithValue(res.message || "Failed to add admin");
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const updateAdmin = createAsyncThunk<
  Admin,
  { id: string; adminData: Partial<Admin> },
  { rejectValue: string }
>(
  "admin/updateAdmin",
  async ({ id, adminData }, { rejectWithValue, dispatch }) => {
    try {
      console.log("Updating admin with ID:", id, "Data:", adminData);
      const res = await putRequest<
        { success: boolean; message?: string; updatedAdmin?: Admin },
        Partial<Admin>
      >(`/admin/${id}`, adminData);

      if (res.success && res.updatedAdmin) {
        dispatch(fetchAdmins());
        return res.updatedAdmin;
      }

      return rejectWithValue(res.message || "Can't edit an admin");
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

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
            adminpassword: "",
          }));
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
      .addCase(addAdmin.fulfilled, (state) => {
        state.loading = false;

        (async () => {
          Swal.fire({
            icon: "success",
            title: "Operation Successful",
            text: "Admin added successfully",
          });
        })();
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add admin";

        (async () => {
          Swal.fire({
            icon: "error",
            title: "Operation Failed",
            text: state.error || "Failed to add admin",
          });
        })();
      })
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

        (async () => {
          Swal.fire({
            icon: "success",
            title: "Operation Successful",
            text: "Admin updated successfully",
          });
        })();
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update admin";

        (async () => {
          Swal.fire({
            icon: "error",
            title: "Operation Failed",
            text: state.error || "Failed to update admin",
          });
        })();
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

          (async () => {
            Swal.fire({
              icon: "success",
              title: "Operation Successful",
              text: "Admin deleted successfully",
            });
          })();
        }
      )
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete admin";
        (async () => {
          Swal.fire({
            icon: "error",
            title: "Operation Failed",
            text: state.error || "Failed to delete admin",
          });
        })();
      });
  },
});

export default adminSlice.reducer;
