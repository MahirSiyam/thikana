import mongoose from "mongoose";
import { firebaseAdminAuth } from "../config/firebase-admin";
import { OwnerProfile } from "../models/owner-profile.model";
import { ServiceProviderProfile } from "../models/service-provider-profile.model";
import { TenantProfile } from "../models/tenant-profile.model";
import { User, type UserDocument } from "../models/user.model";
import type { RegistrationInput } from "../validation/registration.validation";
import {
  safeSendEmail,
  sendRegistrationReceivedEmail,
} from "./email.service";
import { toSafeUser, type SafeUser } from "./user.service";

export class RegistrationError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const isTransactionUnsupported = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  const nested =
    error && typeof error === "object" && "errorResponse" in error
      ? String((error as { errorResponse?: { message?: string } }).errorResponse?.message || "")
      : "";
  const haystack = `${message}\n${nested}`;
  return (
    haystack.includes("Transaction numbers are only allowed") ||
    haystack.includes("replica set") ||
    haystack.includes("retryable writes") ||
    haystack.includes("transactions are not supported")
  );
};

const firebaseErrorCode = (error: unknown): string => {
  if (error && typeof error === "object" && "code" in error) {
    return String((error as { code?: string }).code || "");
  }
  return "";
};

const firebaseUserExists = async (firebaseUid: string): Promise<boolean> => {
  try {
    await firebaseAdminAuth.getUser(firebaseUid);
    return true;
  } catch (error) {
    if (firebaseErrorCode(error) === "auth/user-not-found") {
      return false;
    }
    throw error;
  }
};

const createProfileForRole = async (
  user: UserDocument,
  payload: RegistrationInput,
  session?: mongoose.ClientSession
) => {
  const options = session ? { session } : undefined;

  if (payload.role === "tenant") {
    await TenantProfile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        lookingAs: payload.profileData.lookingAs,
        preferredLocation: payload.profileData.preferredLocation,
        budgetRange: payload.profileData.budgetRange,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true, ...options }
    );
    return;
  }

  if (payload.role === "owner") {
    await OwnerProfile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        propertyCount: payload.profileData.propertyCount,
        preferredContactMethod: payload.profileData.preferredContactMethod,
        ownershipProof: payload.profileData.ownershipProof,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true, ...options }
    );
    return;
  }

  await ServiceProviderProfile.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      serviceCategory: payload.profileData.serviceCategory,
      yearsOfExperience: payload.profileData.yearsOfExperience,
      serviceAreas: payload.profileData.serviceAreas,
      tradeCertificate: payload.profileData.tradeCertificate,
      bio: payload.profileData.bio,
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true, ...options }
  );
};

const syncPendingRegistration = async (
  existing: UserDocument,
  input: {
    firebaseUid: string;
    email: string;
    emailVerified: boolean;
    payload: RegistrationInput;
  }
): Promise<UserDocument> => {
  applyRegistrationFields(existing, input);
  await existing.save();
  await replaceProfilesForRole(existing, input.payload);
  return existing;
};

const createUserDocument = async (
  input: {
    firebaseUid: string;
    email: string;
    emailVerified: boolean;
    payload: RegistrationInput;
  },
  session?: mongoose.ClientSession
) => {
  const options = session ? { session } : undefined;
  const [user] = await User.create(
    [
      {
        firebaseUid: input.firebaseUid,
        fullName: input.payload.commonData.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.payload.commonData.phone.trim(),
        role: input.payload.role,
        emailVerified: input.emailVerified,
        approvalStatus: "pending",
        accountStatus: "pending",
        address: input.payload.commonData.address,
        identityDocuments: input.payload.commonData.identityDocuments,
      },
    ],
    options
  );
  return user;
};

const cleanupPartialRegistration = async (userId: UserDocument["_id"]) => {
  await TenantProfile.deleteMany({ userId });
  await OwnerProfile.deleteMany({ userId });
  await ServiceProviderProfile.deleteMany({ userId });
  await User.deleteOne({ _id: userId });
};

const replaceProfilesForRole = async (
  user: UserDocument,
  payload: RegistrationInput
) => {
  await TenantProfile.deleteMany({ userId: user._id });
  await OwnerProfile.deleteMany({ userId: user._id });
  await ServiceProviderProfile.deleteMany({ userId: user._id });
  await createProfileForRole(user, payload);
};

const applyRegistrationFields = (
  user: UserDocument,
  input: {
    firebaseUid: string;
    email: string;
    emailVerified: boolean;
    payload: RegistrationInput;
  }
) => {
  user.firebaseUid = input.firebaseUid;
  user.fullName = input.payload.commonData.fullName.trim();
  user.email = input.email.trim().toLowerCase();
  user.phone = input.payload.commonData.phone.trim();
  user.role = input.payload.role;
  user.emailVerified = input.emailVerified;
  user.approvalStatus = "pending";
  user.accountStatus = "pending";
  user.address = input.payload.commonData.address;
  user.identityDocuments = input.payload.commonData.identityDocuments;
  user.approvedAt = undefined;
  user.approvedBy = undefined;
  user.rejectedAt = undefined;
  user.rejectedBy = undefined;
  user.rejectionReason = undefined;
  user.suspendedAt = undefined;
  user.suspendedBy = undefined;
  user.suspensionReason = undefined;
};

