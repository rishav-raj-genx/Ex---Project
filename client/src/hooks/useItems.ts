import { useCallback, useEffect, useState } from "react";
import apiClient from "../api/client";
import type {
  Item,
  ApiResponse,
  CreateItemPayload,
  UpdateItemPayload,
} from "../types/item";

interface UseItemsReturn {
  items: Item[];
  loading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  createItem: (payload: CreateItemPayload) => Promise<Item>;
  updateItem: (id: string, payload: UpdateItemPayload) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
}

export function useItems(): UseItemsReturn {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get<ApiResponse<Item[]>>("/items");
      setItems(data.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch items";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(
    async (payload: CreateItemPayload): Promise<Item> => {
      const { data } = await apiClient.post<ApiResponse<Item>>(
        "/items",
        payload
      );
      setItems((prev) => [data.data, ...prev]);
      return data.data;
    },
    []
  );

  const updateItem = useCallback(
    async (id: string, payload: UpdateItemPayload): Promise<Item> => {
      const { data } = await apiClient.put<ApiResponse<Item>>(
        `/items/${id}`,
        payload
      );
      setItems((prev) =>
        prev.map((item) => (item._id === id ? data.data : item))
      );
      return data.data;
    },
    []
  );

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/items/${id}`);
    setItems((prev) => prev.filter((item) => item._id !== id));
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  return { items, loading, error, fetchItems, createItem, updateItem, deleteItem };
}
