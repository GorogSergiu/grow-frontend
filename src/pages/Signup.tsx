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

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordRules = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const passwordsMatch = password === confirmPassword;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!Object.values(passwordRules).every(Boolean)) {
      setError(t("auth.password_invalid"));
      return;
    }

    if (!passwordsMatch) {
      setError(t("auth.password_not_match_error"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // emailRedirectTo: window.location.origin + "/login",
      },
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
          <CardTitle>{t("auth.signup_title")}</CardTitle>
          <CardDescription>{t("auth.signup_subtitle")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full"
            onClick={signInWithGoogle}
          >
            <img src="/google.png" alt="Google" width={20} height={20} />
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="space-y-1 text-xs">
                <div className="text-muted-foreground mb-1">
                  {t("auth.password_requirements")}
                </div>
                <PasswordRule
                  ok={passwordRules.minLength}
                  text={t("auth.password_min_length")}
                />
                <PasswordRule
                  ok={passwordRules.uppercase}
                  text={t("auth.password_uppercase")}
                />
                <PasswordRule
                  ok={passwordRules.lowercase}
                  text={t("auth.password_lowercase")}
                />
                <PasswordRule
                  ok={passwordRules.number}
                  text={t("auth.password_number")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("auth.confirm_password")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {confirmPassword ? (
                <div
                  className={`text-xs ${
                    passwordsMatch ? "text-green-600" : "text-destructive"
                  }`}
                >
                  {passwordsMatch
                    ? t("auth.passwords_match")
                    : t("auth.passwords_not_match")}
                </div>
              ) : null}
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
              {loading ? t("auth.loading") : t("auth.signup")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("auth.have_account")}{" "}
              <Link to="/login" className="text-brand-sky hover:underline">
                {t("auth.go_login")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function PasswordRule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${
        ok ? "text-green-600" : "text-muted-foreground"
      }`}
    >
      <span>{ok ? "✓" : "•"}</span>
      <span>{text}</span>
    </div>
  );
}
