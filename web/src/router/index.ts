import { createRouter, createWebHistory } from "vue-router";
import { useAuthUser } from "../composables/useAuth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Dashboard.vue"),
      meta: { requiresAuth: true, title: "Dashboard" },
    },
    {
      path: "/users",
      name: "Users",
      component: () => import("../views/Users.vue"),
      meta: { requiresAuth: true, title: "Users" },
    },
    {
      path: "/users/:id",
      name: "UserDetail",
      component: () => import("../views/UserDetail.vue"),
      meta: { requiresAuth: true, title: "User Detail" },
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
