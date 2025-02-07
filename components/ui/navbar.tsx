"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/context/auth-context";
import { ChevronsUpDown, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavBarProps {
  userName: string;
  userUen: string;
  corpPassId: string;
}

export function NavBar({ userName, userUen, corpPassId }: NavBarProps) {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="bg-background border-b border-[#E4E4E7] h-[64px] w-full">
      <div className="container mx-auto px-3 w-full h-full flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/checkup-logo.svg"
              alt="MedEx Logo"
              width={120}
              height={40}
              priority
            />
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className={`font-inter text-[14px] font-medium leading-[20px] no-underline 
                ${
                  pathname === "/dashboard"
                    ? "text-[#09090B]"
                    : "text-[#71717A] hover:text-[#09090B]"
                } 
                transition-colors`}
            >
              Dashboard
            </Link>
            <Link
              href="/medical-exam/select"
              className={`font-inter text-[14px] font-medium leading-[20px] no-underline 
                ${
                  pathname === "/medical-exam/select"
                    ? "text-[#09090B]"
                    : "text-[#71717A] hover:text-[#09090B]"
                } 
                transition-colors`}
            >
              Medical Exams
            </Link>
          </nav>
        </div>

        {/* Desktop view - show user dropdown */}
        <div className="hidden md:block">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-[198px] h-[40px] min-h-[40px] px-4 py-2 justify-between border border-[#E4E4E7] rounded-md text-[#71717A] hover:text-[#09090B] transition-colors hover:bg-transparent"
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-inter text-[14px] font-medium leading-[20px] text-left underline-position-from-font text-decoration-skip-ink-none text-[#09090B]">
                    {userName}
                  </span>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-[#09090B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">UEN: {userUen}</p>
                <p className="text-xs text-muted-foreground">
                  Corppass ID: {corpPassId}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile view - show hamburger menu */}
        {/* Mobile view - show hamburger menu */}
        <div className="md:hidden w-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 p-0">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">UEN: {userUen}</p>
                <p className="text-xs text-muted-foreground">
                  Corppass ID: {corpPassId}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
