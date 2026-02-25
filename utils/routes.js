/**
 * Pages where the shared Header and Footer are HIDDEN.
 * These are standalone auth flows with their own minimal layout.
 *
 * The landing page "/", "/support", and all app pages show the normal nav.
 */
export const NAV_HIDDEN_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];