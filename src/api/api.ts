// src/api/api.ts
import axios, { AxiosRequestConfig } from "axios";

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
  request?: unknown;
  message?: string;
}

export const api = axios.create({
  baseURL: import.meta.env.BASE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleRequestError = (error: AxiosError) => {
  if (error.response) {
    throw new Error(error.response.data?.message || "Request failed");
  } else if (error.request) {
    throw new Error("Network error - no response received");
  } else {
    throw new Error("Request setup error");
  }
};

api.interceptors.request.use((config) => {
  console.log(config);
  return config;
});

export const getRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.get<T>(url, config);
    return response.data;
  } catch (error) {
    handleRequestError(error as AxiosError);
    throw error;
  }
};

export const postRequest = async <T, D>(
  url: string,
  data: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleRequestError(error as AxiosError);
    throw error;
  }
};

export const putRequest = async <T, D>(
  url: string,
  data: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleRequestError(error as AxiosError);
    throw error;
  }
};

export const deleteRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.delete<T>(url, config);
    return response.data;
  } catch (error) {
    handleRequestError(error as AxiosError);
    throw error;
  }
};
