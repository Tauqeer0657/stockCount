import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import xssClean from "xss-clean";
import { ApiError } from "./utils/apiError.js";
import { router as userRouter } from "./routers/userRoutes.js";
import { router as projectRouter } from "./routers/projectRoutes.js";
import { router as warehouseRouter } from "./routers/warehouseRoutes.js";
import { router as stockCountRouter } from "./routers/stockCountRoutes.js";

const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));

app.use(cookieParser());

// Use Helmet middleware for basic security headers
app.use(helmet());

// XSS protection middleware
app.use(xssClean());

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/warehouse", warehouseRouter);
app.use("/api/v1/stockCount", stockCountRouter);

// Error handling middleware 
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  // Fallback for unhandled errors
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

export { app };
