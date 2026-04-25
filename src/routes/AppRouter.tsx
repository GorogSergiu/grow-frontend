import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import OnboardingGuard from "./OnboardingGuard";

import PublicLayout from "@/layouts/PublicLayout";
import AppLayout from "@/layouts/AppLayout";

import Landing from "@/pages/Landing";
import FeaturesPage from "@/pages/Features";
import PlansPage from "@/pages/Plans";
import TermsPage from "@/pages/Terms";
import PrivacyPage from "@/pages/Privacy";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import SelectPlan from "@/pages/SelectPlan";
import AuthCallback from "@/pages/AuthCallback";

import Dashboard from "@/features/dashboard/Dashboard";
import CalendarPage from "@/features/calendar/CalendarPage";
import StrategyPage from "@/features/strategy/StrategyPage";
import SettingsPage from "@/features/settings/SettingsPage";
import OnboardingPage from "@/features/onboarding/Onboarding";
import HowItWorksPage from "@/features/how-it-works/HowItWorksPage";
import AnalyticsPage from "@/features/analytics/AnalyticsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-plan" element={<SelectPlan />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Route>

        {/* APP (protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route element={<OnboardingGuard />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/strategy" element={<StrategyPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
              <Route path="/dashboard/calendar" element={<CalendarPage />} />
              <Route path="/dashboard/how-it-works" element={<HowItWorksPage />} />
              <Route path="/dashboard/privacy" element={<PrivacyPage />} />
              <Route path="/dashboard/terms" element={<TermsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
