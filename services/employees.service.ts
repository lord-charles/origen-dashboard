import axios from "axios";
import { User, PaginatedUsers } from "@/types/user";
import { CreateEmployeeDto } from "@/types/employee";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const employeesService = {
  async getEmployees(
    page: number = 1,
    limit: number = 1000000
  ): Promise<PaginatedUsers> {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.status || 500,
          error.response?.data?.message || "Failed to fetch employees",
          error.response?.data
        );
      }
      throw new ApiError(500, "An unexpected error occurred");
    }
  },

  async getEmployeeById(id: string): Promise<User> {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.status || 500,
          error.response?.data?.message || "Failed to fetch employee",
          error.response?.data
        );
      }
      throw new ApiError(500, "An unexpected error occurred");
    }
  },

  async registerEmployee(employee: CreateEmployeeDto): Promise<User> {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.status || 500,
          error.response?.data?.message || "Failed to register employee",
          error.response?.data
        );
      }
      throw new ApiError(
        500,
        "An unexpected error occurred while registering employee"
      );
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.status || 500,
          error.response?.data?.message || "Failed to delete employee",
          error.response?.data
        );
      }
      throw new ApiError(500, "An unexpected error occurred");
    }
  },
};
