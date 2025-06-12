import React, { memo, useMemo } from "react";
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

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
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
};

const emptyStateVariants = {
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
};

const ProjectList = memo<ProjectListProps>(
  ({
    filteredProjectsByMonth,
    getActivityColor,
    ACTIVITY_TYPES,
    onProjectClick,
    selectedCampus,
    currentDate,
  }) => {
    const { getValueForTheme, combine } = useThemeUtils();

    // Additional filtering by campus and date validation
    const finalFilteredProjects = useMemo(() => {
      if (!filteredProjectsByMonth || filteredProjectsByMonth.length === 0)
        return [];

      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      return filteredProjectsByMonth.filter((project) => {
        // Campus filter
        if (selectedCampus && selectedCampus !== "") {
          const projectCampus = project.campus_name;
          if (projectCampus !== selectedCampus) {
            return false;
          }
        }

        // Date validation - check if project belongs to current month/year
        if (project.date_start) {
          try {
            const projectStartDate = new Date(project.date_start);
            const projectYear = projectStartDate.getFullYear();
            const projectMonth = projectStartDate.getMonth();

            // Project must be in the current viewing month/year
            if (projectYear !== currentYear || projectMonth !== currentMonth) {
              return false;
            }
          } catch (error) {
            console.error("Error parsing project date:", error);
            return false;
          }
        } else {
          // Exclude projects without start date
          return false;
        }

        return true;
      });
    }, [filteredProjectsByMonth, selectedCampus, currentDate]);

    const getEmptyStateMessage = () => {
      if (selectedCampus) {
        return {
          title: `ไม่พบกิจกรรมในเดือนนี้ที่ ${selectedCampus}`,
          subtitle: `ลองเลือกวิทยาเขตอื่น หรือเปลี่ยนเดือน`,
          suggestions: [
            { icon: "", text: "เปลี่ยนวิทยาเขต" },
            { icon: "", text: "เปลี่ยนเดือน" },
            { icon: "", text: "ค้นหากิจกรรม" },
          ],
        };
      }

      return {
        title: "ไม่พบกิจกรรมในเดือนนี้",
        subtitle: "ลองเลือกเดือนอื่น หรือดูในมุมมองปฏิทิน",
      };
    };

    const emptyState = getEmptyStateMessage();

    // Empty state when no projects found
    if (!finalFilteredProjects || finalFilteredProjects.length === 0) {
      return (
        <motion.div
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
          className={combine(
            "backdrop-blur-sm rounded-xl p-12 md:p-16 text-center",
            "border shadow-sm",
            getValueForTheme(
              "bg-white/5 border-white/10 shadow-black/10",
              "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
            )
          )}
        >
          {/* Empty state icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.3,
            }}
            className="mb-6"
          >
            <div
              className={combine(
                "mx-auto w-20 h-20 rounded-full flex items-center justify-center",
                "border-2 border-dashed",
                getValueForTheme(
                  "border-white/20 bg-white/5",
                  "border-[#006C67]/30 bg-[#006C67]/5"
                )
              )}
            >
              <svg
                className={combine(
                  "h-10 w-10",
                  getValueForTheme("text-white/30", "text-[#006C67]/40")
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
          </motion.div>

          {/* Empty state text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3
              className={combine(
                "text-lg md:text-xl font-medium mb-3",
                getValueForTheme("text-white/70", "text-[#006C67]/80")
              )}
            >
              {emptyState.title}
            </h3>
            <p
              className={combine(
                "text-sm md:text-base mb-4",
                getValueForTheme("text-white/50", "text-[#006C67]/60")
              )}
            >
              {emptyState.subtitle}
            </p>
          </motion.div>
        </motion.div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 md:space-y-6"
      >
        {/* Projects count header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={combine(
            "flex items-center justify-between pb-3 border-b",
            getValueForTheme("border-white/10", "border-[#006C67]/20")
          )}
        >
          <div>
            <h2
              className={combine(
                "text-lg md:text-xl font-semibold",
                getValueForTheme("text-white", "text-[#006C67]")
              )}
            >
              กิจกรรมทั้งหมด
            </h2>
            {selectedCampus && (
              <p
                className={combine(
                  "text-sm mt-1",
                  getValueForTheme("text-white/70", "text-[#006C67]/70")
                )}
              >
                ที่ {selectedCampus}
              </p>
            )}
          </div>
          <div
            className={combine(
              "px-3 py-1 rounded-full text-sm font-medium",
              getValueForTheme(
                "bg-[#047857]/50 text-[white]/75 border border-[#047857]",
                "bg-[#006C67]/10 text-[#006C67] border border-[#006C67]/20"
              )
            )}
          >
            {finalFilteredProjects.length} กิจกรรม
          </div>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {finalFilteredProjects.map((project, index) => (
            <motion.div
              key={project.id || `project-${index}`}
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <ProjectCard project={project} onClick={onProjectClick} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }
);

ProjectList.displayName = "ProjectList";

export default ProjectList;
