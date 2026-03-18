"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReferralRedirect({ code }) {
  const router = useRouter();

  useEffect(() => {
    // 1. Save the referral code to localStorage (30-day expiry)
    if (code) {
      try {
        localStorage.setItem(
          "referral_code",
          JSON.stringify({
            code,
            expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
          })
        );
      } catch {
        // localStorage unavailable — silently ignore
      }
    }

    // 2. Redirect to the main landing page
    router.replace("/");
  }, [code, router]);

  // Render nothing — the redirect is instant
  return null;
}