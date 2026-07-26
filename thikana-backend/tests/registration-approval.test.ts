import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/server";
import { firebaseAdminAuth } from "../src/config/firebase-admin";
import { User } from "../src/models/user.model";
import { OwnerProfile } from "../src/models/owner-profile.model";
import { TenantProfile } from "../src/models/tenant-profile.model";
import { AuditLog } from "../src/models/audit-log.model";
import { sendAccountApprovedEmail, sendRegistrationReceivedEmail } from "../src/services/email.service";

const mockedAuth = firebaseAdminAuth as unknown as {
  verifyIdToken: ReturnType<typeof vi.fn>;
  getUser: ReturnType<typeof vi.fn>;
};

const authAs = (uid: string, email: string, emailVerified = true) => {
  mockedAuth.verifyIdToken.mockResolvedValue({
    uid,
    email,
    name: "Test User",
  });
  mockedAuth.getUser.mockResolvedValue({
    uid,
    email,
    emailVerified,
  });
};

const tenantPayload = {
  role: "tenant",
  commonData: {
    fullName: "Karim Ahmed",
    phone: "01710000001",
    address: {
      division: "Dhaka",
      district: "Dhaka",
      area: "Dhanmondi",
    },
  },
  profileData: {
    lookingAs: "family",
    preferredLocation: "Dhanmondi",
    budgetRange: "BDT 15000-25000",
  },
};

