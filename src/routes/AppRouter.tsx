import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import OnboardingGuard from "./OnboardingGuard";

import PublicLayout from "@/layouts/PublicLayout";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/components/app/Dashboard";
import AuthCallback from "@/pages/AuthCallback";
import AppLayout from "@/layouts/AppLayout";
import Settings from "@/components/app/Settings";
import Calendar from "@/components/app/Calendar";
import OnboardingPage from "@/pages/onboarding/Onboarding";
import StrategyPage from "@/components/app/Strategy";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Route>

        {/* APP (protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route element={<OnboardingGuard />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* optional placeholders */}
              <Route path="/dashboard/strategy" element={<StrategyPage />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/calendar" element={<Calendar />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
