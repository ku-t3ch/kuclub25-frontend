import React, { memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { type ActivityType } from "../../utils/calendarUtils";
import ProjectCard from "../ui/cardProject";
import { Project } from "../../types/project";

interface ProjectListProps {
  filteredProjectsByMonth: Project[];
  getActivityColor: (type: string) => string;
  ACTIVITY_TYPES: readonly ActivityType[];
  onProjectClick?: (project: Project) => void;
  selectedCampus?: string;
  currentDate: Date;
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  },
  emptyState: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2,
      },
    },
  },
  icon: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.3,
    },
  },
  text: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.5 },
  },
  header: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.1 },
  },
} as const;

const HOVER_VARIANTS = {
  y: -5,
  transition: { type: "spring", stiffness: 300, damping: 20 },
} as const;

const EmptyStateIcon = memo(({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
));
EmptyStateIcon.displayName = "EmptyStateIcon";

const ProjectList = memo<ProjectListProps>(({
  filteredProjectsByMonth,
  getActivityColor,
  ACTIVITY_TYPES,
  onProjectClick,
  selectedCampus,
  currentDate,
}) => {
  const { getValueForTheme, combine } = useThemeUtils();

  const isValidDate = useCallback((dateString: string): boolean => {
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }, []);

  const finalFilteredProjects = useMemo(() => {
    if (!Array.isArray(filteredProjectsByMonth) || filteredProjectsByMonth.length === 0) {
      return [];
    }

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return filteredProjectsByMonth.filter((project) => {
      if (!project?.id || !project.date_start) return false;

      if (selectedCampus && project.campus_name !== selectedCampus) {
        return false;
      }

      if (!isValidDate(project.date_start)) return false;

      const projectStartDate = new Date(project.date_start);
      return (
        projectStartDate.getFullYear() === currentYear &&
        projectStartDate.getMonth() === currentMonth
      );
    });
  }, [filteredProjectsByMonth, selectedCampus, currentDate, isValidDate]);

  const emptyStateConfig = useMemo(() => {
    if (selectedCampus) {
      return {
        title: `ไม่พบกิจกรรมในเดือนนี้ที่ ${selectedCampus}`,
        subtitle: "ลองเลือกวิทยาเขตอื่น หรือเปลี่ยนเดือน",
      };
    }
    return {
      title: "ไม่พบกิจกรรมในเดือนนี้",
      subtitle: "ลองเลือกเดือนอื่น หรือดูในมุมมองปฏิทิน",
    };
  }, [selectedCampus]);

  const themeClasses = useMemo(() => ({
    emptyState: combine(
      "backdrop-blur-sm rounded-xl p-12 md:p-16 text-center border shadow-sm",
      getValueForTheme(
        "bg-white/5 border-white/10 shadow-black/10",
        "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
      )
    ),
    iconContainer: combine(
      "mx-auto w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed",
      getValueForTheme(
        "border-white/20 bg-white/5",
        "border-[#006C67]/30 bg-[#006C67]/5"
      )
    ),
    icon: combine(
      "h-10 w-10",
      getValueForTheme("text-white/30", "text-[#006C67]/40")
    ),
    title: combine(
      "text-lg md:text-xl font-medium mb-3",
      getValueForTheme("text-white/70", "text-[#006C67]/80")
    ),
    subtitle: combine(
      "text-sm md:text-base mb-4",
      getValueForTheme("text-white/50", "text-[#006C67]/60")
    ),
    headerBorder: combine(
      "flex items-center justify-between pb-3 border-b",
      getValueForTheme("border-white/10", "border-[#006C67]/20")
    ),
    headerTitle: combine(
      "text-lg md:text-xl font-semibold",
      getValueForTheme("text-white", "text-[#006C67]")
    ),
    headerSubtitle: combine(
      "text-sm mt-1",
      getValueForTheme("text-white/70", "text-[#006C67]/70")
    ),
    countBadge: combine(
      "px-3 py-1 rounded-full text-sm font-medium",
      getValueForTheme(
        "bg-[#047857]/50 text-white/75 border border-[#047857]",
        "bg-[#006C67]/10 text-[#006C67] border border-[#006C67]/20"
      )
    ),
  }), [combine, getValueForTheme]);

  if (finalFilteredProjects.length === 0) {
    return (
      <motion.div
        variants={ANIMATION_VARIANTS.emptyState}
        initial="hidden"
        animate="visible"
        className={themeClasses.emptyState}
      >
        <motion.div
          {...ANIMATION_VARIANTS.icon}
          className="mb-6"
        >
          <div className={themeClasses.iconContainer}>
            <EmptyStateIcon className={themeClasses.icon} />
          </div>
        </motion.div>

        <motion.div {...ANIMATION_VARIANTS.text}>
          <h3 className={themeClasses.title}>
            {emptyStateConfig.title}
          </h3>
          <p className={themeClasses.subtitle}>
            {emptyStateConfig.subtitle}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.container}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <motion.div
        {...ANIMATION_VARIANTS.header}
        className={themeClasses.headerBorder}
      >
        <div>
          <h2 className={themeClasses.headerTitle}>
            กิจกรรมทั้งหมด
          </h2>
          {selectedCampus && (
            <p className={themeClasses.headerSubtitle}>
              ที่ {selectedCampus}
            </p>
          )}
        </div>
        <div className={themeClasses.countBadge}>
          {finalFilteredProjects.length} กิจกรรม
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {finalFilteredProjects.map((project, index) => (
          <motion.div
            key={project.id || `project-${index}`}
            variants={ANIMATION_VARIANTS.item}
            whileHover={HOVER_VARIANTS}
            whileTap={{ scale: 0.98 }}
          >
            <ProjectCard 
              project={project} 
              onClick={onProjectClick} 
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

ProjectList.displayName = "ProjectList";
export default ProjectList;