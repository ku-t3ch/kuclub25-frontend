/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/th";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { getActivityTypes, type ActivityType } from "../../utils/calendarUtils";
import { useProjects } from "../../hooks/useProject";
import { ACTIVITY_TYPE_COLORS } from "../../constants/activity";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../styles/calendar.css";

const messages = {
  showMore: (total: number) => `+ อีก ${total} โครงการ`,
} as const;

const localizer = momentLocalizer(moment);

interface CalendarViewSectionProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setSelectedMonth: (month: number) => void;
  handleSelectSlot: (slotInfo: any) => void;
  handleSelectProject: (project: any) => void;
  activeFilters: string[];
  projectMatchesFilters: (
    project: any,
    filters: string[],
    getActivityTypesFunc: any
  ) => boolean;
  ACTIVITY_TYPES: ActivityType[];
}

// Memoized helper component for loading state
const LoadingState = memo(({ getValueForTheme, combine }: { 
  getValueForTheme: (dark: string, light: string) => string;
  combine: (...classes: string[]) => string;
}) => (
  <motion.div
    key="calendar-loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={combine(
      // Base loading container styles
      "glass-panel backdrop-blur-sm rounded-xl overflow-hidden border shadow-lg mb-6 sm:mb-8",
      "flex items-center justify-center",
      // Theme-specific styles using calendar classes
      getValueForTheme(
        "calendar-wrapper-dark bg-white/5 border-white/10 shadow-blue-900/20",
        "calendar-wrapper-light bg-white border-gray-100 shadow-gray-200/50"
      )
    )}
    style={{ height: "500px", minHeight: "45vh", maxHeight: "650px" }}
  >
    <div className="flex flex-col items-center space-y-4">
      <div 
        className={combine(
          "animate-spin rounded-full h-8 w-8 border-b-2",
          getValueForTheme("border-blue-500", "border-primary")
        )}
      />
      <p 
        className={combine(
          "transition-colors duration-300",
          getValueForTheme("text-white/70", "text-gray-600")
        )}
      >
        กำลังโหลดโครงการ...
      </p>
    </div>
  </motion.div>
));
LoadingState.displayName = "LoadingState";

// Memoized helper component for error state
const ErrorState = memo(({ 
  getValueForTheme, 
  combine, 
  onRetry 
}: { 
  getValueForTheme: (dark: string, light: string) => string;
  combine: (...classes: string[]) => string;
  onRetry: () => void;
}) => (
  <motion.div
    key="calendar-error"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={combine(
      // Base error container styles
      "glass-panel backdrop-blur-sm rounded-xl overflow-hidden border shadow-lg mb-6 sm:mb-8",
      "flex items-center justify-center",
      // Theme-specific styles using calendar classes
      getValueForTheme(
        "calendar-wrapper-dark bg-white/5 border-white/10 shadow-blue-900/20",
        "calendar-wrapper-light bg-white border-gray-100 shadow-gray-200/50"
      )
    )}
    style={{ height: "500px", minHeight: "45vh", maxHeight: "650px" }}
  >
    <div className="flex flex-col items-center space-y-4">
      <div className="text-red-500 text-2xl">⚠️</div>
      <p 
        className={combine(
          "transition-colors duration-300",
          getValueForTheme("text-white/70", "text-gray-600")
        )}
      >
        เกิดข้อผิดพลาดในการโหลดโครงการ
      </p>
      <button
        onClick={onRetry}
        className={combine(
          // Base button styles
          "px-4 py-2 rounded-lg transition-all duration-300 font-medium",
          "hover:transform hover:scale-105",
          // Theme-specific button styles using calendar patterns
          getValueForTheme(
            "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-400/20",
            "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
          )
        )}
      >
        ลองใหม่
      </button>
    </div>
  </motion.div>
));
ErrorState.displayName = "ErrorState";

