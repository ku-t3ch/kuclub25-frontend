/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "../../hooks/useProject";
import { useThemeUtils } from "../../hooks/useThemeUtils";
import { useCampuses } from "../../hooks/useCampuses"; // เพิ่ม import
import moment from "moment";
import "moment/locale/th";
import ActivityTypeFilter from "../../components/project/activityTypeFilter";
import MonthSelector from "../../components/project/monthSelector";
import ViewToggle from "../../components/project/viewToggle";
import CalendarViewSection from "../../components/project/calendarViewSection";
import ProjectList from "../../components/project/projectList";
import SelectedDateProject from "../../components/project/selectedDate";
import { Vortex } from "../../components/ui/vortex";

import {
  getActivityTypes,
  projectMatchesFilters,
  getActivityColor,
  type ActivityType,
} from "../../utils/calendarUtils";

// Constants moved outside component to prevent recreation
const ACTIVITY_TYPES: ActivityType[] = [
  {
    id: "university_activities",
    label: "กิจกรรมมหาวิทยาลัย",
    color: "#10B981",
  },
  {
    id: "social_activities",
    label: "กิจกรรมสังคม",
    color: "#F59E0B",
  },
  {
    id: "competency_development_activities",
    label: "กิจกรรมพัฒนาเสริมสร้างสมรรถนะ",
    color: "#8B5CF6",
  },
] as const;

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
} as const;

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
} as const;

// Set up moment locale
moment.locale("th");

