import { Suspense } from "react";

// ─── Env ──────────────────────────────────────────────────────────────────────

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Sproutvest";
const APP_URL  = process.env.NEXT_PUBLIC_APP_URL  || "https://sproutapp-eta.vercel.app";

// ─── OG Metadata (server-side — social crawlers get proper preview tags) ──────

export async function generateMetadata({ params }) {
  const code = params?.code ?? "";

  let referrerName = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/referrals/info/${code}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const json = await res.json();
      referrerName =
        json?.data?.name ??
        json?.data?.referrer_name ??
        json?.name ??
        null;
    }
  } catch {}

  const title = referrerName
    ? `${referrerName} invited you to ${APP_NAME}`
    : `You've been invited to ${APP_NAME}`;

  const description =
    `Invest in fully verified land across Nigeria — starting from just ₦5,000. ` +
    `Join ${APP_NAME} today and start building real wealth.`;

  const ogImage = `${APP_URL}/og-referral.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${APP_URL}/r/${code}`,
      siteName: APP_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${APP_NAME} — Invest in Verified Land` }],
      type: "website",
      locale: "en_NG",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: false, follow: false },
  };
}

// ─── Client redirect component ────────────────────────────────────────────────

// Kept in a separate file so the page itself stays a Server Component.
// Create this at: app/r/[code]/ReferralRedirect.jsx
import ReferralRedirect from "./ReferralRedirect";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReferralLanding({ params }) {
  const code = params?.code ?? "";

  return (
    <Suspense fallback={null}>
      <ReferralRedirect code={code} />
    </Suspense>
  );
}