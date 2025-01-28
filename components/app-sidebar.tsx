"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  LayoutDashboard,
  Users,
  DollarSign,
  BarChart2,
  Settings,
  Wallet,
} from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      title: "Employee Management",
      url: "#",
      icon: "Users",
      items: [
        {
          title: "All Employees",
          url: "/employees",
        },
        {
          title: "New Employee",
          url: "/employee/new",
        },
      ],
    },
    {
      title: "Advance Management",
      url: "#",
      icon: "DollarSign",
      items: [
        {
          title: "Salary Advances",
          url: "/advance",
        },
        // {
        //   title: "Loan Advances",
        //   url: "/advances/loan",
        // },
      ],
    },
    {
      title: "Wallet Management",
      url: "#",
      icon: "Wallet",
      items: [
        {
          title: "Innova Wallet",
          url: "/wallet",
        }
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: "BarChart2",
    },
    {
      title: "Settings",
      url: "/settings",
      icon: "Settings",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const [currentPath, setCurrentPath] = React.useState("");

  React.useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const isActive = (url: string) => {
    if (url === "#") return false;
    return currentPath === url || currentPath.startsWith(url);
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="pb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <GalleryVerticalEnd className="size-5" />
                </div>
                <div className="flex flex-col gap-0 leading-none">
                  <span className="text-lg font-semibold">Innova Limited</span>
                  <span className="text-sm text-muted-foreground">
                    Admin Dashboard
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-4">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`rounded-lg p-3.5 transition-all duration-200 hover:bg-accent/50 ${
                    isActive(item.url)
                      ? "bg-accent font-medium shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <a href={item.url} className="text-base">
                    {item.icon && (
                      <span
                        className={`mr-4 inline-flex ${
                          isActive(item.url)
                            ? "text-blue-600"
                            : "text-muted-foreground text-blue-600"
                        }`}
                      >
                        {(() => {
                          const iconProps = {
                            className: "h-5 w-5 transition-colors duration-200",
                          };
                          switch (item.icon) {
                            case "LayoutDashboard":
                              return <LayoutDashboard {...iconProps} />;
                            case "Users":
                              return <Users {...iconProps} />;
                            case "DollarSign":
                              return <DollarSign {...iconProps} />;
                            case "Wallet":
                              return <Wallet {...iconProps} />;
                            case "BarChart2":
                              return <BarChart2 {...iconProps} />;
                            case "Settings":
                              return <Settings {...iconProps} />;
                            default:
                              return null;
                          }
                        })()}
                      </span>
                    )}
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-9 mt-2.5 space-y-1.5 border-l border-muted pl-4">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={`rounded-md p-2.5 transition-all duration-200 hover:bg-accent/50 ${
                            isActive(subItem.url)
                              ? "bg-accent font-medium text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <a href={subItem.url} className="text-sm">
                            {subItem.title}
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-accent rounded-md">
        {session?.user && <NavUser user={session.user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
