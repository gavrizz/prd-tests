import { cn } from "@/lib/utils";

// Faithful reproduction of dara-front's TabMenu underline register
// (src/components/TabMenu.tsx): active tab = border-b-2 border-brand, med-em text;
// inactive = low-em text. Overflow "More" collapsing is omitted in the slice.
export type Tab = { id: string; label: string; disabled?: boolean };

export function TabMenu({
  tabs,
  activeTab,
  onTabChange,
  className,
}: {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 flex-1", className)}>
      <div className="flex flex-row items-start justify-start gap-[1.25rem] border-b border-gray-200">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            className={cn(
              "select-none whitespace-nowrap px-4 py-2 text-center text-sm font-medium",
              tab.disabled
                ? "cursor-not-allowed text-gray-300"
                : activeTab === tab.id
                  ? "cursor-pointer border-b-2 border-brand text-text-theme-light-med-em"
                  : "cursor-pointer text-text-theme-light-low-em transition-colors hover:text-text-theme-light-med-em",
            )}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}
