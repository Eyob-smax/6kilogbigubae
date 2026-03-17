// src/api/api.ts
import axios, { AxiosRequestConfig } from "axios";
import { User } from "../types";

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
  request?: unknown;
  message?: string;
}

export interface IResponseObject {
  message?: string;
  success: boolean;
  user?: User & { userid: number };
}

const normalizeBaseURL = (url: string) => {
  const trimmedUrl = url.trim().replace(/\/+$/, "");
  return trimmedUrl.endsWith("/api") ? trimmedUrl : `${trimmedUrl}/api`;
};

const getBaseURL = () => {
  const env = import.meta.env as ImportMetaEnv & {
    BASE_API_URL?: string;
  };

  const envUrl = env.VITE_API_URL || env.BASE_API_URL;
  if (envUrl) {
    return normalizeBaseURL(envUrl);
  }

  if (import.meta.env.DEV) {
    return "http://localhost:6500/api"; //https://gbi-backend-h76f.vercel.app/api
  }

  return "http://localhost:6500/api"; //https://gbi-backend-h76f.vercel.app/api
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 20000,
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
  return config;
});

export const getRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.get<T>(url, config);
    return response.data;
  } catch (error) {
    handleRequestError(error as AxiosError);
    throw error;
  }
};

export const postRequest = async <IResponseObject, D>(
  url: string,
  data: D,
  config?: AxiosRequestConfig,
): Promise<IResponseObject> => {
  try {
    const response = await api.post<IResponseObject>(url, data, config);
    return response.data as IResponseObject;
  } catch (error) {
    handleRequestError(error as AxiosError);
    throw error;
  }
};

export const putRequest = async <T, D>(
  url: string,
  data: D,
  config?: AxiosRequestConfig,
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
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.delete<T>(url, config);
    return response.data;
  } catch (error) {
    handleRequestError(error as AxiosError);
    throw error;
  }
};
