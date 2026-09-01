import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/lib/cn";

const icon = { success: CheckCircle2, info: Info, error: AlertCircle };
const tone = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-brand-200 bg-brand-50 text-brand-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
      {toasts.map((t) => {
        const Icon = icon[t.variant];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 shadow-[var(--shadow-pop)] animate-[toast-in_0.2s_ease-out]",
              tone[t.variant]
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="focus-ring rounded p-0.5 opacity-60 hover:opacity-100" aria-label="Dismiss">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
