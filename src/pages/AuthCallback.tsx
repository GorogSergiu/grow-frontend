import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase finalizează sesiunea automat după redirect,
    // noi doar redirecționăm userul mai departe.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard", { replace: true });
      else navigate("/login", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="py-20 text-center text-muted-foreground">
      Signing you in…
    </div>
  );
}
