<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Dialog, InputText, Button, Password } from "primevue";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user";

interface Props {
  visible: boolean;
  user?: User | null;
  loading?: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "save", data: CreateUserRequest | UpdateUserRequest): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  user: null,
  loading: false,
});

const emit = defineEmits<Emits>();

// Form data
const formData = ref({
  name: "",
  username: "",
  email: "",
  password: "",
});

// Form errors
const errors = ref({
  name: "",
  username: "",
  email: "",
  password: "",
});

// Computed properties
const isEditMode = computed(() => !!props.user);
const dialogTitle = computed(() =>
  isEditMode.value ? "Edit User" : "Add New User"
);

// Reset form function (defined before watches)
const resetForm = () => {
  formData.value = {
    name: "",
    username: "",
    email: "",
    password: "",
  };
  errors.value = {
    name: "",
    username: "",
    email: "",
    password: "",
  };
};

// Watch for user prop changes to populate form
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.value = {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        password: "",
      };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// Watch visible prop to reset form when dialog closes
watch(
  () => props.visible,
  (newVisible) => {
    if (!newVisible) {
      resetForm();
    }
  }
);

// Validate form
const validateForm = (): boolean => {
  let isValid = true;
  errors.value = {
    name: "",
    username: "",
    email: "",
    password: "",
  };

  // Validate name
  if (!formData.value.name.trim()) {
    errors.value.name = "Name is required";
    isValid = false;
  } else if (formData.value.name.length > 100) {
    errors.value.name = "Name must be less than 100 characters";
    isValid = false;
  }

  // Validate username
  if (!formData.value.username.trim()) {
    errors.value.username = "Username is required";
    isValid = false;
  } else if (formData.value.username.length < 3) {
    errors.value.username = "Username must be at least 3 characters";
    isValid = false;
  } else if (formData.value.username.length > 32) {
    errors.value.username = "Username must be less than 32 characters";
    isValid = false;
  } else if (!/^[a-z0-9_]+$/i.test(formData.value.username)) {
    errors.value.username =
      "Username can only contain letters, numbers, and underscores";
    isValid = false;
  }

  // Validate email
  if (!formData.value.email.trim()) {
    errors.value.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = "Invalid email format";
    isValid = false;
  }

  // Validate password (only required for new users)
  if (!isEditMode.value) {
    if (!formData.value.password) {
      errors.value.password = "Password is required";
      isValid = false;
    } else if (formData.value.password.length < 6) {
      errors.value.password = "Password must be at least 6 characters";
      isValid = false;
    } else if (formData.value.password.length > 128) {
      errors.value.password = "Password must be less than 128 characters";
      isValid = false;
    }
  } else {
    // For edit mode, validate password only if provided
    if (
      formData.value.password &&
      (formData.value.password.length < 6 ||
        formData.value.password.length > 128)
    ) {
      errors.value.password = "Password must be between 6 and 128 characters";
      isValid = false;
    }
  }

  return isValid;
};

// Handle save
const handleSave = () => {
  if (!validateForm()) return;

  const data: CreateUserRequest | UpdateUserRequest = {
    name: formData.value.name.trim(),
    username: formData.value.username.trim(),
    email: formData.value.email.trim().toLowerCase(),
  };

  // Add password if provided (for create or update)
  if (formData.value.password) {
    data.password = formData.value.password;
  }

  emit("save", data);
};

// Handle cancel
const handleCancel = () => {
  emit("update:visible", false);
  resetForm();
};
</script>

<template>
  <Dialog
    :visible="visible"
    :header="dialogTitle"
    :modal="true"
    :closable="!loading"
    :closeOnEscape="!loading"
    :style="{ width: '500px' }"
    @update:visible="(val) => emit('update:visible', val)"
  >
    <div class="space-y-4 py-4">
      <!-- Name Field -->
      <div class="space-y-2">
        <label
          for="name"
          class="block text-sm font-medium text-surface-900 dark:text-surface-0"
        >
          Full Name <span class="text-red-500">*</span>
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :disabled="loading"
          :invalid="!!errors.name"
          placeholder="Enter full name"
          class="w-full"
          @keyup.enter="handleSave"
        />
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </div>

      <!-- Username Field -->
      <div class="space-y-2">
        <label
          for="username"
          class="block text-sm font-medium text-surface-900 dark:text-surface-0"
        >
          Username <span class="text-red-500">*</span>
        </label>
        <InputText
          id="username"
          v-model="formData.username"
          :disabled="loading"
          :invalid="!!errors.username"
          placeholder="Enter username"
          class="w-full"
          @keyup.enter="handleSave"
        />
        <small v-if="errors.username" class="text-red-500">{{
          errors.username
        }}</small>
      </div>

      <!-- Email Field -->
      <div class="space-y-2">
        <label
          for="email"
          class="block text-sm font-medium text-surface-900 dark:text-surface-0"
        >
          Email Address <span class="text-red-500">*</span>
        </label>
        <InputText
          id="email"
          v-model="formData.email"
          :disabled="loading"
          :invalid="!!errors.email"
          type="email"
          placeholder="Enter email address"
          class="w-full"
          @keyup.enter="handleSave"
        />
        <small v-if="errors.email" class="text-red-500">{{
          errors.email
        }}</small>
      </div>

      <!-- Password Field -->
      <div class="space-y-2">
        <label
          for="password"
          class="block text-sm font-medium text-surface-900 dark:text-surface-0"
        >
          Password
          <span v-if="!isEditMode" class="text-red-500">*</span>
          <span v-else class="text-surface-500 text-xs"
            >(Leave blank to keep current)</span
          >
        </label>
        <Password
          id="password"
          v-model="formData.password"
          :disabled="loading"
          :invalid="!!errors.password"
          :feedback="false"
          toggleMask
          placeholder="Enter password"
          class="w-full"
          inputClass="w-full"
          @keyup.enter="handleSave"
        />
        <small v-if="errors.password" class="text-red-500">{{
          errors.password
        }}</small>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          label="Cancel"
          severity="secondary"
          @click="handleCancel"
          :disabled="loading"
        />
        <Button
          :label="isEditMode ? 'Update' : 'Create'"
          @click="handleSave"
          :loading="loading"
          :disabled="loading"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.p-password-input) {
  width: 100%;
}
</style>
