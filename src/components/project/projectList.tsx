import React, { memo } from "react";
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
}

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
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
      delay: 0.2
    }
  }
};

const ProjectList = memo<ProjectListProps>(({ 
  filteredProjectsByMonth, 
  getActivityColor, 
  ACTIVITY_TYPES,
  onProjectClick 
}) => {
  const { getValueForTheme, combine } = useThemeUtils();

  // Empty state when no projects found
  if (!filteredProjectsByMonth || filteredProjectsByMonth.length === 0) {
    return (
      <motion.div
        variants={emptyStateVariants}
        initial="hidden"
        animate="visible"
        className={combine(
          "backdrop-blur-sm rounded-xl p-12 md:p-16 text-center",
          "border shadow-sm",
          getValueForTheme(
            "bg-white/5 border-white/10 shadow-blue-900/20",
            "bg-gray-50/80 border-gray-200 shadow-gray-200/50"
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
            delay: 0.3 
          }}
          className="mb-6"
        >
          <div className={combine(
            "mx-auto w-20 h-20 rounded-full flex items-center justify-center",
            "border-2 border-dashed",
            getValueForTheme(
              "border-white/20 bg-white/5",
              "border-gray-300 bg-white"
            )
          )}>
            <svg
              className={combine(
                "h-10 w-10",
                getValueForTheme("text-white/30", "text-gray-400")
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
              getValueForTheme("text-white/70", "text-gray-700")
            )}
          >
            ไม่พบโครงการในเดือนนี้
          </h3>
          <p
            className={combine(
              "text-sm md:text-base mb-4",
              getValueForTheme("text-white/50", "text-gray-500")
            )}
          >
            ลองเลือกเดือนอื่น หรือดูในมุมมองปฏิทิน
          </p>
          
          {/* Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { icon: "📅", text: "เปลี่ยนเดือน" },
              { icon: "🔍", text: "ค้นหาโครงการ" },
              { icon: "📊", text: "ดูปฏิทิน" }
            ].map((suggestion, index) => (
              <motion.div
                key={suggestion.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={combine(
                  "px-3 py-1.5 rounded-full text-xs font-medium",
                  "border transition-all duration-300",
                  getValueForTheme(
                    "bg-white/5 border-white/10 text-white/60 hover:bg-white/10",
                    "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  )
                )}
              >
                <span className="mr-1">{suggestion.icon}</span>
                {suggestion.text}
              </motion.div>
            ))}
          </div>
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
          getValueForTheme(
            "border-white/10",
            "border-gray-200"
          )
        )}
      >
        <h2 className={combine(
          "text-lg md:text-xl font-semibold",
          getValueForTheme("text-white", "text-gray-900")
        )}>
          โครงการทั้งหมด
        </h2>
        <div className={combine(
          "px-3 py-1 rounded-full text-sm font-medium",
          getValueForTheme(
            "bg-blue-500/20 text-blue-300 border border-blue-400/30",
            "bg-primary/10 text-primary border border-primary/20"
          )
        )}>
          {filteredProjectsByMonth.length} โครงการ
        </div>
      </motion.div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProjectsByMonth.map((project, index) => (
          <motion.div 
            key={project.id || `project-${index}`} 
            variants={itemVariants}
            whileHover={{ 
              y: -5,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <ProjectCard
              project={project}
              onClick={onProjectClick}
            />
          </motion.div>
        ))}
      </div>

      {/* Load more indicator (if needed) */}
      {filteredProjectsByMonth.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-6"
        >
          <div className={combine(
            "inline-flex items-center px-4 py-2 rounded-full text-sm",
            getValueForTheme(
              "bg-white/5 text-white/60 border border-white/10",
              "bg-gray-50 text-gray-500 border border-gray-200"
            )
          )}>
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            แสดงครบทุกโครงการแล้ว
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

ProjectList.displayName = "ProjectList";

export default ProjectList;