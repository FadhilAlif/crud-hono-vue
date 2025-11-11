import { Hono } from "hono";
import { Routes } from "./routes";

const app = new Hono().basePath("/api/v1");

app.route("/", Routes);

export default app;
