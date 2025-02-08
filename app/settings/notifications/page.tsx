import AdminNotificationConfig from "./admin-notification-config";
import { getNotificationConfig } from "@/services/notification-service";

export default async function NotificationsPage() {
  const initialConfig = await getNotificationConfig();

  return (
    <div>
      <AdminNotificationConfig initialConfig={initialConfig} />
    </div>
  );
}
