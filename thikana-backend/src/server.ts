import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDatabase } from "./config/db";
import { verifyMailConnection } from "./config/mailer";
import emailVerificationRoutes from "./routes/email-verification.routes";

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Thikana API is running" });
});

app.use("/api/auth/email-verification", emailVerificationRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = Number(process.env.PORT || 5000);

const start = async () => {
  await connectDatabase();
  await verifyMailConnection();

  app.listen(PORT, () => {
    console.log(`Thikana backend listening on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
