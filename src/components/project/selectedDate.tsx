/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import ProjectCard from "../ui/cardProject";
import { type ActivityType } from "../../utils/calendarUtils";

interface SelectedDateProjectsProps {
  selectedDate: Date;
  projectsOnSelectedDate: any[];
  setSelectedDate: (date: Date | null) => void;
  getActivityColor: (type: string) => string;
  ACTIVITY_TYPES: readonly ActivityType[];
}

// Pre-defined animation variants to prevent recreation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const;

const singleProjectVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 },
} as const;

const hoverVariants = {
  y: -3,
  transition: { type: "spring", stiffness: 300, damping: 20 },
} as const;

// Memoized Close Icon component
const CloseIcon = memo(() => (
  <svg
    className="w-3 h-3 xs:w-4 xs:h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
));
CloseIcon.displayName = "CloseIcon";

// Memoized project validation utility
const useValidatedProjects = (projectsOnSelectedDate: any[]) => {
  return useMemo(() => {
    if (!projectsOnSelectedDate?.length) return [];

    return projectsOnSelectedDate
      .map((projectItem) => {
        if (!projectItem) return null;

        const project = projectItem.originalProject || projectItem;

        if (
          !project?.id &&
          !project?.project_name_th &&
          !project?.project_name_en
        ) {
          return null;
        }

        return project;
      })
      .filter(Boolean);
  }, [projectsOnSelectedDate]);
};

// Memoized empty state component
const EmptyState = memo<{
  getValueForTheme: (dark: string, light: string) => string;
  combine: (...classes: string[]) => string;
}>(({ getValueForTheme, combine }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="mb-8 sm:mb-10 lg:mb-12 mx-2 xs:mx-0"
  >
    <div
      className={combine(
        "backdrop-blur-sm rounded-lg xs:rounded-xl overflow-hidden border shadow-lg",
        "p-4 xs:p-6 sm:p-8 text-center",
        getValueForTheme(
          "bg-white/5 border-white/10 shadow-[black]",
          "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
        )
      )}
    >
      <p
        className={combine(
          "text-xs xs:text-sm",
          getValueForTheme("text-white/60", "text-[#006C67]/60")
        )}
      >
        ไม่มีข้อมูลกิจกรรมที่ถูกต้องสำหรับวันที่เลือก
      </p>
    </div>
  </motion.div>
));
EmptyState.displayName = "EmptyState";

// Memoized project item component
const ProjectItem = memo<{
  project: any;
  index: number;
  onProjectClick: (project: any) => void;
}>(({ project, index, onProjectClick }) => {
  const projectKey = useMemo(
    () => project.id || `project-${index}`,
    [project.id, index]
  );

  const handleClick = useCallback(() => {
    onProjectClick(project);
  }, [project, onProjectClick]);

  return (
    <motion.div
      key={projectKey}
      variants={itemVariants}
      whileHover={hoverVariants}
      className="w-full"
    >
      <ProjectCard project={project} onClick={handleClick} />
    </motion.div>
  );
});
ProjectItem.displayName = "ProjectItem";

