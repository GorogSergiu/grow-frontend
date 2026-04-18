import { apiFetch } from "@/api/client";

export function getMe() {
  return apiFetch("/api/me");
}
