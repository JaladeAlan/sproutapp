import { getToken } from "./tokenStore";
import api from "./api";

export async function checkAuth() {
  if (typeof window === "undefined") return false;
  const token = getToken();
  if (!token) return false;

  try {
    const res = await api.get("/me");
    return res.status === 200;
  } catch {
    return false;
  }
}