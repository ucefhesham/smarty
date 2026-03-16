import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export default function SectionHeader({ title, subtitle, children, className, centered = false }: SectionHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col md:flex-row justify-between items-end gap-6 mb-12",
      centered && "items-center text-center flex-col",
      className
    )}>
      <div className="space-y-2">
        {subtitle && (
          <span className="text-primary font-bold uppercase text-xs tracking-[0.2em]">
            {subtitle}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
          {title}
        </h2>
      </div>
      {children && (
        <div className="flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
