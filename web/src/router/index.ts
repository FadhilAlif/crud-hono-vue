import { createRouter, createWebHistory } from "vue-router";
import { useAuthUser } from "../composables/useAuth";

/**
 * Vue Router Configuration
 *
 * Routes:
 * - / (Home) - Protected route, requires authentication
 * - /users - Protected route, requires authentication
 * - /login - Guest only route, redirects to home if already logged in
 * - /access-denied - Public access denied page
 * - /error - Public error page
 * - /* (catch all) - Redirects to error page
 *
 * Meta fields:
 * - requiresAuth: true - Route requires user to be logged in
 * - guest: true - Route is only accessible to non-authenticated users
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Users.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/users",
      name: "Users",
      component: () => import("../views/Users.vue"),
      meta: { requiresAuth: true },
    },

    // Authentication Routes
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/auth/Login.vue"),
      meta: { guest: true },
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/auth/Register.vue"),
      meta: { guest: true },
    },
    {
      path: "/access-denied",
      name: "AccessDenied",
      component: () => import("../views/auth/Access.vue"),
    },
    {
      path: "/error",
      name: "Error",
      component: () => import("../views/auth/Error.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/error",
    },
  ],
});

// Navigation guard untuk authentication
router.beforeEach((to, _from, next) => {
  const user = useAuthUser();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isGuestOnly = to.matched.some((record) => record.meta.guest);

  if (requiresAuth && !user) {
    // Jika halaman memerlukan auth tapi user belum login
    next({ name: "Login" });
  } else if (isGuestOnly && user) {
    // Jika halaman hanya untuk guest (login) tapi user sudah login
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
