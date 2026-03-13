import { ThemeProvider } from "@/components/theme-provider";
import AppRouter from "@/routes/AppRouter";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="creatorstrategy-theme">
      <AppRouter />
    </ThemeProvider>
  );
}
