import { getRequest } from "../api/api";
import { UsersApiResponse } from "../types";

interface GetUsersParams {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  batch?: number;
  participation?: string;
}

export async function getUsers(
  params: GetUsersParams = {},
): Promise<UsersApiResponse> {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.append("page", String(params.page));
  if (params.limit !== undefined) query.append("limit", String(params.limit));
  if (params.q) query.append("q", params.q);
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params.batch !== undefined) query.append("batch", String(params.batch));
  if (params.participation) query.append("participation", params.participation);

  const url = "/user" + (query.toString() ? `?${query.toString()}` : "");
  return await getRequest<UsersApiResponse>(url);
}
