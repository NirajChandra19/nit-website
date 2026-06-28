"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  name: string;
  reg_id: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; studentId?: number; message: string }>;
  completeLogin: (user: User) => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const checkAuth = async () => {
    try {
      // ADDED: credentials: 'include'
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        // User is not logged in (Guest)
        setUser(null);
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user); // This will now succeed!
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Network failure during auth check:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  checkAuth();
}, []);

  interface LoginResponse {
    success: boolean;
    requires2FA?: boolean;
    studentId?: number;
    message: string;
  }

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.requires2FA) {
          return { success: true, requires2FA: true, studentId: data.studentId, message: "2FA verification required." };
        }
        setUser(data.user);
        return { success: true, message: `Welcome back, ${data.user.name}!` };
      } else {
        return { success: false, message: data.error || "Invalid email or password." };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: "Connection error. Please try again." };
    }
  };

  const completeLogin = (userData: User) => {
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || "Registration failed." };
      }
    } catch (error) {
      console.error("Registration Error:", error);
      return { success: false, message: "Connection error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, completeLogin, register, logout, isAuthenticated: !!user, isLoading }}>
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
