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
const username = ref("");
const password = ref("");
const checked = ref(false);

const handleLogin = async () => {
  if (!username.value || !password.value) {
    showToast.warn("Warning", "Please fill in all fields");
    return;
  }

  loginMutation.mutate(
    {
      username: username.value,
      password: password.value,
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
        console.log("Error response:", error.response);

        const errorData = error.response?.data;
        let errorMessage = "Login failed";

        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.errors) {
          // Handle validation errors
          errorMessage = Object.values(errorData.errors).join(", ");
        } else if (error.message) {
          errorMessage = error.message;
        }
        showToast.error("Error", errorMessage);
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
      <div
        class="w-full bg-black/15 py-20 px-8 sm:px-20"
        style="border-radius: 53px"
      >
        <div class="text-center mb-8">
          <div class="text-surface-900 text-3xl font-medium mb-4">
            Welcome to HonoVueBun CRUD!
          </div>
          <span class="text-muted-color font-medium">Sign in to continue</span>
        </div>

        <div>
          <label
            for="username1"
            class="block text-surface-900 text-xl font-medium mb-2"
            >Username</label
          >
          <InputText
            id="username1"
            type="text"
            placeholder="Username"
            class="w-full md:w-120 mb-8"
            v-model="username"
            @keyup.enter="handleLogin"
          />

          <label
            for="password1"
            class="block text-surface-900 font-medium text-xl mb-2"
            >Password</label
          >
          <Password
            id="password1"
            v-model="password"
            placeholder="Password"
            :toggleMask="true"
            class="mb-4"
            fluid
            :feedback="false"
            @keyup.enter="handleLogin"
          ></Password>

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
            type="button"
            class="w-full"
            @click="handleLogin"
            :loading="loginMutation.isPending.value"
            :disabled="loginMutation.isPending.value"
          ></Button>
        </div>
      </div>
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