// Main component
const SelectedDateProjects: React.FC<SelectedDateProjectsProps> = memo(
  ({
    selectedDate,
    projectsOnSelectedDate,
    setSelectedDate,
    getActivityColor,
    ACTIVITY_TYPES,
  }) => {
    const { getValueForTheme, combine } = useThemeUtils();

    // Memoized valid projects
    const validProjects = useValidatedProjects(projectsOnSelectedDate);

    // Memoized formatted date
    const formattedDate = useMemo(() => {
      return moment(selectedDate).format("DD MMMM YYYY");
    }, [selectedDate]);

    // Memoized theme classes
    const themeClasses = useMemo(
      () => ({
        container: getValueForTheme(
          "bg-white/5 border-white/10 shadow-[black]",
          "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
        ),
        header: getValueForTheme(
          "border-white/10 bg-gradient-to-r from-white/5 to-white/3",
          "border-[#006C67]/20 bg-gradient-to-r from-[#006C67]/5 to-white"
        ),
        indicator: getValueForTheme(
          "bg-gradient-to-b from-[#047857] via-[#006C67] to-[#047857]",
          "bg-gradient-to-b from-[#006C67] to-[#006C67]/80"
        ),
        titleText: getValueForTheme("text-white/90", "text-[#006C67]/70"),
        dateText: getValueForTheme("text-white", "text-[#006C67]"),
        badge: getValueForTheme(
          "bg-[#047857]/40 text-[white]/75 border border-[#047857]/90",
          "bg-[#006C67]/10 text-[#006C67] border border-[#006C67]/20"
        ),
        closeButton: getValueForTheme(
          "text-white/60 hover:text-white hover:bg-white/10",
          "text-[#006C67]/60 hover:text-[#006C67] hover:bg-[#006C67]/5"
        ),
        footer: getValueForTheme(
          "border-white/10 bg-white/3",
          "border-[#006C67]/20 bg-[#006C67]/5"
        ),
        footerText: getValueForTheme("text-white/60", "text-[#006C67]/60"),
        viewAllButton: getValueForTheme(
          "text-[#047857] hover:text-[#047857] hover:bg-[#047857]",
          "text-[#006C67] hover:text-[#006C67]/80 hover:bg-[#006C67]/5"
        ),
      }),
      [getValueForTheme]
    );

    // Memoized handlers
    const handleCloseClick = useCallback(() => {
      setSelectedDate(null);
    }, [setSelectedDate]);

    const handleProjectClick = useCallback((project: any) => {
      if (project?.id) {
        window.location.href = `/projects/${project.id}`;
      }
    }, []);

    const handleViewAllClick = useCallback(() => {
      console.log("View all projects for selected date");
      // Add your view all logic here
    }, []);

    // Early returns for performance
    if (!selectedDate || !projectsOnSelectedDate?.length) {
      return null;
    }

    if (validProjects.length === 0) {
      return (
        <EmptyState getValueForTheme={getValueForTheme} combine={combine} />
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="mb-8 sm:mb-10 lg:mb-12 mx-2 xs:mx-0"
      >
        <div
          className={combine(
            "backdrop-blur-sm rounded-lg xs:rounded-xl overflow-hidden border shadow-lg",
            themeClasses.container
          )}
        >
          {/* Header */}
          <div
            className={combine(
              "flex flex-col xs:flex-row xs:items-center justify-between",
              "py-3 xs:py-4 px-3 xs:px-5 border-b gap-3 xs:gap-0",
              themeClasses.header
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={combine(
                  "w-1 h-6 xs:h-6 rounded-full flex-shrink-0",
                  themeClasses.indicator
                )}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={combine(
                    "text-lg xs:text-lg font-medium break-words",
                    themeClasses.dateText
                  )}
                >
                  {formattedDate}
                </p>
              </div>
              <div
                className={combine(
                  "px-2 xs:px-3 py-1 rounded-full text-xs xs:text-sm font-medium flex-shrink-0",
                  themeClasses.badge
                )}
              >
                {validProjects.length} กิจกรรม
              </div>
              <button
                onClick={handleCloseClick}
                className={combine(
                  "p-1.5 xs:p-2 rounded-lg transition-all duration-200",
                  "flex items-center justify-center flex-shrink-0",
                  themeClasses.closeButton
                )}
                aria-label="ปิดรายการกิจกรรม"
                type="button"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
          {/* Projects List */}
          <div className="p-3 xs:p-4 sm:p-5">
            {validProjects.length === 1 ? (
              // Single project - full width
              <motion.div {...singleProjectVariants}>
                <ProjectCard
                  project={validProjects[0]}
                  onClick={handleProjectClick}
                />
              </motion.div>
            ) : (
              // Multiple projects - responsive grid layout
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4"
              >
                {validProjects.map((project, index) => (
                  <ProjectItem
                    key={project.id || `project-${index}`}
                    project={project}
                    index={index}
                    onProjectClick={handleProjectClick}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

SelectedDateProjects.displayName = "SelectedDateProjects";

export default SelectedDateProjects;
