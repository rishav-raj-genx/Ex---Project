import apiClient from "./client";
import type { Booking, BookingRequest } from "../types/booking";

export const bookingApi = {
  async getOccupiedSeats(params: {
    movieId: string;
    showDate: string;
    showtime: string;
    theater?: string;
  }): Promise<string[]> {
    const res = await apiClient.get<{ success: boolean; data: string[] }>(
      "/bookings/occupied",
      { params }
    );
    return res.data.data;
  },

  async createBooking(payload: BookingRequest): Promise<Booking> {
    const res = await apiClient.post<{ success: boolean; data: Booking }>(
      "/bookings",
      payload
    );
    return res.data.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const res = await apiClient.get<{ success: boolean; data: Booking[] }>(
      "/bookings/my-bookings"
    );
    return res.data.data;
  },
};
