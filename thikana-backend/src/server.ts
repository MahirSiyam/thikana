import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { connectDatabase } from "./config/db";
import { verifyMailConnection } from "./config/mailer";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import emailVerificationRoutes from "./routes/email-verification.routes";
import featuredReviewsRoutes from "./routes/featured-reviews.routes";
import listingRoutes from "./routes/listing.routes";
import messageRoutes from "./routes/message.routes";
import providerRoutes from "./routes/provider.routes";
import publicProviderRoutes from "./routes/public-provider.routes";
import supportRoutes from "./routes/support.routes";
import tenantRoutes from "./routes/tenant.routes";
import uploadRoutes from "./routes/upload.routes";
import { initSocketServer } from "./socket";

const app = express();

const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:3000,http://localhost:3001"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Thikana API is running" });
});

app.use("/api/auth/email-verification", emailVerificationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/providers", publicProviderRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/featured-reviews", featuredReviewsRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export { app };

const PORT = Number(process.env.PORT || 5000);

const start = async () => {
  await connectDatabase();
  await verifyMailConnection();

  const httpServer = createServer(app);
  initSocketServer(httpServer, allowedOrigins);

  httpServer.listen(PORT, () => {
    console.log(`Thikana backend listening on port ${PORT}`);
  });
};

if (process.env.NODE_ENV !== "test") {
  start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
