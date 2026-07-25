import { afterAll, afterEach, beforeAll, vi } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

vi.mock("../src/config/firebase-admin", () => ({
  firebaseAdminAuth: {
    verifyIdToken: vi.fn(),
    getUser: vi.fn(),
    updateUser: vi.fn(),
  },
}));

vi.mock("../src/services/email.service", async () => {
  const actual = await vi.importActual<typeof import("../src/services/email.service")>(
    "../src/services/email.service"
  );
  return {
    ...actual,
    sendOtpEmail: vi.fn().mockResolvedValue(undefined),
    sendRegistrationReceivedEmail: vi.fn().mockResolvedValue(undefined),
    sendAccountApprovedEmail: vi.fn().mockResolvedValue(undefined),
    sendAccountRejectedEmail: vi.fn().mockResolvedValue(undefined),
    sendAccountSuspendedEmail: vi.fn().mockResolvedValue(undefined),
    sendAccountReactivatedEmail: vi.fn().mockResolvedValue(undefined),
    safeSendEmail: vi.fn(async (_label: string, send: () => Promise<void>) => {
      await send();
    }),
  };
});

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.OTP_HASH_SECRET = "test-otp-secret";
  process.env.FRONTEND_URL = "http://localhost:3000";
  process.env.APPROVAL_REQUIRES_EMAIL_VERIFIED = "true";

  mongo = await MongoMemoryServer.create();
  await mongoose.connect(`${mongo.getUri()}?retryWrites=false`);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
  vi.clearAllMocks();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
