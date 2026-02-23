"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "../utils/api";
import { resetNotificationCache } from "../services/notificationService";

export const AuthContext = createContext(null);

// ─── Cookie helpers ──────────────────────────────────────────────────────────
function setCookie(name, value) {
  document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
}

function clearCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Prevent double execution (React 18 StrictMode)
  const hasCheckedAuth = useRef(false);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      const res = await api.get("/me");
      const userData = res.data.user ?? res.data;
      setUser(userData);

      // Keep cookies in sync with localStorage token
      setCookie("auth_token", token);
      setCookie("user_role", userData?.role || "user");
    } catch (err) {
      console.error("Auth check failed:", err);

      resetNotificationCache();

      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;

      // Clear middleware cookies
      clearCookie("auth_token");
      clearCookie("user_role");

      setUser(null);

      localStorage.setItem("redirectAfterLogin", pathname);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });

      const token =
        res.data?.token ||
        res.data?.access_token ||
        res.data?.data?.token;

      if (!token) throw new Error("Token not returned");

      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // Prefer backend user object, else fetch it
      let userData = res.data?.user || null;
      if (userData) {
        setUser(userData);
      } else {
        await checkAuth();
        userData = user;
      }

      // Set cookies so middleware.js can protect routes immediately
      setCookie("auth_token", token);
      setCookie("user_role", userData?.role || "user");

      // Redirect to saved path or dashboard
      const redirectPath =
        localStorage.getItem("redirectAfterLogin") || "/dashboard";
      localStorage.removeItem("redirectAfterLogin");

      router.replace(redirectPath);
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    api.post("/logout").catch(() => {});

    resetNotificationCache();

    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;

    // Clear middleware cookies
    clearCookie("auth_token");
    clearCookie("user_role");

    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);