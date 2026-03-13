import { apiFetch } from "./https";

export function getMe() {
  return apiFetch("/api/me");
}