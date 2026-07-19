import crypto from "node:crypto";

export const generateOtp = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashOtp = ({
  firebaseUid,
  otp,
}: {
  firebaseUid: string;
  otp: string;
}): string => {
  const secret = process.env.OTP_HASH_SECRET;
  if (!secret) {
    throw new Error("OTP_HASH_SECRET is not configured");
  }

  return crypto.createHmac("sha256", secret).update(`${firebaseUid}:${otp}`).digest("hex");
};
