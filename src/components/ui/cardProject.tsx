import React, { useMemo, useCallback } from "react";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { useRouter } from "next/navigation";
import { formatDateForDisplay } from "../../utils/formatdate";
import { Project } from "../../types/project";
import { ACTIVITY_LABELS, ACTIVITY_COLORS } from "../../constants/activity";
import ProjectCardDateDisplay from "./dateDisplay";

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
}

interface ActivityTag {
  type: string;
  key: keyof typeof ACTIVITY_COLORS;
  typeColor: "purple" | "orange" | "emerald" | "default";
}

const ALLOWED_ACTIVITY_TYPES = [
  "competency_development_activities",
  "social_activities",
  "university_activities",
] as const;

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { getValueForTheme, combine } = useThemeUtils();
  const router = useRouter();

  // Extract and process project data
  const projectData = useMemo(() => {
    const startDate = project.date_start_the_project || project.date_start;
    const endDate = project.date_end_the_project || project.date_end;

    // Helper function to format month display with better spacing
    const getMonthDisplay = () => {
      if (!startDate) return { text: "?", isRange: false };

      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : start;

      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        const fallback =
          start.toLocaleString("th-TH", { month: "short" }) || "?";
        return { text: fallback, isRange: false };
      }

      // Same month and year
      if (
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear()
      ) {
        return {
          text: start.toLocaleString("th-TH", { month: "short" }),
          isRange: false,
        };
      }

      // Different months, same year
      if (start.getFullYear() === end.getFullYear()) {
        const startMonth = start.toLocaleString("th-TH", { month: "short" });
        const endMonth = end.toLocaleString("th-TH", { month: "short" });
        return {
          text: `${startMonth} – ${endMonth}`, // En dash with spaces
          isRange: true,
          startMonth,
          endMonth,
        };
      }

      // Different years
      const startMonth = start.toLocaleString("th-TH", { month: "short" });
      const endMonth = end.toLocaleString("th-TH", { month: "short" });
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();

      // If years are very different, show years too
      if (Math.abs(endYear - startYear) > 1) {
        return {
          text: `${startMonth} ${startYear
            .toString()
            .slice(-2)} – ${endMonth} ${endYear.toString().slice(-2)}`,
          isRange: true,
          startMonth: `${startMonth} ${startYear.toString().slice(-2)}`,
          endMonth: `${endMonth} ${endYear.toString().slice(-2)}`,
          hasYear: true,
        };
      }

      return {
        text: `${startMonth} – ${endMonth}`,
        isRange: true,
        startMonth,
        endMonth,
      };
    };

    const monthDisplay = getMonthDisplay();

    return {
      orgName:
        project.org_nickname ||
        project.org_name_th ||
        project.org_name_en ||
        "",
      isMultiDayProject: Boolean(
        startDate &&
          endDate &&
          new Date(startDate).toDateString() !==
            new Date(endDate).toDateString()
      ),
      displayName:
        project.project_name_th ||
        project.name_th ||
        project.project_name_en ||
        project.name_en ||
        "ไม่ระบุชื่อกิจกรรม",
      displayLocation:
        typeof project.schedule === "object" && project.schedule?.location
          ? project.schedule.location
          : project.project_location || project.location || "ไม่ระบุสถานที่",
      startDate,
      endDate,
      monthDisplay, // Enhanced month display object
      displayDay: startDate ? new Date(startDate).getDate().toString() : "?",
      displayEndDay: endDate ? new Date(endDate).getDate().toString() : null,
    };
  }, [project]);

  // Process activity hours into activity tags
  const activityTags = useMemo((): ActivityTag[] => {
    if (
      !project.activity_hours ||
      typeof project.activity_hours !== "object" ||
      Array.isArray(project.activity_hours)
    ) {
      return [];
    }

    const activities: ActivityTag[] = [];

    Object.entries(project.activity_hours).forEach(([key, value]) => {
      if (key === "__proto__") return;

      // Handle nested competency_development_activities
      if (
        key === "competency_development_activities" &&
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const totalHours = Object.values(value as Record<string, number>)
          .filter(
            (hours): hours is number => typeof hours === "number" && hours > 0
          )
          .reduce((sum, hours) => sum + hours, 0);

        if (totalHours > 0) {
          activities.push({
            type: ACTIVITY_LABELS[key] || key.replace(/_/g, " "),
            key: key as keyof typeof ACTIVITY_COLORS,
            typeColor: "purple",
          });
        }
      }
      // Handle direct activity types
      else if (
        ALLOWED_ACTIVITY_TYPES.includes(key as any) &&
        typeof value === "number" &&
        value > 0
      ) {
        const typeColor =
          key === "social_activities"
            ? "orange"
            : key === "university_activities"
            ? "emerald"
            : "default";

        activities.push({
          type:
            ACTIVITY_LABELS[key as keyof typeof ACTIVITY_LABELS] ||
            key.replace(/_/g, " "),
          key: key as keyof typeof ACTIVITY_COLORS,
          typeColor,
        });
      }
    });

    return activities;
  }, [project.activity_hours]);

  // Format date range for display
  const dateRange = useMemo(() => {
    if (!projectData.startDate && !projectData.endDate) {
      return "ไม่ระบุวันที่";
    }

    const start = formatDateForDisplay(projectData.startDate);
    const end = formatDateForDisplay(projectData.endDate);

    return start === end || !end ? start : `${start} - ${end}`;
  }, [projectData.startDate, projectData.endDate]);

  // Theme styles configuration
  const styles = useMemo(
    () => ({
      card: getValueForTheme(
        "bg-gradient-to-b from-white/5 to-white/3 border border-white/10 hover:border-blue-400/30",
        "bg-white border border-[#006C67]/20 hover:border-[#006C67]/40 shadow-sm"
      ),
      orgIcon: getValueForTheme("text-blue-300/90", "text-[#006C67]/80"),
      title: getValueForTheme(
        "text-white group-hover:text-blue-100",
        "text-[#006C67] group-hover:text-[#006C67]/80"
      ),
      dateBg: getValueForTheme(
        "bg-gradient-to-br from-blue-500/70 to-indigo-600/70 border border-blue-400/20",
        "bg-[#006C67]/70 border border-[#006C67]/20"
      ),
      dateHover: getValueForTheme(
        "group-hover:from-blue-500/80 group-hover:to-indigo-600/80",
        "group-hover:from-[#006C67]/90 group-hover:to-[#006C67]/80"
      ),
      details: getValueForTheme(
        "text-white/70 group-hover:text-blue-200/90",
        "text-[#006C67]/60 group-hover:text-[#006C67]/80"
      ),
      iconBg: getValueForTheme(
        "bg-blue-500/10 text-blue-400/80",
        "bg-[#006C67]/10 text-[#006C67]/60"
      ),
      button: getValueForTheme(
        "bg-gradient-to-r from-blue-800/20 to-indigo-800/20 hover:from-blue-700/30 hover:to-indigo-700/30",
        "bg-gradient-to-r from-[#006C67]/5 to-[#006C67]/10 hover:from-[#006C67]/10 hover:to-[#006C67]/15"
      ),
      buttonBorder: getValueForTheme(
        "border-white/5 hover:border-blue-400/10",
        "border-[#006C67]/20 hover:border-[#006C67]/30"
      ),
      buttonText: getValueForTheme(
        "text-white/70 hover:text-white/90",
        "text-[#006C67]/70 hover:text-[#006C67]"
      ),
      buttonIcon: getValueForTheme(
        "text-blue-300/70 group-hover:text-blue-200",
        "text-[#006C67]/50 group-hover:text-[#006C67]"
      ),
    }),
    [getValueForTheme]
  );

  // Event handlers
  const handleClick = useCallback(() => onClick?.(project), [onClick, project]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleClick();
    },
    [handleClick]
  );

  // Activity Tag Colors - Fixed to properly respond to theme changes
  const getTagColors = useCallback(
    (typeColor: string) => {
      const colorMap = {
        purple: getValueForTheme(
          "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30",
          "bg-purple-50 text-purple-600 ring-1 ring-purple-200"
        ),
        emerald: getValueForTheme(
          "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30",
          "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
        ),
        orange: getValueForTheme(
          "bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/30",
          "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
        ),
        default: getValueForTheme(
          "bg-gray-600/20 text-gray-300 ring-1 ring-gray-500/30",
          "bg-[#006C67]/10 text-[#006C67] ring-1 ring-[#006C67]/20"
        ),
      };
      return colorMap[typeColor as keyof typeof colorMap] || colorMap.default;
    },
    [getValueForTheme] // Now properly depends on getValueForTheme
  );

  // Memoize tag colors for performance
  const activityTagColors = useMemo(() => {
    const colorCache = new Map<string, string>();
    
    activityTags.forEach(tag => {
      if (!colorCache.has(tag.typeColor)) {
        colorCache.set(tag.typeColor, getTagColors(tag.typeColor));
      }
    });
    
    return colorCache;
  }, [activityTags, getTagColors]);

  // Enhanced month display component
  const renderMonthDisplay = useMemo(() => {
    const { monthDisplay } = projectData;

    if (!monthDisplay.isRange) {
      // Single month display
      return (
        <div className="text-white/90 text-2xs sm:text-xs md:text-xs font-medium uppercase tracking-wide mb-1 sm:mb-1">
          {monthDisplay.text}
        </div>
      );
    }

    // Range display for cross-month projects with proper spacing
    if (monthDisplay.startMonth && monthDisplay.endMonth) {
      return (
        <div className="text-white/90 font-medium uppercase tracking-wide mb-1 sm:mb-1">
          <div className="flex items-center justify-center">
            <div className="text-3xs sm:text-2xs md:text-xs opacity-90 text-center">
              {monthDisplay.startMonth}
            </div>

            <div className="w-1 sm:w-1.5 md:w-2" />

            <div className="flex items-center justify-center">-</div>

            <div className="w-1 sm:w-1.5 md:w-2" />

            <div className="text-3xs sm:text-2xs md:text-xs opacity-90 text-center">
              {monthDisplay.endMonth}
            </div>
          </div>
        </div>
      );
    }

    // Fallback to text display with enhanced spacing
    return (
      <div className="text-white/90 font-medium uppercase tracking-wide mb-1 sm:mb-1">
        <div className="text-2xs sm:text-xs md:text-xs leading-tight text-center whitespace-nowrap">
          {monthDisplay.text}
        </div>
      </div>
    );
  }, [projectData.monthDisplay]);

  return (
    <div
      className={combine(
        "h-full flex flex-col overflow-hidden group cursor-pointer",
        "backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
        styles.card
      )}
      onClick={(e: React.MouseEvent) => router.push(`/projects/${project.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`ดูรายละเอียด ${projectData.displayName}`}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col h-full relative">
        {/* Main Content */}
        <div className="flex p-2 sm:p-3 md:p-4 items-start gap-2 sm:gap-3 md:gap-4 relative z-10 flex-grow">
          {/* Date Display */}
          <div
            className={combine(
              "flex-shrink-0 rounded-lg p-1.5 sm:p-2 md:p-3 text-center",
              "min-w-[5rem] sm:min-w-[4rem] md:min-w-[5rem] shadow-sm",
              "transition-all duration-300 min-h-[3rem] sm:min-h-[4rem] md:min-h-[5rem]",
              styles.dateBg,
              styles.dateHover
            )}
          >
            {/* Enhanced month display with proper spacing */}
            {renderMonthDisplay}

            <ProjectCardDateDisplay
              isMultiDayProject={projectData.isMultiDayProject}
              startDateTime={
                projectData.startDate
                  ? new Date(projectData.startDate)
                  : undefined
              }
              endDateTime={
                projectData.endDate ? new Date(projectData.endDate) : undefined
              }
              dayStart={projectData.displayDay}
              day={projectData.displayDay}
            />
          </div>

          {/* Content Section */}
          <div className="flex-grow">
            {/* Project Title */}
            <h3
              className={combine(
                "font-medium mb-0 line-clamp-2 leading-tight transition-colors duration-300 py-1",
                "text-sm sm:text-base md:text-lg",
                styles.title
              )}
            >
              {projectData.displayName}
            </h3>

            {/* Organization Name */}
            {projectData.orgName && (
              <div
                className={combine(
                  "mb-2 sm:mb-1.5 md:mb-2 text-xs sm:text-2xs md:text-xs font-medium flex items-center",
                  styles.orgIcon
                )}
              >
                <svg
                  className="w-3 sm:w-2.5 md:w-3 h-3 sm:h-2.5 md:h-3 mr-2 sm:mr-1.5 md:mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="truncate">{projectData.orgName}</span>
              </div>
            )}

            {/* Activity Tags - Updated to use memoized colors */}
            {activityTags.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-1.5 md:gap-2 mb-2 sm:mb-2 md:mb-3">
                {activityTags.map((tag, index) => (
                  <div
                    key={`${tag.key}-${index}`}
                    className={combine(
                      "inline-flex items-center px-2.5 sm:px-2 md:px-2.5 py-1 sm:py-0.75 md:py-1 rounded-full text-xs sm:text-2xs md:text-xs font-medium",
                      activityTagColors.get(tag.typeColor) || getTagColors(tag.typeColor),
                      "transition-all duration-300 hover:shadow-sm"
                    )}
                  >
                    {tag.type}
                  </div>
                ))}
              </div>
            )}

            {/* Project Details */}
            <div className="flex flex-col space-y-1.5 sm:space-y-1.5 text-xs sm:text-2xs md:text-xs mt-2 sm:mt-1.5 md:mt-2">
              

              {/* Location */}
              <div
                className={combine(
                  "flex items-start transition-colors duration-300",
                  styles.details
                )}
              >
                <span
                  className={combine(
                    "flex items-center justify-center w-4 sm:w-3.5 md:w-4 h-4 sm:h-3.5 md:h-4",
                    "rounded-full mr-2 sm:mr-1.5 md:mr-2 flex-shrink-0 mt-0.5",
                    styles.iconBg
                  )}
                >
                  <svg
                    className="w-2.5 sm:w-2 md:w-2.5 h-2.5 sm:h-2 md:h-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                <span className="break-words">
                  {projectData.displayLocation}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleButtonClick}
          className={combine(
            "w-full mt-auto py-2 sm:py-1.5 md:py-2 px-3 sm:px-3 md:px-4",
            "transition-all duration-300 text-xs sm:text-2xs md:text-xs font-medium",
            "border-t rounded-b-xl",
            styles.button,
            styles.buttonBorder
          )}
          aria-label={`ดูรายละเอียด ${projectData.displayName}`}
        >
          <div
            className={combine(
              "flex items-center justify-center",
              styles.buttonText
            )}
          >
            <span>ดูรายละเอียด</span>
            <div className="ml-2 sm:ml-1.5 md:ml-2 flex items-center">
              <svg
                className={combine(
                  "w-3 sm:w-2.5 md:w-3 h-3 sm:h-2.5 md:h-3",
                  styles.buttonIcon
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProjectCard);