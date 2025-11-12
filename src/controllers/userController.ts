import type { Context } from "hono";
import prisma from "../../prisma/client";
import { UserCreateRequest, UserUpdateRequest } from "../types/user";

// Controller User

// GET All Users
export const getUsers = async (c: Context) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { id: "desc" },
    });

    return c.json(
      {
        success: true,
        message: "Get all users",
        data: users,
      },
      200
    );
  } catch (error: unknown) {
    console.error(`Error getting users: ${error}`);
    return c.json(
      {
        success: false,
        message: "Failed to get all users",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
};

// Create User
export const createUser = async (c: Context) => {
  try {
    // Extract user data from request body
    const { name, username, email, password } = c.get(
      "validatedBody"
    ) as UserCreateRequest;

    // Check Duplicate Email or Username
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true, email: true, username: true },
    });
    if (existingUser) {
      const conflictField =
        existingUser.email === email
          ? "email"
          : existingUser.username === username
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

    // Hash Password
    const hashedPassword = await Bun.password.hash(password);

    // Create User (dont expose password)
    const newUser = await prisma.user.create({
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
      {
        success: true,
        message: "User created successfully",
        data: newUser,
      },
      201
    );
  } catch (error: unknown) {
    console.error(`Error creating user: ${error}`);
    return c.json(
      {
        success: false,
        message: "Failed to create user",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
};

// GET User by ID
export const getUserById = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return c.json(
        {
          success: false,
          message: `User with ID ${id} not found`,
        },
        404
      );
    }

    return c.json(
      {
        success: true,
        message: `Get user with ID ${id}`,
        data: user,
      },
      200
    );
  } catch (error: unknown) {
    console.error(`Error getting user by ID: ${error}`);
    return c.json(
      {
        success: false,
        message: "Failed to get user by ID",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
};

export const updateUser = async (c: Context) => {
  try {
    const userId = c.req.param("id");
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User Tidak Ditemukan!",
        },
        404
      );
    }

    const { name, username, email, password } = c.get(
      "validatedBody"
    ) as UserUpdateRequest;

    // Check duplicate email/username
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
        NOT: { id: Number(userId) },
      },
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

    // Update user (hash password only if provided)
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        name,
        username,
        email,
        password: password ? await Bun.password.hash(password) : user.password,
      },
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
      {
        success: true,
        message: `User ${updatedUser.id} Berhasil Diupdate!`,
        data: updatedUser,
      },
      200
    );
  } catch (error: unknown) {
    console.error(`Error getting user by ID: ${error}`);
    return c.json(
      {
        success: false,
        message: "Failed to update user by ID",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
};

export const deleteUser = async (c: Context) => {
  try {
    const userId = c.req.param("id");
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      return c.json(
        {
          success: false,
          message: `User with ID ${userId} not found`,
        },
        404
      );
    }
    await prisma.user.delete({ where: { id: Number(userId) } });

    return c.json(
      {
        success: true,
        message: `User with ID ${userId} successfully deleted`,
      },
      200
    );
  } catch (error: unknown) {
    console.error(`Error deleting user: ${error}`);
    return c.json(
      {
        success: false,
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
};
