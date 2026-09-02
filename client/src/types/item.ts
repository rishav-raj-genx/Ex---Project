export interface Item {
  _id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemPayload {
  name: string;
  description: string;
  status?: Item["status"];
}

export type UpdateItemPayload = Partial<CreateItemPayload>;

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}
