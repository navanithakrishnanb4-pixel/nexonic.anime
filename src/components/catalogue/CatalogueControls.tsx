"use client";

interface FilterOption {
  label: string;
  value: string;
}

interface CatalogueControlsProps {
  categories: FilterOption[];
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  sortOptions: FilterOption[];
  activeSort: string;
  onSortChange: (value: string) => void;
}

/**
 * Reusable catalogue control bar (category pills + sort select). Built
 * as real, wired-up UI — clicking a pill does update local state and
 * the active pill styling — but with zero Works to filter, changing
 * these controls has no visible effect on the grid below yet. That's
 * intentional per the brief: the controls must not "pretend" to filter
 * content that doesn't exist. Once Work data exists, the Works page
 * only needs to apply `activeCategory`/`activeSort` to its data query;
 * this component doesn't change.
 */
export function CatalogueControls({
  categories,
  activeCategory,
  onCategoryChange,
  sortOptions,
  activeSort,
  onSortChange,
}: CatalogueControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
      <div
        role="group"
        aria-label="Filter works by category"
        className="flex flex-wrap gap-xs"
      >
        {categories.map((cat) => {
          const isActive = cat.value === activeCategory;
          return (
            <button
              key={cat.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-md py-xs rounded-full font-label-md text-label-md transition-colors duration-200 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isActive
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-transparent text-on-surface-variant border-outline-variant hover:border-outline hover:text-on-surface"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-sm">
        <label
          htmlFor="works-sort"
          className="font-label-md text-label-md text-on-surface-variant"
        >
          Sort
        </label>
        <select
          id="works-sort"
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs font-body-md text-body-md text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
