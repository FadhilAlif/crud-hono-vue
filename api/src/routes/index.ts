import { Hono } from "hono";

// Import Middlewares
import { validateBody } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

// Import Schemas
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";

// Import Controllers
import { AuthController } from "../controllers/authController";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";

// Initialize router
const router = new Hono();

// Auth Routes
router.post("/register", validateBody(registerSchema), AuthController.register);
router.post("/login", validateBody(loginSchema), AuthController.login);

// Protected User Routes
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.put(
  "/users/:id",
  verifyToken,
  validateBody(updateUserSchema),
  updateUser
);
router.post("/users", verifyToken, validateBody(createUserSchema), createUser);
router.delete("/users/:id", verifyToken, deleteUser);

export const Routes = router;
