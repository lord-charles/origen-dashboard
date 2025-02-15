"use server";

import axios, { AxiosError } from "axios";
import { Advance, AdvanceConfig, PaginatedAdvances } from "@/types/advance";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { endOfMonth, startOfMonth } from "date-fns";

export interface GetAdvancesParams {
  page?: number;
  limit?: number;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}

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

export async function getAdvances({
  page = 1,
  limit = 1000,
  startDate,
  endDate,
}: GetAdvancesParams = {}): Promise<PaginatedAdvances> {
  try {
    const now = new Date();
    const defaultEndDate = endOfMonth(now).toISOString();
    const defaultStartDate = startOfMonth(now).toISOString();

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      startDate: startDate || defaultStartDate,
      endDate: endDate || defaultEndDate,
    });

    const config = await getAxiosConfig();

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/advances?${queryParams.toString()}`,
      config
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to fetch advances:", error);
    return { data: [], total: 0, page: 1, limit: 10 };
  }
}

export async function getAdvanceById(id: string): Promise<Advance | null> {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/advances/${id}`,
      config
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to fetch advance details:", error);
    throw error;
  }
}

export async function createAdvance(
  advanceData: Partial<Advance>
): Promise<Advance | null> {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/advances`,
      advanceData,
      config
    );
    return data;
  } catch (error) {
    console.error("Failed to create advance:", error);
    throw error;
  }
}

export async function updateAdvance(
  id: string,
  advanceData: Partial<Advance>
): Promise<Advance | null> {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/advances/${id}`,
      advanceData,
      config
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to update advance:", error);
    throw error;
  }
}

export async function updateAdvanceStatus(
  id: string,
  status: string,
  comments?: string
): Promise<Advance | null> {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/advances/${id}/status`,
      { status, comments },
      config
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to update advance status:", error);
    throw error;
  }
}

export async function getAdvanceConfig(): Promise<AdvanceConfig> {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/system-config/advance/config`,
      config
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to fetch advance configuration:", error);
    throw error;
  }
}

export interface AddSuspensionPeriodParams {
  startDate: string;
  endDate: string;
  reason: string;
  isActive: boolean;
}

export async function addSuspensionPeriod(
  params: AddSuspensionPeriodParams
): Promise<any> {
  try {
 
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/system-config/advance_config/suspension-periods`,
      params,
      config
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    console.error("Failed to add suspension period:", error);
    throw error;
  }
}

export async function updateSuspensionPeriod({
  _id,
  startDate,
  endDate,
  reason,
  isActive,
}: {
  _id: string;
  startDate: string;
  endDate: string;
  reason: string;
  isActive: boolean;
}) {
  try {

    const config = await getAxiosConfig();
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/system-config/advance_config/suspension-periods/${_id}`, 
      {
        startDate,
        endDate,
        reason,
        isActive,
        id: _id,
      },
      config
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error;
  }
}

export async function deleteSuspensionPeriod(_id: string) {
  try {

    const config = await getAxiosConfig();
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/system-config/advance_config/suspension-periods/${_id}`,
      config
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error;
  }
}

interface UpdateAdvanceConfigParams {
  advanceDefaultInterestRate?: number;
  advanceMinAmount?: number;
  advanceMaxAmount?: number;
  advanceMinRepaymentPeriod?: number;
  advanceMaxRepaymentPeriod?: number;
  maxAdvancePercentage?: number;
  maxActiveAdvances?: number;
}

export async function updateAdvanceConfig(params: UpdateAdvanceConfigParams) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/system-config/advance_config/advance-config`,
      params,
      config
    );
    return data;
  } catch (error) {

    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error;
  }
}

export async function generateReport(format: 'csv' | 'excel'): Promise<Blob> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/reports/generate?format=${format}`,
      {
        ...config,
        responseType: 'arraybuffer',
      }
    );
    
    const mimeType = format === 'excel' 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv';
    
    return new Blob([response.data], { type: mimeType });
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    console.error("Failed to generate report:", error);
    throw error;
  }
}
