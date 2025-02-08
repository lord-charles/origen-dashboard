export type NotificationType = 'balance_alert' | 'monthly_report';

export interface NotificationAdmin {
  name: string;
  email: string;
  phone: string;
  notificationTypes: NotificationType[];
  notes: string;
}

export interface NotificationConfigData {
  notificationAdmins: NotificationAdmin[];
  balanceThreshold: number;
  reportFormat: 'pdf' | 'excel' | 'csv';
  reportGenerationDay: number;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
}

export interface NotificationConfig {
  _id: string;
  key: string;
  type: string;
  data: NotificationConfigData;
  isActive: boolean;
  createdBy: string;
  suspensionPeriods: any[];
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}