const reclaimOrphanedUser = async (
  existing: UserDocument,
  input: {
    firebaseUid: string;
    email: string;
    emailVerified: boolean;
    payload: RegistrationInput;
  }
): Promise<UserDocument> => {
  applyRegistrationFields(existing, input);
  await existing.save();
  await replaceProfilesForRole(existing, input.payload);
  return existing;
};

const registerWithoutTransaction = async (input: {
  firebaseUid: string;
  email: string;
  emailVerified: boolean;
  payload: RegistrationInput;
}): Promise<UserDocument> => {
  const user = await createUserDocument(input);
  try {
    await createProfileForRole(user, input.payload);
    return user;
  } catch (error) {
    await cleanupPartialRegistration(user._id);
    throw error;
  }
};

const assertPhoneAvailable = async (
  phone: string,
  exceptUserId?: UserDocument["_id"]
) => {
  const duplicatePhone = await User.findOne({ phone });
  if (!duplicatePhone) return;

  if (exceptUserId && String(duplicatePhone._id) === String(exceptUserId)) {
    return;
  }

  const phoneOwnerAlive = await firebaseUserExists(duplicatePhone.firebaseUid);
  if (!phoneOwnerAlive) {
    // Orphaned phone holder — remove so this registration can take the number.
    await cleanupPartialRegistration(duplicatePhone._id);
    return;
  }

  throw new RegistrationError(
    "An account with this phone number already exists",
    "DUPLICATE_PHONE",
    409
  );
};

export const registerUser = async (input: {
  firebaseUid: string;
  email: string;
  emailVerified: boolean;
  payload: RegistrationInput;
}): Promise<SafeUser> => {
  const existingByUid = await User.findOne({ firebaseUid: input.firebaseUid });
  if (existingByUid) {
    // Pending / incomplete accounts can resubmit so all owner fields persist.
    const canRefresh =
      existingByUid.approvalStatus === "pending" ||
      existingByUid.accountStatus === "pending" ||
      existingByUid.approvalStatus === "rejected";

    if (canRefresh) {
      const refreshed = await syncPendingRegistration(existingByUid, input);
      return toSafeUser(refreshed);
    }

    return toSafeUser(existingByUid);
  }

  const normalizedEmail = input.email.trim().toLowerCase();
  const phone = input.payload.commonData.phone.trim();

  const duplicateEmail = await User.findOne({ email: normalizedEmail });
  if (duplicateEmail) {
    // Same account won a concurrent register — treat as success / refresh pending.
    if (duplicateEmail.firebaseUid === input.firebaseUid) {
      const canRefresh =
        duplicateEmail.approvalStatus === "pending" ||
        duplicateEmail.accountStatus === "pending" ||
        duplicateEmail.approvalStatus === "rejected";
      if (canRefresh) {
        return toSafeUser(await syncPendingRegistration(duplicateEmail, input));
      }
      return toSafeUser(duplicateEmail);
    }

    const emailOwnerAlive = await firebaseUserExists(duplicateEmail.firebaseUid);
    if (emailOwnerAlive) {
      throw new RegistrationError(
        "An account with this email already exists",
        "DUPLICATE_EMAIL",
        409
      );
    }

    await assertPhoneAvailable(phone, duplicateEmail._id);
    const reclaimed = await reclaimOrphanedUser(duplicateEmail, input);

    await safeSendEmail("registrationReceived", () =>
      sendRegistrationReceivedEmail({
        email: reclaimed.email,
        name: reclaimed.fullName,
        role: input.payload.role,
      })
    );

    return toSafeUser(reclaimed);
  }

  await assertPhoneAvailable(phone);

  let createdUser: UserDocument | null = null;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      createdUser = await createUserDocument(input, session);
      await createProfileForRole(createdUser, input.payload, session);
    });
  } catch (error) {
    if (isTransactionUnsupported(error)) {
      try {
        createdUser = await registerWithoutTransaction(input);
      } catch (fallbackError) {
        const raced = await User.findOne({ firebaseUid: input.firebaseUid });
        if (raced) {
          return toSafeUser(raced);
        }
        throw fallbackError;
      }
    } else {
      const raced = await User.findOne({ firebaseUid: input.firebaseUid });
      if (raced) {
        return toSafeUser(raced);
      }
      throw error;
    }
  } finally {
    await session.endSession();
  }

  if (!createdUser) {
    throw new RegistrationError(
      "Could not complete registration",
      "REGISTRATION_FAILED",
      500
    );
  }

  const user = createdUser as UserDocument;

  await safeSendEmail("registrationReceived", () =>
    sendRegistrationReceivedEmail({
      email: user.email,
      name: user.fullName,
      role: input.payload.role,
    })
  );

  return toSafeUser(user);
};