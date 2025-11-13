<script setup lang="ts">
import { ref } from "vue";
import { useLogin } from "../../composables/useLogin";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import { useToastService } from "../../composables/useToastService";
import { Button, Checkbox, InputText, Password, Toast } from "primevue";

// Composables
const router = useRouter();
const showToast = useToastService();
const loginMutation = useLogin();

// Variable Reactive
// const username = ref("");
// const password = ref("");
const loginField = ref({ username: "", password: "" });
const checked = ref(false);
const fieldErrors = ref({ username: "", password: "" });

const handleLogin = async () => {
  fieldErrors.value = { username: "", password: "" };

  // Validasi frontend tetap ada
  const { username, password } = loginField.value;
  if (!username || !password) {
    showToast.warn("Warning", "Please fill in all fields");
    return;
  }

  loginMutation.mutate(
    {
      username: username,
      password: password,
    },
    {
      onSuccess: (response) => {
        console.log("Login success response:", response);
        const { data } = response;

        if (data?.token && data?.user) {
          Cookies.set("token", data.token);
          Cookies.set("user", JSON.stringify(data.user));
          showToast.success("Success", response.message || "Login successful");

          setTimeout(() => {
            router.push({ name: "Home" });
          }, 500);
        }
      },
      onError: (error: any) => {
        console.log("Login error:", error);
        const errorData = error.response?.data;

        if (errorData?.errors) {
          const { username, password } = errorData.errors;

          if (username) {
            fieldErrors.value.username = Array.isArray(username)
              ? username[0]
              : username;
          }
          if (password) {
            fieldErrors.value.password = Array.isArray(password)
              ? password[0]
              : password;
          }
          showToast.warn("Login Failed", "Please check the errors below.");
        } else if (errorData?.message) {
          // --- KASUS: Ada error umum ---
          // (Contoh: "Invalid credentials", "Server error")
          // Tidak ada objek 'errors', jadi kita tampilkan di toast
          showToast.error("Login Failed", errorData.message);
        } else if (error.message) {
          showToast.error("Network Error", error.message);
        } else {
          showToast.error("Error", "An unexpected error occurred.");
        }
      },
    }
  );
};
</script>

<template>
  <Toast />
  <div
    class="bg-surface-50 flex items-center justify-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center">
      <form
        @submit.prevent="handleLogin"
        class="w-full bg-black/15 py-20 px-8 sm:px-20"
        style="border-radius: 53px"
      >
        <div class="text-center mb-8">
          <div class="text-surface-900 text-3xl font-medium mb-4">
            Welcome to HonoVueBun CRUD!
          </div>
          <span class="text-muted-color font-medium">Sign in to continue</span>
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
            v-model="loginField.username"
            :invalid="!!fieldErrors.username"
          />
          <small class="p-error text-red-500" v-if="fieldErrors.username">
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
            v-model="loginField.password"
            placeholder="Password"
            :toggleMask="true"
            fluid
            :feedback="false"
            :invalid="!!fieldErrors.password"
          ></Password>
          <small class="p-error text-red-500" v-if="fieldErrors.password">
            {{ fieldErrors.password }}
          </small>
        </div>

        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
          <div class="flex items-center">
            <Checkbox
              v-model="checked"
              id="rememberme1"
              binary
              class="mr-2"
            ></Checkbox>
            <label for="rememberme1">Remember me</label>
          </div>
          <span
            class="font-medium no-underline ml-2 text-right cursor-pointer text-primary"
            >Forgot password?</span
          >
        </div>

        <Button
          label="Sign In"
          type="submit"
          class="w-full"
          :loading="loginMutation.isPending.value"
          :disabled="loginMutation.isPending.value"
        ></Button>

        <div class="text-center mt-6">
          <span class="text-muted-color">Don't have an account? </span>
          <span
            @click="router.push('/register')"
            class="font-medium text-primary cursor-pointer hover:underline"
          >
            Register here
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
