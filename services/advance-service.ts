import api from "@/utils/api";
import { AxiosError } from "axios";
import { Advance, PaginatedAdvances } from "@/types/advance";
import { toast } from "sonner";
import { TokenService } from "@/utils/token";

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

function handleApiError(error: unknown, defaultMessage: string): never {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      toast("Session expired. Please login again.");
      TokenService.clearAll();
      // window.location.href = "/auth/login";
      throw new ApiError(401, "Session expired");
    }

    const data = error.response?.data;
    throw new ApiError(
      error.response?.status ?? 500,
      data?.message ?? defaultMessage,
      data
    );
  }
  throw new ApiError(500, defaultMessage);
}

export const advanceService = {
  async getAdvances({
    page = 1,
    limit = 10,
  }: GetAdvancesParams = {}): Promise<PaginatedAdvances> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const { data } = await api.get(`/advances?${queryParams.toString()}`);
      return data;
    } catch (error) {
      handleApiError(error, "Failed to fetch advances");
    }
  },

  async getAdvanceById(id: string): Promise<Advance> {
    try {
      const { data } = await api.get(`/advances/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Failed to fetch advance details");
    }
  },

  async createAdvance(advanceData: Partial<Advance>): Promise<Advance> {
    try {
      const { data } = await api.post("/advances", advanceData);
      toast.success("Advance created successfully");
      return data;
    } catch (error) {
      handleApiError(error, "Failed to create advance");
    }
  },

  async updateAdvance(
    id: string,
    advanceData: Partial<Advance>
  ): Promise<Advance> {
    try {
      const { data } = await api.patch(`/advances/${id}`, advanceData);
      toast.success("Advance updated successfully");
      return data;
    } catch (error) {
      handleApiError(error, "Failed to update advance");
    }
  },
};
