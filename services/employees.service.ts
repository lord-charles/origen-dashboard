"use server";

import axios from "axios";
import { User, PaginatedUsers } from "@/types/user";
import { CreateEmployeeDto } from "@/types/employee";
import { cookies } from "next/headers";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

const getAxiosConfig = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token.value}` : "",
      "Content-Type": "application/json",
    },
  };
};

export async function getAllEmployees(
  page: number = 1,
  limit: number = 1000000
): Promise<PaginatedUsers> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users?page=${page}&limit=${limit}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return { data: [], total: 0, page: 1, limit };
  }
}

export async function getEmployeeById(id: string): Promise<User | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employee:", error);
    return null;
  }
}

export async function registerEmployee(
  employee: CreateEmployeeDto
): Promise<User | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      employee,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to register employee:", error);
    return null;
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const config = await getAxiosConfig();
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, config);
    return true;
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return false;
  }
}
