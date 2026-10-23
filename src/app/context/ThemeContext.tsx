import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeCtx {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: "light", resolvedTheme: "light", isDark: false, setTheme: () => {},
});

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark" || value === "system";

const getSystemTheme = (): ResolvedTheme =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark" : "light";

const resolve = (t: Theme): ResolvedTheme => (t === "system" ? getSystemTheme() : t);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem("dos-theme");
      return isTheme(savedTheme) ? savedTheme : "light";
    } catch {
      return "light";
    }
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolve(theme));

  useEffect(() => {
    const resolved = resolve(theme);
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme = resolved;
    try { localStorage.setItem("dos-theme", theme); } catch {}
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const r: ResolvedTheme = e.matches ? "dark" : "light";
      setResolvedTheme(r);
      document.documentElement.classList.toggle("dark", r === "dark");
      document.documentElement.style.colorScheme = r;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <Ctx.Provider value={{ theme, resolvedTheme, isDark: resolvedTheme === "dark", setTheme: setThemeState }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
