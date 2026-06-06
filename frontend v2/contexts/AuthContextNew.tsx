// src/contexts/AuthContextNew.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "../utils/axiosInstance";

interface AuthContextType {
  user: any;
  loading: boolean;
  sendOtp: (phone: string, fullName: string) => Promise<any>;
  verifyOtp: (phone: string, code: string) => Promise<any>;
  loginSendOtp: (phone: string) => Promise<any>;
  loginVerifyOtp: (phone: string, code: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProviderNew({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(() =>
    localStorage.getItem("accessToken") ? "pending" : null,
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        if (res.data.success) {
          setUser(res.data.user); // replaces "pending" with real user
        } else {
          setUser(null); // clear if /auth/me says not authenticated
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const sendOtp = async (phone: string, fullName: string) => {
    try {
      const res = await axiosInstance.post("/signup/send-otp", {
        full_name: fullName,
        phone_number: phone,
      });
      return res.data;
    } catch {
      return { success: false };
    }
  };

  const verifyOtp = async (phone: string, code: string) => {
    try {
      const res = await axiosInstance.post("/signup/verify-otp", {
        phone_number: phone,
        code,
      });

      const data = res.data;
      if (data.success) {
        setUser(data.user);
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
      }

      return data;
    } catch {
      return { success: false };
    }
  };

  const loginSendOtp = async (phone: string) => {
    try {
      const res = await axiosInstance.post("/login/send-otp", {
        phone_number: phone,
      });
      return res.data;
    } catch {
      return { success: false };
    }
  };

  const loginVerifyOtp = async (phone: string, code: string) => {
    try {
      const res = await axiosInstance.post("/login/verify-otp", {
        phone_number: phone,
        code,
      });

      const data = res.data;
      if (data.success) {
        setUser(data.user);
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
      }

      return data;
    } catch {
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
      setUser(null);
      localStorage.removeItem("accessToken");
      return { success: true };
    } catch (err) {
      return { success: false, message: "Logout failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sendOtp,
        verifyOtp,
        loginSendOtp,
        loginVerifyOtp,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProviderNew");
  }
  return context;
}
