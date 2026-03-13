import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Loader from "@/components/Loader";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="p-6">
        <Loader />
      </div>
    );
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <Outlet />;
}
