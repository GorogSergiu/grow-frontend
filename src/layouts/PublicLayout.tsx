import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background (tokens only) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-brand-cream via-background to-background" />

      <Navbar />

      <main className="mx-auto max-w-6xl px-4">
        <Outlet />
      </main>
    </div>
  );
}
