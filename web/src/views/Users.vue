<script setup lang="ts">
import { Button, Card } from "primevue";
import { useAuthUser } from "../composables/useAuth";
import { useLogout } from "../composables/useLogout";

const user = useAuthUser();
const { logout } = useLogout();
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950">
    <div
      class="flex justify-between items-center p-4 bg-surface-0 dark:bg-surface-900 shadow-md"
    >
      <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
        Users Dashboard
      </h1>
      <div class="flex items-center gap-4">
        <div class="text-surface-900 dark:text-surface-0">
          <span class="font-medium"
            >Welcome, {{ user?.name || user?.username }}</span
          >
        </div>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          @click="logout"
          severity="secondary"
        />
      </div>
    </div>

    <div class="p-8">
      <Card>
        <template #title>User Information</template>
        <template #content>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="font-medium text-surface-500 dark:text-surface-400">
                Name:
              </p>
              <p class="text-surface-900 dark:text-surface-0">
                {{ user?.name }}
              </p>
            </div>
            <div>
              <p class="font-medium text-surface-500 dark:text-surface-400">
                Username:
              </p>
              <p class="text-surface-900 dark:text-surface-0">
                {{ user?.username }}
              </p>
            </div>
            <div>
              <p class="font-medium text-surface-500 dark:text-surface-400">
                Email:
              </p>
              <p class="text-surface-900 dark:text-surface-0">
                {{ user?.email }}
              </p>
            </div>
            <div>
              <p class="font-medium text-surface-500 dark:text-surface-400">
                User ID:
              </p>
              <p class="text-surface-900 dark:text-surface-0">{{ user?.id }}</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