export default function ProjectsPage() {
  const { getValueForTheme, combine } = useThemeUtils();
  const { projects, isLoading, error } = useProjects();
  const { campuses, loading: campusLoading } = useCampuses(); // เพิ่ม hook

  // State management
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [projectsOnSelectedDate, setProjectsOnSelectedDate] = useState<any[]>(
    []
  );
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().getMonth()
  );
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [activeFilters, setActiveFilters] = useState<string[]>(["all"]);
  const [selectedCampus, setSelectedCampus] = useState<string | undefined>(
    undefined
  ); // เพิ่ม state

  const projectsListRef = useRef<HTMLDivElement>(null);

  // Memoized theme values for performance
  const themeValues = useMemo(
    () => ({
      containerBg: getValueForTheme(
        "bg-gradient-to-b from-[#051D35] via-[#051D35] to-[#000000] dark-theme",
        "bg-gradient-to-b from-white via-white to-gray-50 light-theme"
      ),
      vortexBg: getValueForTheme(
        "bg-gradient-to-b from-[#000000] to-[#123067]",
        "bg-gradient-to-b from-white via-gray-50 to-gray-100"
      ),
      titleText: getValueForTheme(
        "text-white text-opacity-90",
        "text-[#006C67] text-opacity-90"
      ),
      loadingSpinner: getValueForTheme("border-blue-400", "border-[#006C67]"),
      loadingBorder: getValueForTheme("border-white/10", "border-[#006C67]/20"),
      loadingText: getValueForTheme("text-white/60", "text-[#006C67]/70"),
    }),
    [getValueForTheme]
  );

  // Utility function to create date from project data
  const createProjectDate = useCallback(
    (project: any, isEndDate = false): Date | null => {
      if (!project) return null;

      try {
        const startDate = project.date_start;
        const endDate = project.date_end;

        if (startDate && endDate) {
          const date = new Date(isEndDate ? endDate : startDate);
          return isNaN(date.getTime()) ? null : date;
        }
        return null;
      } catch {
        return null;
      }
    },
    []
  );

  // Format and filter projects for the calendar
  const calendarProjects = useMemo(() => {
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return [];
    }

    try {
      return projects
        .map((project) => {
          if (!project || !project.id) {
            return null;
          }

          try {
            const start = createProjectDate(project, false);
            const end = createProjectDate(project, true);

            if (!start || !end) {
              return null;
            }

            const isMultiDay = start.toDateString() !== end.toDateString();
            const activityTypes = getActivityTypes(project);
            const activityType = activityTypes[0] || "default";

            return {
              id: project.id,
              title: project.name_th || project.name_en || "ไม่ระบุชื่อกิจกรรม",
              start,
              end,
              allDay: isMultiDay,
              originalProject: project,
              activityType: activityType,
            };
          } catch (error) {
            console.error("Error formatting project:", error, project);
            return null;
          }
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error processing projects:", error);
      return [];
    }
  }, [projects, createProjectDate]);

  // Optimized filtered projects with useMemo - เพิ่ม campus filter
  const filteredProjects = useMemo(() => {
    if (!calendarProjects.length) return [];

    let filtered = calendarProjects;

    // Filter by activity type
    if (!activeFilters.includes("all")) {
      filtered = filtered.filter(
        (project) =>
          project?.originalProject &&
          projectMatchesFilters(
            project.originalProject,
            activeFilters,
            getActivityTypes
          )
      );
    }

    // Filter by campus
    if (selectedCampus && selectedCampus !== "") {
      filtered = filtered.filter((project) => {
        const campusName = project?.originalProject?.campus_name;
        return campusName === selectedCampus;
      });
    }

    return filtered;
  }, [calendarProjects, activeFilters, selectedCampus]);

  // Optimized filtered projects by month
  const filteredProjectsByMonth = useMemo(() => {
    return filteredProjects
      .filter((project) => project.start?.getMonth() === selectedMonth)
      .map((project) => project.originalProject)
      .filter(Boolean)
      .sort((a, b) => {
        const dateA = a.date_start;
        const dateB = b.date_start;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
  }, [filteredProjects, selectedMonth]);

  // Toggle filter selection
  const toggleFilter = useCallback((filter: string) => {
    if (!filter) return;

    setActiveFilters((prev) => {
      if (filter === "all") {
        return ["all"];
      }

      const newFilters = prev.includes("all") ? [] : [...prev];

      if (newFilters.includes(filter)) {
        const filteredSet = newFilters.filter((f) => f !== filter);
        return filteredSet.length === 0 ? ["all"] : filteredSet;
      } else {
        return [...newFilters, filter];
      }
    });
  }, []);

  // Campus filter handler
  const handleCampusChange = useCallback((campusName: string | undefined) => {
    setSelectedCampus(campusName);
  }, []);

  // Month navigation
  const goToNextMonth = useCallback(() => {
    const nextMonth = (selectedMonth + 1) % 12;
    const nextYear =
      selectedMonth === 11
        ? currentDate.getFullYear() + 1
        : currentDate.getFullYear();

    setSelectedMonth(nextMonth);
    setCurrentDate(new Date(nextYear, nextMonth, 1));
  }, [selectedMonth, currentDate]);

  const goToPreviousMonth = useCallback(() => {
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear =
      selectedMonth === 0
        ? currentDate.getFullYear() - 1
        : currentDate.getFullYear();

    setSelectedMonth(prevMonth);
    setCurrentDate(new Date(prevYear, prevMonth, 1));
  }, [selectedMonth, currentDate]);

  // Update projects on selected date based on current filters
  const updateProjectsOnSelectedDate = useCallback(
    (date: Date) => {
      if (!date || !filteredProjects.length) {
        setProjectsOnSelectedDate([]);
        return;
      }

      try {
        const clickedDate = date instanceof Date ? date : new Date(date);
        if (isNaN(clickedDate.getTime())) {
          setProjectsOnSelectedDate([]);
          return;
        }

        const projectsOnDate = filteredProjects.filter((project) => {
          if (!project?.start || !project?.end) return false;

          const projectStart = new Date(project.start);
          const projectEnd = new Date(project.end);

          return (
            projectStart.toDateString() === clickedDate.toDateString() ||
            projectEnd.toDateString() === clickedDate.toDateString() ||
            (clickedDate >= projectStart && clickedDate <= projectEnd)
          );
        });

        const projects = projectsOnDate
          .map((project) => project.originalProject)
          .filter(Boolean);

        setProjectsOnSelectedDate(projects);
      } catch (error) {
        console.error("Error in updateProjectsOnSelectedDate:", error);
        setProjectsOnSelectedDate([]);
      }
    },
    [filteredProjects]
  );

  // Handle calendar date click
  const handleSelectSlot = useCallback(
    (slotInfo: any) => {
      if (!slotInfo?.start) return;

      const clickedDate = moment(slotInfo.start).toDate();
      setSelectedDate(clickedDate);
      updateProjectsOnSelectedDate(clickedDate);

      setTimeout(() => {
        // หาตำแหน่งของ SelectedDateProject
        const selectedDateElement = document.querySelector(
          "[data-selected-date-projects]"
        );

        if (selectedDateElement) {
          // เลื่อนไปยัง element โดยเพิ่ม offset เพื่อให้เลื่อนลงมากขึ้น
          const elementTop =
            selectedDateElement.getBoundingClientRect().top +
            window.pageYOffset;
          const offset = 100;

          window.scrollTo({
            top: elementTop - offset,
            behavior: "smooth",
          });
        } else {
          // fallback ไปยัง projectsListRef แต่เพิ่ม offset
          if (projectsListRef.current) {
            const elementTop =
              projectsListRef.current.getBoundingClientRect().top +
              window.pageYOffset;
            const offset = 200; // เลื่อนลงมากขึ้น

            window.scrollTo({
              top: elementTop + offset,
              behavior: "smooth",
            });
          }
        }
      }, 500);
    },
    [updateProjectsOnSelectedDate]
  );

  // Handle project click in calendar
  const handleSelectProject = useCallback(
    (project: any) => {
      if (!project?.start) return;

      const projectDate = new Date(project.start);
      setSelectedDate(projectDate);
      updateProjectsOnSelectedDate(projectDate);
    },
    [updateProjectsOnSelectedDate]
  );

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (newViewMode: "calendar" | "list") => {
      setViewMode(newViewMode);
    },
    []
  );

  // Handle project click
  const handleProjectClick = useCallback((project: any) => {
    if (!project?.id) return;

    const projectId = project.id;
    if (!projectId) {
      console.error("Project ID not found:", project);
      return;
    }

    // Navigate to project details page
    window.location.href = `/projects/${projectId}`;
  }, []);

  // Reset selection when projects or filters change
  useEffect(() => {
    if (selectedDate) {
      updateProjectsOnSelectedDate(selectedDate);
    }
  }, [filteredProjects, updateProjectsOnSelectedDate, selectedDate]);

  // Memoized components for better performance
  const LoadingComponent = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center py-32"
      >
        <div className="w-12 h-12 relative">
          <div
            className={combine(
              "absolute inset-0 rounded-full border-2",
              themeValues.loadingBorder
            )}
          />
          <div
            className={combine(
              "absolute inset-0 rounded-full border-2 border-t-transparent animate-spin",
              themeValues.loadingSpinner
            )}
          />
        </div>
        <p className={combine("mt-4 text-sm", themeValues.loadingText)}>
          กำลังโหลดข้อมูลกิจกรรม...
        </p>
      </motion.div>
    ),
    [combine, themeValues]
  );

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={combine("min-h-screen pt-10 ")}>
      <Vortex
        backgroundColor="transparent"
        rangeY={800}
        particleCount={100}
        baseHue={120}
        particleOpacity={0.3}
        className="flex flex-col items-center justify-start w-full min-h-screen px-4"
        containerClassName={combine("fixed inset-0 z-0", themeValues.vortexBg)}
      />

      <motion.div
        className={combine("min-h-screen relative overflow-hidden")}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {/* Fixed spacing for navbar */}
        <div className="h-8 " />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12 max-w-7xl relative z-10"
        >
          {/* Header section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-center gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            <h1
              className={combine(
                "text-2xl sm:text-3xl lg:text-4xl font-bold text-center lg:text-left",
                "tracking-wide leading-tight flex-shrink-0",
                themeValues.titleText
              )}
            >
              กิจกรรมทั้งหมด
            </h1>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <ViewToggle
              viewMode={viewMode}
              setViewMode={handleViewModeChange}
            />
          </div>

          {/* Filters Section */}
          <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10 lg:mb-12">
            {/* Campus Filter */}
            <div className="flex flex-col gap-3 items-center justify-center px-4 sm:px-6">
              <div className="w-full max-w-xs relative">
                <select
                  value={selectedCampus || ""}
                  onChange={(e) =>
                    handleCampusChange(e.target.value || undefined)
                  }
                  disabled={campusLoading}
                  className={combine(
                    "w-full px-4 py-3 rounded-xl border-0 text-sm font-medium",
                    "focus:outline-none focus:ring-2 focus:ring-[#006C67]/30 focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-200 ease-in-out",
                    "shadow-sm hover:shadow-md",
                    "appearance-none cursor-pointer",
                    "min-h-[48px]",
                    getValueForTheme(
                      "bg-white/5 backdrop-blur-sm border-white/10 text-white/90 hover:bg-white/10",
                      "bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white"
                    )
                  )}
                >
                  <option
                    value=""
                    className={getValueForTheme(
                      "bg-gray-900 text-white",
                      "bg-white text-gray-900"
                    )}
                  >
                    ทุกวิทยาเขต
                  </option>
                  {campuses.map((campus) => (
                    <option
                      key={campus.id}
                      value={campus.name}
                      className={getValueForTheme(
                        "bg-gray-900 text-white",
                        "bg-white text-gray-900"
                      )}
                    >
                      {campus.name}
                    </option>
                  ))}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className={combine(
                      "w-5 h-5 transition-colors duration-200",
                      getValueForTheme("text-white/60", "text-gray-400")
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Loading indicator */}
                {campusLoading && (
                  <div className="absolute inset-y-0 right-8 flex items-center">
                    <div
                      className={combine(
                        "w-4 h-4 rounded-full border-2 border-t-transparent animate-spin",
                        getValueForTheme(
                          "border-white/40",
                          "border-[#006C67]/40"
                        )
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Activity Type Filter */}
            <div className="px-4 sm:px-6 lg:px-0">
              <ActivityTypeFilter
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                ACTIVITY_TYPES={ACTIVITY_TYPES}
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            LoadingComponent
          ) : (
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              {/* Month Selector */}
              <div className="mb-8 sm:mb-10 px-4 sm:px-0">
                <MonthSelector
                  currentDate={currentDate}
                  selectedMonth={selectedMonth}
                  goToPreviousMonth={goToPreviousMonth}
                  goToNextMonth={goToNextMonth}
                />
              </div>

              {/* Main Content */}
              <AnimatePresence mode="wait">
                {viewMode === "calendar" ? (
                  <motion.div
                    key="calendar"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-8 sm:space-y-10 lg:space-y-12 px-2 sm:px-4 lg:px-0"
                    ref={projectsListRef}
                  >
                    <CalendarViewSection
                      currentDate={currentDate}
                      setCurrentDate={setCurrentDate}
                      setSelectedMonth={setSelectedMonth}
                      filteredEvents={filteredProjects}
                      handleSelectSlot={handleSelectSlot}
                      handleSelectEvent={handleSelectProject}
                      activeFilters={activeFilters}
                      projectMatchesFilters={projectMatchesFilters}
                      ACTIVITY_TYPES={ACTIVITY_TYPES}
                    />

                    {/* Selected Date Projects */}
                    <AnimatePresence>
                      {selectedDate && projectsOnSelectedDate.length > 0 && (
                        <div className="mt-10 lg:mt-12">
                          <SelectedDateProject
                            data-selected-date-projects
                            selectedDate={selectedDate}
                            projectsOnSelectedDate={projectsOnSelectedDate}
                            setSelectedDate={setSelectedDate}
                            getActivityColor={(type: string) =>
                              getActivityColor(type, ACTIVITY_TYPES)
                            }
                            ACTIVITY_TYPES={ACTIVITY_TYPES}
                          />
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="pb-10 lg:pb-12 px-2 sm:px-4 lg:px-0"
                  >
                    <ProjectList
                      filteredProjectsByMonth={filteredProjectsByMonth}
                      getActivityColor={(type: string) =>
                        getActivityColor(type, ACTIVITY_TYPES)
                      }
                      ACTIVITY_TYPES={ACTIVITY_TYPES}
                      onProjectClick={handleProjectClick}
                      selectedCampus={selectedCampus}
                      currentDate={currentDate}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
