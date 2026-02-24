"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import { GUEST_ROUTES } from "../../utils/routes";

export default function ConditionalHeader() {
  const pathname = usePathname();

  const isGuestPage = GUEST_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isGuestPage) return null;
  return <Header />;
}