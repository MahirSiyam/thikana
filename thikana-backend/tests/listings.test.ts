import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/server";
import { firebaseAdminAuth } from "../src/config/firebase-admin";
import { User } from "../src/models/user.model";
import { Listing } from "../src/models/listing.model";

const mockedAuth = firebaseAdminAuth as unknown as {
  verifyIdToken: ReturnType<typeof vi.fn>;
  getUser: ReturnType<typeof vi.fn>;
};

const authAs = (uid: string, email: string, emailVerified = true) => {
  mockedAuth.verifyIdToken.mockResolvedValue({
    uid,
    email,
    name: "Owner User",
  });
  mockedAuth.getUser.mockResolvedValue({
    uid,
    email,
    emailVerified,
  });
};

const listingPayload = {
  title: "Cozy 2BR in Dhanmondi",
  propertyType: "Apartment",
  address: {
    division: "Dhaka",
    district: "Dhaka",
    area: "Dhanmondi",
  },
  sizeSqft: 750,
  beds: 2,
  baths: 1,
  monthlyRent: 18000,
  whoCanRent: ["Family"],
};

describe("listings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lets an approved owner create and list a draft, then admin can approve it for public browse", async () => {
    const owner = await User.create({
      firebaseUid: "uid-owner-listing",
      fullName: "Owner Test",
      email: "owner-listing@example.com",
      phone: "01719990001",
      role: "owner",
      emailVerified: true,
      approvalStatus: "approved",
      accountStatus: "active",
      approvedAt: new Date(),
    });

    const admin = await User.create({
      firebaseUid: "uid-admin-listing",
      fullName: "Admin Test",
      email: "admin-listing@example.com",
      phone: "01719990002",
      role: "admin",
      emailVerified: true,
      approvalStatus: "approved",
      accountStatus: "active",
      approvedAt: new Date(),
    });

    authAs(owner.firebaseUid, owner.email, true);
    const created = await request(app)
      .post("/api/listings/mine")
      .set("Authorization", "Bearer test-token")
      .send({ ...listingPayload, submitForReview: true });

    expect(created.status).toBe(201);
    expect(created.body.data.status).toBe("under_review");
    const listingId = created.body.data.id as string;

    const mine = await request(app)
      .get("/api/listings/mine")
      .set("Authorization", "Bearer test-token");
    expect(mine.status).toBe(200);
    expect(mine.body.data).toHaveLength(1);

    const publicBefore = await request(app).get("/api/listings/public");
    expect(publicBefore.status).toBe(200);
    expect(publicBefore.body.data).toHaveLength(0);

    authAs(admin.firebaseUid, admin.email, true);
    const approved = await request(app)
      .patch(`/api/admin/listings/${listingId}/approve`)
      .set("Authorization", "Bearer test-token")
      .send({});
    expect(approved.status).toBe(200);
    expect(approved.body.data.status).toBe("live");

    const publicAfter = await request(app).get("/api/listings/public");
    expect(publicAfter.status).toBe(200);
    expect(publicAfter.body.data).toHaveLength(1);
    expect(publicAfter.body.data[0].title).toBe(listingPayload.title);

    expect(await Listing.countDocuments({ ownerId: owner._id })).toBe(1);
  });

  it("blocks non-owners from creating listings", async () => {
    await User.create({
      firebaseUid: "uid-tenant-listing",
      fullName: "Tenant Test",
      email: "tenant-listing@example.com",
      phone: "01719990003",
      role: "tenant",
      emailVerified: true,
      approvalStatus: "approved",
      accountStatus: "active",
      approvedAt: new Date(),
    });

    authAs("uid-tenant-listing", "tenant-listing@example.com", true);
    const response = await request(app)
      .post("/api/listings/mine")
      .set("Authorization", "Bearer test-token")
      .send(listingPayload);

    expect(response.status).toBe(403);
  });
});
