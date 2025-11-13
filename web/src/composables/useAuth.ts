import Cookies from "js-cookie";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export const useAuthUser = (): User | null => {
  const user = Cookies.get("user");
  return user ? (JSON.parse(user) as User) : null;
};

export const isAuthenticated = (): boolean => {
  const token = Cookies.get("token");
  const user = Cookies.get("user");
  return !!(token && user);
};
