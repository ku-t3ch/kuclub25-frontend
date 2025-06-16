import React, { memo, useMemo, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Animation constants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  },
  singleProject: {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  },
  hover: {
    y: -3,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
} as const;

// Memoized Icons
const CloseIcon = memo(() => (
  <svg
    className="w-3 h-3 xs:w-4 xs:h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
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

const CalendarIcon = memo<{ className: string }>(({ className }) => (
  <svg
    className={className}
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

// Empty State Component
const EmptyState = memo<{
  getValueForTheme: (dark: string, light: string) => string;
  combine: (...classes: string[]) => string;
  selectedDate: Date;
  formattedDate: string;
}>(({ getValueForTheme, combine, selectedDate, formattedDate }) => {
  const themeClasses = useMemo(
    () => ({
      container: combine(
        "backdrop-blur-sm rounded-lg xs:rounded-xl overflow-hidden border shadow-lg",
        "p-6 xs:p-8 sm:p-10 text-center",
        getValueForTheme(
          "bg-white/5 border-white/10 shadow-black/10",
          "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
        )
      ),
      iconContainer: combine(
        "w-16 h-16 mx-auto rounded-full flex items-center justify-center border-2 border-dashed",
        getValueForTheme(
          "border-white/20 bg-white/5",
          "border-[#006C67]/30 bg-[#006C67]/5"
        )
      ),
      icon: combine(
        "w-8 h-8",
        getValueForTheme("text-white/30", "text-[#006C67]/40")
      ),
      title: combine(
        "text-lg font-medium mb-2",
        getValueForTheme("text-white/70", "text-[#006C67]/80")
      ),
      description: combine(
        "text-sm",
        getValueForTheme("text-white/50", "text-[#006C67]/60")
      ),
    }),
    [getValueForTheme, combine]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="mb-8 sm:mb-10 lg:mb-12 mx-2 xs:mx-0"
    >
      <div className={themeClasses.container}>
        <div className="mb-4">
          <div className={themeClasses.iconContainer}>
            <CalendarIcon className={themeClasses.icon} />
          </div>
        </div>
        <h3 className={themeClasses.title}>
          ไม่มีกิจกรรมในวันที่ {formattedDate}
        </h3>
        <p className={themeClasses.description}>
          ลองเลือกวันอื่น หรือดูกิจกรรมในมุมมองรายการ
        </p>
      </div>
    </motion.div>
  );
});
EmptyState.displayName = "EmptyState";

// Project Item Component
const ProjectItem = memo<{
  project: any;
  index: number;
  onProjectClick: (project: any) => void;
}>(({ project, index, onProjectClick }) => {
  const handleClick = useCallback(() => {
    onProjectClick(project);
  }, [project, onProjectClick]);

  const projectKey = useMemo(() => {
    return project?.id || project?.project_id || `project-${index}`;
  }, [project?.id, project?.project_id, index]);

  return (
    <motion.div
      key={projectKey}
      variants={ANIMATION_VARIANTS.item}
      whileHover={ANIMATION_VARIANTS.hover}
      className="w-full"
    >
      <ProjectCard project={project} onClick={handleClick} />
    </motion.div>
  );
});
ProjectItem.displayName = "ProjectItem";

// Main Component
const SelectedDateProjects = memo<SelectedDateProjectsProps>(
  ({
    selectedDate,
    projectsOnSelectedDate,
    setSelectedDate,
    getActivityColor,
    ACTIVITY_TYPES,
  }) => {
    const { getValueForTheme, combine } = useThemeUtils();
    const [isClient, setIsClient] = useState(false);

    // Client-side mounting check for SSR safety
    useEffect(() => {
      setIsClient(true);
    }, []);

    // Memoize valid projects with better error handling
    const validProjects = useMemo(() => {
      if (
        !Array.isArray(projectsOnSelectedDate) ||
        projectsOnSelectedDate.length === 0
      ) {
        return [];
      }

      return projectsOnSelectedDate
        .map((projectItem, index) => {
          if (!projectItem) return null;

          let project = projectItem;

          if (projectItem.originalProject) {
            project = projectItem.originalProject;
          }

          if (!project) return null;

          const hasValidId =
            project.id || project.project_id || project.projectid;
          const hasValidName =
            project.name_th || project.name_en || project.title;

          if (!hasValidId && !hasValidName) return null;

          return {
            ...project,
            id:
              project.id ||
              project.project_id ||
              project.projectid ||
              `temp-${index}`,
            name_th:
              project.name_th ||
              project.project_name_th ||
              project.title ||
              "ไม่ระบุชื่อ",
            name_en:
              project.name_en ||
              project.project_name_en ||
              project.title ||
              "Untitled",
          };
        })
        .filter(Boolean);
    }, [projectsOnSelectedDate]);

    // Memoize formatted date with SSR safety
    const formattedDate = useMemo(() => {
      if (!selectedDate || !isClient) return "";

      try {
        return moment(selectedDate).format("DD MMMM YYYY");
      } catch {
        // Fallback for invalid dates
        return selectedDate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    }, [selectedDate, isClient]);

    // Memoize theme classes
    const themeClasses = useMemo(
      () => ({
        container: combine(
          "backdrop-blur-sm rounded-lg xs:rounded-xl overflow-hidden border shadow-lg",
          getValueForTheme(
            "bg-white/5 border-white/10 shadow-black/10",
            "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
          )
        ),
        header: combine(
          "flex flex-col xs:flex-row xs:items-center justify-between",
          "py-3 xs:py-4 px-3 xs:px-5 border-b gap-3 xs:gap-0",
          getValueForTheme(
            "border-white/10 bg-gradient-to-r from-white/5 to-white/3",
            "border-[#006C67]/20 bg-gradient-to-r from-[#006C67]/5 to-white"
          )
        ),
        indicator: combine(
          "w-1 h-6 xs:h-6 rounded-full flex-shrink-0",
          getValueForTheme(
            "bg-gradient-to-b from-[#047857] via-[#006C67] to-[#047857]",
            "bg-gradient-to-b from-[#006C67] to-[#006C67]/80"
          )
        ),
        dateText: combine(
          "text-lg xs:text-lg font-medium break-words",
          getValueForTheme("text-white", "text-[#006C67]")
        ),
        badge: combine(
          "px-2 xs:px-3 py-1 rounded-full text-xs xs:text-sm font-medium",
          getValueForTheme(
            "bg-[#047857]/40 text-white/75 border border-[#047857]/90",
            "bg-[#006C67]/10 text-[#006C67] border border-[#006C67]/20"
          )
        ),
        closeButton: combine(
          "p-1.5 xs:p-2 rounded-lg transition-all duration-200",
          "flex items-center justify-center hover:scale-105 active:scale-95",
          getValueForTheme(
            "text-white/60 hover:text-white hover:bg-white/10",
            "text-[#006C67]/60 hover:text-[#006C67] hover:bg-[#006C67]/5"
          )
        ),
      }),
      [getValueForTheme, combine]
    );

    // Memoized event handlers
    const handleCloseClick = useCallback(() => {
      setSelectedDate(null);
    }, [setSelectedDate]);

    const handleProjectClick = useCallback((project: any) => {
      if (!project) return;

      const projectId = project.id || project.project_id || project.projectid;
      if (projectId && !projectId.startsWith("temp-")) {
        try {
          // Use Next.js router instead of direct window.location for better performance
          if (typeof window !== "undefined") {
            window.location.href = `/projects/${projectId}`;
          }
        } catch (error) {
          console.warn("Navigation failed:", error);
        }
      }
    }, []);

    // Early returns for invalid states
    if (!selectedDate) {
      return null;
    }

    if (!isClient) {
      // Return loading state for SSR
      return (
        <div className="mb-8 sm:mb-10 lg:mb-12 mx-2 xs:mx-0">
          <div className={themeClasses.container}>
            <div className="p-6 xs:p-8 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (
      !Array.isArray(projectsOnSelectedDate) ||
      projectsOnSelectedDate.length === 0 ||
      validProjects.length === 0
    ) {
      return (
        <EmptyState
          getValueForTheme={getValueForTheme}
          combine={combine}
          selectedDate={selectedDate}
          formattedDate={formattedDate}
        />
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-10 lg:mb-12 mx-2 xs:mx-0"
          data-selected-date-projects
        >
          <div className={themeClasses.container}>
            {/* Header */}
            <div className={themeClasses.header}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={themeClasses.indicator} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className={themeClasses.dateText}>
                    กิจกรรมวันที่ {formattedDate}
                  </p>
                </div>
                <button
                  onClick={handleCloseClick}
                  className={themeClasses.closeButton}
                  aria-label="ปิดรายการกิจกรรม"
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={themeClasses.badge}>
                  {validProjects.length} กิจกรรม
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 xs:p-4 sm:p-5">
              {validProjects.length === 1 ? (
                <motion.div {...ANIMATION_VARIANTS.singleProject}>
                  <ProjectCard
                    project={validProjects[0]}
                    onClick={handleProjectClick}
                  />
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    variants={ANIMATION_VARIANTS.container}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
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
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

SelectedDateProjects.displayName = "SelectedDateProjects";
export default SelectedDateProjects;
