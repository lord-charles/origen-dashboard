"use server";
import axios, { AxiosError } from "axios";
import { NotificationConfig, NotificationAdmin, NotificationConfigData } from "@/types/notification";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

export async function getNotificationConfig(): Promise<NotificationConfig> {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/system-config/notification`,
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

interface RequiredNotificationSettings {
  balanceThreshold: number;
  reportFormat: 'pdf' | 'excel' | 'csv';
  reportGenerationDay: number;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
}

export async function updateNotificationConfig(
  params: RequiredNotificationSettings
): Promise<NotificationConfig> {
  try {
    const config = await getAxiosConfig();
    
    // Ensure all required fields are present and properly typed
    const payload = {
      balanceThreshold: Number(params.balanceThreshold),
      reportFormat: params.reportFormat,
      reportGenerationDay: Number(params.reportGenerationDay),
      enableEmailNotifications: Boolean(params.enableEmailNotifications),
      enableSMSNotifications: Boolean(params.enableSMSNotifications),
    };

    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/system-config/notification/settings`,
      payload,
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

interface AddNotificationAdminParams {
  name: string;
  email: string;
  phone: string;
  notificationTypes: ("balance_alert" | "monthly_report")[];
  notes: string;
}

export async function addNotificationAdmin(
  admin: AddNotificationAdminParams
): Promise<NotificationConfig> {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/system-config/notification/admins`,
      admin,
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

export async function deleteNotificationAdmin(
  email: string
): Promise<NotificationConfig> {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/system-config/notification/admins/${email}`,
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
