import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/th";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { getActivityTypes, type ActivityType } from "../../utils/calendarUtils";
import { ACTIVITY_TYPE_COLORS } from "../../constants/activity";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../styles/calendar.css";

const MESSAGES = {
  showMore: (total: number) => `+ อีก ${total} กิจกรรม`,
} as const;

const ACTIVITY_ORDER = [
  "university_activities",
  "social_activities",
  "competency_development_activities",
] as const;

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

const LoadingState = memo(({
  getValueForTheme,
  combine,
}: {
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
        "calendar-wrapper-dark bg-white/5 border-white/10 shadow-black/1",
        "calendar-wrapper-light bg-white border-gray-100 shadow-gray-200/50"
      )
    )}
    style={{ height: "500px", minHeight: "45vh", maxHeight: "650px" }}
  >
    <div className="flex flex-col items-center space-y-4">
      <div className={combine(
        "animate-spin rounded-full h-8 w-8 border-b-2",
        getValueForTheme("border-[#54CF90]", "border-[#006C67]")
      )} />
      <p className={combine(
        "transition-colors duration-300",
        getValueForTheme("text-white/70", "text-gray-600")
      )}>
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
  filteredEvents,
  handleSelectSlot,
  handleSelectEvent,
  activeFilters = ["all"],
  ACTIVITY_TYPES = [],
}) => {
  const { getValueForTheme, combine } = useThemeUtils();
  
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  const clickHandlersRef = useRef(new Map<Element, EventListener>());
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<string>("");

  useEffect(() => {
    setIsMounted(true);
    
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);

    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);

  const calendarProjects = useMemo(() => {
    if (!Array.isArray(filteredEvents) || filteredEvents.length === 0) return [];

    return filteredEvents.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay || true,
      originalProject: event.originalProject,
      activityType: event.activityType,
    }));
  }, [filteredEvents]);

  const projectsByDate = useMemo(() => {
    const dateMap = new Map<string, any[]>();

    calendarProjects.forEach(project => {
      if (!project.start || !project.end) return;

      const startDate = new Date(project.start);
      const endDate = new Date(project.end);
      const current = new Date(startDate);

      while (current <= endDate) {
        const dateKey = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`;
        
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, []);
        }
        dateMap.get(dateKey)!.push(project);
        current.setDate(current.getDate() + 1);
      }
    });

    return dateMap;
  }, [calendarProjects]);

  const createDayIndicator = useCallback((activityType: string) => {
    const dot = document.createElement("div");
    dot.className = "day-indicator";
    
    const activityColor = ACTIVITY_TYPE_COLORS[activityType as keyof typeof ACTIVITY_TYPE_COLORS];
    dot.style.backgroundColor = activityColor || "#9CA3AF";

    const activityClass = {
      university_activities: "activity-university",
      social_activities: "activity-social", 
      competency_development_activities: "activity-competency",
    }[activityType] || "activity-default";
    
    dot.classList.add(activityClass);
    return dot;
  }, []);

  const getOrderedActivityTypes = useCallback((projects: any[]) => {
    const activityTypesSet = new Set<string>();
    
    projects.forEach(project => {
      if (project.originalProject) {
        getActivityTypes(project.originalProject).forEach(type => {
          activityTypesSet.add(type);
        });
      }
    });

    const orderedTypes = ACTIVITY_ORDER.filter(type => activityTypesSet.has(type));
    const remainingTypes = Array.from(activityTypesSet).filter(type => 
      !ACTIVITY_ORDER.includes(type as any)
    );
    
    return [...orderedTypes, ...remainingTypes];
  }, []);

  const updateCalendarDots = useCallback(() => {
    if (!isMounted) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const updateSignature = `${calendarProjects.length}-${activeFilters.join(",")}-${currentDate.getMonth()}-${currentDate.getFullYear()}`;
        if (lastUpdateRef.current === updateSignature) return;
        lastUpdateRef.current = updateSignature;

        const calendarView = document.querySelector(".rbc-month-view");
        if (!calendarView) return;

        clickHandlersRef.current.forEach((handler, cell) => {
          cell.removeEventListener("click", handler);
        });
        clickHandlersRef.current.clear();

        const dateCells = document.querySelectorAll(".rbc-date-cell");

        dateCells.forEach((cell) => {
          const existingIndicators = cell.querySelectorAll(".day-indicator-container, .project-count");
          existingIndicators.forEach(indicator => indicator.remove());

          cell.classList.remove("has-projects", "dark-theme-has-projects", "light-theme-has-projects");

          const dayText = (cell as HTMLElement).textContent?.trim() || "";
          const dayNum = parseInt(dayText);
          if (isNaN(dayNum) || cell.classList.contains("rbc-off-range")) return;

          const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${dayNum}`;
          const projectsOnDay = projectsByDate.get(dateKey) || [];

          if (projectsOnDay.length > 0) {
            cell.classList.add("has-projects");
            cell.classList.add(getValueForTheme("dark-theme-has-projects", "light-theme-has-projects"));

            const dotsContainer = document.createElement("div");
            dotsContainer.className = "day-indicator-container";

            const projectCount = projectsOnDay.length;
            if (projectCount > 0) {
              const projectCountText = document.createElement("span");
              projectCountText.className = "project-count";
              projectCountText.textContent = projectCount.toString();
              dotsContainer.appendChild(projectCountText);
            }

            const orderedActivityTypes = getOrderedActivityTypes(projectsOnDay);
            const displayActivityTypes = orderedActivityTypes.slice(0, 3);

            displayActivityTypes.forEach(activityType => {
              const dot = createDayIndicator(activityType);
              dotsContainer.appendChild(dot);
            });

            const clickHandler = () => {
              const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
              handleSelectSlot({
                start: clickedDate,
                end: clickedDate,
                slots: [clickedDate],
                action: "click",
              });
            };

            (cell as HTMLElement).classList.add("cursor-pointer");
            cell.addEventListener("click", clickHandler);
            clickHandlersRef.current.set(cell, clickHandler);
            cell.appendChild(dotsContainer);
          }
        });

        calendarView.classList.add("processed");
      } catch (error) {
        // Silent error handling for production
      }
    }, 50);
  }, [
    isMounted,
    calendarProjects,
    currentDate,
    activeFilters,
    getValueForTheme,
    handleSelectSlot,
    projectsByDate,
    createDayIndicator,
    getOrderedActivityTypes,
  ]);

  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
    setSelectedMonth(date.getMonth());
  }, [setCurrentDate, setSelectedMonth]);

  const containerHeight = useMemo(() => {
    if (!isMounted) {
      return {
        height: "650px",
        minHeight: "50vh",
        maxHeight: "750px",
      };
    }

    const isMobile = windowWidth < 640;
    return {
      height: isMobile ? "500px" : "650px",
      minHeight: isMobile ? "40vh" : "50vh",
      maxHeight: isMobile ? "600px" : "750px",
    };
  }, [isMounted, windowWidth]);

  useEffect(() => {
    if (isMounted) {
      updateCalendarDots();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateCalendarDots, isMounted]);

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

  if (!isMounted) {
    return <LoadingState getValueForTheme={getValueForTheme} combine={combine} />;
  }

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
          "calendar-wrapper-dark bg-black/2 border-white/10 shadow-black/1",
          "calendar-wrapper-light bg-white border-gray-100 shadow-gray-100/50"
        )
      )}
    >
      <div className="calendar-container relative" style={containerHeight}>
        <Calendar
          localizer={localizer}
          events={calendarProjects}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          messages={MESSAGES}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          popup
          views={["month"]}
          defaultView="month"
          date={currentDate}
          onNavigate={handleNavigate}
          components={{
            event: () => null,
          }}
        />
      </div>
    </motion.div>
  );
});

CalendarViewSection.displayName = "CalendarViewSection";
export default CalendarViewSection;