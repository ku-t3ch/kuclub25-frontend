/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/th";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { getActivityTypes, type ActivityType } from "../../utils/calendarUtils";
import { ACTIVITY_TYPE_COLORS } from "../../constants/activity";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../styles/calendar.css";

const messages = {
  showMore: (total: number) => `+ อีก ${total} กิจกรรม`,
} as const;

const localizer = momentLocalizer(moment);

interface CalendarViewSectionProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setSelectedMonth: (month: number) => void;
  filteredEvents: any[]; 
  handleSelectSlot: (slotInfo: any) => void;
  handleSelectEvent: (project: any) => void;
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
      "glass-panel backdrop-blur-sm rounded-xl overflow-hidden border shadow-lg mb-6 sm:mb-8",
      "flex items-center justify-center",
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
          getValueForTheme("border-blue-500", "border-[#006C67]")
        )}
      />
      <p 
        className={combine(
          "transition-colors duration-300",
          getValueForTheme("text-white/70", "text-gray-600")
        )}
      >
        กำลังโหลดกิจกรรม...
      </p>
    </div>
  </motion.div>
));
LoadingState.displayName = "LoadingState";

const CalendarViewSection = memo<CalendarViewSectionProps>(({
  currentDate,
  setCurrentDate,
  setSelectedMonth,
  filteredEvents, // ใช้ filteredEvents ที่ส่งมาจาก parent
  handleSelectSlot,
  handleSelectEvent,
  activeFilters = ['all'],
  projectMatchesFilters,
  ACTIVITY_TYPES = [],
}) => {
  const { getValueForTheme, combine } = useThemeUtils();

  // Cache refs for DOM manipulation
  const clickHandlersRef = useRef(new Map<Element, EventListener>());
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<string>('');

  // ใช้ filteredEvents ที่ส่งมาจาก parent แทนการ filter เอง
  const calendarProjects = useMemo(() => {
    if (!Array.isArray(filteredEvents) || filteredEvents.length === 0) return [];

    return filteredEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay || true,
      originalProject: event.originalProject,
      activityType: event.activityType
    }));
  }, [filteredEvents]);

  // Optimized date-based project grouping
  const projectsByDate = useMemo(() => {
    const dateMap = new Map<string, any[]>();
    
    for (let i = 0; i < calendarProjects.length; i++) {
      const project = calendarProjects[i];
      if (!project.start || !project.end) continue;
      
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
          // Clear existing indicators
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

          // Use pre-computed date map
          const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${dayNum}`;
          const projectsOnDay = projectsByDate.get(dateKey) || [];

          if (projectsOnDay.length > 0) {
            // Add appropriate classes
            cell.classList.add("has-projects");
            cell.classList.add(
              getValueForTheme(
                "dark-theme-has-projects",
                "light-theme-has-projects"
              )
            );

            // Create dots container
            const dotsContainer = document.createElement("div");
            dotsContainer.className = "day-indicator-container";

            // Get unique activity types
            const activityTypesSet = new Set<string>();

            for (let i = 0; i < projectsOnDay.length; i++) {
              const project = projectsOnDay[i];
              if (project.originalProject) {
                const types = getActivityTypes(project.originalProject);
                for (let j = 0; j < types.length; j++) {
                  activityTypesSet.add(types[j]);
                }
              }
            }

            // Add project count
            const projectCount = projectsOnDay.length;
            if (projectCount > 0) {
              const projectCountText = document.createElement("span");
              projectCountText.className = "project-count";
              projectCountText.textContent = projectCount.toString();
              dotsContainer.appendChild(projectCountText);
            }

            // Show max 3 unique activity types
            const uniqueActivityTypes = Array.from(activityTypesSet).slice(0, 3);

            // Add dots for each type
            for (let i = 0; i < uniqueActivityTypes.length; i++) {
              const activityType = uniqueActivityTypes[i];
              const dot = document.createElement("div");
              dot.className = "day-indicator";

              
              const activityColor = ACTIVITY_TYPE_COLORS[activityType as keyof typeof ACTIVITY_TYPE_COLORS];
              
              if (activityColor) {
                dot.style.backgroundColor = activityColor;
              } else {
                dot.style.backgroundColor = '#9CA3AF'; // gray-400 fallback
              }

              
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

            (cell as HTMLElement).classList.add('cursor-pointer');
            cell.addEventListener("click", clickHandler);
            clickHandlersRef.current.set(cell, clickHandler);

            cell.appendChild(dotsContainer);
          }
        });

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
    handleSelectSlot,
    projectsByDate
  ]);

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

  // Show loading if no events
  if (!filteredEvents || filteredEvents.length === 0) {
    return <LoadingState getValueForTheme={getValueForTheme} combine={combine} />;
  }

  return (
    <motion.div
      key="calendar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={combine(
        "glass-panel backdrop-blur-sm rounded-lg overflow-hidden border shadow-md mb-6 sm:mb-8",
        "transition-all duration-300 hover:shadow-lg",
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
          onSelectEvent={handleSelectEvent}
          selectable
          popup
          views={["month"]}
          defaultView="month"
          date={currentDate}
          onNavigate={handleNavigate}
          components={{
            event: () => null, // Hide default event rendering, use custom dots
          }}
        />
      </div>
    </motion.div>
  );
});

CalendarViewSection.displayName = "CalendarViewSection";

export default CalendarViewSection;