"use client";

import React from 'react';
import { useThemeUtils } from '../../hooks/useThemeUtils';

interface StatsData {
  total: number;
  displayed: number;
  category: string | null;
  campus: string | null;
}

interface OrganizationControlsBarProps {
  stats: StatsData;
  sortBy: "name" | "views" | "latest";
  onSortChange: (sort: "name" | "views" | "latest") => void;
}

const OrganizationControlsBar: React.FC<OrganizationControlsBarProps> = ({
  stats,
  sortBy,
  onSortChange
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeClasses = {
    controlsBar: combine(
      "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 p-3 sm:p-4 rounded-xl border",
      getValueForTheme(
        "bg-white/5 border-white/10",
        "bg-gray-50 border-gray-200"
      )
    ),
    statsContainer: combine(
      "flex flex-wrap items-center gap-2 text-xs sm:text-sm",
      getValueForTheme("text-white/70", "text-gray-600")
    ),
    statsBadge: combine(
      "px-2 sm:px-3 py-1 rounded-full font-medium text-xs sm:text-sm",
      getValueForTheme("bg-blue-500/20 text-blue-300", "bg-[#006C67]/10 text-[#006C67]")
    ),
    sortSelect: combine(
      "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm min-w-[120px] sm:min-w-[160px]",
      getValueForTheme(
        "bg-white/10 border-white/20 text-white",
        "bg-white border-gray-300 text-gray-900"
      )
    )
  };

  return (
    <div className={themeClasses.controlsBar}>
      {/* Stats */}
      <div className={themeClasses.statsContainer}>
        <span className={themeClasses.statsBadge}>
          {stats.total} ชมรม
        </span>
        {stats.category && (
          <span className="hidden xs:inline">ประเภท: {stats.category}</span>
        )}
        {stats.campus && (
          <span className="hidden sm:inline">วิทยาเขต: {stats.campus}</span>
        )}
      </div>

      {/* Sort Dropdown Only */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as "name" | "views" | "latest")}
        className={themeClasses.sortSelect}
      >
        <option value="name">ชื่อ A-Z</option>
        <option value="views">ความนิยม</option>
        <option value="latest">ล่าสุด</option>
      </select>
    </div>
  );
};

export default React.memo(OrganizationControlsBar);