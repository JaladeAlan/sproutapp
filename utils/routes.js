/**
 * Routes that don't require authentication and belong to the
 * "guest" / marketing shell (no Header / Footer).
 *
 * Import this anywhere you need the same list rather than
 * duplicating it across ConditionalHeader, ConditionalFooter, middleware, etc.
 */
export const GUEST_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];