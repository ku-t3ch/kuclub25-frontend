import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/th";
import { motion, AnimatePresence } from "framer-motion";
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

// Create localizer once and memoize it
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
  loading?: boolean;
}

// Optimized Loading Skeleton Component
const CalendarSkeleton = memo(
  ({
    getValueForTheme,
    combine,
  }: {
    getValueForTheme: (dark: string, light: string) => string;
    combine: (...classes: string[]) => string;
  }) => {
    const [isClient, setIsClient] = useState(false);

    // Create skeleton grid for calendar days
    const skeletonDays = useMemo(
      () => Array.from({ length: 35 }, (_, i) => i),
      []
    );

    // Deterministic pattern for skeleton dots (no Math.random)
    const skeletonPattern = useMemo(() => {
      // Create a deterministic pattern that looks random but is consistent
      const pattern = [];
      for (let i = 0; i < 35; i++) {
        // Use deterministic logic to create a "random-looking" pattern
        const hasActivity = (i * 7 + 3) % 5 === 0 || (i * 3 + 1) % 7 === 0;
        const activityCount = hasActivity ? (i % 3) + 1 : 0;
        pattern.push({ hasActivity, activityCount });
      }
      return pattern;
    }, []);

    useEffect(() => {
      setIsClient(true);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={combine(
          "glass-panel backdrop-blur-sm rounded-lg overflow-hidden border shadow-md mb-6 sm:mb-8",
          getValueForTheme(
            "bg-black/20 border-white/10",
            "bg-white border-gray-100"
          )
        )}
        style={{ height: "650px", minHeight: "50vh" }}
      >
        {/* Calendar Header Skeleton */}
        <div
          className={combine(
            "p-4 border-b flex items-center justify-between",
            getValueForTheme("border-white/10", "border-gray-200")
          )}
        >
          <div
            className={combine(
              "h-6 w-32 rounded animate-pulse",
              getValueForTheme("bg-white/10", "bg-gray-200")
            )}
          />
          <div className="flex space-x-2">
            <div
              className={combine(
                "h-8 w-8 rounded animate-pulse",
                getValueForTheme("bg-white/10", "bg-gray-200")
              )}
            />
            <div
              className={combine(
                "h-8 w-8 rounded animate-pulse",
                getValueForTheme("bg-white/10", "bg-gray-200")
              )}
            />
          </div>
        </div>

        {/* Calendar Grid Skeleton */}
        <div className="p-4">
          {/* Week headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {[
              { full: "อาทิตย์", short: "อา" },
              { full: "จันทร์", short: "จ" },
              { full: "อังคาร", short: "อ" },
              { full: "พุธ", short: "พ" },
              { full: "พฤหัสบดี", short: "พฤ" },
              { full: "ศุกร์", short: "ศ" },
              { full: "เสาร์", short: "ส" }
            ].map((day, i) => (
              <div
                key={i}
                className={combine(
                  "h-8 flex items-center justify-center text-sm font-medium",
                  getValueForTheme("text-white/60", "text-gray-500")
                )}
              >
                <span className="hidden sm:inline">{day.full}</span>
                <span className="sm:hidden">{day.short}</span>
              </div>
            ))}
          </div>

          {/* Calendar days skeleton */}
          <div className="grid grid-cols-7 gap-2">
            {skeletonDays.map((day) => {
              const dayPattern = skeletonPattern[day];

              return (
                <div
                  key={day}
                  className={combine(
                    "aspect-square rounded-lg flex flex-col p-2 relative overflow-hidden",
                    getValueForTheme("bg-white/5", "bg-gray-50")
                  )}
                >
                  <div
                    className={combine(
                      "h-4 w-6 rounded animate-pulse mb-2",
                      getValueForTheme("bg-white/10", "bg-gray-200")
                    )}
                  />

                  {/* Deterministic activity dots skeleton - only render on client */}
                  {isClient && dayPattern.hasActivity && (
                    <div className="flex space-x-1 mt-auto">
                      {Array.from({ length: dayPattern.activityCount }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className={combine(
                              "w-2 h-2 rounded-full animate-pulse",
                              getValueForTheme("bg-white/20", "bg-gray-300")
                            )}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-3">
            <div
              className={combine(
                "animate-spin rounded-full h-8 w-8 border-2 border-transparent border-t-current",
                getValueForTheme("text-[#54CF90]", "text-[#006C67]")
              )}
            />
            <p
              className={combine(
                "text-sm font-medium",
                getValueForTheme("text-white/80", "text-gray-600")
              )}
            >
              กำลังโหลดปฏิทินกิจกรรม...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
);
CalendarSkeleton.displayName = "CalendarSkeleton";

// Optimized project transformation with memoization
const useCalendarProjects = (filteredEvents: any[]) => {
  return useMemo(() => {
    if (!Array.isArray(filteredEvents) || filteredEvents.length === 0)
      return [];

    return filteredEvents.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay ?? true,
      originalProject: event.originalProject,
      activityType: event.activityType,
    }));
  }, [filteredEvents]);
};

// Optimized date mapping with better performance
const useProjectsByDate = (calendarProjects: any[]) => {
  return useMemo(() => {
    const dateMap = new Map<string, any[]>();

    for (const project of calendarProjects) {
      if (!project.start || !project.end) continue;

      const startDate = new Date(project.start);
      const endDate = new Date(project.end);

      // Optimize date iteration
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;

      for (let time = startTime; time <= endTime; time += oneDayMs) {
        const date = new Date(time);
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, []);
        }
        dateMap.get(dateKey)!.push(project);
      }
    }

    return dateMap;
  }, [calendarProjects]);
};

// Custom hook for window size with SSR safety
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 });
  const [isClient, setIsClient] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsClient(true);

    const updateSize = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { ...windowSize, isClient };
};

const CalendarViewSection = memo<CalendarViewSectionProps>(
  ({
    currentDate,
    setCurrentDate,
    setSelectedMonth,
    filteredEvents,
    handleSelectSlot,
    handleSelectEvent,
    activeFilters = ["all"],
    ACTIVITY_TYPES = [],
    loading = false,
  }) => {
    const { getValueForTheme, combine } = useThemeUtils();

    const [isMounted, setIsMounted] = useState(false);
    const { width, height, isClient } = useWindowSize();
    const clickHandlersRef = useRef(new Map<Element, EventListener>());
    const updateTimeoutRef = useRef<NodeJS.Timeout>();
    const lastUpdateRef = useRef<string>("");

    // Custom hooks for data processing
    const calendarProjects = useCalendarProjects(filteredEvents);
    const projectsByDate = useProjectsByDate(calendarProjects);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Memoized activity type functions
    const createDayIndicator = useCallback((activityType: string) => {
      const dot = document.createElement("div");
      dot.className = "day-indicator";

      const activityColor =
        ACTIVITY_TYPE_COLORS[activityType as keyof typeof ACTIVITY_TYPE_COLORS];
      dot.style.backgroundColor = activityColor || "#9CA3AF";

      const activityClass =
        {
          university_activities: "activity-university",
          social_activities: "activity-social",
          competency_development_activities: "activity-competency",
        }[activityType] || "activity-default";

      dot.classList.add(activityClass);
      return dot;
    }, []);

    const getOrderedActivityTypes = useCallback((projects: any[]) => {
      const activityTypesSet = new Set<string>();

      for (const project of projects) {
        if (project.originalProject) {
          const types = getActivityTypes(project.originalProject);
          for (const type of types) {
            activityTypesSet.add(type);
          }
        }
      }

      const orderedTypes = ACTIVITY_ORDER.filter((type) =>
        activityTypesSet.has(type)
      );
      const remainingTypes = Array.from(activityTypesSet).filter(
        (type) => !ACTIVITY_ORDER.includes(type as any)
      );

      return [...orderedTypes, ...remainingTypes];
    }, []);

    // Optimized calendar dots update with better performance
    const updateCalendarDots = useCallback(() => {
      if (!isMounted || !isClient) return;

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        try {
          const updateSignature = `${
            calendarProjects.length
          }-${activeFilters.join(
            ","
          )}-${currentDate.getMonth()}-${currentDate.getFullYear()}`;
          if (lastUpdateRef.current === updateSignature) return;
          lastUpdateRef.current = updateSignature;

          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            const calendarView = document.querySelector(".rbc-month-view");
            if (!calendarView) return;

            // Clean up existing handlers
            clickHandlersRef.current.forEach((handler, cell) => {
              cell.removeEventListener("click", handler);
            });
            clickHandlersRef.current.clear();

            const dateCells = document.querySelectorAll(".rbc-date-cell");

            dateCells.forEach((cell) => {
              const existingIndicators = cell.querySelectorAll(
                ".day-indicator-container, .project-count"
              );
              existingIndicators.forEach((indicator) => indicator.remove());

              cell.classList.remove(
                "has-projects",
                "dark-theme-has-projects",
                "light-theme-has-projects"
              );

              const dayText = (cell as HTMLElement).textContent?.trim() || "";
              const dayNum = parseInt(dayText);
              if (isNaN(dayNum) || cell.classList.contains("rbc-off-range"))
                return;

              const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${dayNum}`;
              const projectsOnDay = projectsByDate.get(dateKey) || [];

              if (projectsOnDay.length > 0) {
                cell.classList.add("has-projects");
                cell.classList.add(
                  getValueForTheme(
                    "dark-theme-has-projects",
                    "light-theme-has-projects"
                  )
                );

                const dotsContainer = document.createElement("div");
                dotsContainer.className = "day-indicator-container";

                const projectCount = projectsOnDay.length;
                if (projectCount > 0) {
                  const projectCountText = document.createElement("span");
                  projectCountText.className = "project-count";
                  projectCountText.textContent = projectCount.toString();
                  dotsContainer.appendChild(projectCountText);
                }

                const orderedActivityTypes =
                  getOrderedActivityTypes(projectsOnDay);
                const displayActivityTypes = orderedActivityTypes.slice(0, 3);

                displayActivityTypes.forEach((activityType) => {
                  const dot = createDayIndicator(activityType);
                  dotsContainer.appendChild(dot);
                });

                const clickHandler = (e: Event) => {
                  e.preventDefault();
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

                (cell as HTMLElement).classList.add("cursor-pointer");
                cell.addEventListener("click", clickHandler, {
                  passive: false,
                });
                clickHandlersRef.current.set(cell, clickHandler);
                cell.appendChild(dotsContainer);
              }
            });

            calendarView.classList.add("processed");
          });
        } catch (error) {
          console.warn("Calendar dots update failed:", error);
        }
      }, 50);
    }, [
      isMounted,
      isClient,
      calendarProjects,
      currentDate,
      activeFilters,
      getValueForTheme,
      handleSelectSlot,
      projectsByDate,
      createDayIndicator,
      getOrderedActivityTypes,
    ]);

    const handleNavigate = useCallback(
      (date: Date) => {
        setCurrentDate(date);
        setSelectedMonth(date.getMonth());
      },
      [setCurrentDate, setSelectedMonth]
    );

    // Memoized container height with SSR safety
    const containerStyle = useMemo(() => {
      // Default SSR-safe values
      const defaultStyle = {
        height: "650px",
        minHeight: "50vh",
        maxHeight: "750px",
      };

      if (!isMounted || !isClient) {
        return defaultStyle;
      }

      const isMobile = width < 640;
      const isTablet = width < 1024;

      if (isMobile) {
        return {
          height: `${Math.min(height * 0.6, 500)}px`,
          minHeight: "400px",
          maxHeight: "500px",
        };
      } else if (isTablet) {
        return {
          height: "600px",
          minHeight: "45vh",
          maxHeight: "650px",
        };
      }

      return defaultStyle;
    }, [isMounted, isClient, width, height]);

    // Effect for updating calendar dots
    useEffect(() => {
      if (isMounted && !loading && isClient) {
        updateCalendarDots();
      }

      return () => {
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
      };
    }, [updateCalendarDots, isMounted, loading, isClient]);

    // Cleanup effect
    useEffect(() => {
      return () => {
        clickHandlersRef.current.forEach((handler, cell) => {
          cell.removeEventListener("click", handler);
        });
        clickHandlersRef.current.clear();

        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
      };
    }, []);

    // Show skeleton while loading or not mounted
    if (
      !isMounted ||
      loading ||
      !filteredEvents ||
      filteredEvents.length === 0
    ) {
      return (
        <CalendarSkeleton
          getValueForTheme={getValueForTheme}
          combine={combine}
        />
      );
    }

    if (!filteredEvents || filteredEvents.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={combine(
            "glass-panel backdrop-blur-sm rounded-lg overflow-hidden border shadow-md mb-6 sm:mb-8",
            getValueForTheme(
              "bg-black/20 border-white/10",
              "bg-white border-gray-100"
            )
          )}
          style={containerStyle}
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div
                className={combine(
                  "w-16 h-16 rounded-full flex items-center justify-center mx-auto",
                  getValueForTheme("bg-white/10", "bg-gray-100")
                )}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className={combine(
                    "text-lg font-medium mb-2",
                    getValueForTheme("text-white/90", "text-gray-900")
                  )}
                >
                  ไม่พบกิจกรรมในปฏิทิน
                </h3>
                <p
                  className={combine(
                    "text-sm",
                    getValueForTheme("text-white/60", "text-gray-500")
                  )}
                >
                  ลองปรับเปลี่ยนตัวกรองหรือเลือกเดือนอื่น
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="calendar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={combine(
            "glass-panel backdrop-blur-sm rounded-lg overflow-hidden border shadow-md mb-6 sm:mb-8",
            "transition-all duration-300 hover:shadow-lg will-change-transform",
            getValueForTheme(
              "calendar-wrapper-dark bg-black/20 border-white/10 shadow-black/10",
              "calendar-wrapper-light bg-white border-gray-100 shadow-gray-100/50"
            )
          )}
        >
          <div className="calendar-container relative" style={containerStyle}>
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
      </AnimatePresence>
    );
  }
);

CalendarViewSection.displayName = "CalendarViewSection";
export default CalendarViewSection;
