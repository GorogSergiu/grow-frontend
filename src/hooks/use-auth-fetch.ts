import { supabase } from "@/lib/supabase";

/**
 * Returns a helper that retrieves the current Supabase access token.
 * Use this instead of repeating the supabase.auth.getSession() pattern
 * in every component.
 */
export function useAuthFetch() {
  const getAccessToken = async (): Promise<string | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  return { getAccessToken };
}
