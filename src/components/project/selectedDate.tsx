/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
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

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const SelectedDateProjects: React.FC<SelectedDateProjectsProps> = ({ 
  selectedDate, 
  projectsOnSelectedDate, 
  setSelectedDate, 
  getActivityColor, 
  ACTIVITY_TYPES 
}) => {
  const { getValueForTheme, combine } = useThemeUtils();

  // Early return if no data
  if (!selectedDate || !projectsOnSelectedDate || projectsOnSelectedDate.length === 0) {
    return null;
  }

  // Helper function to extract project data safely
  const extractProject = (projectItem: any) => {
    if (!projectItem) {
      console.warn('Invalid project item:', projectItem);
      return null;
    }

    // Handle different data structures
    const project = projectItem.originalProject || projectItem;
    
    // Validate required fields
    if (!project.id && !project.project_name_th && !project.project_name_en) {
      console.warn('Project missing required fields:', project);
      return null;
    }

    return project;
  };

  // Filter out invalid projects
  const validProjects = projectsOnSelectedDate
    .map(extractProject)
    .filter(Boolean);

  if (validProjects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <div className={combine(
          "backdrop-blur-sm rounded-xl overflow-hidden border shadow-lg p-8 text-center",
          getValueForTheme(
            "bg-white/5 border-white/10 shadow-blue-900/20",
            "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
          )
        )}>
          <p className={combine(
            "text-sm",
            getValueForTheme("text-white/60", "text-[#006C67]/60")
          )}>
            ไม่มีข้อมูลกิจกรรมที่ถูกต้องสำหรับวันที่เลือก
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="mb-12"
    >
      <div className={combine(
        "backdrop-blur-sm rounded-xl overflow-hidden border shadow-lg",
        getValueForTheme(
          "bg-white/5 border-white/10 shadow-blue-900/20",
          "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
        )
      )}>
        {/* Header */}
        <div className={combine(
          "flex items-center justify-between py-4 px-5 border-b",
          getValueForTheme(
            "border-white/10 bg-gradient-to-r from-white/5 to-white/3",
            "border-[#006C67]/20 bg-gradient-to-r from-[#006C67]/5 to-white"
          )
        )}>
          <div className="flex items-center">
            <div
              className={combine(
                "w-1 h-6 rounded-full mr-3",
                getValueForTheme(
                  "bg-gradient-to-b from-blue-400 to-blue-600",
                  "bg-gradient-to-b from-[#006C67] to-[#006C67]/80"
                )
              )}
              aria-hidden="true"
            />
            <div>
              <h2 className={combine(
                "text-sm font-medium",
                getValueForTheme("text-white/90", "text-[#006C67]/70")
              )}>
                กิจกรรมวันที่
              </h2>
              <p className={combine(
                "text-lg font-semibold",
                getValueForTheme("text-white", "text-[#006C67]")
              )}>
                {moment(selectedDate).format("DD MMMM YYYY")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Project count badge */}
            <div className={combine(
              "px-3 py-1 rounded-full text-sm font-medium",
              getValueForTheme(
                "bg-blue-500/20 text-blue-300 border border-blue-400/30",
                "bg-[#006C67]/10 text-[#006C67] border border-[#006C67]/20"
              )
            )}>
              {validProjects.length} กิจกรรม
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                setSelectedDate(null);
              }}
              className={combine(
                "p-2 rounded-lg transition-all duration-200",
                "flex items-center justify-center",
                getValueForTheme(
                  "text-white/60 hover:text-white hover:bg-white/10",
                  "text-[#006C67]/60 hover:text-[#006C67] hover:bg-[#006C67]/5"
                )
              )}
              aria-label="ปิดรายการกิจกรรม"
            >
              <svg
                className="w-4 h-4"
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
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="p-5">
          {validProjects.length === 1 ? (
            // Single project - full width
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard
                project={validProjects[0]}
                onClick={(project) => {
                  // Handle project click
                }}
              />
            </motion.div>
          ) : (
            // Multiple projects - grid layout
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {validProjects.map((project, index) => {
                const projectKey = project.id || `project-${index}`;
                
                return (
                  <motion.div 
                    key={projectKey}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -3,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                  >
                    <ProjectCard
                      project={project}
                      onClick={(clickedProject) => {
                        // Handle project click
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SelectedDateProjects;