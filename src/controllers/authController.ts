import type { Context } from "hono";
import prisma from "../../prisma/client";
import { sign } from "hono/jwt";
import type { LoginRequest, RegisterRequest } from "../types/auth";

export const AuthController = {
  // Login
  login: async (c: Context) => {
    try {
      const { username, password } = c.get("validatedBody") as LoginRequest;
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user)
        return c.json({ success: false, message: "User tidak ditemukan" }, 401);

      const isPasswordValid = user.password
        ? await Bun.password.verify(password, user.password)
        : false;

      if (!isPasswordValid)
        return c.json({ success: false, message: "Password salah" }, 401);

      const payload = {
        sub: user.id,
        username: user.username,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // Expire in 8 hours
      };

      const secret = process.env.JWT_SECRET || "default";
      const token = await sign(payload, secret);

      const { password: _, ...userData } = user;
      return c.json(
        {
          success: true,
          message: "Login Berhasil!",
          data: { user: userData, token },
        },
        200
      );
    } catch {
      return c.json({ success: false, message: "Internal server error" }, 500);
    }
  },

  // Register
  register: async (c: Context) => {
    try {
      const { name, username, email, password } = c.get(
        "validatedBody"
      ) as RegisterRequest;

      const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
        select: { id: true, email: true, username: true },
      });

      if (existing) {
        const conflictField =
          existing.email === email
            ? "email"
            : existing.username === username
            ? "username"
            : "email";

        return c.json(
          {
            success: false,
            message:
              conflictField === "email"
                ? "Email sudah terdaftar"
                : "Username sudah digunakan",
            errors: { [conflictField]: "Telah digunakan" },
          },
          409
        );
      }

      const hashedPassword = await Bun.password.hash(password);
      const user = await prisma.user.create({
        data: { name, username, email, password: hashedPassword },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return c.json(
        { success: true, message: "User Berhasil Dibuat", data: user },
        201
      );
    } catch {
      return c.json({ success: false, message: "Internal server error" }, 500);
    }
  },
};
