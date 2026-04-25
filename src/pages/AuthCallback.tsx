import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate("/login", { replace: true });
        return;
      }

      // Check if there's a pending plan selection from signup
      const plan = localStorage.getItem("selected_plan");
      if (plan) {
        localStorage.removeItem("selected_plan");
        try {
          const res = await fetch(`${API_URL}/api/billing/create-checkout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ plan }),
          });
          const body = await res.json();
          if (res.ok && body.url) {
            window.location.href = body.url;
            return;
          }
        } catch {
          // If checkout fails, continue to dashboard
        }
      }

      navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="py-20 text-center text-muted-foreground">
      Signing you in…
    </div>
  );
}
