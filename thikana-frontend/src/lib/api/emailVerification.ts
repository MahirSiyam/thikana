import { auth } from "@/lib/firebase/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ApiResponse = {
  success: boolean;
  message: string;
  [key: string]: unknown;
};

async function authorizedFetch(path: string, options: RequestInit = {}): Promise<ApiResponse> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You are not signed in");
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

  const data = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

/** Ask the backend to generate and email a fresh 6-digit OTP to the signed-in Firebase user. */
export const sendEmailOtp = () =>
  authorizedFetch("/api/auth/email-verification/send-otp", { method: "POST" });

/** Submit the 6-digit OTP the user received by email for verification. */
export const verifyEmailOtp = (otp: string) =>
  authorizedFetch("/api/auth/email-verification/verify-otp", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
