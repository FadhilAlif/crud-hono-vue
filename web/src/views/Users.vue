<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  DataTable,
  Column,
  Card,
  Button,
  InputText,
  ConfirmDialog,
  Toast,
} from "primevue";
import { useConfirm } from "primevue/useconfirm";
import AppLayout from "../layouts/AppLayout.vue";
import UserFormDialog from "../components/UserFormDialog.vue";
import {
  useUsers,
  useDeleteUser,
  useCreateUser,
  useUpdateUser,
} from "../composables/useUsers";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user";
import { Edit, Info, Trash, UserPlus } from "lucide-vue-next";

const router = useRouter();
const confirm = useConfirm();

// Data fetching
const { data: usersData, isLoading, isError, error } = useUsers();
const { mutate: deleteUser } = useDeleteUser();
const { mutate: createUser, isPending: isCreating } = useCreateUser();
const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

// Dialog state
const dialogVisible = ref(false);
const selectedUser = ref<User | null>(null);

// Search functionality
const searchQuery = ref("");

// Computed users list with search filter
const users = computed(() => {
  if (!usersData.value?.data) return [];

  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return usersData.value.data;

  return usersData.value.data.filter((user: User) => {
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    );
  });
});

// Navigate to user detail
const viewUserDetail = (user: User) => {
  router.push(`/users/${user.id}`);
};

// Open dialog for adding new user
const openAddDialog = () => {
  selectedUser.value = null;
  dialogVisible.value = true;
};

// Open dialog for editing user
const openEditDialog = (user: User) => {
  selectedUser.value = user;
  dialogVisible.value = true;
};

// Handle save (create or update)
const handleSave = (data: CreateUserRequest | UpdateUserRequest) => {
  if (selectedUser.value) {
    // Update existing user
    updateUser(
      { id: selectedUser.value.id, data },
      {
        onSuccess: () => {
          dialogVisible.value = false;
          selectedUser.value = null;
        },
      }
    );
  } else {
    // Create new user
    createUser(data as CreateUserRequest, {
      onSuccess: () => {
        dialogVisible.value = false;
      },
    });
  }
};

// Delete user with confirmation
const confirmDelete = (user: User) => {
  confirm.require({
    message: `Are you sure you want to delete user "${user.name}"?`,
    header: "Delete Confirmation",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    rejectClass: "p-button-secondary",
    acceptClass: "p-button-danger",
    accept: () => {
      deleteUser(user.id);
    },
  });
};

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <AppLayout>
    <Toast />
    <ConfirmDialog />

    <!-- User Form Dialog -->
    <UserFormDialog
      v-model:visible="dialogVisible"
      :user="selectedUser"
      :loading="isCreating || isUpdating"
      @save="handleSave"
    />

    <div class="space-y-6">
      <Card>
        <template #title>
          <div class="flex justify-between items-center">
            <span>Users Management</span>
          </div>
        </template>

        <template #content>
          <!-- Search Bar -->
          <div class="flex items-center justify-between mb-4">
            <span class="p-input-icon-left w-full md:w-96">
              <InputText
                v-model="searchQuery"
                placeholder="Search users by name, email, or username..."
                class="w-full"
              />
            </span>

            <!-- Add User Button -->
            <div class="flex items-center">
              <Button
                label="Add New User"
                severity="success"
                @click="openAddDialog"
              >
                <template #icon>
                  <UserPlus class="w-5 h-5 mr-2" />
                </template>
              </Button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
          </div>

          <!-- Error State -->
          <div
            v-else-if="isError"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400"
          >
            <div class="flex items-center gap-2">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ error?.message || "Failed to load users" }}</span>
            </div>
          </div>

          <!-- Data Table -->
          <DataTable
            v-else
            :value="users"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            stripedRows
            @row-click="(event) => viewUserDetail(event.data)"
            class="p-datatable-sm cursor-pointer"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
          >
            <template #empty>
              <div class="text-center py-8 text-surface-500">
                <i class="pi pi-inbox text-4xl mb-4"></i>
                <p>No users found.</p>
              </div>
            </template>

            <Column field="id" header="ID" sortable style="width: 5%">
              <template #body="{ data }">
                <span class="font-mono text-sm">{{ data.id }}</span>
              </template>
            </Column>

            <Column field="name" header="Name" sortable style="width: 20%">
              <template #body="{ data }">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold"
                  >
                    {{ data.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-medium">{{ data.name }}</span>
                </div>
              </template>
            </Column>

            <Column
              field="username"
              header="Username"
              sortable
              style="width: 15%"
            >
              <template #body="{ data }">
                <span class="text-surface-600 dark:text-surface-400"
                  >@{{ data.username }}</span
                >
              </template>
            </Column>

            <Column field="email" header="Email" sortable style="width: 25%">
              <template #body="{ data }">
                <span class="text-surface-600 dark:text-surface-400">{{
                  data.email
                }}</span>
              </template>
            </Column>

            <Column
              field="createdAt"
              header="Created At"
              sortable
              style="width: 15%"
            >
              <template #body="{ data }">
                <span class="text-surface-500 text-sm">{{
                  formatDate(data.createdAt)
                }}</span>
              </template>
            </Column>

            <Column header="Actions" style="width: 10%">
              <template #body="{ data }">
                <div class="flex items-center" @click.stop>
                  <Button
                    severity="info"
                    rounded
                    text
                    @click="viewUserDetail(data)"
                    v-tooltip.top="'View Details'"
                  >
                    <Info class="w-6 h-6"
                  /></Button>
                  <Button
                    severity="warn"
                    rounded
                    text
                    @click="openEditDialog(data)"
                    v-tooltip.top="'Edit User'"
                    ><Edit class="w-6 h-6"
                  /></Button>
                  <Button
                    severity="danger"
                    rounded
                    text
                    @click="confirmDelete(data)"
                    v-tooltip.top="'Delete User'"
                    ><Trash class="w-6 h-6"
                  /></Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </AppLayout>
</template>
<style scoped></style>
