import { Hono } from "hono";
import { Routes } from "./routes";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api/v1");
app.use("*", cors());
app.route("/", Routes);

export default app;
