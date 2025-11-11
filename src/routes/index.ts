//import hono
import { Hono } from "hono";

//import middleware validateBody
import { validateBody } from "../middlewares/validate.middleware";

//import schema auth
import { registerSchema, loginSchema } from "../schemas/auth.schema";

//import controller register
import { register } from "../controllers/registerController";

//import controller login
import { login } from "../controllers/loginController";

//inistialize router
const router = new Hono();

//register route
router.post("/register", validateBody(registerSchema), register);
//login route
router.post("/login", validateBody(loginSchema), login);

export const Routes = router;
