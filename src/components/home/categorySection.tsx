/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { memo, useMemo, useCallback } from 'react';
import { useThemeUtils } from '../../hooks/useThemeUtils';

interface CategoryItemProps {
  category: { id: string | undefined; name: string }; // id ตอนนี้เป็น type name
  isActive: boolean;
  count?: number;
  onClick: () => void;
  isMobile?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
  category, 
  isActive, 
  count, 
  onClick, 
  isMobile = false 
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  // Memoize class names to prevent unnecessary recalculations
  const mobileClasses = useMemo(() => {
    return combine(
      "transition-all duration-200 px-3 py-4 rounded-xl text-sm relative overflow-hidden",
      isActive
        ? getValueForTheme(
            "bg-blue-600/15 border border-blue-500/30 text-blue-200",
            "bg-[#006C67]/10 border border-[#006C67]/20 text-[#006C67]"
          )
        : getValueForTheme(
            "bg-gray-800/40 border border-gray-700/30 hover:bg-gray-700/30 text-gray-300 hover:text-white",
            "bg-gray-50/70 border border-gray-100 hover:bg-gray-100/80 text-gray-600 hover:text-gray-800"
          )
    );
  }, [isActive, combine, getValueForTheme]);

  const desktopClasses = useMemo(() => {
    return combine(
      "whitespace-nowrap transition-all duration-200",
      "px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full",
      "text-2xs xs:text-xs sm:text-sm font-medium",
      isActive
        ? getValueForTheme(
            "bg-blue-500/20 text-blue-300 border border-blue-500/30",
            "bg-[#006C67]/10 text-[#006C67] border border-[#006C67]/20"
          )
        : getValueForTheme(
            "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10",
            "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 border border-gray-200"
          )
    );
  }, [isActive, combine, getValueForTheme]);

  const countBadgeClasses = useMemo(() => {
    const baseClasses = isMobile 
      ? "px-2 py-0.5 rounded-full text-xs font-medium"
      : "ml-1 xs:ml-1.5 sm:ml-2 px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full text-[0.6rem] xs:text-2xs sm:text-xs";
    
    const colorClasses = isActive
      ? getValueForTheme(
          isMobile ? "bg-blue-500/20 text-blue-200" : "bg-blue-600/30 text-blue-200", 
          "bg-[#006C67]/20 text-[#006C67]"
        )
      : getValueForTheme(
          isMobile ? "bg-gray-600/20 text-gray-300" : "bg-gray-600/20 text-gray-400", 
          isMobile ? "bg-gray-200 text-gray-600" : "bg-gray-200 text-gray-500"
        );
    
    return combine(baseClasses, colorClasses);
  }, [isActive, isMobile, combine, getValueForTheme]);

  const activeIndicatorClasses = useMemo(() => {
    return combine(
      "absolute top-1 right-1 w-1.5 h-1.5 rounded-full",
      getValueForTheme("bg-blue-400", "bg-[#006C67]")
    );
  }, [combine, getValueForTheme]);

