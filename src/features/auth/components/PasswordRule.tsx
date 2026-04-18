export function PasswordRule({ ok, text }: { ok: boolean; text: string }) {
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
