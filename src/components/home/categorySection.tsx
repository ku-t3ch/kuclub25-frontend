"use client";

import React, { memo, useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useThemeUtils } from '../../hooks/useThemeUtils';
import { Campus } from '../../types/organization';

interface CategoryItemProps {
  category: { id: string | undefined; name: string };
  isActive: boolean;
  count?: number;
  onClick: () => void;
  isMobile?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = memo(({
  category,
  isActive,
  count,
  onClick,
  isMobile = false
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const classes = useMemo(() => {
    if (isMobile) {
      return combine(
        "transition-all duration-200 px-3 py-3 rounded-lg text-sm relative overflow-hidden touch-manipulation",
        isActive
          ? getValueForTheme(
            "bg-blue-600/15 border border-blue-500/30 text-blue-200",
            "bg-[#006C67]/10 border border-[#006C67]/20 text-[#006C67]"
          )
          : getValueForTheme(
            "bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white",
            "bg-gray-50/70 border border-gray-100 hover:bg-gray-100/80 text-gray-600 hover:text-gray-800"
          )
      );
    }
    
    return combine(
      "whitespace-nowrap transition-all duration-200 px-4 py-2.5 rounded-full text-sm font-medium",
      isActive
        ? getValueForTheme(
          "bg-blue-500/20 text-blue-300 border border-blue-500/30",
          "bg-[#006C67]/10 text-[#006C67] border border-[#006C67]/20"
        )
        : getValueForTheme(
          "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10",
          "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 border border-gray-200"
        )
    );
  }, [isActive, isMobile, combine, getValueForTheme]);

  const countBadgeClasses = useMemo(() => {
    const baseClasses = isMobile ? "px-2 py-0.5 rounded-full text-xs font-medium" : "ml-2 px-2 py-0.5 rounded-full text-xs";
    const colorClasses = isActive
      ? getValueForTheme(
        isMobile ? "bg-blue-500/20 text-blue-200" : "bg-blue-600/30 text-blue-200",
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
    getValueForTheme("bg-blue-400", "bg-[#006C67]")
  ), [combine, getValueForTheme]);

  const shouldShowCount = isActive && count !== undefined;

  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className={classes}
        type="button"
        aria-pressed={isActive}
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="font-medium leading-tight text-center">{category.name}</span>
          {shouldShowCount && (
            <span className={countBadgeClasses}>{count}</span>
          )}
        </div>
        {isActive && <div className={indicatorClasses} />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={classes}
      type="button"
      aria-pressed={isActive}
    >
      {category.name}
      {shouldShowCount && <span className={countBadgeClasses}>{count}</span>}
    </button>
  );
});

CategoryItem.displayName = 'CategoryItem';

interface DropdownOptionProps {
  category: { id: string | undefined; name: string };
  isActive: boolean;
  count?: number;
  onClick: () => void;
  isLast: boolean;
}

const DropdownOption: React.FC<DropdownOptionProps> = memo(({
  category,
  isActive,
  count,
  onClick,
  isLast
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const classes = useMemo(() => combine(
    "w-full flex items-center justify-between px-4 py-3 text-sm text-left",
    "transition-colors duration-150 touch-manipulation",
    isActive
      ? getValueForTheme(
        "bg-blue-600/20 text-blue-200",
        "bg-[#006C67]/10 text-[#006C67]"
      )
      : getValueForTheme(
        "text-white/80 hover:bg-white/10 hover:text-white",
        "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      ),
    !isLast ? getValueForTheme(
      "border-b border-white/10",
      "border-b border-gray-100"
    ) : ""
  ), [isActive, isLast, combine, getValueForTheme]);

  const countClasses = useMemo(() => combine(
    "px-2 py-1 rounded-full text-xs font-medium",
    isActive
      ? getValueForTheme(
        "bg-blue-500/20 text-blue-200",
        "bg-[#006C67]/20 text-[#006C67]"
      )
      : getValueForTheme(
        "bg-white/15 text-white/70",
        "bg-gray-200 text-gray-600"
      )
  ), [isActive, combine, getValueForTheme]);

  const indicatorClasses = useMemo(() => combine(
    "w-2 h-2 rounded-full",
    getValueForTheme("bg-blue-400", "bg-[#006C67]")
  ), [combine, getValueForTheme]);

  return (
    <button
      onClick={onClick}
      className={classes}
      type="button"
    >
      <span className="font-medium truncate">{category.name}</span>
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        {count !== undefined && (
          <span className={countClasses}>{count}</span>
        )}
        {isActive && <div className={indicatorClasses} />}
      </div>
    </button>
  );
});

DropdownOption.displayName = 'DropdownOption';

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

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  totalClubCount,
  categoryCountMap,
  loading,
  onCategoryChange,
  campuses,
  activeCampus,
  onCampusChange,
  campusLoading = false
}) => {
  const { combine, getValueForTheme } = useThemeUtils();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoized handlers
  const handleCategorySelect = useCallback((categoryId: string | undefined) => {
    onCategoryChange(categoryId);
    setIsDropdownOpen(false);
  }, [onCategoryChange]);

  const handleCampusSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    onCampusChange(selectedValue || undefined);
  }, [onCampusChange]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  // Memoized computed values
  const activeCategoryName = useMemo(() => {
    const active = categories.find(cat => cat.id === activeCategory);
    return active?.name || "ทั้งหมด";
  }, [categories, activeCategory]);

  const activeCategoryCount = useMemo(() => 
    categoryCountMap.get(activeCategory), 
    [categoryCountMap, activeCategory]
  );

  // Memoized class strings
  const sectionClasses = useMemo(() => "relative z-10 px-4 sm:px-6 lg:px-8 py-8", []);
  const containerClasses = useMemo(() => "max-w-7xl mx-auto", []);
  const mobileLayoutClasses = useMemo(() => "md:hidden space-y-6", []);
  const desktopLayoutClasses = useMemo(() => "hidden md:block space-y-8", []);

  const headerClasses = useMemo(() => ({
    mobile: combine("text-xl font-bold", getValueForTheme("text-white", "text-[#006C67]")),
    desktop: combine("text-2xl lg:text-3xl font-bold", getValueForTheme("text-white", "text-[#006C67]"))
  }), [combine, getValueForTheme]);

  const selectClasses = useMemo(() => ({
    mobile: combine(
      "w-full px-4 py-3 rounded-xl text-sm font-medium",
      "transition-all duration-200 appearance-none cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm",
      getValueForTheme(
        "bg-white/10 border border-white/20 text-white focus:bg-white/15 focus:ring-blue-500",
        "bg-white border border-gray-200 text-gray-700 focus:bg-gray-50 focus:ring-[#006C67] focus:border-[#006C67]"
      ),
      campusLoading ? "opacity-50 cursor-not-allowed" : ""
    ),
    desktop: combine(
      "px-6 py-3 pr-12 rounded-xl text-sm font-medium",
      "transition-all duration-200 appearance-none cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "min-w-[240px] shadow-sm",
      getValueForTheme(
        "bg-white/10 border border-white/20 text-white hover:bg-white/15 focus:bg-white/15 focus:ring-blue-500",
        "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:ring-[#006C67] focus:border-[#006C67]"
      ),
      campusLoading ? "opacity-50 cursor-not-allowed" : ""
    )
  }), [combine, getValueForTheme, campusLoading]);

  const dropdownButtonClasses = useMemo(() => combine(
    "w-full flex items-center justify-between",
    "px-4 py-3 rounded-xl text-sm font-medium",
    "transition-all duration-200 touch-manipulation shadow-sm",
    getValueForTheme(
      "bg-white/10 border border-white/20 text-white hover:bg-white/15",
      "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
    )
  ), [combine, getValueForTheme]);

  const dropdownContentClasses = useMemo(() => combine(
    "absolute top-full left-0 right-0 mt-2 z-50",
    "rounded-xl border shadow-lg overflow-hidden",
    "animate-in fade-in-0 zoom-in-95 duration-200",
    getValueForTheme(
      "bg-gray-900/95 border-white/20 backdrop-blur-md",
      "bg-white border-gray-200 shadow-xl"
    )
  ), [combine, getValueForTheme]);

  const countBadgeClasses = useMemo(() => combine(
    "px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0",
    getValueForTheme(
      "bg-blue-500/20 text-blue-300",
      "bg-[#006C67]/10 text-[#006C67]"
    )
  ), [combine, getValueForTheme]);

  const chevronClasses = useMemo(() => combine(
    "w-5 h-5 transition-transform duration-200 flex-shrink-0",
    isDropdownOpen ? "rotate-180" : "",
    getValueForTheme("text-white/70", "text-gray-500")
  ), [combine, getValueForTheme, isDropdownOpen]);

  const iconClasses = useMemo(() => combine(
    "w-5 h-5 transition-transform duration-200",
    getValueForTheme("text-white/70", "text-gray-500")
  ), [combine, getValueForTheme]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Memoized campus options
  const campusOptions = useMemo(() => 
    campuses.map((campus) => (
      <option 
        key={campus.id} 
        value={campus.id}
        className={getValueForTheme(
          "bg-gray-800 text-white",
          "bg-white text-gray-900"
        )}
      >
        {campus.name}
      </option>
    )), 
    [campuses, getValueForTheme]
  );

  // Memoized category items
  const categoryItems = useMemo(() => 
    categories.map((category) => (
      <CategoryItem
        key={category.id || 'all'}
        category={category}
        isActive={activeCategory === category.id}
        count={categoryCountMap.get(category.id)}
        onClick={() => onCategoryChange(category.id)}
        isMobile={false}
      />
    )), 
    [categories, activeCategory, categoryCountMap, onCategoryChange]
  );

  // Memoized dropdown options
  const dropdownOptions = useMemo(() => 
    categories.map((category, index) => (
      <DropdownOption
        key={category.id || 'all'}
        category={category}
        isActive={activeCategory === category.id}
        count={categoryCountMap.get(category.id)}
        onClick={() => handleCategorySelect(category.id)}
        isLast={index === categories.length - 1}
      />
    )), 
    [categories, activeCategory, categoryCountMap, handleCategorySelect]
  );

  // Loading skeleton
  const loadingSkeleton = useMemo(() => (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className={combine(
            "animate-pulse h-10 rounded-xl",
            getValueForTheme("bg-white/10", "bg-gray-200"),
            index === 0 ? "w-20" : "w-24"
          )}
        />
      ))}
    </div>
  ), [combine, getValueForTheme]);

  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        
        {/* Mobile Layout */}
        <div className={mobileLayoutClasses}>
          {/* Campus Filter - Mobile */}
          <div className="space-y-3">
            <h2 className={headerClasses.mobile}>วิทยาเขต</h2>
            <div className="relative">
              <select
                value={activeCampus || ''}
                onChange={handleCampusSelectChange}
                disabled={campusLoading}
                className={selectClasses.mobile}
              >
                {!campusLoading && campusOptions}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter - Mobile */}
          <div className="space-y-3">
            <h2 className={headerClasses.mobile}>ประเภทองค์กร</h2>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={dropdownButtonClasses}
                type="button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex items-center gap-3">
                  <span className="truncate font-medium">{activeCategoryName}</span>
                  {activeCategoryCount !== undefined && (
                    <span className={countBadgeClasses}>{activeCategoryCount}</span>
                  )}
                </div>
                <svg className={chevronClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className={dropdownContentClasses}>
                  <div className="max-h-64 overflow-y-auto">
                    {!loading && dropdownOptions}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className={desktopLayoutClasses}>
          {/* Campus Filter - Desktop */}
          <div className="space-y-4">
            <h2 className={headerClasses.desktop}>วิทยาเขต</h2>
            <div className="relative inline-block">
              <select
                value={activeCampus || ''}
                onChange={handleCampusSelectChange}
                disabled={campusLoading}
                className={selectClasses.desktop}
              >
                {!campusLoading && campusOptions}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter - Desktop */}
          <div className="space-y-4">
            <h2 className={headerClasses.desktop}>ประเภทองค์กร</h2>
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                <div className="flex flex-nowrap gap-3 pb-2 min-w-max">
                  {!loading && categoryItems}
                </div>
              </div>
            </div>
          </div>
        </div>

  
        {(loading || campusLoading) && loadingSkeleton}
      </div>
    </section>
  );
};

export { CategoryItem };
export default memo(CategoryFilter);