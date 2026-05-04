import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  layout?: "stacked" | "split";
  action?: ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  layout = "stacked",
  action,
}: SectionHeaderProps) {
  const wrapperClassName =
    layout === "split"
      ? "flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5"
      : "mb-8";

  return (
    <div className={wrapperClassName}>
      {layout === "split" ? (
        <>
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-zinc-400/90 mt-1.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-zinc-400/90 mt-1.5 font-medium">
              {subtitle}
            </p>
          )}
        </>
      )}
    </div>
  );
}
