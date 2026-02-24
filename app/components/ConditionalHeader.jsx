"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const GUEST_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export default function ConditionalHeader() {
  const pathname = usePathname();

  const isGuestPage = GUEST_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isGuestPage) return null;
  return <Header />;
}