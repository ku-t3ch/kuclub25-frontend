"use client";

import React from 'react';
import { useThemeUtils } from '../../hooks/useThemeUtils';

interface FilterOption {
  id: string | undefined;
  name: string;
}

interface OrganizationEnhancedFiltersProps {
  searchQuery: string;
  selectedCategory: string | undefined;
  selectedCampus: string | undefined;
  sortBy: "name" | "views" | "latest";
  showFilters: boolean;
  categories: FilterOption[];
  campusOptions: FilterOption[];
  campusLoading: boolean;
  onSearch: (query: string) => void;
  onCategoryChange: (categoryName: string | undefined) => void;
  onCampusChange: (campusName: string) => void;
  onSortChange: (sort: "name" | "views" | "latest") => void;
  onClearFilters: () => void;
  onToggleFilters: () => void;
}

const OrganizationEnhancedFilters: React.FC<OrganizationEnhancedFiltersProps> = ({
  searchQuery,
  selectedCategory,
  selectedCampus,
  sortBy,
  showFilters,
  categories,
  campusOptions,
  campusLoading,
  onSearch,
  onCategoryChange,
  onCampusChange,
  onSortChange,
  onClearFilters,
  onToggleFilters
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeClasses = {
    filterSection: combine(
      "mb-6 sm:mb-8 rounded-xl border shadow-lg overflow-hidden",
      getValueForTheme(
        "bg-white/5 border-white/10 backdrop-blur-sm",
        "bg-white border-gray-200 shadow-sm"
      )
    ),
    filterHeader: combine(
      "flex items-center justify-between p-3 sm:p-4 border-b",
      getValueForTheme("border-white/10", "border-gray-200")
    ),
    filterToggleButton: combine(
      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 sm:hidden",
      getValueForTheme(
        "bg-white/10 hover:bg-white/20 text-white",
        "bg-gray-100 hover:bg-gray-200 text-gray-700"
      )
    ),
    filterContent: combine(
      "transition-all duration-300 ease-in-out",
      showFilters ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"
    ),
    filterGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-6",
    filterGroup: "space-y-1.5 sm:space-y-2",
    filterLabel: combine(
      "block text-xs sm:text-sm font-medium mb-1",
      getValueForTheme("text-white/80", "text-gray-700")
    ),
    filterInput: combine(
      "w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-sm",
      "focus:outline-none focus:ring-2 transition-all duration-200",
      "placeholder:text-xs sm:placeholder:text-sm",
      getValueForTheme(
        "bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-black/20 focus:ring-black/20",
        "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#006C67] focus:ring-[#006C67]/25"
      )
    ),
    filterSelect: combine(
      "w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-xs sm:text-sm appearance-none cursor-pointer",
      "focus:outline-none focus:ring-2 transition-all duration-200",
      getValueForTheme(
        "bg-white/10 border-white/20 text-white focus:border-black/20 focus:ring-black/20",
        "bg-white border-gray-300 text-gray-900 focus:border-[#006C67] focus:ring-[#006C67]/25"
      )
    ),
    clearFiltersContainer: "p-3 sm:p-4 border-t bg-opacity-50",
    clearButton: combine(
      "w-full sm:w-auto mx-auto px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center justify-center gap-2",
      getValueForTheme(
        "bg-white/5 hover:bg-white/10 text-white border-white/20",
        "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
      )
    )
  };

  return (
    <div className={themeClasses.filterSection}>
      {/* Filter Header with Toggle (Mobile) */}
      <div className={themeClasses.filterHeader}>
        <h3 className={combine(
          "text-sm sm:text-base font-semibold",
          getValueForTheme("text-white", "text-gray-900")
        )}>
          ตัวกรองการค้นหา
        </h3>
        <button
          onClick={onToggleFilters}
          className={themeClasses.filterToggleButton}
        >
          <span className="text-xs sm:text-sm">
            {showFilters ? 'ซ่อน' : 'แสดง'}ตัวกรอง
          </span>
          <svg 
            className={combine(
              "w-4 h-4 transition-transform duration-200",
              showFilters ? "rotate-180" : ""
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Content */}
      <div className={themeClasses.filterContent}>
        <div className={themeClasses.filterGrid}>
          {/* Search */}
          <div className={themeClasses.filterGroup}>
            <label className={themeClasses.filterLabel}>ค้นหา</label>
            <div className="relative">
              <input
                type="text"
                placeholder="ชื่อชมรม, คำอธิบาย..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className={themeClasses.filterInput}
              />
              <svg 
                className={combine(
                  "absolute right-2 sm:right-3 top-2 sm:top-2.5 w-3 h-3 sm:w-4 sm:h-4",
                  getValueForTheme("text-white/50", "text-gray-400")
                )} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter - ใช้ name แทน id */}
          <div className={themeClasses.filterGroup}>
            <label className={themeClasses.filterLabel}>ประเภทองค์กร</label>
            <select
              value={selectedCategory || ""}
              onChange={(e) => onCategoryChange(e.target.value || undefined)}
              className={themeClasses.filterSelect}
            >
              {categories.map((category, index) => (
                <option 
                  key={category.name || `category-${index}`} 
                  value={category.name || ""}
                  className={getValueForTheme("bg-gray-800 text-white", "bg-white text-gray-900")}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campus Filter - ใช้ name แทน id */}
          <div className={themeClasses.filterGroup}>
            <label className={themeClasses.filterLabel}>วิทยาเขต</label>
            <select
              value={selectedCampus || ""}
              onChange={(e) => onCampusChange(e.target.value)}
              disabled={campusLoading}
              className={combine(
                themeClasses.filterSelect,
                campusLoading ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              {campusOptions.map((option, index) => (
                <option 
                  key={option.name || `campus-${index}`} 
                  value={option.name || ""}
                  className={getValueForTheme("bg-gray-800 text-white", "bg-white text-gray-900")}
                >
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className={themeClasses.filterGroup}>
            <label className={themeClasses.filterLabel}>เรียงตาม</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as "name" | "views" | "latest")}
              className={themeClasses.filterSelect}
            >
              <option 
                key="sort-name"
                value="name" 
                className={getValueForTheme("bg-gray-800 text-white", "bg-white text-gray-900")}
              >
                ชื่อ A-Z
              </option>
              <option 
                key="sort-views"
                value="views" 
                className={getValueForTheme("bg-gray-800 text-white", "bg-white text-gray-900")}
              >
                ความนิยม
              </option>
              <option 
                key="sort-latest"
                value="latest" 
                className={getValueForTheme("bg-gray-800 text-white", "bg-white text-gray-900")}
              >
                ล่าสุด
              </option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className={combine(
          themeClasses.clearFiltersContainer,
          getValueForTheme("border-white/10", "border-gray-200")
        )}>
          <button
            onClick={onClearFilters}
            className={themeClasses.clearButton}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-xs sm:text-sm">ล้างตัวกรอง</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrganizationEnhancedFilters);