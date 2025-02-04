import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "normal" | "pending" | "positive" | "negative";
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        {
          "bg-green-50 text-green-700": status === "normal",
          "bg-orange-50 text-orange-700": status === "pending",
          "bg-red-50 text-red-700": status === "positive",
          "bg-gray-100 text-gray-700": status === "negative",
        }
      )}
    >
      {children}
    </span>
  );
}
