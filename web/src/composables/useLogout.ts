import Cookies from "js-cookie";
import { useRouter } from "vue-router";

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    // Hapus token dan user data dari cookies
    Cookies.remove("token");
    Cookies.remove("user");

    // Redirect ke halaman login
    router.push({ name: "Login" });
  };

  return { logout };
};
