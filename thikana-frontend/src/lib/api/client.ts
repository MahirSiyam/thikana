import { auth, adminAuth } from "@/lib/firebase/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AuthScope = "user" | "admin";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  code?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  [key: string]: unknown;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  payload?: ApiResponse;

  constructor(message: string, status: number, code?: string, payload?: ApiResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

function authForScope(scope: AuthScope) {
  return scope === "admin" ? adminAuth : auth;
}

export async function authorizedFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  scope: AuthScope = "user"
): Promise<ApiResponse<T>> {
  const currentUser = authForScope(scope).currentUser;
  if (!currentUser) {
    throw new ApiError("You are not signed in", 401, "UNAUTHENTICATED");
  }

  if (!API_URL) {
    throw new ApiError("API URL is not configured", 500, "API_URL_MISSING");
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      ...(options.headers ?? {}),
    },
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new ApiError(
      data.message || "Something went wrong",
      response.status,
      data.code,
      data
    );
  }

  return data;
}

/** Admin-only API calls — uses the separate admin Firebase session. */
export async function adminAuthorizedFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  return authorizedFetch<T>(path, options, "admin");
}

export async function publicFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  if (!API_URL) {
    throw new ApiError("API URL is not configured", 500, "API_URL_MISSING");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new ApiError(
      data.message || "Something went wrong",
      response.status,
      data.code,
      data
    );
  }

  return data;
}
