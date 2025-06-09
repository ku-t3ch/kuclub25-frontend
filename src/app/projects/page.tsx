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
              title: project.name_th || project.name_en || "ไม่ระบุชื่อโครงการ",
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

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setActiveFilters(["all"]);
    setSelectedCampus(undefined);
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

        if (projects.length > 0) {
          setTimeout(() => {
            projectsListRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 300);
        }
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
          กำลังโหลดข้อมูลโครงการ...
        </p>
      </motion.div>
    ),
    [combine, themeValues]
  );

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={combine("min-h-screen pt-16 md:pt-20")}>
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
        <div className="h-16 sm:h-20 md:h-24" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl relative z-10"
        >
          {/* Header section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
            <h1
              className={combine(
                "text-2xl sm:text-3xl lg:text-4xl font-bold text-center lg:text-left",
                "tracking-wide leading-tight flex-shrink-0",
                themeValues.titleText
              )}
            >
              โครงการทั้งหมด
            </h1>

            <div className="flex justify-center lg:justify-end">
              <ViewToggle
                viewMode={viewMode}
                setViewMode={handleViewModeChange}
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {/* Campus Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <label
                className={combine(
                  "text-sm font-medium flex-shrink-0",
                  getValueForTheme("text-white/80", "text-gray-700")
                )}
              >
                กรองตามวิทยาเขต:
              </label>

              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={selectedCampus || ""}
                  onChange={(e) =>
                    handleCampusChange(e.target.value || undefined)
                  }
                  disabled={campusLoading}
                  className={combine(
                    "px-3 py-2 rounded-lg border text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-[#006C67] focus:border-transparent",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    getValueForTheme(
                      "bg-white/10 border-white/20 text-white placeholder-white/50",
                      "bg-white border-gray-300 text-gray-900"
                    )
                  )}
                >
                  <option
                    value=""
                    className={getValueForTheme(
                      "bg-gray-800 text-white",
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
                        "bg-gray-800 text-white",
                        "bg-white text-gray-900"
                      )}
                    >
                      {campus.name}
                    </option>
                  ))}
                </select>

                {/* Clear filters button */}
                {(selectedCampus || !activeFilters.includes("all")) && (
                  <button
                    onClick={clearAllFilters}
                    className={combine(
                      "px-3 py-2 rounded-lg text-sm font-medium",
                      "transition-colors duration-200",
                      getValueForTheme(
                        "bg-red-500/20 text-red-300 hover:bg-red-500/30",
                        "bg-red-50 text-red-600 hover:bg-red-100"
                      )
                    )}
                  >
                    ล้างตัวกรอง
                  </button>
                )}
              </div>
            </div>

            {/* Activity Type Filter */}
            <ActivityTypeFilter
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              ACTIVITY_TYPES={ACTIVITY_TYPES}
            />

            {/* Filter Results Summary */}
            <div
              className={combine(
                "px-4 py-3 rounded-lg border text-sm",
                getValueForTheme(
                  "bg-white/5 border-white/10 text-white/80",
                  "bg-gray-50 border-gray-200 text-gray-700"
                )
              )}
            >
              <div className="flex items-center justify-between">
                <span>
                  พบโครงการ{" "}
                  <span className="font-semibold text-[#006C67]">
                    {filteredProjects.length.toLocaleString("th-TH")}
                  </span>{" "}
                  โครงการ
                  {(selectedCampus || !activeFilters.includes("all")) && (
                    <span className="ml-2 text-xs opacity-75">
                      (จากทั้งหมด{" "}
                      {calendarProjects.length.toLocaleString("th-TH")} โครงการ)
                    </span>
                  )}
                </span>

                {/* Active Filters Indicator */}
                {(selectedCampus || !activeFilters.includes("all")) && (
                  <span
                    className={combine(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getValueForTheme(
                        "bg-blue-500/20 text-blue-300",
                        "bg-[#006C67]/10 text-[#006C67]"
                      )
                    )}
                  >
                    มีตัวกรองที่ใช้งาน
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            LoadingComponent
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Month Selector */}
              <div className="mb-6 sm:mb-8">
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
                    className="space-y-6 sm:space-y-8"
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
                        <div className="mt-8">
                          <SelectedDateProject
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
                    className="pb-8"
                  >
                    <ProjectList
                      filteredProjectsByMonth={filteredProjectsByMonth}
                      getActivityColor={(type: string) =>
                        getActivityColor(type, ACTIVITY_TYPES)
                      }
                      ACTIVITY_TYPES={ACTIVITY_TYPES}
                      onProjectClick={handleProjectClick}
                      selectedCampus={selectedCampus} // เพิ่ม prop นี้
                      currentDate={currentDate} // เพิ่ม prop นี้
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
