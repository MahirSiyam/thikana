import { OwnerProfile } from "../models/owner-profile.model";
import { ServiceProviderProfile } from "../models/service-provider-profile.model";
import { TenantProfile } from "../models/tenant-profile.model";
import type { UserDocument } from "../models/user.model";
import { User } from "../models/user.model";
import type { UpdateProfileInput } from "../validation/profile.validation";
import {
  getSignedAssetUrl,
  isCloudinaryConfigured,
} from "./cloudinary.service";
import { toSafeUser } from "./user.service";

export class ProfileError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ProfileError";
    this.code = code;
    this.status = status;
  }
}

type AssetLike = {
  publicId?: string;
  resourceType?: "image" | "raw";
  secureUrl?: string;
} | null | undefined;

const signedUrl = (asset: AssetLike): string | null => {
  if (!asset?.publicId) return null;
  if (asset.secureUrl) return asset.secureUrl;
  if (!isCloudinaryConfigured()) return null;
  try {
    return getSignedAssetUrl({
      publicId: asset.publicId,
      resourceType: asset.resourceType || "image",
      expiresInSeconds: 60 * 60,
    });
  } catch {
    return null;
  }
};

const formatMemberSince = (date?: Date | null) => {
  if (!date) return "Recently";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatLocation = (address?: UserDocument["address"]) => {
  const parts = [address?.area, address?.district, address?.division].filter(
    Boolean
  );
  return parts.length ? parts.join(", ") : "Bangladesh";
};

export const getFullProfile = async (user: UserDocument) => {
  const base = toSafeUser(user);
  const nidFront = user.identityDocuments?.nidFront as AssetLike;
  const nidBack = user.identityDocuments?.nidBack as AssetLike;
  const selfie = user.identityDocuments?.selfie as AssetLike;

  const nidVerified = Boolean(nidFront?.publicId && nidBack?.publicId);
  const faceVerified = Boolean(selfie?.publicId);

  let ownershipVerified = false;
  let ownerExtras: {
    propertyCount?: string | null;
    preferredContactMethod?: string | null;
    ownershipProofUrl?: string | null;
  } | null = null;

  let tenantExtras: Record<string, unknown> | null = null;
  let providerExtras: Record<string, unknown> | null = null;

  if (user.role === "owner") {
    const profile = await OwnerProfile.findOne({ userId: user._id });
    ownershipVerified = Boolean(profile?.ownershipProof?.publicId);
    ownerExtras = {
      propertyCount: profile?.propertyCount ?? null,
      preferredContactMethod: profile?.preferredContactMethod ?? null,
      ownershipProofUrl: signedUrl(profile?.ownershipProof as AssetLike),
    };
  } else if (user.role === "tenant") {
    const profile = await TenantProfile.findOne({ userId: user._id }).lean();
    tenantExtras = profile
      ? {
          lookingAs: profile.lookingAs ?? null,
          preferredLocation: profile.preferredLocation ?? null,
          budgetRange: profile.budgetRange ?? null,
        }
      : null;
  } else if (user.role === "service_provider") {
    const profile = await ServiceProviderProfile.findOne({
      userId: user._id,
    }).lean();
    providerExtras = profile
      ? {
          serviceCategory: profile.serviceCategory ?? null,
          yearsOfExperience: profile.yearsOfExperience ?? null,
          serviceAreas: profile.serviceAreas ?? [],
          bio: profile.bio ?? null,
          tradeCertificateUrl: signedUrl(
            profile.tradeCertificate as AssetLike
          ),
          pricingItems: (profile.pricingItems ?? []).map(
            (item: { _id?: unknown; name: string; priceBdt: number }) => ({
              id: String(item._id ?? item.name),
              name: item.name,
              priceBdt: item.priceBdt,
            })
          ),
          availabilityDays: profile.availabilityDays ?? [],
          workingHours: {
            start: profile.workingHours?.start || "09:00",
            end: profile.workingHours?.end || "18:00",
          },
        }
      : null;
  }

  const verificationItems = [
    { id: "nid", label: "NID Verified", verified: nidVerified },
    ...(user.role === "owner"
      ? [
          {
            id: "ownership",
            label: "Ownership Proof",
            verified: ownershipVerified,
          },
        ]
      : []),
    { id: "face", label: "Face Verified", verified: faceVerified },
  ];

  const allVerified =
    nidVerified &&
    faceVerified &&
    (user.role !== "owner" || ownershipVerified) &&
    user.approvalStatus === "approved";

  return {
    ...base,
    location: formatLocation(user.address),
    memberSince: formatMemberSince(user.createdAt),
    verificationItems,
    allVerified,
    owner: ownerExtras,
    tenant: tenantExtras,
    serviceProvider: providerExtras,
  };
};

export const updateProfile = async (
  user: UserDocument,
  input: UpdateProfileInput
) => {
  if (input.fullName !== undefined) {
    user.fullName = input.fullName;
  }
  if (input.phone !== undefined) {
    if (input.phone) {
      const clash = await User.findOne({
        phone: input.phone,
        _id: { $ne: user._id },
      }).select("_id");
      if (clash) {
        throw new ProfileError(
          "This phone number is already in use",
          "PHONE_IN_USE",
          409
        );
      }
    }
    user.phone = input.phone || undefined;
  }
  if (input.address !== undefined) {
    user.address = {
      division: input.address.division || user.address?.division || "",
      district: input.address.district || user.address?.district || "",
      area: input.address.area || user.address?.area || "",
    };
  }
  if (input.profileImage !== undefined) {
    if (input.profileImage === null) {
      user.profileImage = undefined;
    } else {
      user.profileImage = {
        publicId: input.profileImage.publicId,
        resourceType: input.profileImage.resourceType || "image",
        format: input.profileImage.format,
        bytes: input.profileImage.bytes,
        uploadedAt: input.profileImage.uploadedAt || new Date(),
        secureUrl: input.profileImage.secureUrl,
      };
    }
  }

  await user.save();

  if (user.role === "owner") {
    const ownerProfile = await OwnerProfile.findOne({ userId: user._id });
    if (ownerProfile) {
      if (input.preferredContactMethod !== undefined) {
        ownerProfile.preferredContactMethod = input.preferredContactMethod;
      }
      if (input.propertyCount !== undefined) {
        ownerProfile.propertyCount = input.propertyCount;
      }
      await ownerProfile.save();
    }
  }

  if (user.role === "tenant") {
    const tenantProfile =
      (await TenantProfile.findOne({ userId: user._id })) ||
      (await TenantProfile.create({ userId: user._id }));
    if (input.lookingAs !== undefined) {
      tenantProfile.lookingAs = input.lookingAs || undefined;
    }
    if (input.preferredLocation !== undefined) {
      tenantProfile.preferredLocation = input.preferredLocation || undefined;
    }
    if (input.budgetRange !== undefined) {
      tenantProfile.budgetRange = input.budgetRange || undefined;
    }
    await tenantProfile.save();
  }

  if (user.role === "service_provider") {
    const providerProfile = await ServiceProviderProfile.findOne({
      userId: user._id,
    });
    if (providerProfile) {
      if (input.serviceCategory !== undefined) {
        providerProfile.serviceCategory = input.serviceCategory;
      }
      if (input.yearsOfExperience !== undefined) {
        providerProfile.yearsOfExperience = input.yearsOfExperience;
      }
      if (input.serviceAreas !== undefined) {
        providerProfile.serviceAreas = input.serviceAreas;
      }
      if (input.bio !== undefined) {
        providerProfile.bio = input.bio;
      }
      if (input.pricingItems !== undefined) {
        providerProfile.pricingItems = input.pricingItems as never;
      }
      if (input.availabilityDays !== undefined) {
        providerProfile.availabilityDays = input.availabilityDays as never;
      }
      if (input.workingHours !== undefined) {
        providerProfile.workingHours = input.workingHours as never;
      }
      await providerProfile.save();
    }
  }

  return getFullProfile(user);
};

export const deactivateAccount = async (user: UserDocument) => {
  if (user.role === "admin") {
    throw new ProfileError(
      "Admin accounts cannot be deactivated here",
      "FORBIDDEN",
      403
    );
  }
  user.accountStatus = "disabled";
  user.suspensionReason = "Self-deactivated by user";
  user.suspendedAt = new Date();
  await user.save();
  return getFullProfile(user);
};
