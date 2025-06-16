"use client";

import React, { memo, useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { Campus } from "../../types/organization";

interface CategoryItemProps {
  category: { id: string | undefined; name: string };
  isActive: boolean;
  count?: number;
  onClick: () => void;
  isMobile?: boolean;
}

// Memoized Category Item Component
const CategoryItem = memo<CategoryItemProps>(({ 
  category, 
  isActive, 
  count, 
  onClick, 
  isMobile = false 
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const classes = useMemo(() => {
    const baseClasses = isMobile 
      ? "transition-all duration-200 px-3 py-3 rounded-lg text-sm relative overflow-hidden touch-manipulation"
      : "whitespace-nowrap transition-all duration-200 px-4 py-2.5 rounded-full text-sm font-medium";

    const stateClasses = isActive
      ? getValueForTheme(
          "bg-[#54CF90]/15 border border-[#54CF90]/30 text-[#54CF90]",
          "bg-[#006C67]/10 border border-[#006C67]/20 text-[#006C67]"
        )
      : getValueForTheme(
          isMobile 
            ? "bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white"
            : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10",
          isMobile
            ? "bg-gray-50/70 border border-gray-100 hover:bg-gray-100/80 text-gray-600 hover:text-gray-800"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 border border-gray-200"
        );

    return combine(baseClasses, stateClasses);
  }, [isActive, isMobile, combine, getValueForTheme]);

  const countBadgeClasses = useMemo(() => {
    const baseClasses = isMobile
      ? "px-2 py-0.5 rounded-full text-xs font-medium"
      : "ml-2 px-2 py-0.5 rounded-full text-xs";
      
    const colorClasses = isActive
      ? getValueForTheme(
          isMobile ? "bg-[#54CF90]/20 text-[#54CF90]" : "bg-[#54CF90]/30 text-[#54CF90]",
          "bg-[#006C67]/20 text-[#006C67]"
        )
      : getValueForTheme(
          isMobile ? "bg-white/10 text-white/70" : "bg-white/10 text-white/60",
          isMobile ? "bg-gray-200 text-gray-600" : "bg-gray-200 text-gray-500"
        );
        
    return combine(baseClasses, colorClasses);
  }, [isActive, isMobile, combine, getValueForTheme]);

  const indicatorClasses = useMemo(() => combine(
    "absolute top-1 right-1 w-1.5 h-1.5 rounded-full",
    getValueForTheme("bg-[#54CF90]", "bg-[#006C67]")
  ), [combine, getValueForTheme]);

  const shouldShowCount = isActive && count !== undefined;

  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className={classes}
        type="button"
        aria-pressed={isActive}
        aria-label={`${category.name}${shouldShowCount ? ` (${count} รายการ)` : ''}`}
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="font-medium leading-tight text-center">
            {category.name}
          </span>
          {shouldShowCount && (
            <span className={countBadgeClasses}>{count}</span>
          )}
        </div>
        {isActive && <div className={indicatorClasses} aria-hidden="true" />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={classes}
      type="button"
      aria-pressed={isActive}
      aria-label={`${category.name}${shouldShowCount ? ` (${count} รายการ)` : ''}`}
    >
      {category.name}
      {shouldShowCount && <span className={countBadgeClasses}>{count}</span>}
    </button>
  );
});
CategoryItem.displayName = "CategoryItem";

// Memoized Dropdown Option Component
const DropdownOption = memo<{
  category: { id: string | undefined; name: string };
  isActive: boolean;
  count?: number;
  onClick: () => void;
  isLast: boolean;
}>(({ category, isActive, count, onClick, isLast }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const classes = useMemo(() => combine(
    "w-full flex items-center justify-between px-4 py-3 text-sm text-left",
    "transition-colors duration-150 touch-manipulation",
    isActive
      ? getValueForTheme(
          "bg-[#54CF90]/20 text-[#54CF90]",
          "bg-[#006C67]/10 text-[#006C67]"
        )
      : getValueForTheme(
          "text-white/80 hover:bg-white/10 hover:text-white",
          "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        ),
    !isLast
      ? getValueForTheme("border-b border-white/10", "border-b border-gray-100")
      : ""
  ), [isActive, isLast, combine, getValueForTheme]);

  const countClasses = useMemo(() => combine(
    "px-2 py-1 rounded-full text-xs font-medium",
    isActive
      ? getValueForTheme(
          "bg-[#54CF90]/20 text-[#54CF90]",
          "bg-[#006C67]/20 text-[#006C67]"
        )
      : getValueForTheme(
          "bg-white/15 text-white/70",
          "bg-gray-200 text-gray-600"
        )
  ), [isActive, combine, getValueForTheme]);

  const indicatorClasses = useMemo(() => combine(
    "w-2 h-2 rounded-full",
    getValueForTheme("bg-[#54CF90]", "bg-[#006C67]")
  ), [combine, getValueForTheme]);

  return (
    <button 
      onClick={onClick} 
      className={classes} 
      type="button"
      aria-label={`${category.name}${count !== undefined ? ` (${count} รายการ)` : ''}`}
    >
      <span className="font-medium truncate">{category.name}</span>
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        {count !== undefined && <span className={countClasses}>{count}</span>}
        {isActive && <div className={indicatorClasses} aria-hidden="true" />}
      </div>
    </button>
  );
});
DropdownOption.displayName = "DropdownOption";

// Memoized Loading Skeleton Component
const FilterSkeleton = memo<{
  getValueForTheme: (dark: string, light: string) => string;
  combine: (...classes: string[]) => string;
}>(({ getValueForTheme, combine }) => (
  <section className="relative z-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="md:hidden space-y-6">
        {/* Mobile skeleton */}
        {[1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <div className={combine(
              "h-5 w-20 rounded animate-pulse",
              getValueForTheme("bg-white/10", "bg-gray-200")
            )} />
            <div className={combine(
              "h-12 w-full rounded-xl animate-pulse",
              getValueForTheme("bg-white/5", "bg-gray-100")
            )} />
          </div>
        ))}
      </div>
      
      <div className="hidden md:block space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className={combine(
                "h-6 w-24 rounded animate-pulse",
                getValueForTheme("bg-white/10", "bg-gray-200")
              )} />
              <div className={combine(
                "h-12 w-full rounded-xl animate-pulse",
                getValueForTheme("bg-white/5", "bg-gray-100")
              )} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
));
FilterSkeleton.displayName = "FilterSkeleton";

