"use client";

import React, { memo } from "react";

interface FilterControlsProps {
  categories: Array<{ id: string | undefined; name: string }>;
  selectedCategory: string | undefined;
  sortBy: "name" | "views" | "latest";
  viewMode: "grid" | "list";
  onCategoryChange: (categoryId: string | undefined) => void;
  onSortChange: (sort: "name" | "views" | "latest") => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  themeClasses: any;
}

const FilterControls = memo(({
  categories,
  selectedCategory,
  sortBy,
  viewMode,
  onCategoryChange,
  onSortChange,
  onViewModeChange,
  themeClasses
}: FilterControlsProps) => (
  <div className={themeClasses.filtersContainer}>
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Category Filter */}
      <div className="flex-1">
        <label className={themeClasses.filterLabel}>หมวดหมู่</label>
        <select
          value={selectedCategory || ""}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
          className={themeClasses.filterSelect}
        >
          {categories.map((category) => (
            <option key={category.id || "all"} value={category.id || ""}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Filter */}
      <div className="flex-1">
        <label className={themeClasses.filterLabel}>เรียงตาม</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as "name" | "views" | "latest")}
          className={themeClasses.filterSelect}
        >
          <option value="name">ชื่อ (A-Z)</option>
          <option value="views">ยอดชม (มาก-น้อย)</option>
          <option value="latest">ล่าสุด</option>
        </select>
      </div>

      {/* View Mode */}
      <div className="flex-1">
        <label className={themeClasses.filterLabel}>มุมมอง</label>
        <div className="flex rounded-lg overflow-hidden">
          {(["grid", "list"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`${themeClasses.viewModeButton} ${
                viewMode === mode ? themeClasses.viewModeActive : themeClasses.viewModeInactive
              }`}
            >
              {mode === "grid" ? "ตาราง" : "รายการ"}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
));

FilterControls.displayName = "FilterControls";

export default FilterControls;