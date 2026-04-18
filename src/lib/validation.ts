export type PasswordRules = {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
};

export function getPasswordRules(password: string): PasswordRules {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
}

export function isPasswordValid(rules: PasswordRules): boolean {
  return Object.values(rules).every(Boolean);
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}
