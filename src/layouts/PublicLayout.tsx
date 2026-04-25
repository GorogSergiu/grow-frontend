import { Outlet } from "react-router-dom";
import { PublicNavbar } from "@/features/navigation/PublicNavbar";
import { PublicFooter } from "@/features/navigation/PublicFooter";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background (tokens only) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-brand-cream via-background to-background" />

      <PublicNavbar />

      <main className="mx-auto max-w-6xl px-4">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}
