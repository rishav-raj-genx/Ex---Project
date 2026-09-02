import apiClient from "./client";
import type { AuthResponse, LoginCredentials, RegisterPayload, User } from "../types/auth";

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/register", payload);
    return res.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return res.data;
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    const res = await apiClient.get<{ success: boolean; user: User }>("/auth/me");
    return res.data;
  },
};
