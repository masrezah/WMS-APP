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
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link href={item.href}>
                        <item.icon />
                        <span className={isActive ? "font-semibold" : ""}>{item.name}</span>
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
