"use client";

import { authenticate } from "@/lib/auth/mock-users";
import { User } from "@/lib/types/user";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  login: (uen: string, corpPassId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    const authStatus = Cookies.get("authStatus") === "true";
    const storedUser = Cookies.get("user");
    if (authStatus && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no valid auth, redirect to login
      if (pathname !== "/login" && pathname !== "/") {
        router.push("/login");
      }
    }
  }, [router, pathname]);

  const login = async (uen: string, corpPassId: string) => {
    try {
      const authenticatedUser = await authenticate({ uen, corpPassId });
      if (authenticatedUser) {
        // Set cookies to expire in 3 hours
        const cookieOptions = {
          expires: 3 / 24, // 3 hours
          secure: process.env.NODE_ENV === "production", // Only HTTPS in prod
          sameSite: "lax" as const, // Allow redirect from login
        };

        Cookies.set("user", JSON.stringify(authenticatedUser), cookieOptions);
        Cookies.set("authStatus", "true", cookieOptions);
        setUser(authenticatedUser);
        router.push("/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
    Cookies.remove("authStatus");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
