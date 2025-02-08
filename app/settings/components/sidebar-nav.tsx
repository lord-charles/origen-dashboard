"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Settings, Bell, Palette } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const iconMap = {
  user: User,
  settings: Settings,
  bell: Bell,
  palette: Palette,
};

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon?: keyof typeof iconMap;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  // If we're at the root settings path, we want the first item to be selected
  const isRootPath = pathname === "/settings";
  const defaultSelected = isRootPath ? items[0]?.href : pathname;

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const Icon = item.icon ? iconMap[item.icon] : null;
        const isSelected = item.href === defaultSelected;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-x-2 px-4 py-2 text-sm font-medium transition-all",
              "border-b-2 lg:border-b-0 lg:border-l-2",
              isSelected
                ? "border-primary text-primary bg-primary/5 hover:bg-primary/10"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
              "rounded-none"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
