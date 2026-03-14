import { Outlet } from "react-router-dom";
import { AppNavbar } from "@/components/app/AppNavbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNavbar />

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
