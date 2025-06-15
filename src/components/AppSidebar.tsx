
import { Home, Package, Layers, FileText, Settings, Play, Upload } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Namespaces",
    url: "/namespaces",
    icon: Package,
  },
  {
    title: "Interfaces",
    url: "/interfaces",
    icon: Layers,
  },
  {
    title: "Clases",
    url: "/classes",
    icon: FileText,
  },
  {
    title: "Métodos",
    url: "/methods",
    icon: Settings,
  },
  {
    title: "Ejecución",
    url: "/execution",
    icon: Play,
  },
  {
    title: "Transformadores",
    url: "/transformers",
    icon: Upload,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ObjectSim</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
