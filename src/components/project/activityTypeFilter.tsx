import React from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { type ActivityType } from "../../utils/calendarUtils";

interface ActivityTypeFilterProps {
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
  ACTIVITY_TYPES: readonly ActivityType[];
}

const ActivityTypeFilter: React.FC<ActivityTypeFilterProps> = ({
  activeFilters,
  toggleFilter,
  ACTIVITY_TYPES
}) => {
  const { getValueForTheme, combine } = useThemeUtils();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mb-6 max-w-4xl mx-auto"
    >
      <div className="relative px-2">
        <div className="flex overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide -mx-1 px-1">
          <div className="flex gap-3 sm:flex-wrap sm:justify-center min-w-min">
            {/* All filter button */}
            <motion.button
              onClick={() => toggleFilter('all')}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                activeFilters.includes('all')
                  ? combine(
                      "shadow-md",
                      getValueForTheme(
                        "bg-blue-500 text-white",
                        "bg-[#006C67] text-white"
                      )
                    )
                  : getValueForTheme(
                      "bg-white/10 text-white/90 hover:bg-white/20",
                      "bg-white border border-[#006C67]/20 text-[#006C67] hover:bg-[#006C67]/5"
                    )
              }`}
            >
              ทั้งหมด
            </motion.button>
            
            {/* Activity type filter buttons */}
            {ACTIVITY_TYPES.map((activityType) => {
              return (
                <motion.button
                  key={activityType.id}
                  onClick={() => toggleFilter(activityType.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                    activeFilters.includes(activityType.id)
                      ? `text-white shadow-md`
                      : combine(
                          "",
                          getValueForTheme(
                            "bg-white/10 text-white/90 hover:bg-white/20",
                            "bg-white border border-[#006C67]/20 text-[#006C67] hover:bg-[#006C67]/5"
                          )
                        )
                  }`}
                  style={{
                    backgroundColor: activeFilters.includes(activityType.id) ? activityType.color : undefined
                  }}
                >
                  <span 
                    className={`w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0`}
                    style={{
                      backgroundColor: !activeFilters.includes(activityType.id) ? activityType.color : 'white'
                    }}
                  ></span>
                  <span className="truncate">{activityType.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Fade gradient indicators to show there's more content on mobile */}
        <div className={combine(
          "absolute right-0 top-0 bottom-0 w-8 pointer-events-none sm:hidden",
          getValueForTheme(
            "bg-gradient-to-l from-black/10 to-transparent",
            "bg-gradient-to-l from-white/80 to-transparent"
          )
        )}></div>
      </div>
    </motion.div>
  );
};

export default ActivityTypeFilter;