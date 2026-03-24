"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppRole, useStore } from "@/store/useStore";
import { 
  LayoutDashboard, 
  Database, 
  ArrowDownToLine, 
  Boxes, 
  ArrowUpFromLine, 
  Package2,
  Blocks,
  Map as MapIcon,
  History,
  Search,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE', 'PURCHASING', 'RESOURCES', 'PRODUCTION', 'SHIPMENT'] },
  { name: "Master Data", href: "/master-data/products", icon: Database, roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'PURCHASING'] },
  { name: "Inbound", href: "/inbound/receiving", icon: ArrowDownToLine, roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'PURCHASING', 'WAREHOUSE_OPERATOR'] },
  { name: "Inventory", href: "/inventory/stock", icon: Boxes, roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE', 'WAREHOUSE_OPERATOR'] },
  { name: "Outbound", href: "/outbound/orders", icon: ArrowUpFromLine, roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'SHIPMENT', 'WAREHOUSE_OPERATOR'] },
  { name: "Audit Trail", href: "/audit-logs", icon: History, roles: ['SUPER_ADMIN', 'TENANT_ADMIN'] },
  { name: "Add-ons", href: "/addons", icon: Blocks, roles: ['SUPER_ADMIN', 'TENANT_ADMIN'] },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  let rawRole = useStore((state) => state.role) as string;
  const activeModules = useStore((state) => state.activeModules) || [];
  
  // Auto-migrate cached old roles from local storage
  if (rawRole === "admin") rawRole = "TENANT_ADMIN";
  if (rawRole === "operator") rawRole = "WAREHOUSE_OPERATOR";
  
  const role = rawRole as AppRole;
  const pathname = usePathname();

  const dynamicMenuItems = [...menuItems];
  
  // Inject activated Add-ons dynamically into the sidebar before the Settings/Addons item
  if (activeModules.includes('layout-routing')) {
    dynamicMenuItems.splice(dynamicMenuItems.length - 1, 0, {
      name: "Layout & Rute",
      href: "/layout-routing",
      icon: MapIcon,
      roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'WAREHOUSE_OPERATOR']
    });
  }

  const filteredItems = dynamicMenuItems.filter((item) => item.roles.includes(role));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Package2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-base">WMS Panel</span>
                  <span className="text-xs text-muted-foreground">Role: {role}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="bg-[#f9fafb] dark:bg-zinc-950 px-2">
        {/* Search Bar matching the reference */}
        <div className="px-2 pt-4 pb-2">
          <div className="relative flex items-center w-full h-10 rounded-xl bg-gray-100 dark:bg-zinc-900/50 px-3 text-gray-400 dark:text-zinc-500 transition-colors focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-200 focus-within:shadow-sm dark:focus-within:bg-zinc-900 dark:focus-within:ring-zinc-800">
            <Search className="w-5 h-5 shrink-0" />
            <input 
              type="text" 
              placeholder="Search" 
              className="flex-1 w-full bg-transparent border-none outline-none px-3 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-500" 
            />
            <div className="bg-white dark:bg-zinc-800 rounded-md shadow-sm px-1.5 py-0.5 text-xs font-mono font-medium text-gray-400 border border-gray-200 dark:border-zinc-700">/</div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {filteredItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      tooltip={item.name}
                      className={`h-11 rounded-xl transition-all duration-200 px-3 flex items-center gap-3 ${
                        isActive 
                          ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] font-semibold border border-gray-100 dark:border-zinc-700/50" 
                          : "text-gray-500 font-medium dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100/80 dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      <Link href={item.href}>
                        <item.icon className="w-5 h-5" style={{ strokeWidth: isActive ? 2.5 : 2 }} />
                        <span className="text-base">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
