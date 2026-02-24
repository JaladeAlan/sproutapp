"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const NO_CHROME_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-verify",
  "/set-new-password",
  "/verify-email",
  "/email-verified",
];

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (NO_CHROME_ROUTES.includes(pathname)) return null;
  return <Header />;
}