"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import { GUEST_ROUTES } from "../../utils/routes";

export default function ConditionalFooter() {
  const pathname = usePathname();

  const isGuestPage = GUEST_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isGuestPage) return null;
  return <Footer />;
}