import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { type ActivityType } from "../../utils/calendarUtils";

interface ActivityTypeFilterProps {
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
  ACTIVITY_TYPES: readonly ActivityType[];
}

const ActivityTypeFilter: React.FC<ActivityTypeFilterProps> = React.memo(({
  activeFilters,
  toggleFilter,
  ACTIVITY_TYPES,
}) => {
  const { getValueForTheme, combine } = useThemeUtils();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { activeFilterLabel, activeFilterColor } = useMemo(() => {
    if (activeFilters.includes("all")) {
      return { activeFilterLabel: "ทั้งหมด", activeFilterColor: getValueForTheme("#3B82F6", "#006C67") };
    }
    if (activeFilters.length === 0) {
      return { activeFilterLabel: "เลือกประเภทกิจกรรม", activeFilterColor: getValueForTheme("#3B82F6", "#006C67") };
    }
    if (activeFilters.length === 1) {
      const activeType = ACTIVITY_TYPES.find(type => activeFilters.includes(type.id));
      return { 
        activeFilterLabel: activeType?.label || "ทั้งหมด",
        activeFilterColor: activeType?.color || getValueForTheme("#3B82F6", "#006C67")
      };
    }
    return { 
      activeFilterLabel: `เลือก ${activeFilters.length} ประเภท`,
      activeFilterColor: getValueForTheme("#3B82F6", "#006C67")
    };
  }, [activeFilters, ACTIVITY_TYPES, getValueForTheme]);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const handleFilterSelect = useCallback((filterId: string, shouldClose = false) => {
    toggleFilter(filterId);
    if (shouldClose) setIsDropdownOpen(false);
  }, [toggleFilter]);

  const handleCloseDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const themeClasses = useMemo(() => ({
    mobileButton: combine(
      "w-full flex items-center justify-between px-4 py-3 rounded-xl border-0 text-sm font-medium",
      "focus:outline-none focus:ring-2 focus:ring-[#006C67]/30 focus:ring-offset-2",
      "transition-all duration-200 ease-in-out shadow-sm hover:shadow-md min-h-[48px]",
      getValueForTheme(
        "bg-white/5 backdrop-blur-sm border-white/10 text-white/90 hover:bg-white/10",
        "bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white"
      )
    ),
    dropdown: combine(
      "absolute top-full left-4 right-4 mt-2 py-2 rounded-xl shadow-lg border z-50 backdrop-blur-sm",
      getValueForTheme("bg-black/25 border-white/10", "bg-white/95 border-gray-200")
    ),
    desktopButton: (isActive: boolean, color?: string) => combine(
      "flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0",
      isActive
        ? "text-white shadow-md"
        : getValueForTheme(
            "bg-white/10 text-white/90 hover:bg-white/20",
            "bg-white border border-[#006C67]/20 text-[#006C67] hover:bg-[#006C67]/5"
          )
    ),
  }), [combine, getValueForTheme]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mb-6 max-w-4xl mx-auto"
    >
      <div className="sm:hidden relative px-4">
        <button onClick={handleDropdownToggle} className={themeClasses.mobileButton}>
          <div className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
              style={{ backgroundColor: activeFilterColor }}
            />
            <span className="truncate">{activeFilterLabel}</span>
          </div>
          <svg
            className={combine(
              "w-5 h-5 transition-transform duration-200",
              isDropdownOpen ? "rotate-180" : "",
              getValueForTheme("text-white/60", "text-gray-400")
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={themeClasses.dropdown}
            >
              <button
                onClick={() => handleFilterSelect("all", true)}
                className={combine(
                  "w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150",
                  activeFilters.includes("all")
                    ? getValueForTheme("bg-[#54CF90]/20 text-[#54CF90]", "bg-[#006C67]/10 text-[#006C67]")
                    : getValueForTheme("text-white/90 hover:bg-white/5", "text-gray-700 hover:bg-gray-50")
                )}
              >
                <span className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: getValueForTheme("#3B82F6", "#006C67") }} />
                <span>ทั้งหมด</span>
                {activeFilters.includes("all") && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {ACTIVITY_TYPES.map((activityType) => (
                <button
                  key={activityType.id}
                  onClick={() => handleFilterSelect(activityType.id)}
                  className={combine(
                    "w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150",
                    activeFilters.includes(activityType.id)
                      ? getValueForTheme("bg-white/10 text-white", "bg-gray-50 text-gray-900")
                      : getValueForTheme("text-white/90 hover:bg-white/5", "text-gray-700 hover:bg-gray-50")
                  )}
                >
                  <span className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: activityType.color }} />
                  <span className="truncate flex-1 text-left">{activityType.label}</span>
                  {activeFilters.includes(activityType.id) && (
                    <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}

              <div className="border-t border-white/10 dark:border-gray-200 mt-2 pt-2">
                <button
                  onClick={handleCloseDropdown}
                  className={combine(
                    "w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
                    getValueForTheme("text-white/70 hover:bg-white/5 hover:text-white/90", "text-gray-500 hover:bg-gray-50 hover:text-gray-700")
                  )}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  เสร็จสิ้น
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={handleCloseDropdown} />}
      </div>

      <div className="hidden sm:block relative px-2">
        <div className="flex overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide -mx-1 px-1">
          <div className="flex gap-3 sm:flex-wrap sm:justify-center min-w-min">
            <motion.button
              onClick={() => toggleFilter("all")}
              whileTap={{ scale: 0.95 }}
              className={combine(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0",
                activeFilters.includes("all")
                  ? combine("shadow-md", getValueForTheme("bg-gradient-to-r from-[#54CF90] to-[#006C67] text-white", "bg-[#006C67] text-white"))
                  : getValueForTheme("bg-white/10 text-white/90 hover:bg-white/20", "bg-white border border-[#006C67]/20 text-[#006C67] hover:bg-[#006C67]/5")
              )}
            >
              ทั้งหมด
            </motion.button>

            {ACTIVITY_TYPES.map((activityType) => (
              <motion.button
                key={activityType.id}
                onClick={() => toggleFilter(activityType.id)}
                whileTap={{ scale: 0.95 }}
                className={themeClasses.desktopButton(activeFilters.includes(activityType.id))}
                style={{
                  backgroundColor: activeFilters.includes(activityType.id) ? activityType.color : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0"
                  style={{
                    backgroundColor: !activeFilters.includes(activityType.id) ? activityType.color : "white",
                  }}
                />
                <span className="truncate">{activityType.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ActivityTypeFilter.displayName = "ActivityTypeFilter";
export default ActivityTypeFilter;