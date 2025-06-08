"use client";

import React, { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeUtils } from "../../../hooks/useThemeUtils";
import ProjectCard from "../../ui/cardProject";

interface OrganizationProjectSectionProps {
  projectCategories: any;
  projectsLoading: boolean;
  activeTab: "upcoming" | "ongoing" | "past" | "all";
  onTabChange: (tab: "upcoming" | "ongoing" | "past" | "all") => void;
  onProjectClick: (project: any) => void;
}

// Constants outside component to prevent recreation
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SECTION_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.2 }
};

// Memoized loading animation component
const LoadingSpinner = React.memo<{ themeValues: any }>(({ themeValues }) => (
  <motion.div
    key="loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="py-12 md:py-20 flex flex-col items-center justify-center"
  >
    <div className="w-8 h-8 md:w-10 md:h-10 relative">
      <div
        className={`absolute inset-0 rounded-full border-2 border-t-transparent animate-spin ${themeValues.spinnerBorder}`}
      />
    </div>
    <p className={`mt-3 md:mt-4 text-sm md:text-base ${themeValues.secondaryText}`}>
      กำลังโหลดข้อมูล...
    </p>
  </motion.div>
));
LoadingSpinner.displayName = "LoadingSpinner";

// Memoized empty state component
const EmptyState = React.memo<{
  activeTab: string;
  themeValues: any;
  combine: (...classes: string[]) => string;
  getValueForTheme: (dark: string, light: string) => string;
}>(({ activeTab, themeValues, combine, getValueForTheme }) => {
  const emptyMessages = useMemo(() => ({
    all: "ยังไม่มีโครงการหรือกิจกรรม",
    upcoming: "ไม่มีโครงการที่กำลังจะมาถึง",
    ongoing: "ไม่มีโครงการที่กำลังดำเนินการ",
    past: "ไม่มีโครงการที่ผ่านมา"
  }), []);

  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12 md:py-20"
    >
      <div
        className={combine(
          "w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full flex items-center justify-center",
          getValueForTheme("bg-white/10", "bg-[#006C67]/10")
        )}
      >
        <svg
          className={combine("w-6 h-6 md:w-8 md:h-8", themeValues.secondaryText)}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className={combine("text-base md:text-lg font-light px-4", themeValues.secondaryText)}>
        {emptyMessages[activeTab as keyof typeof emptyMessages]}
      </p>
    </motion.div>
  );
});
EmptyState.displayName = "EmptyState";

// Memoized calendar icon component
const CalendarIcon = React.memo(() => (
  <svg
    className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
));
CalendarIcon.displayName = "CalendarIcon";

// Optimized tab button component with better responsive design
const TabButton = React.memo<{
  tab: any;
  isActive: boolean;
  onClick: () => void;
  themeValues: any;
  combine: (...classes: string[]) => string;
  getValueForTheme: (dark: string, light: string) => string;
}>(({ tab, isActive, onClick, themeValues, combine, getValueForTheme }) => (
  <motion.button
    onClick={onClick}
    className={combine(
      "px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 border whitespace-nowrap flex-shrink-0",
      isActive ? themeValues.tabActive : themeValues.tabInactive
    )}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="block sm:inline">{tab.label}</span>
    {tab.count > 0 && (
      <span
        className={combine(
          "ml-1 sm:ml-2 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full text-xs",
          isActive
            ? getValueForTheme("bg-blue-500/30", "bg-[#006C67]/20")
            : getValueForTheme("bg-white/10", "bg-[#006C67]/10")
        )}
      >
        {tab.count}
      </span>
    )}
  </motion.button>
));
TabButton.displayName = "TabButton";

