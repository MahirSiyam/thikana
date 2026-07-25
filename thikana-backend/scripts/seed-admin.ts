import "dotenv/config";
import { connectDatabase } from "../src/config/db";
import { firebaseAdminAuth } from "../src/config/firebase-admin";
import { User } from "../src/models/user.model";

const email = (process.argv[2] || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.argv[3] || process.env.ADMIN_PASSWORD || "";

if (!email || !password) {
  console.error(
    "Usage: npm run seed:admin\n" +
      "  (reads ADMIN_EMAIL and ADMIN_PASSWORD from .env)\n" +
      "Or: npm run seed:admin -- email@example.com yourPassword"
  );
  process.exit(1);
}

const run = async () => {
  await connectDatabase();

  let firebaseUser;
  try {
    firebaseUser = await firebaseAdminAuth.getUserByEmail(email);
    await firebaseAdminAuth.updateUser(firebaseUser.uid, {
      password,
      emailVerified: true,
      displayName: firebaseUser.displayName || "Thikana Admin",
    });
    console.log(`Updated existing Firebase user: ${email}`);
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: string }).code)
        : "";
    if (code !== "auth/user-not-found") {
      throw error;
    }

    firebaseUser = await firebaseAdminAuth.createUser({
      email,
      password,
      emailVerified: true,
      displayName: "Thikana Admin",
    });
    console.log(`Created Firebase user: ${email}`);
  }

  const existing = await User.findOne({
    $or: [{ email }, { firebaseUid: firebaseUser.uid }],
  });

  if (existing) {
    existing.firebaseUid = firebaseUser.uid;
    existing.fullName = existing.fullName || "Thikana Admin";
    existing.email = email;
    existing.role = "admin";
    existing.emailVerified = true;
    existing.approvalStatus = "approved";
    existing.accountStatus = "active";
    existing.approvedAt = existing.approvedAt || new Date();
    if (!existing.phone) {
      existing.phone = `admin-${firebaseUser.uid.slice(0, 8)}`;
    }
    await existing.save();
    console.log(`Promoted Mongo user to admin (id=${existing._id})`);
  } else {
    const created = await User.create({
      firebaseUid: firebaseUser.uid,
      fullName: "Thikana Admin",
      email,
      phone: `admin-${firebaseUser.uid.slice(0, 8)}`,
      role: "admin",
      emailVerified: true,
      approvalStatus: "approved",
      accountStatus: "active",
      approvedAt: new Date(),
    });
    console.log(`Created Mongo admin user (id=${created._id})`);
  }

  console.log("Admin ready. Sign in at /admin/signin");
  console.log(`Email: ${email}`);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
