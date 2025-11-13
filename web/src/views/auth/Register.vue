<script setup lang="ts">
import { ref } from "vue";
import { useRegister } from "../../composables/useRegister";
import { useRouter } from "vue-router";
import { useToastService } from "../../composables/useToastService";
import { Button, InputText, Password, Toast } from "primevue";

// Composables
const router = useRouter();
const registerMutation = useRegister();
const showToast = useToastService();

// Variable Reactive
const registerField = ref({ name: "", username: "", email: "", password: "" });
const fieldErrors = ref({ name: "", username: "", email: "", password: "" });

const handleRegister = async () => {
  fieldErrors.value = { name: "", username: "", email: "", password: "" };

  // Validasi frontend untuk semua field
  const { name, username, email, password } = registerField.value;
  if (!name || !username || !email || !password) {
    showToast.warn("Warning", "Please fill in all fields");
    return;
  }

  // Kirim semua data dari registerField
  registerMutation.mutate(registerField.value, {
    onSuccess: (response) => {
      console.log("Register success response:", response);
      showToast.success(
        "Success",
        response.message || "Registration successful!"
      );

      router.push({ name: "Login" });
    },
    onError: (error: any) => {
      console.log("Register error:", error);
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const { name, username, email, password } = errorData.errors;

        if (name) {
          fieldErrors.value.name = Array.isArray(name) ? name[0] : name;
        }
        if (username) {
          fieldErrors.value.username = Array.isArray(username)
            ? username[0]
            : username;
        }
        if (email) {
          fieldErrors.value.email = Array.isArray(email) ? email[0] : email;
        }
        if (password) {
          fieldErrors.value.password = Array.isArray(password)
            ? password[0]
            : password;
        }

        showToast.warn("Registration Failed", "Please check the errors below.");
      } else if (errorData?.message) {
        // --- KASUS: Error umum ---
        showToast.error("Registration Failed", errorData.message);
      } else if (error.message) {
        showToast.error("Network Error", error.message);
      } else {
        showToast.error("Error", "An unexpected error occurred.");
      }
    },
  });
};
</script>

<template>
  <Toast />
  <div
    class="bg-surface-50 flex items-center justify-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center">
      <form
        @submit.prevent="handleRegister"
        class="w-full bg-black/15 py-20 px-8 sm:px-20"
        style="border-radius: 53px"
      >
        <div class="text-center mb-8">
          <div class="text-surface-900 text-3xl font-medium mb-4">
            Welcome to HonoVueBun CRUD!
          </div>
          <span class="text-muted-color font-medium">Register to continue</span>
        </div>

        <div class="flex flex-col gap-2 mb-4">
          <label for="name" class="block text-surface-900 text-xl font-medium"
            >Name</label
          >
          <InputText
            id="name"
            type="text"
            placeholder="Your Name"
            class="w-full"
            v-model="registerField.name"
            :invalid="!!fieldErrors.name"
          />
          <small class="p-error" v-if="fieldErrors.name">
            {{ fieldErrors.name }}
          </small>
        </div>

        <div class="flex flex-col gap-2 mb-4">
          <label for="email" class="block text-surface-900 text-xl font-medium"
            >Email</label
          >
          <InputText
            id="email"
            type="email"
            placeholder="your@email.com"
            class="w-full"
            v-model="registerField.email"
            :invalid="!!fieldErrors.email"
          />
          <small class="p-error" v-if="fieldErrors.email">
            {{ fieldErrors.email }}
          </small>
        </div>

        <div class="flex flex-col gap-2 mb-4">
          <label
            for="username"
            class="block text-surface-900 text-xl font-medium"
            >Username</label
          >
          <InputText
            id="username"
            type="text"
            placeholder="Username"
            class="w-full"
            v-model="registerField.username"
            :invalid="!!fieldErrors.username"
          />
          <small class="p-error" v-if="fieldErrors.username">
            {{ fieldErrors.username }}
          </small>
        </div>

        <div class="flex flex-col gap-2 mb-4">
          <label
            for="password"
            class="block text-surface-900 font-medium text-xl"
            >Password</label
          >
          <Password
            id="password"
            v-model="registerField.password"
            placeholder="Password"
            :toggleMask="true"
            fluid
            :feedback="false"
            :invalid="!!fieldErrors.password"
          ></Password>
          <small class="p-error" v-if="fieldErrors.password">
            {{ fieldErrors.password }}
          </small>
        </div>

        <Button
          label="Register"
          type="submit"
          class="w-full mt-8"
          :loading="registerMutation.isPending.value"
          :disabled="registerMutation.isPending.value"
        ></Button>

        <div class="text-center mt-6">
          <span class="text-muted-color">Already have an account? </span>
          <span
            @click="router.push('/login')"
            class="font-medium text-primary cursor-pointer hover:underline"
          >
            Login here
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
