import axios, { AxiosInstance } from "axios";
import { TokenService } from "./token";

class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = TokenService.getToken();
        // if (token) {
        config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzdhNWFjMDA2MGFiNTEzOGY3N2ZlNWEiLCJlbWFpbCI6ImNtaWh1bnlvQHN0cmF0aG1vcmUuZWR1Iiwicm9sZXMiOlsiZW1wbG95ZWUiLCJociJdLCJpYXQiOjE3MzY0ODc1NTIsImV4cCI6MTczNjU3Mzk1Mn0.x65vjVIPF28DgWZSTKPx-tTguDdvW78PCPENlk6Yei0`;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          TokenService.clearAll();
          // Redirect to login or handle as needed
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

export default ApiClient.getInstance().getAxiosInstance();
