import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import Api from "../services/api";
import type { User, UsersResponse, UserDetailResponse } from "../types/user";
import { useToastService } from "./useToastService";

// Fetch all users
export const useUsers = () => {
  return useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await Api.get<UsersResponse>("/users");
      return response.data;
    },
  });
};

// Fetch single user by ID
export const useUser = (id: number | string) => {
  return useQuery<UserDetailResponse>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await Api.get<UserDetailResponse>(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToastService();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await Api.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      success("Success", "User deleted successfully");
    },
    onError: (error: any) => {
      showError(
        "Error",
        error.response?.data?.message || "Failed to delete user"
      );
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToastService();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<User> }) => {
      const response = await Api.put(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      success("Success", "User updated successfully");
    },
    onError: (error: any) => {
      showError(
        "Error",
        error.response?.data?.message || "Failed to update user"
      );
    },
  });
};
