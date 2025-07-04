// import { api } from "../api/api";
// import { UniversityUser, User } from "../types";

// export async function getUsers() {
//   try {
//     const response = await api.get("/user");
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error fetching users: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error fetching users:", error);
//     alert("Failed to fetch users. Please try again later. " + message);
//   }
// }

// export async function getUsersById(id: string) {
//   try {
//     const response = await api.get(`/user/${id}`);
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error fetching user: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error fetching user:", error);
//     alert("Failed to fetch user. Please try again later. " + message);
//   }
// }

// export async function createUser(userData: User & UniversityUser) {
//   try {
//     const response = await api.post("/user", userData);
//     if (response.status === 201) {
//       return response.data;
//     } else {
//       throw new Error(`Error creating user: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error creating user:", error);
//     alert("Failed to create user. Please try again later. " + message);
//   }
// }

// export async function updateUser(
//   id: string,
//   userData: Partial<User & UniversityUser>
// ) {
//   try {
//     const response = await api.put(`/user/${id}`, userData);
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error updating user: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error updating user:", error);
//     alert("Failed to update user. Please try again later. " + message);
//   }
// }

// export default async function deleteUser(id: string) {
//   try {
//     const response = await api.delete(`/user/${id}`);
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error deleting user: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error deleting user:", error);
//     alert("Failed to delete user. Please try again later. " + message);
//   }
// }

// export async function deleteAllUsers() {
//   try {
//     const response = await api.delete("/user");
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(`Error deleting all users: ${response.statusText}`);
//     }
//   } catch (error) {
//     const { message } = error as Error;
//     console.error("Error deleting all users:", error);
//     alert("Failed to delete all users. Please try again later. " + message);
//   }
// }
