// import { api } from "../api/api";
// import { Admin } from "../types";

// export default async function getAdmins() {
//   try {
//     const response = await api.get("/admin");
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error fetching admins: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error fetching admins:", error);
//     alert("Failed to fetch admins. Please try again later. " + message);
//   }
// }

// export async function getAdminById(id: string) {
//   try {
//     const response = await api.get(`/admin/${id}`);
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error fetching admin: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error fetching admin:", error);
//     alert("Failed to fetch admin. Please try again later. " + message);
//   }
// }

// export async function createAdmin(adminData: Admin) {
//   try {
//     const response = await api.post("/admin", adminData);
//     if (response.status === 201) {
//       return response.data;
//     } else {
//       throw new Error(`Error creating admin: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error creating admin:", error);
//     alert("Failed to create admin. Please try again later. " + message);
//   }
// }

// export async function updateAdmin(id: string, adminData: Partial<Admin>) {
//   try {
//     const response = await api.put(`/admin/${id}`, adminData);
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error updating admin: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error updating admin:", error);
//     alert("Failed to update admin. Please try again later. " + message);
//   }
// }

// export async function deleteAdmin(id: string) {
//   try {
//     const response = await api.delete(`/admin/${id}`);
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error deleting admin: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error deleting admin:", error);
//     alert("Failed to delete admin. Please try again later. " + message);
//   }
// }

// export async function deleteAllAdmins() {
//   try {
//     const response = await api.delete("/admin");
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error deleting all admins: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error deleting all admins:", error);
//     alert("Failed to delete all admins. Please try again later. " + message);
//   }
// }

// export async function loginAdmin(studentId: string, adminPassword: string) {
//   try {
//     const response = await api.post("/admin/login", {
//       studentId,
//       adminPassword,
//     });
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error logging in admin: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error logging in admin:", error);
//     alert("Failed to log in admin. Please try again later. " + message);
//   }
// }

// export async function logoutAdmin() {
//   try {
//     const response = await api.post("/admin/logout");
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error logging out admin: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error logging out admin:", error);
//     alert("Failed to log out admin. Please try again later. " + message);
//   }
// }

// export async function registerAdmin(adminData: Admin) {
//   try {
//     const response = await api.post("/admin/register", adminData);
//     if (response.status === 201) {
//       return response.data;
//     } else {
//       throw new Error(`Error registering admin: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error registering admin:", error);
//     alert("Failed to register admin. Please try again later. " + message);
//   }
// }
