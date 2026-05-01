import { cn } from "@/lib/utils";

interface Props {
  tags: string[];
  className?: string;
}

/** Tag chips reused across locked + unlocked variants. */
export function TagsRow({ tags, className }: Props) {
  if (!tags.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-cream-300 bg-cream-200 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-moss-500"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
