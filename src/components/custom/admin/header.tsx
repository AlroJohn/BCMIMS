"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import LogoutWrapper from "../custom-ui/logout-button";
import { DynamicBreadcrumb } from "./admin-breadcrumb-route";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function Header() {
  const router = useRouter();
  const { role } = useAuth();

  const handleProfileClick = () => {
    if (role === "Admin") {
      router.push("/admin/profile");
    } else {
      router.push("/committee/profile");
    }
  };

  return (
    <header className="flex justify-between items-center h-16 shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <DynamicBreadcrumb />
      </div>
      <div className="flex items-center gap-2  px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full overflow-hidden"
            >
              <Avatar>
                <AvatarImage src="/" alt="User" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutWrapper>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </LogoutWrapper>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