interface CategoryFilterProps {
  categories: Array<{ id: string | undefined; name: string }>;
  activeCategory: string | undefined;
  totalClubCount: number;
  categoryCountMap: Map<string | undefined, number>;
  loading: boolean;
  onCategoryChange: (typeName: string | undefined) => void;
  campuses: Campus[];
  activeCampus: string | undefined;
  onCampusChange: (campusId: string | undefined) => void;
  campusLoading?: boolean;
}

const CategoryFilter = memo<CategoryFilterProps>(({
  categories,
  activeCategory,
  totalClubCount,
  categoryCountMap,
  loading,
  onCategoryChange,
  campuses,
  activeCampus,
  onCampusChange,
  campusLoading = false,
}) => {
  const { combine, getValueForTheme } = useThemeUtils();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Client-side mounting check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoized handlers
  const handleCategorySelect = useCallback((categoryId: string | undefined) => {
    onCategoryChange(categoryId);
    setIsDropdownOpen(false);
  }, [onCategoryChange]);

  const handleCampusSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    onCampusChange(selectedValue || undefined);
  }, [onCampusChange]);

  const handleCategorySelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    onCategoryChange(selectedValue || undefined);
  }, [onCategoryChange]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  // Memoized computed values
  const activeCategoryName = useMemo(() => {
    const active = categories.find((cat) => cat.id === activeCategory);
    return active?.name || "ทั้งหมด";
  }, [categories, activeCategory]);

  const activeCategoryCount = useMemo(() => 
    categoryCountMap.get(activeCategory),
    [categoryCountMap, activeCategory]
  );

  // Memoized theme classes
  const themeClasses = useMemo(() => ({
    header: {
      mobile: combine(
        "text-lg font-medium",
        getValueForTheme("text-white", "text-[#006C67]")
      ),
      desktop: combine(
        "text-xl lg:text-2xl font-medium",
        getValueForTheme("text-white", "text-[#006C67]")
      ),
    },
    select: {
      base: combine(
        "w-full px-4 py-3 rounded-xl text-sm font-medium appearance-none cursor-pointer",
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm"
      ),
      theme: getValueForTheme(
        "bg-white/10 border border-white/20 text-white hover:bg-white/15 focus:bg-white/15 focus:ring-[#54CF90]",
        "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:ring-[#006C67] focus:border-[#006C67]"
      ),
      disabled: "opacity-50 cursor-not-allowed",
    },
    dropdown: {
      button: combine(
        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium",
        "transition-all duration-200 touch-manipulation shadow-sm",
        getValueForTheme(
          "bg-white/10 border border-white/20 text-white hover:bg-white/15",
          "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        )
      ),
      content: combine(
        "absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border shadow-lg overflow-hidden",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        getValueForTheme(
          "bg-black/75 border-white/20 backdrop-blur-md",
          "bg-white border-gray-200 shadow-xl"
        )
      ),
    },
    countBadge: combine(
      "px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0",
      getValueForTheme(
        "bg-[#54CF90]/20 text-[#54CF90]",
        "bg-[#006C67]/10 text-[#006C67]"
      )
    ),
    chevron: combine(
      "w-5 h-5 transition-transform duration-200 flex-shrink-0",
      isDropdownOpen ? "rotate-180" : "",
      getValueForTheme("text-white/70", "text-gray-500")
    ),
    icon: combine(
      "w-5 h-5 transition-transform duration-200",
      getValueForTheme("text-white/70", "text-gray-500")
    ),
  }), [combine, getValueForTheme, isDropdownOpen]);

  // Click outside handler
  useEffect(() => {
    if (!isClient) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen, isClient]);

  // Memoized options
  const campusOptions = useMemo(() => {
    if (!isClient || campusLoading) return null;
    
    return campuses.map((campus, index) => (
      <option
        key={campus.name || `campus-${index}`}
        value={campus.name}
        className={getValueForTheme("bg-gray-800 text-white", "bg-white text-gray-900")}
      >
        {campus.name}
      </option>
    ));
  }, [campuses, getValueForTheme, isClient, campusLoading]);

  const categoryOptions = useMemo(() => {
    if (!isClient || loading) return null;

    return categories
      .filter((category) => category.id !== undefined)
      .map((category, index) => (
        <option
          key={category.id || `category-${index}`}
          value={category.id}
          className={getValueForTheme("bg-gray-800 text-white", "bg-white text-gray-900")}
        >
          {category.name}
          {categoryCountMap.get(category.id) && ` (${categoryCountMap.get(category.id)})`}
        </option>
      ));
  }, [categories, categoryCountMap, getValueForTheme, isClient, loading]);

  const dropdownOptions = useMemo(() => {
    if (!isClient || loading) return null;

    return categories.map((category, index) => (
      <DropdownOption
        key={category.id || "all"}
        category={category}
        isActive={activeCategory === category.id}
        count={categoryCountMap.get(category.id)}
        onClick={() => handleCategorySelect(category.id)}
        isLast={index === categories.length - 1}
      />
    ));
  }, [categories, activeCategory, categoryCountMap, handleCategorySelect, isClient, loading]);

  // Show skeleton until client-side hydration
  if (!isClient) {
    return <FilterSkeleton getValueForTheme={getValueForTheme} combine={combine} />;
  }

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {/* Campus Filter - Mobile */}
          <div className="space-y-3">
            <h2 className={themeClasses.header.mobile}>วิทยาเขต</h2>
            <div className="relative">
              <select
                value={activeCampus || ""}
                onChange={handleCampusSelectChange}
                disabled={campusLoading}
                className={combine(
                  themeClasses.select.base,
                  themeClasses.select.theme,
                  campusLoading ? themeClasses.select.disabled : ""
                )}
                aria-label="เลือกวิทยาเขต"
              >
                <option value="" className={getValueForTheme("bg-gray-800 text-white", "bg-white text-gray-900")}>
                  ทุกวิทยาเขต
                </option>
                {campusOptions}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className={themeClasses.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter - Mobile */}
          <div className="space-y-3">
            <h2 className={themeClasses.header.mobile}>ประเภทองค์กร</h2>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={themeClasses.dropdown.button}
                type="button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="เลือกประเภทองค์กร"
              >
                <div className="flex items-center gap-3">
                  <span className="truncate font-medium">{activeCategoryName}</span>
                  {activeCategoryCount !== undefined && (
                    <span className={themeClasses.countBadge}>{activeCategoryCount}</span>
                  )}
                </div>
                <svg className={themeClasses.chevron} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className={themeClasses.dropdown.content}>
                  <div className="max-h-64 overflow-y-auto relative z-10">
                    {dropdownOptions}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Campus Filter - Desktop */}
            <div className="space-y-4">
              <h2 className={themeClasses.header.desktop}>วิทยาเขต</h2>
              <div className="relative">
                <select
                  value={activeCampus || ""}
                  onChange={handleCampusSelectChange}
                  disabled={campusLoading}
                  className={combine(
                    themeClasses.select.base,
                    themeClasses.select.theme,
                    campusLoading ? themeClasses.select.disabled : ""
                  )}
                  aria-label="เลือกวิทยาเขต"
                >
                  <option value="" className={getValueForTheme("bg-gray-800 text-white", "bg-white text-gray-900")}>
                    ทุกวิทยาเขต
                  </option>
                  {campusOptions}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className={themeClasses.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter - Desktop */}
            <div className="space-y-4">
              <h2 className={themeClasses.header.desktop}>ประเภทองค์กร</h2>
              <div className="relative">
                <select
                  value={activeCategory || ""}
                  onChange={handleCategorySelectChange}
                  disabled={loading}
                  className={combine(
                    themeClasses.select.base,
                    themeClasses.select.theme,
                    loading ? themeClasses.select.disabled : ""
                  )}
                  aria-label="เลือกประเภทองค์กร"
                >
                  <option value="" className={getValueForTheme("bg-gray-800 text-white", "bg-white text-gray-900")}>
                    ทั้งหมด
                    {categoryCountMap.get(undefined) && ` (${categoryCountMap.get(undefined)})`}
                  </option>
                  {categoryOptions}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className={themeClasses.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CategoryFilter.displayName = "CategoryFilter";
export { CategoryItem };
export default CategoryFilter;