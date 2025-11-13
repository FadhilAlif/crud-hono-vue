import { useMutation } from "@tanstack/vue-query";
import Api from "../services/api";

//interface LoginRequest
interface LoginRequest {
  username: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await Api.post("/login", data);
      return response.data;
    },
  });
};
