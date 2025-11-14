<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Card, Button, Skeleton, Tag, Divider } from "primevue";
import AppLayout from "../layouts/AppLayout.vue";
import { useUser } from "../composables/useUsers";
import { UserIcon } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();

// Get user ID from route params
const userId = computed(() => route.params.id as string);

// Fetch user data
const { data: userData, isLoading, isError, error } = useUser(userId.value);

const user = computed(() => userData.value?.data);

// Navigate back to users list
const goBack = () => {
  router.push("/users");
};

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <Button
          icon="pi pi-arrow-left"
          text
          rounded
          @click="goBack"
          v-tooltip.right="'Back to Users'"
        />
        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
          User Details
        </h2>
      </div>

      <!-- Loading State -->
      <Card v-if="isLoading">
        <template #content>
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <Skeleton shape="circle" size="5rem" />
              <div class="flex-1 space-y-2">
                <Skeleton width="200px" height="2rem" />
                <Skeleton width="150px" height="1.5rem" />
              </div>
            </div>
            <Divider />
            <div class="space-y-4">
              <Skeleton width="100%" height="1.5rem" />
              <Skeleton width="100%" height="1.5rem" />
              <Skeleton width="100%" height="1.5rem" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Error State -->
      <Card v-else-if="isError">
        <template #content>
          <div
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-700 dark:text-red-400"
          >
            <div class="flex flex-col items-center gap-4 text-center">
              <i class="pi pi-exclamation-circle text-5xl"></i>
              <div>
                <h3 class="text-xl font-semibold mb-2">Failed to Load User</h3>
                <p>{{ error?.message || "An error occurred" }}</p>
              </div>
              <Button
                label="Go Back"
                icon="pi pi-arrow-left"
                @click="goBack"
                severity="secondary"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- User Details -->
      <Card v-else-if="user">
        <template #content>
          <div class="space-y-6">
            <!-- User Header -->
            <div class="flex items-start gap-6">
              <div
                class="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold"
              >
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <h3
                  class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2"
                >
                  {{ user.name }}
                </h3>
                <div class="flex flex-wrap gap-3 items-center">
                  <Tag :value="`@${user.username}`" severity="info">
                    <template #icon>
                      <UserIcon class="w-4 h-4" />
                    </template>
                  </Tag>
                  <Tag :value="`ID: ${user.id}`" severity="secondary" />
                </div>
              </div>
            </div>

            <Divider />

            <!-- User Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Email -->
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
                  {{ user.email }}
                </p>
              </div>

              <!-- Username -->
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
                  @{{ user.username }}
                </p>
              </div>

              <!-- Full Name -->
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
                  {{ user.name }}
                </p>
              </div>

              <!-- User ID -->
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
                  {{ user.id }}
                </p>
              </div>

              <!-- Created At -->
              <div class="space-y-2" v-if="user.createdAt">
                <div
                  class="flex items-center gap-2 text-surface-500 dark:text-surface-400"
                >
                  <span class="text-sm font-medium uppercase tracking-wide"
                    >Created At</span
                  >
                </div>
                <p class="text-lg text-surface-900 dark:text-surface-0">
                  {{ formatDate(user.createdAt) }}
                </p>
              </div>

              <!-- Updated At -->
              <div class="space-y-2" v-if="user.updatedAt">
                <div
                  class="flex items-center gap-2 text-surface-500 dark:text-surface-400"
                >
                  <span class="text-sm font-medium uppercase tracking-wide"
                    >Last Updated</span
                  >
                </div>
                <p class="text-lg text-surface-900 dark:text-surface-0">
                  {{ formatDate(user.updatedAt) }}
                </p>
              </div>
            </div>

            <Divider />

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <Button
                label="Back to Users"
                icon="pi pi-arrow-left"
                @click="goBack"
                severity="secondary"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </AppLayout>
</template>

<style scoped>
/* Additional styles if needed */
</style>