describe("registration + approval + authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a tenant and defaults to pending", async () => {
    authAs("uid-tenant-1", "tenant1@example.com", true);

    const response = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send(tenantPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.role).toBe("tenant");
    expect(response.body.data.approvalStatus).toBe("pending");
    expect(response.body.data.accountStatus).toBe("pending");
    expect(response.body.data.canAccessDashboard).toBe(false);
    expect(sendRegistrationReceivedEmail).toHaveBeenCalled();

    const profile = await TenantProfile.findOne({
      userId: response.body.data.id,
    });
    expect(profile).toBeTruthy();
  });

  it("rejects admin role on public registration", async () => {
    authAs("uid-admin-attempt", "adminattempt@example.com", true);

    const response = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        role: "admin",
      });

    expect(response.status).toBe(403);
    expect(response.body.code).toBe("INVALID_ROLE");
  });

  it("rejects duplicate email registration", async () => {
    authAs("uid-tenant-2", "dup@example.com", true);
    await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        commonData: { ...tenantPayload.commonData, phone: "01710000002" },
      });

    authAs("uid-tenant-3", "dup@example.com", true);
    mockedAuth.getUser.mockImplementation(async (uid: string) => {
      if (uid === "uid-tenant-2") {
        return { uid, email: "dup@example.com", emailVerified: true };
      }
      return { uid, email: "dup@example.com", emailVerified: true };
    });

    const response = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        commonData: { ...tenantPayload.commonData, phone: "01710000003" },
      });

    expect(response.status).toBe(409);
    expect(response.body.code).toBe("DUPLICATE_EMAIL");
  });

  it("is idempotent when the same firebase user registers twice", async () => {
    authAs("uid-tenant-idem", "idem@example.com", true);

    const first = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        commonData: { ...tenantPayload.commonData, phone: "01710000021" },
      });

    const second = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        commonData: { ...tenantPayload.commonData, phone: "01710000021" },
      });

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(second.body.data.id).toBe(first.body.data.id);
    expect(await User.countDocuments({ email: "idem@example.com" })).toBe(1);
  });

  it("stores full owner registration data including media asset refs", async () => {
    authAs("uid-owner-full", "ownerfull@example.com", true);

    const ownershipProof = {
      publicId: "thikana/owner/ownership-proof/deed-1.jpg",
      resourceType: "image" as const,
      format: "jpg",
      bytes: 120_000,
      secureUrl: "https://cdn.test/thikana/owner/ownership-proof/deed-1.jpg",
      uploadedAt: new Date().toISOString(),
    };

    const identityDocuments = {
      nidFront: {
        publicId: "thikana/identity/nid-front/test.jpg",
        resourceType: "image" as const,
        secureUrl: "https://cdn.test/thikana/identity/nid-front/test.jpg",
      },
      nidBack: {
        publicId: "thikana/identity/nid-back/test.jpg",
        resourceType: "image" as const,
        secureUrl: "https://cdn.test/thikana/identity/nid-back/test.jpg",
      },
      selfie: {
        publicId: "thikana/identity/selfie/test.jpg",
        resourceType: "image" as const,
        secureUrl: "https://cdn.test/thikana/identity/selfie/test.jpg",
      },
    };

    const response = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        role: "owner",
        commonData: {
          fullName: "Owner Full",
          phone: "01710000031",
          address: {
            division: "Dhaka",
            district: "Dhaka",
            area: "Gulshan",
          },
          identityDocuments,
        },
        profileData: {
          propertyCount: "3",
          preferredContactMethod: "whatsapp",
          ownershipProof,
        },
      });

    expect(response.status).toBe(201);

    const user = await User.findById(response.body.data.id).lean();
    expect(user?.role).toBe("owner");
    expect(user?.fullName).toBe("Owner Full");
    expect(user?.phone).toBe("01710000031");
    expect(user?.address).toMatchObject({
      division: "Dhaka",
      district: "Dhaka",
      area: "Gulshan",
    });
    expect(user?.identityDocuments?.nidFront?.publicId).toBe(
      identityDocuments.nidFront.publicId
    );
    expect(user?.identityDocuments?.nidFront?.secureUrl).toBe(
      identityDocuments.nidFront.secureUrl
    );
    expect(user?.identityDocuments?.selfie?.publicId).toBe(
      identityDocuments.selfie.publicId
    );

    const profile = await OwnerProfile.findOne({ userId: user?._id }).lean();
    expect(profile?.propertyCount).toBe("3");
    expect(profile?.preferredContactMethod).toBe("whatsapp");
    expect(profile?.ownershipProof?.publicId).toBe(ownershipProof.publicId);
    expect(profile?.ownershipProof?.secureUrl).toBe(ownershipProof.secureUrl);

    // Pending resubmit should overwrite owner profile fields.
    const updatedProof = {
      ...ownershipProof,
      publicId: "thikana/owner/ownership-proof/deed-2.jpg",
      secureUrl: "https://cdn.test/thikana/owner/ownership-proof/deed-2.jpg",
    };
    const second = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        role: "owner",
        commonData: {
          fullName: "Owner Full Updated",
          phone: "01710000031",
          address: {
            division: "Dhaka",
            district: "Dhaka",
            area: "Banani",
          },
          identityDocuments,
        },
        profileData: {
          propertyCount: "5",
          preferredContactMethod: "phone",
          ownershipProof: updatedProof,
        },
      });

    expect(second.status).toBe(201);
    expect(second.body.data.id).toBe(response.body.data.id);

    const refreshedUser = await User.findById(response.body.data.id).lean();
    expect(refreshedUser?.fullName).toBe("Owner Full Updated");
    expect(refreshedUser?.address?.area).toBe("Banani");

    const refreshedProfile = await OwnerProfile.findOne({
      userId: response.body.data.id,
    }).lean();
    expect(refreshedProfile?.propertyCount).toBe("5");
    expect(refreshedProfile?.preferredContactMethod).toBe("phone");
    expect(refreshedProfile?.ownershipProof?.publicId).toBe(updatedProof.publicId);
    expect(refreshedProfile?.ownershipProof?.secureUrl).toBe(updatedProof.secureUrl);
  });

  it("reclaims an orphaned mongo user when the old firebase account is gone", async () => {
    authAs("uid-orphan-old", "orphan@example.com", true);
    const first = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        role: "owner",
        commonData: { ...tenantPayload.commonData, phone: "01710000022" },
        profileData: {
          propertyCount: "2",
          preferredContactMethod: "phone",
        },
      });
    expect(first.status).toBe(201);

    authAs("uid-orphan-new", "orphan@example.com", true);
    mockedAuth.getUser.mockImplementation(async (uid: string) => {
      if (uid === "uid-orphan-old") {
        const error = new Error("Firebase user not found") as Error & {
          code?: string;
        };
        error.code = "auth/user-not-found";
        throw error;
      }
      return { uid, email: "orphan@example.com", emailVerified: true };
    });

    const second = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        role: "owner",
        commonData: { ...tenantPayload.commonData, phone: "01710000022" },
        profileData: {
          propertyCount: "4",
          preferredContactMethod: "whatsapp",
        },
      });

    expect(second.status).toBe(201);
    expect(second.body.data.id).toBe(first.body.data.id);
    expect(second.body.data.firebaseUid).toBe("uid-orphan-new");
    expect(await User.countDocuments({ email: "orphan@example.com" })).toBe(1);
  });

  it("rejects invalid role-specific data", async () => {
    authAs("uid-sp-1", "sp1@example.com", true);

    const response = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        role: "service_provider",
        commonData: {
          fullName: "Rafiq",
          phone: "01710000004",
        },
        profileData: {
          serviceCategory: "not-a-real-category",
        },
      });

    expect(response.status).toBe(422);
    expect(response.body.code).toBe("VALIDATION_FAILED");
  });

  it("lets admin approve a pending user and creates an audit log", async () => {
    authAs("uid-tenant-4", "tenant4@example.com", true);
    const created = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        commonData: { ...tenantPayload.commonData, phone: "01710000005" },
      });

    const admin = await User.create({
      firebaseUid: "uid-admin-1",
      fullName: "Site Admin",
      email: "admin@example.com",
      phone: "01719999999",
      role: "admin",
      emailVerified: true,
      approvalStatus: "approved",
      accountStatus: "active",
    });

    authAs(admin.firebaseUid, admin.email, true);
    const approved = await request(app)
      .patch(`/api/admin/users/${created.body.data.id}/approve`)
      .set("Authorization", "Bearer admin-token")
      .send({ note: "Looks good" });

    expect(approved.status).toBe(200);
    expect(approved.body.data.approvalStatus).toBe("approved");
    expect(approved.body.data.accountStatus).toBe("active");
    expect(approved.body.data.canAccessDashboard).toBe(true);
    expect(sendAccountApprovedEmail).toHaveBeenCalled();

    const logs = await AuditLog.find({ action: "USER_APPROVED" });
    expect(logs).toHaveLength(1);
  });

  it("blocks non-admin from approving users", async () => {
    authAs("uid-tenant-5", "tenant5@example.com", true);
    const created = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        commonData: { ...tenantPayload.commonData, phone: "01710000006" },
      });

    authAs("uid-tenant-5", "tenant5@example.com", true);
    // loadUser will find the tenant; requireAdmin should fail
    // but the tenant must exist in DB first — already registered above
    const response = await request(app)
      .patch(`/api/admin/users/${created.body.data.id}/approve`)
      .set("Authorization", "Bearer tenant-token")
      .send({});

    expect(response.status).toBe(403);
    expect(response.body.code).toBe("ROLE_ACCESS_DENIED");
  });

  it("returns normalized /me state and registrationComplete", async () => {
    authAs("uid-tenant-6", "tenant6@example.com", false);

    const incomplete = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer test-token");

    expect(incomplete.status).toBe(200);
    expect(incomplete.body.data.registrationComplete).toBe(false);
    expect(incomplete.body.data.canAccessDashboard).toBe(false);

    await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        commonData: { ...tenantPayload.commonData, phone: "01710000007" },
      });

    mockedAuth.getUser.mockResolvedValue({
      uid: "uid-tenant-6",
      email: "tenant6@example.com",
      emailVerified: true,
    });

    const complete = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer test-token");

    expect(complete.body.data.registrationComplete).toBe(true);
    expect(complete.body.data.emailVerified).toBe(true);
    expect(complete.body.data.approvalStatus).toBe("pending");
    expect(complete.body.data.canAccessDashboard).toBe(false);
  });

  it("is idempotent on repeated approval", async () => {
    authAs("uid-tenant-7", "tenant7@example.com", true);
    const created = await request(app)
      .post("/api/auth/register")
      .set("Authorization", "Bearer test-token")
      .send({
        ...tenantPayload,
        commonData: { ...tenantPayload.commonData, phone: "01710000008" },
      });

    await User.create({
      firebaseUid: "uid-admin-2",
      fullName: "Admin Two",
      email: "admin2@example.com",
      phone: "01718888888",
      role: "admin",
      emailVerified: true,
      approvalStatus: "approved",
      accountStatus: "active",
    });

    authAs("uid-admin-2", "admin2@example.com", true);
    await request(app)
      .patch(`/api/admin/users/${created.body.data.id}/approve`)
      .set("Authorization", "Bearer admin-token")
      .send({});

    const second = await request(app)
      .patch(`/api/admin/users/${created.body.data.id}/approve`)
      .set("Authorization", "Bearer admin-token")
      .send({});

    expect(second.status).toBe(200);
    expect(second.body.data.approvalStatus).toBe("approved");

    const logs = await AuditLog.find({
      targetUserId: created.body.data.id,
      action: "USER_APPROVED",
    });
    expect(logs).toHaveLength(1);
  });
});
