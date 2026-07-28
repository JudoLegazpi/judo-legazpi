import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acceso de administración — Club Judo Legazpi" },
      { name: "description", content: "Área privada de gestión del Club Judo Legazpi." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Acceso de administración" },
      { property: "og:description", content: "Área privada del Club Judo Legazpi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else navigate({ to: "/admin", replace: true });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) setMessage(error.message);
      else setMessage("Cuenta creada. Revisa tu correo si se pide confirmación y luego inicia sesión.");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary px-4 py-12">
      <div className="card-elevated w-full max-w-sm p-6">
        <h1 className="text-2xl">Administración</h1>
        <p className="mt-1 text-sm text-muted-foreground">Club Judo Legazpi</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-sm bg-primary px-4 font-display text-sm uppercase text-primary-foreground disabled:opacity-60"
          >
            {mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-destructive">{message}</p>}

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 text-sm text-muted-foreground underline"
        >
          {mode === "login" ? "Crear la cuenta de administración" : "Ya tengo cuenta"}
        </button>
      </div>
    </div>
  );
}
