<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Button, Avatar, Drawer } from "primevue";
import { useAuthUser } from "../composables/useAuth";
import { useLogout } from "../composables/useLogout";

const router = useRouter();
const user = useAuthUser();
const { logout } = useLogout();

const sidebarVisible = ref(false);

const menuItems = ref([
  {
    label: "Dashboard",
    icon: "pi pi-home",
    command: () => router.push("/"),
  },
  {
    label: "Users",
    icon: "pi pi-users",
    command: () => router.push("/users"),
  },
]);
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950">
    <!-- Header -->
    <div
      class="flex justify-between items-center p-4 bg-surface-0 dark:bg-surface-900 shadow-md border-b border-surface-200 dark:border-surface-700"
    >
      <div class="flex items-center gap-4">
        <Button
          icon="pi pi-bars"
          text
          rounded
          @click="sidebarVisible = true"
          class="lg:hidden"
        />
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
          {{ $route.meta.title || $route.name }}
        </h1>
      </div>

      <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-2">
          <Avatar
            :label="user?.name?.charAt(0) || 'U'"
            shape="circle"
            class="bg-primary text-white"
          />
          <span class="font-medium text-surface-900 dark:text-surface-0">
            {{ user?.name || user?.username }}
          </span>
        </div>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          @click="logout"
          severity="secondary"
          size="small"
        />
      </div>
    </div>

    <div class="flex">
      <!-- Desktop Sidebar -->
      <aside
        class="hidden lg:block w-64 bg-surface-0 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 min-h-[calc(100vh-73px)]"
      >
        <nav class="p-4">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.label">
              <button
                @click="item.command"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:cursor-pointer"
                :class="{
                  'bg-primary text-white hover:bg-primary-600':
                    $route.path ===
                      item.label.toLowerCase().replace(' ', '-') ||
                    ($route.path === '/' && item.label === 'Dashboard') ||
                    ($route.path.startsWith('/users') &&
                      item.label === 'Users'),
                  'text-surface-700 dark:text-surface-300':
                    !(
                      $route.path === item.label.toLowerCase().replace(' ', '-')
                    ) &&
                    !($route.path === '/' && item.label === 'Dashboard') &&
                    !(
                      $route.path.startsWith('/users') && item.label === 'Users'
                    ),
                }"
              >
                <i :class="item.icon"></i>
                <span class="font-medium">{{ item.label }}</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Mobile Drawer -->
      <Drawer v-model:visible="sidebarVisible" header="Menu" position="left">
        <nav>
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.label">
              <button
                @click="item.command"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
                :class="{
                  'bg-primary text-white hover:bg-primary-600':
                    $route.path ===
                      item.label.toLowerCase().replace(' ', '-') ||
                    ($route.path === '/' && item.label === 'Dashboard') ||
                    ($route.path.startsWith('/users') &&
                      item.label === 'Users'),
                  'text-surface-700 dark:text-surface-300':
                    !(
                      $route.path === item.label.toLowerCase().replace(' ', '-')
                    ) &&
                    !($route.path === '/' && item.label === 'Dashboard') &&
                    !(
                      $route.path.startsWith('/users') && item.label === 'Users'
                    ),
                }"
              >
                <i :class="item.icon"></i>
                <span class="font-medium">{{ item.label }}</span>
              </button>
            </li>
          </ul>
        </nav>
      </Drawer>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
