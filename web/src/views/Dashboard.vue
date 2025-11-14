<script setup lang="ts">
import { Card } from "primevue";
import AppLayout from "../layouts/AppLayout.vue";
import { useAuthUser } from "../composables/useAuth";

const user = useAuthUser();
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Welcome Section -->
      <Card>
        <template #title>
          <div class="flex items-center gap-3">
            <span>Welcome Back!</span>
          </div>
        </template>
        <template #content>
          <p class="text-lg text-surface-700 dark:text-surface-300">
            Hello, <span class="font-bold">{{ user?.name }}</span
            >! Welcome to your dashboard.
          </p>
        </template>
      </Card>

      <!-- User Information -->
      <Card>
        <template #title>User Information</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div
                class="flex items-center gap-2 text-surface-500 dark:text-surface-400"
              >
                <span class="text-sm font-medium uppercase tracking-wide"
                  >Full Name</span
                >
              </div>
              <p
                class="text-lg text-surface-900 dark:text-surface-0 font-medium"
              >
                {{ user?.name }}
              </p>
            </div>

            <div class="space-y-2">
              <div
                class="flex items-center gap-2 text-surface-500 dark:text-surface-400"
              >
                <span class="text-sm font-medium uppercase tracking-wide"
                  >Username</span
                >
              </div>
              <p
                class="text-lg text-surface-900 dark:text-surface-0 font-medium"
              >
                @{{ user?.username }}
              </p>
            </div>

            <div class="space-y-2">
              <div
                class="flex items-center gap-2 text-surface-500 dark:text-surface-400"
              >
                <span class="text-sm font-medium uppercase tracking-wide"
                  >Email Address</span
                >
              </div>
              <p
                class="text-lg text-surface-900 dark:text-surface-0 font-medium"
              >
                {{ user?.email }}
              </p>
            </div>

            <div class="space-y-2">
              <div
                class="flex items-center gap-2 text-surface-500 dark:text-surface-400"
              >
                <span class="text-sm font-medium uppercase tracking-wide"
                  >User ID</span
                >
              </div>
              <p
                class="text-lg text-surface-900 dark:text-surface-0 font-medium font-mono"
              >
                {{ user?.id }}
              </p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </AppLayout>
</template>

<style scoped></style>
