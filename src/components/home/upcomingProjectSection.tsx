import React, { useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Project } from "../../types/project";
import ProjectCard from "../ui/cardProject";

interface UpcomingProjectSectionProps {
  projects: Project[];
  loading?: boolean;
  title?: string;
  maxProjects?: number;
  onProjectClick?: (project: Project) => void;
  showViewAllButton?: boolean;
  onViewAll?: () => void;
  activeCampus?: string;
  campuses?: Array<{ id: string; name: string }>;
}

const UpcomingProjectSection: React.FC<UpcomingProjectSectionProps> = ({
  projects,
  loading = false,
  title = "กิจกรรมที่กำลังจะเกิดขึ้น",
  maxProjects = 6,
  onProjectClick,
  showViewAllButton = true,
  onViewAll,
  activeCampus,
  campuses = []
}) => {
  const { resolvedTheme } = useTheme();

  const getValueForTheme = (darkValue: string, lightValue: string) => {
    return resolvedTheme === "dark" ? darkValue : lightValue;
  };

  // Helper function สำหรับการเทียบ campus name
  const isCampusMatch = (projectCampusName: string | null | undefined, selectedCampusName: string): boolean => {
    if (!projectCampusName || !selectedCampusName) return false;
    return projectCampusName === selectedCampusName;
  };

  // Filter and sort upcoming projects พร้อมกรองตาม campus
  const upcomingProjects = useMemo(() => {
    const now = new Date();

    let filteredProjects = projects
      .filter((project) => {
        const startDate = project.date_start_the_project || project.date_start;
        if (!startDate) return false;

        const start = new Date(startDate);
        return start >= now; // Only future projects
      });

    // Apply campus filter if specified
    if (activeCampus !== undefined && campuses.length > 0) {
      const selectedCampus = campuses.find(campus => campus.id === activeCampus);
      if (selectedCampus) {
        filteredProjects = filteredProjects.filter((project) => {
          return isCampusMatch(project.campus_name, selectedCampus.name);
        });
      }
    }

    return filteredProjects
      .sort((a, b) => {
        const dateA = a.date_start_the_project || a.date_start;
        const dateB = b.date_start_the_project || b.date_start;

        if (!dateA) return 1;
        if (!dateB) return -1;

        return new Date(dateA).getTime() - new Date(dateB).getTime();
      })
      .slice(0, maxProjects);
  }, [projects, maxProjects, activeCampus, campuses]);

  // Update title เพื่อแสดง campus ที่เลือก
  const displayTitle = useMemo(() => {
    if (activeCampus && campuses.length > 0) {
      const selectedCampus = campuses.find(campus => campus.id === activeCampus);
      if (selectedCampus) {
        return `${title} - ${selectedCampus.name}`;
      }
    }
    return title;
  }, [title, activeCampus, campuses]);

  if (loading) {
    return (
      <div className="w-full px-4 xs:px-5 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2
              className={`text-lg md:text-3xl font-bold ${getValueForTheme(
                "text-white",
                "text-[#006C67]"
              )}`}
            >
              {displayTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(Math.min(maxProjects, 6))].map((_, index) => (
              <div
                key={index}
                className={`
                  animate-pulse rounded-lg p-3 sm:p-4 border
                  ${getValueForTheme(
                    "bg-white/5 border-white/10",
                    "bg-gray-50 border-gray-200"
                  )}
                `}
              >
                <div
                  className={`h-5 sm:h-6 w-16 sm:w-20 rounded-full mb-2 ${getValueForTheme(
                    "bg-white/10",
                    "bg-gray-200"
                  )}`}
                />
                <div
                  className={`h-5 sm:h-6 rounded mb-3 sm:mb-4 ${getValueForTheme(
                    "bg-white/10",
                    "bg-gray-200"
                  )}`}
                />
                <div
                  className={`h-3 sm:h-4 rounded mb-2 ${getValueForTheme(
                    "bg-white/10",
                    "bg-gray-200"
                  )}`}
                />
                <div
                  className={`h-3 sm:h-4 rounded mb-3 sm:mb-4 w-2/3 ${getValueForTheme(
                    "bg-white/10",
                    "bg-gray-200"
                  )}`}
                />
                <div className="flex gap-2 mb-2 sm:mb-3">
                  <div
                    className={`h-3 sm:h-4 w-3 sm:w-4 ${getValueForTheme(
                      "bg-white/10",
                      "bg-gray-200"
                    )}`}
                  />
                  <div
                    className={`h-3 sm:h-4 rounded flex-1 ${getValueForTheme(
                      "bg-white/10",
                      "bg-gray-200"
                    )}`}
                  />
                </div>
                <div className="flex gap-2 mb-2 sm:mb-3">
                  <div
                    className={`h-3 sm:h-4 w-3 sm:w-4 ${getValueForTheme(
                      "bg-white/10",
                      "bg-gray-200"
                    )}`}
                  />
                  <div
                    className={`h-3 sm:h-4 rounded flex-1 ${getValueForTheme(
                      "bg-white/10",
                      "bg-gray-200"
                    )}`}
                  />
                </div>
                <div className="flex gap-2">
                  <div
                    className={`h-5 sm:h-6 w-12 sm:w-16 rounded-full ${getValueForTheme(
                      "bg-white/10",
                      "bg-gray-200"
                    )}`}
                  />
                  <div
                    className={`h-5 sm:h-6 w-16 sm:w-20 rounded-full ${getValueForTheme(
                      "bg-white/10",
                      "bg-gray-200"
                    )}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 xs:px-5 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
          <h2
            className={`text-lg md:text-3xl font-semibold ${getValueForTheme(
              "text-white",
              "text-[#006C67]"
            )} leading-tight`}
          >
            {displayTitle}
          </h2>

       

          {/* Optional View All Button */}
          {showViewAllButton && upcomingProjects.length > 0 && onViewAll && (
            <button
              onClick={onViewAll}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${getValueForTheme(
                  "bg-blue-600 hover:bg-blue-700 text-white",
                  "bg-[#006C67] hover:bg-[#005550] text-white"
                )}
              `}
            >
              ดูทั้งหมด
            </button>
          )}
        </div>

        {upcomingProjects.length === 0 ? (
          <div
            className={`text-center py-8 sm:py-12 px-4 ${getValueForTheme(
              "text-white/70",
              "text-[#006C67]/70"
            )}`}
          >
            <div
              className={`
              w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center
              ${getValueForTheme("bg-white/10", "bg-[#006C67]/10")}
            `}
            >
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 opacity-70"
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
            <h3
              className={`text-lg sm:text-xl font-semibold mb-2 ${getValueForTheme(
                "text-white",
                "text-[#006C67]"
              )}`}
            >
              {activeCampus ? 
                `ไม่มีกิจกรรมที่กำลังจะเกิดขึ้นในวิทยาเขตนี้` : 
                `ไม่มีกิจกรรมที่กำลังจะเกิดขึ้น`
              }
            </h3>
            <p className="text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              {activeCampus ? 
                `กิจกรรมทั้งหมดในวิทยาเขตนี้ได้สิ้นสุดลงแล้วหรือไม่มีข้อมูลวันที่ กรุณาลองเปลี่ยนวิทยาเขตหรือตรวจสอบอีกครั้งในภายหลัง` :
                `กิจกรรมทั้งหมดได้สิ้นสุดลงแล้วหรือไม่มีข้อมูลวันที่ กรุณาตรวจสอบอีกครั้งในภายหลัง`
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {upcomingProjects.map((project) => (
                <div
                  key={project.id}
                  className="transform transition-transform duration-200 active:scale-[0.98] sm:hover:scale-[1.02]"
                >
                  <ProjectCard
                    project={project}
                    onClick={onProjectClick}
                    showCountdown={true} // Enable countdown for upcoming projects
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UpcomingProjectSection;