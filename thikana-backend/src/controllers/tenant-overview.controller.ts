import type { Request, Response } from "express";
import { listPublicListings } from "../services/listing.service";
import { getFullProfile } from "../services/profile.service";
import { countSavedHomes } from "../services/saved-home.service";
import {
  countTenantBookingsByStatus,
  getTenantBookingUsage,
  listTenantBookings,
} from "../services/booking.service";

const profileCompletionPercent = (profile: Awaited<ReturnType<typeof getFullProfile>>) => {
  const checks = [
    Boolean(profile.fullName),
    Boolean(profile.phone),
    Boolean(profile.email),
    Boolean(profile.address?.area || profile.address?.district),
    Boolean(profile.tenant?.lookingAs || profile.tenant?.preferredLocation),
    Boolean(profile.verificationItems?.some((item) => item.verified)),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
};

export const getTenantOverview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const tenantId = String(req.user._id);
    const [profile, savedCount, bookingCounts, usage, recentBookings, recommended] =
      await Promise.all([
        getFullProfile(req.user),
        countSavedHomes(tenantId),
        countTenantBookingsByStatus(tenantId),
        getTenantBookingUsage(tenantId),
        listTenantBookings({
          tenantId,
          query: { status: "all", page: 1, limit: 5 },
        }),
        listPublicListings({
          page: 1,
          limit: 4,
          sortBy: "approvedAt",
          sortOrder: "desc",
        }),
      ]);

    return res.status(200).json({
      success: true,
      message: "OK",
      data: {
        greetingName: (profile.fullName || "there").split(" ")[0],
        avatarUrl: profile.avatarUrl || null,
        stats: {
          savedHomes: savedCount,
          activeBookings: bookingCounts.active,
          pendingBookings: bookingCounts.pending,
          profileScore: profileCompletionPercent(profile),
        },
        bookingUsage: usage,
        recentBookings: recentBookings.items,
        recommendedHomes: recommended.items,
      },
    });
  } catch (error) {
    console.error("getTenantOverview error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load tenant overview",
    });
  }
};
