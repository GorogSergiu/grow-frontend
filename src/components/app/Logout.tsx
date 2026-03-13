import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function LogoutSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);

    await supabase.auth.signOut();

    navigate("/login", { replace: true });
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-6">
      <div>
        <div className="font-medium">Logout</div>
        <div className="text-sm text-muted-foreground">
          Sign out from your account
        </div>
      </div>

      <Button
        variant="destructive"
        className="rounded-full cursor-pointer"
        onClick={logout}
        disabled={loading}
      >
        {loading ? "Logging out…" : "Logout"}
      </Button>
    </div>
  );
}
