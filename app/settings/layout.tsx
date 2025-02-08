import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import { Card } from "@/components/ui/card";
import DashboardProvider from "../dashboard-provider";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

const sidebarNavItems: {
  title: string;
  href: string;
  icon?: "user" | "settings" | "bell" | "palette";
}[] = [
  {
    title: "Profile",
    href: "/settings",
    icon: "user",
  },
  {
    title: "Advance",
    href: "/settings/advance",
    icon: "settings",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: "bell",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: "palette",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <DashboardProvider>
      <Header />
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and set email preferences.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col lg:flex-row lg:space-x-12">
            <aside className="lg:w-1/7">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-7xl">{children}</div>
          </div>
        </div>
    </DashboardProvider>
  );
}
