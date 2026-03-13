import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/dashboard", { replace: true });
  }

  async function signInWithGoogle() {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="py-20">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth.login_title")}</CardTitle>
          <CardDescription>{t("auth.login_subtitle")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full"
            onClick={signInWithGoogle}
          >
            <img src="/google.png" alt="Google" width={20} height={20} />{" "}
            {t("auth.google")}
          </Button>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px w-full bg-border" />
            <span className="text-xs text-muted-foreground">
              {t("auth.or")}
            </span>
            <div className="h-px w-full bg-border" />
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error ? (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              className="w-full rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
              disabled={loading}
            >
              {loading ? t("auth.loading") : t("auth.login")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("auth.no_account")}{" "}
              <Link to="/signup" className="text-brand-sky hover:underline">
                {t("auth.go_signup")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
