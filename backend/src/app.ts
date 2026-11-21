import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import batchRoutes from "./routes/batch.route";
import approvalRoutes from "./routes/approval.route";
import certificateRoutes from "./routes/certificate.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "CertiFlow API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/certificates", certificateRoutes);

export default app;