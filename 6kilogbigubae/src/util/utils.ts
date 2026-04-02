import { AxiosError } from "axios";

export const extractError = (err: unknown): string => {
  const error = err as AxiosError<{ message?: string }>;
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unexpected error occurred"
  );
};
