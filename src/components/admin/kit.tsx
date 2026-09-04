import { Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "min-h-11 w-full rounded-2xl border border-input bg-background px-3 outline-none focus:border-primary";

export function PrimaryButton({
  children,
  className,
  busy,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || busy}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-5 font-display text-sm uppercase text-primary-foreground disabled:opacity-60",
        className,
      )}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function DarkButton({
  children,
  className,
  busy,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || busy}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-2xl bg-foreground px-4 font-display text-sm uppercase text-background disabled:opacity-60",
        className,
      )}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border px-4 text-sm hover:border-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Etiqueta de estado publicado / visible. */
export function StatusBadge({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
        on ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
      )}
    >
      {on ? onLabel : offLabel}
    </span>
  );
}

/** Borrado en dos pasos, sin ventanas del navegador. */
export function ConfirmDelete({
  onConfirm,
  label = "Borrar",
}: {
  onConfirm: () => void;
  label?: string;
}) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="min-h-10 rounded-2xl border border-destructive px-3 text-sm text-destructive"
      >
        {label}
      </button>
    );
  }

  return (
    <span className="inline-flex gap-2">
      <button
        type="button"
        onClick={() => {
          setArmed(false);
          onConfirm();
        }}
        className="min-h-10 rounded-2xl bg-destructive px-3 text-sm text-destructive-foreground"
      >
        Confirmar
      </button>
      <button
        type="button"
        onClick={() => setArmed(false)}
        className="min-h-10 rounded-2xl border border-border px-3 text-sm"
      >
        Cancelar
      </button>
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="card-elevated mt-6 p-10 text-center">
      <p className="font-display text-lg uppercase">Sin contenido todavía</p>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function Loading({ text = "Cargando…" }: { text?: string }) {
  return (
    <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {text}
    </p>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="block text-xs font-semibold uppercase tracking-wide">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
