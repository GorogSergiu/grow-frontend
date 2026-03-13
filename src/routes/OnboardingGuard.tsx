import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function OnboardingGuard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        navigate("/login", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", userId)
        .single();

      if (cancelled) return;

      if (error) {
        // dacă ai un error aici, mai bine NU redirectăm în loop
        setChecking(false);
        return;
      }

      if (!data?.onboarding_completed) {
        navigate("/onboarding", { replace: true });
        return;
      }

      setChecking(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (checking)
    return (
      <div className="py-20 text-center text-muted-foreground">Loading…</div>
    );

  return <Outlet />;
}
