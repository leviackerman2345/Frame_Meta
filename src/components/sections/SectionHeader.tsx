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
      ? "flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4"
      : "mb-8 md:mb-10";

  return (
    <div className={wrapperClassName}>
      {layout === "split" ? (
        <>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-zinc-500 mt-1.5">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </>
      ) : (
        <>
          <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-zinc-500 mt-1.5">
              {subtitle}
            </p>
          )}
        </>
      )}
    </div>
  );
}