const CalendarViewSection = memo<CalendarViewSectionProps>(({
  currentDate,
  setCurrentDate,
  setSelectedMonth,
  handleSelectSlot,
  handleSelectProject,
  activeFilters = ['all'],
  projectMatchesFilters,
  ACTIVITY_TYPES = [],
}) => {
  const { getValueForTheme, combine } = useThemeUtils();
  
  // Use useProjects hook to fetch projects data
  const { projects, loading, error, refetch } = useProjects();

  // Cache refs for DOM manipulation
  const clickHandlersRef = useRef(new Map<Element, EventListener>());
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<string>('');

  // Memoized filtered projects with better performance
  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects) || projects.length === 0) return [];
    
    return projects.filter(project => {
      try {
        // Apply filters
        if (activeFilters.includes("all")) return true;
        if (!projectMatchesFilters || typeof projectMatchesFilters !== 'function') return true;
        
        return projectMatchesFilters(project, activeFilters, getActivityTypes);
      } catch (error) {
        console.warn('Error filtering project:', error);
        return true;
      }
    });
  }, [projects, activeFilters, projectMatchesFilters, currentDate]);

  // Optimized calendar projects conversion with memoization
  const calendarProjects = useMemo(() => {
    if (!Array.isArray(filteredProjects) || filteredProjects.length === 0) return [];

    const results = [];
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    for (let i = 0; i < filteredProjects.length; i++) {
      const project = filteredProjects[i];
      
      try {
        // Extract dates from project
        const startDate = project.date_start_the_project || project.date_start || project.start;
        const endDate = project.date_end_the_project || project.date_end || project.end;
        
        if (!startDate) continue;

        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date(start);

        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;

        // Skip projects not in current month/year for better performance
        if (start.getFullYear() !== currentYear && end.getFullYear() !== currentYear) continue;
        if (start.getFullYear() === currentYear && start.getMonth() !== currentMonth && 
            end.getFullYear() === currentYear && end.getMonth() !== currentMonth) continue;

        const calendarProject = {
          id: project.id,
          title: project.project_name_th || project.project_name_en || project.name_th || project.name_en || "โครงการ",
          start,
          end,
          allDay: true,
          originalProject: project
        };

        results.push(calendarProject);
      } catch (error) {
        console.warn('Error converting project to calendar format:', error);
        continue;
      }
    }

    return results;
  }, [filteredProjects, currentDate]);

  // Optimized date-based project grouping
  const projectsByDate = useMemo(() => {
    const dateMap = new Map<string, any[]>();
    
    for (let i = 0; i < calendarProjects.length; i++) {
      const project = calendarProjects[i];
      const startDate = new Date(project.start);
      const endDate = new Date(project.end);
      
      // Create date range for multi-day projects
      const current = new Date(startDate);
      while (current <= endDate) {
        const dateKey = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`;
        
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, []);
        }
        dateMap.get(dateKey)!.push(project);
        
        current.setDate(current.getDate() + 1);
      }
    }
    
    return dateMap;
  }, [calendarProjects]);

  // Optimized calendar dots update with debouncing and caching
  const updateCalendarDots = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        // Create update signature to prevent unnecessary updates
        const updateSignature = `${calendarProjects.length}-${activeFilters.join(',')}-${currentDate.getMonth()}-${currentDate.getFullYear()}`;
        if (lastUpdateRef.current === updateSignature) return;
        lastUpdateRef.current = updateSignature;

        const calendarView = document.querySelector(".rbc-month-view");
        if (!calendarView) return;

        // Clear existing event listeners
        clickHandlersRef.current.forEach((handler, cell) => {
          cell.removeEventListener("click", handler);
        });
        clickHandlersRef.current.clear();

        const dateCells = document.querySelectorAll(".rbc-date-cell");

        dateCells.forEach((cell) => {
          // Clear existing indicators more efficiently
          const existingIndicators = cell.querySelectorAll(".day-indicator-container, .project-count");
          existingIndicators.forEach((indicator) => indicator.remove());

          // Remove existing classes
          cell.classList.remove(
            "has-projects",
            "dark-theme-has-projects",
            "light-theme-has-projects"
          );

          // Get day number
          const dayText = (cell as HTMLElement).textContent?.trim() || "";
          const dayNum = parseInt(dayText);
          if (isNaN(dayNum)) return;

          // Skip days not in current month
          if (cell.classList.contains("rbc-off-range")) return;

          // Use pre-computed date map for better performance
          const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${dayNum}`;
          let projectsOnDay = projectsByDate.get(dateKey) || [];

          // Apply active filters if needed
          if (!activeFilters.includes("all")) {
            projectsOnDay = projectsOnDay.filter((project) =>
              projectMatchesFilters(
                project.originalProject,
                activeFilters,
                getActivityTypes
              )
            );
          }

          if (projectsOnDay.length > 0) {
            // Add appropriate classes
            cell.classList.add("has-projects");
            cell.classList.add(
              getValueForTheme(
                "dark-theme-has-projects",
                "light-theme-has-projects"
              )
            );

            // Create dots container using CSS class
            const dotsContainer = document.createElement("div");
            dotsContainer.className = "day-indicator-container";

            // Get unique activity types more efficiently
            const activityTypesSet = new Set<string>();

            for (let i = 0; i < projectsOnDay.length; i++) {
              const types = getActivityTypes(projectsOnDay[i].originalProject);
              for (let j = 0; j < types.length; j++) {
                const type = types[j];
                if (activeFilters.includes("all") || activeFilters.includes(type)) {
                  activityTypesSet.add(type);
                }
              }
            }

            // Add project count using CSS class
            const projectCount = projectsOnDay.length;
            if (projectCount > 0) {
              const projectCountText = document.createElement("span");
              projectCountText.className = "project-count"; // Using CSS class from calendar.css
              projectCountText.textContent = projectCount.toString();
              dotsContainer.appendChild(projectCountText);
            }

            // Show max 3 unique activity types
            const uniqueActivityTypes = Array.from(activityTypesSet).slice(0, 3);

            // Add dots for each type using CSS classes and activity colors
            for (let i = 0; i < uniqueActivityTypes.length; i++) {
              const activityType = uniqueActivityTypes[i];
              const dot = document.createElement("div");

              // Use CSS classes for day indicators
              dot.className = "day-indicator";

              // Get color from activity.ts instead of hardcoded classes
              const activityColor = ACTIVITY_TYPE_COLORS[activityType as keyof typeof ACTIVITY_TYPE_COLORS];
              
              if (activityColor) {
                // Set the background color directly using the hex value from activity.ts
                dot.style.backgroundColor = activityColor;
              } else {
                // Fallback to gray for unknown activity types
                dot.style.backgroundColor = '#9CA3AF'; // gray-400 equivalent
              }

              // Optional: Add CSS class for additional styling while keeping the color from activity.ts
              switch (activityType) {
                case 'competency_development_activities':
                  dot.classList.add('activity-competency');
                  break;
                case 'social_activities':
                  dot.classList.add('activity-social');
                  break;
                case 'university_activities':
                  dot.classList.add('activity-university');
                  break;
                default:
                  dot.classList.add('activity-default');
                  break;
              }

              dotsContainer.appendChild(dot);
            }

            // Make cell clickable with cached event listener
            const clickHandler = () => {
              const clickedDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                dayNum
              );
              handleSelectSlot({
                start: clickedDate,
                end: clickedDate,
                slots: [clickedDate],
                action: "click",
              });
            };

            // Use CSS cursor class
            (cell as HTMLElement).classList.add('cursor-pointer');
            cell.addEventListener("click", clickHandler);
            clickHandlersRef.current.set(cell, clickHandler);

            // Add mobile tap target if needed using CSS class
            if (window.innerWidth < 768) {
              const tapTarget = document.createElement("div");
              tapTarget.className = "mobile-tap-target absolute top-0 left-0 right-0 bottom-0 z-4";
              cell.appendChild(tapTarget);
            }

            cell.appendChild(dotsContainer);
          }
        });

        // Mark calendar as processed using CSS class
        calendarView.classList.add("processed");
      } catch (error) {
        console.error("Error updating calendar dots:", error);
      }
    }, 50);
  }, [
    calendarProjects,
    currentDate,
    activeFilters,
    getValueForTheme,
    ACTIVITY_TYPES,
    projectMatchesFilters,
    handleSelectSlot,
    projectsByDate
  ]);

  // Effect to update calendar dots
  useEffect(() => {
    updateCalendarDots();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateCalendarDots]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up all event listeners when component unmounts
      clickHandlersRef.current.forEach((handler, cell) => {
        cell.removeEventListener("click", handler);
      });
      clickHandlersRef.current.clear();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoized navigation handler
  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
    setSelectedMonth(date.getMonth());
  }, [setCurrentDate, setSelectedMonth]);

  // Memoized retry handler
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Early returns with memoized components
  if (loading) {
    return <LoadingState getValueForTheme={getValueForTheme} combine={combine} />;
  }

  if (error) {
    return (
      <ErrorState 
        getValueForTheme={getValueForTheme} 
        combine={combine} 
        onRetry={handleRetry}
      />
    );
  }

  return (
    <motion.div
      key="calendar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={combine(
        // Base calendar wrapper styles
        "glass-panel backdrop-blur-sm rounded-lg overflow-hidden border shadow-md mb-6 sm:mb-8",
        "transition-all duration-300 hover:shadow-lg",
        // Theme-specific styles using calendar CSS classes
        getValueForTheme(
          "calendar-wrapper-dark bg-white/5 border-white/10 shadow-blue-900/5",
          "calendar-wrapper-light bg-white border-gray-100 shadow-gray-100/50"
        )
      )}
    >
      <div
        className="calendar-container relative"
        style={{ height: "550px", minHeight: "50vh", maxHeight: "750px" }}
      >
        <Calendar
          localizer={localizer}
          events={calendarProjects}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          messages={messages}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectProject}
          selectable
          popup
          views={["month"]}
          defaultView="month"
          date={currentDate}
          onNavigate={handleNavigate}
          components={{
            event: () => null, // Hide default event rendering, we'll use custom dots
          }}
        />
      </div>
    </motion.div>
  );
});

CalendarViewSection.displayName = "CalendarViewSection";

export default CalendarViewSection;