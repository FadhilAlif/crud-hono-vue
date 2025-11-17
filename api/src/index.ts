import { Hono } from "hono";
import { Routes } from "./routes";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api/v1");
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return "*";
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return origin;
      }
      // Allow Vercel preview deployments
      if (origin.includes(".vercel.app")) {
        return origin;
      }
      return allowedOrigins[0];
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  })
);
app.route("/", Routes);

export default app;
