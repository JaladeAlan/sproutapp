"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

export default function AdminGuard({ children }) {
  const router = useRouter();
  // "loading" | "authorized" | "unauthorized"
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api.get("/me")
      .then((res) => {
        const user = res.data?.data ?? {};
        setStatus(user.is_admin === true ? "authorized" : "unauthorized");
      })
      .catch(() => {
        setStatus("unauthorized");
      });
  }, []);

  useEffect(() => {
    if (status === "unauthorized") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0D1F1A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status !== "authorized") return null;

  return children;
}