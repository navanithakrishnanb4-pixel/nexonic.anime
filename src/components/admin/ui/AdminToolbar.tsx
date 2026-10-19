"use client";

import { SearchIcon } from "@/components/admin/ui/AdminIcons";

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}

export function SearchBox({ value, onChange, placeholder }: SearchBoxProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-500 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="font-outfit bg-ink-800 border border-white/10 text-paper-200 text-sm rounded-xl py-2 pl-8 pr-3 w-56 outline-none focus:border-neon-violet/40 transition-all placeholder:text-paper-500"
      />
    </div>
  );
}

interface FilterChipsProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  activeClass?: string;
}

export function FilterChips({
  options,
  value,
  onChange,
  activeClass = "bg-neon-violet/15 text-neon-violet-soft border border-neon-violet/25",
}: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto shelf-scroll" role="group" aria-label="Filter">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`font-outfit shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            value === o.value ? activeClass : "text-paper-500 hover:text-paper-300 hover:bg-white/5"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