const OrganizationProjectSection: React.FC<OrganizationProjectSectionProps> = ({
  projectCategories,
  projectsLoading,
  activeTab,
  onTabChange,
  onProjectClick,
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  // Memoized theme values for better performance
  const themeValues = useMemo(() => ({
    cardBg: getValueForTheme(
      "bg-white/5 border-white/10 shadow-blue-900/5",
      "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
    ),
    primaryText: getValueForTheme("text-white", "text-[#006C67]"),
    secondaryText: getValueForTheme("text-white/70", "text-[#006C67]/70"),
    accentBlue: getValueForTheme("text-blue-300", "text-[#006C67]"),
    titleGradient: getValueForTheme(
      "bg-gradient-to-r from-white to-blue-100",
      "bg-gradient-to-r from-[#006C67] to-[#006C67]/80"
    ),
    tabActive: getValueForTheme(
      "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "bg-[#006C67]/10 text-[#006C67] border border-[#006C67]/20"
    ),
    tabInactive: getValueForTheme(
      "bg-white/5 text-white/60 border-white/10 hover:bg-white/10",
      "bg-white text-[#006C67]/60 border border-[#006C67]/20 hover:bg-[#006C67]/5"
    ),
    spinnerBorder: getValueForTheme("border-blue-400", "border-[#006C67]"),
    hoverShadow: getValueForTheme(
      "0 15px 20px -5px rgba(0, 0, 0, 0.3)",
      "0 15px 20px -5px rgba(0, 108, 103, 0.1)"
    )
  }), [getValueForTheme]);

  // Memoized current projects
  const currentProjects = useMemo(() => 
    projectCategories[activeTab] || [], 
    [projectCategories, activeTab]
  );

  // Memoized tabs configuration
  const tabs = useMemo(() => [
    {
      key: "all",
      label: "ทั้งหมด",
      count: projectCategories.counts?.all || 0,
    },
    {
      key: "upcoming",
      label: "กำลังจะมาถึง",
      count: projectCategories.counts?.upcoming || 0,
    },
    {
      key: "ongoing",
      label: "กำลังดำเนินการ",
      count: projectCategories.counts?.ongoing || 0,
    },
    {
      key: "past",
      label: "ที่ผ่านมา",
      count: projectCategories.counts?.past || 0,
    },
  ], [projectCategories.counts]);

  // Memoized tab change handlers
  const createTabHandler = useCallback((tabKey: string) => 
    () => onTabChange(tabKey as typeof activeTab), 
    [onTabChange]
  );

  // Memoized project click handler with project id
  const handleProjectClick = useCallback((project: any) => 
    () => onProjectClick(project), 
    [onProjectClick]
  );

  return (
    <motion.div
      {...SECTION_ANIMATION}
      className={combine(
        "backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl overflow-hidden relative",
        themeValues.cardBg
      )}
    >
      {/* Projects Header with Tabs */}
      <div className="flex flex-col gap-4 mb-6 md:mb-8">
        {/* Title */}
        <h2
          className={combine(
            "text-xl sm:text-2xl md:text-3xl font-medium bg-clip-text text-transparent flex items-center gap-2 md:gap-3",
            themeValues.titleGradient
          )}
        >
          <span className={themeValues.accentBlue}>
            <CalendarIcon />
          </span>
          <span className="leading-tight">โครงการและกิจกรรม</span>
        </h2>

        {/* Project Tabs - Responsive Scrollable */}
        <div className="w-full overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                tab={tab}
                isActive={activeTab === tab.key}
                onClick={createTabHandler(tab.key)}
                themeValues={themeValues}
                combine={combine}
                getValueForTheme={getValueForTheme}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Projects Content */}
      <AnimatePresence mode="wait">
        {projectsLoading ? (
          <LoadingSpinner themeValues={themeValues} />
        ) : currentProjects.length > 0 ? (
          <motion.div
            key={activeTab}
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
          >
            {currentProjects.map((project: any) => (
              <motion.div
                key={project.id}
                variants={ITEM_VARIANTS}
                whileHover={{
                  y: -2,
                  scale: 1.01,
                  boxShadow: themeValues.hoverShadow,
                }}
                whileTap={{ scale: 0.99 }}
                onClick={handleProjectClick(project)}
                className="cursor-pointer touch-manipulation"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            activeTab={activeTab}
            themeValues={themeValues}
            combine={combine}
            getValueForTheme={getValueForTheme}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(OrganizationProjectSection);