  // Show count badge when category is active and count is defined (including 0)
  const shouldShowCount = isActive && count !== undefined;

  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className={mobileClasses}
        type="button"
        aria-pressed={isActive}
      >
        <div className="flex flex-col items-center justify-center gap-1.5">
          <span className="font-medium leading-tight">{category.name}</span>
          {shouldShowCount && (
            <span className={countBadgeClasses}>
              {count}
            </span>
          )}
        </div>
        {isActive && (
          <div className={activeIndicatorClasses} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={desktopClasses}
      type="button"
      aria-pressed={isActive}
    >
      {category.name}
      {shouldShowCount && (
        <span className={countBadgeClasses}>
          {count}
        </span>
      )}
    </button>
  );
};

// Memoized CategoryItem
const MemoizedCategoryItem = memo(CategoryItem, (prevProps, nextProps) => {
  return (
    prevProps.category.id === nextProps.category.id &&
    prevProps.category.name === nextProps.category.name &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.count === nextProps.count &&
    prevProps.isMobile === nextProps.isMobile
  );
});

// CategoryFilter Interface - filter ด้วย type name
interface CategoryFilterProps {
  categories: Array<{ id: string | undefined; name: string }>; // id เป็น type name
  activeCategory: string | undefined; // activeCategory เป็น type name
  totalClubCount: number;
  categoryCountMap: Map<string | undefined, number>; // Add this prop for category counts
  loading: boolean;
  onCategoryChange: (typeName: string | undefined) => void; // parameter เป็น type name
}

// Main CategoryFilter Component
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  totalClubCount,
  categoryCountMap,
  loading,
  onCategoryChange
}) => {
  const { combine, getValueForTheme } = useThemeUtils();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get active category name for display
  const activeCategoryName = useMemo(() => {
    const active = categories.find(cat => cat.id === activeCategory);
    return active?.name || "ทั้งหมด";
  }, [categories, activeCategory]);

  const handleCategorySelect = (categoryId: string | undefined) => {
    onCategoryChange(categoryId);
    setIsDropdownOpen(false);
  };

  return (
    <section className="relative px-4 xs:px-5 sm:px-6 lg:px-8 pb-4">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Category Filter - Dropdown */}
        <div className="md:hidden mb-1">
          <h3 className={combine(
            "text-lg font-semibold mb-3",
            getValueForTheme("text-white", "text-gray-900")
          )}>
            เลือกประเภท
          </h3>
          
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={combine(
                "w-full flex items-center justify-between",
                "px-4 py-3 rounded-xl text-sm font-medium",
                "transition-all duration-200",
                getValueForTheme(
                  "bg-gray-800/40 border border-gray-700/30 text-gray-300 hover:bg-gray-700/30",
                  "bg-gray-50/70 border border-gray-100 text-gray-600 hover:bg-gray-100/80"
                )
              )}
              type="button"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="flex items-center gap-2">
                <span>{activeCategoryName}</span>
                {categoryCountMap.get(activeCategory) !== undefined && (
                  <span className={combine(
                    "px-2 py-0.5 rounded-full text-xs",
                    getValueForTheme(
                      "bg-gray-600/20 text-gray-300",
                      "bg-gray-200 text-gray-600"
                    )
                  )}>
                    {categoryCountMap.get(activeCategory)}
                  </span>
                )}
              </div>
              <svg 
                className={combine(
                  "w-4 h-4 transition-transform duration-200",
                  isDropdownOpen ? "rotate-180" : "",
                  getValueForTheme("text-gray-400", "text-gray-500")
                )}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className={combine(
                "absolute top-full left-0 right-0 mt-2 z-50",
                "rounded-xl border shadow-lg overflow-hidden",
                "animate-in fade-in-0 zoom-in-95 duration-100",
                getValueForTheme(
                  "bg-gray-800 border-gray-700",
                  "bg-white border-gray-200"
                )
              )}>
                <div className="max-h-60 overflow-y-auto">
                  {!loading && categories.map((category, index) => (
                    <button
                      key={category.id || 'all'}
                      onClick={() => handleCategorySelect(category.id)}
                      className={combine(
                        "w-full flex items-center justify-between px-4 py-3 text-sm text-left",
                        "transition-colors duration-150",
                        activeCategory === category.id
                          ? getValueForTheme(
                              "bg-blue-600/15 text-blue-200",
                              "bg-[#006C67]/10 text-[#006C67]"
                            )
                          : getValueForTheme(
                              "text-gray-300 hover:bg-gray-700/30 hover:text-white",
                              "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                            ),
                        index !== categories.length - 1 ? getValueForTheme(
                          "border-b border-gray-700/30",
                          "border-b border-gray-100"
                        ) : ""
                      )}
                      type="button"
                    >
                      <span className="font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        {activeCategory === category.id && categoryCountMap.get(category.id) !== undefined && (
                          <span className={combine(
                            "px-2 py-0.5 rounded-full text-xs",
                            getValueForTheme(
                              "bg-blue-500/20 text-blue-200",
                              "bg-[#006C67]/20 text-[#006C67]"
                            )
                          )}>
                            {categoryCountMap.get(category.id)}
                          </span>
                        )}
                        {activeCategory === category.id && (
                          <div className={combine(
                            "w-1.5 h-1.5 rounded-full",
                            getValueForTheme("bg-blue-400", "bg-[#006C67]")
                          )} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Category Filter */}
        <div className="hidden md:block">
          <div className="flex items-center gap-4 mb-4">
            <h3 className={combine(
              "text-xl font-semibold",
              getValueForTheme("text-white", "text-gray-900")
            )}>
              เลือกประเภท
            </h3>
            {loading && (
              <div className={combine(
                "animate-pulse h-8 w-20 rounded-full",
                getValueForTheme("bg-gray-700", "bg-gray-200")
              )} />
            )}
          </div>
          
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide -mx-4 xs:-mx-5 sm:-mx-6 px-4 xs:px-5 sm:px-6">
              <div className="flex flex-nowrap gap-1.5 xs:gap-2 sm:gap-2.5 pb-2">
                {!loading && categories.map((category) => (
                  <MemoizedCategoryItem
                    key={category.id || 'all'}
                    category={category}
                    isActive={activeCategory === category.id}
                    count={categoryCountMap.get(category.id)}
                    onClick={() => onCategoryChange(category.id)}
                    isMobile={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex gap-2 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={combine(
                  "animate-pulse h-8 rounded-full",
                  getValueForTheme("bg-gray-700", "bg-gray-200"),
                  index === 0 ? "w-16" : "w-20"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Export both components
export { MemoizedCategoryItem as CategoryItem };
export default memo(CategoryFilter);