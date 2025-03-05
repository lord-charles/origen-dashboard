"use server";

import axios, { AxiosError } from "axios";
import { PaginatedUsers } from "@/types/user";
import { cookies } from "next/headers";
import { PaymentTransaction } from "@/types/wallet";
import { UtilityTransactionResponse } from "@/types/utility";
import { endOfMonth, startOfMonth } from "date-fns";
import { redirect } from "next/navigation";

export async function handleUnauthorized() {
  "use server";
  redirect("/unauthorized");
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
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to fetch employees:", error);
    return { data: [], total: 0, page: 1, limit };
  }
}

export async function  getWalletTransactions(
  params: {
    startDate?: string;
    endDate?: string;
  } = {}
) {
  try {
    const now = new Date();
    const defaultEndDate = endOfMonth(now).toISOString();
    const defaultStartDate = startOfMonth(now).toISOString();

    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/wallet-transactions`,
      {
        ...config,
        params: {
          startDate: params.startDate || defaultStartDate,
          endDate: params.endDate || defaultEndDate,
          limit: 20000,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to fetch wallet transactions:", error);
    return { data: [], total: 0, page: 1, limit: 10 };
  }
}

export async function getPaymentTransactions(
  params: {
    startDate?: string;
    endDate?: string;
  } = {}
) {
  try {
    const now = new Date();
    const defaultEndDate = endOfMonth(now).toISOString();
    const defaultStartDate = startOfMonth(now).toISOString();

    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/transactions`,
      {
        ...config,
        params: {
          startDate: params.startDate || defaultStartDate,
          endDate: params.endDate || defaultEndDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to fetch payment transactions:", error);
    throw error;
  }
}

export async function getUtilityTransactions(
  params: {
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<UtilityTransactionResponse> {
  try {
    const now = new Date();
    const defaultEndDate = endOfMonth(now).toISOString();
    const defaultStartDate = startOfMonth(now).toISOString();

    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/mpesa-audit`,
      {
        ...config,
        params: {
          startDate: params.startDate || defaultStartDate,
          endDate: params.endDate || defaultEndDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to fetch utility transactions:", error);
    return { data: { transactions: [], pagination: { total: 0, page: 1, limit: 10 } } };
  }
}
