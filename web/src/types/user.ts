export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
}

export interface UserDetailResponse {
  data: User;
}

export interface CreateUserRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}
