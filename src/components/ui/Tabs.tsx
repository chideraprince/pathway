import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ items, defaultKey, className }: { items: TabItem[]; defaultKey?: string; className?: string }) {
  const [active, setActive] = useState(defaultKey ?? items[0]?.key);
  const activeItem = items.find((i) => i.key === active);

  return (
    <div className={className}>
      <div className="flex gap-1 overflow-x-auto scrollbar-none border-b border-ink-200" role="tablist">
        {items.map((item) => (
          <button
            key={item.key}
            role="tab"
            aria-selected={active === item.key}
            onClick={() => setActive(item.key)}
            className={cn(
              "focus-ring whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              active === item.key ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500 hover:text-ink-800"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pt-5">{activeItem?.content}</div>
    </div>
  );
}
