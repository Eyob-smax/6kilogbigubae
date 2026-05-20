import { useEffect, useState } from "react";
import { UsersApiResponse } from "../types";
import { getUsers } from "./userApi";

export interface UseUsersParams {
  page: number;
  limit: number;
  q: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | undefined;
  batch: number | null;
  participation: string | null;
  gender: string | null;
  sponsorshiptype: string | null;
  cafeteriaaccess: boolean | null;
  tookcourse: boolean | null;
  departmentname: string | null;
  clergicalstatus: string | null;
}

interface UseUsersReturn {
  data: UsersApiResponse | null;
  isLoading: boolean;
  isError: boolean;
}

export default function useUsers(params: UseUsersParams): UseUsersReturn {
  const [data, setData] = useState<UsersApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);

    getUsers({
      page: params.page,
      limit: params.limit,
      q: params.q,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      batch: params.batch ?? undefined,
      participation: params.participation ?? undefined,
      gender: params.gender ?? undefined,
      sponsorshiptype: params.sponsorshiptype ?? undefined,
      cafeteriaaccess: params.cafeteriaaccess ?? undefined,
      tookcourse: params.tookcourse ?? undefined,
      departmentname: params.departmentname ?? undefined,
      clergicalstatus: params.clergicalstatus ?? undefined,
    })
      .then((res) => {
        if (!cancelled) {
          setData(res);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    params.page,
    params.limit,
    params.q,
    params.sortBy,
    params.sortOrder,
    params.batch,
    params.participation,
    params.gender,
    params.sponsorshiptype,
    params.cafeteriaaccess,
    params.tookcourse,
    params.departmentname,
    params.clergicalstatus,
  ]);

  return { data, isLoading, isError };
}
