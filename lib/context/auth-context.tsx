"use client";

import { authenticate } from "@/lib/auth/mock-users";
import { User } from "@/lib/types/user";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    const authStatus = Cookies.get("authStatus") === "true";
    const storedUser = Cookies.get("user");
    if (authStatus && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (uen: string, corpPassId: string) => {
    try {
      const authenticatedUser = await authenticate({ uen, corpPassId });
      if (authenticatedUser) {
        // Set cookies to expire in 24 hours
        const cookieOptions = {
          expires: 1 / 24, // 1 hour
          secure: true, // Only send over HTTPS
          sameSite: "strict" as const, // Protect against CSRF
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
