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
            "bg-white border-gray-100 shadow-gray-200/50"
          )
        )}>
          <p className={combine(
            "text-sm",
            getValueForTheme("text-white/60", "text-gray-500")
          )}>
            ไม่มีข้อมูลโครงการที่ถูกต้องสำหรับวันที่เลือก
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
          "bg-white border-gray-100 shadow-gray-200/50"
        )
      )}>
        {/* Header */}
        <div className={combine(
          "flex items-center justify-between py-4 px-5 border-b",
          getValueForTheme(
            "border-white/10 bg-gradient-to-r from-white/5 to-white/3",
            "border-gray-100 bg-gradient-to-r from-gray-50 to-white"
          )
        )}>
          <div className="flex items-center">
            <div
              className={combine(
                "w-1 h-6 rounded-full mr-3",
                getValueForTheme(
                  "bg-gradient-to-b from-blue-400 to-blue-600",
                  "bg-gradient-to-b from-primary to-teal-600"
                )
              )}
              aria-hidden="true"
            />
            <div>
              <h2 className={combine(
                "text-sm font-medium",
                getValueForTheme("text-white/90", "text-gray-700")
              )}>
                โครงการวันที่
              </h2>
              <p className={combine(
                "text-lg font-semibold",
                getValueForTheme("text-white", "text-gray-900")
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
                "bg-primary/10 text-primary border border-primary/20"
              )
            )}>
              {validProjects.length} โครงการ
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
                  "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                )
              )}
              aria-label="ปิดรายการโครงการ"
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

                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Footer with actions */}
        {validProjects.length > 0 && (
          <div className={combine(
            "px-5 py-3 border-t",
            getValueForTheme(
              "border-white/10 bg-white/3",
              "border-gray-100 bg-gray-50/50"
            )
          )}>
            <div className="flex items-center justify-between">
              <span className={combine(
                "text-xs",
                getValueForTheme("text-white/60", "text-gray-500")
              )}>
                แสดง {validProjects.length} โครงการ
              </span>
              
              <button
                onClick={() => {

                }}
                className={combine(
                  "text-xs px-3 py-1.5 rounded-lg transition-all duration-200",
                  "font-medium",
                  getValueForTheme(
                    "text-blue-300 hover:text-blue-200 hover:bg-blue-500/10",
                    "text-primary hover:text-primary/80 hover:bg-primary/5"
                  )
                )}
              >
                ดูทั้งหมด
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SelectedDateProjects;