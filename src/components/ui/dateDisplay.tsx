import React, { useMemo } from "react";

interface ProjectCardDateDisplayProps {
  isMultiDayProject: boolean;
  startDateTime?: Date;
  endDateTime?: Date;
  dayStart?: string;
  dayEnd?: string;
  day?: string;
}

const ProjectCardDateDisplay: React.FC<ProjectCardDateDisplayProps> = ({
  isMultiDayProject,
  startDateTime,
  endDateTime,
  dayStart,
  dayEnd,
  day,
}) => {
  // Helper function to format month names
  const formatMonthName = (date: Date, format: "short" | "long" = "short") => {
    try {
      return date.toLocaleString("th-TH", {
        month: format === "short" ? "short" : "long",
      });
    } catch (error) {
      console.warn("Error formatting month name:", error);
      const monthNames =
        format === "short"
          ? [
              "ม.ค.",
              "ก.พ.",
              "มี.ค.",
              "เม.ย.",
              "พ.ค.",
              "มิ.ย.",
              "ก.ค.",
              "ส.ค.",
              "ก.ย.",
              "ต.ค.",
              "พ.ย.",
              "ธ.ค.",
            ]
          : [
              "มกราคม",
              "กุมภาพันธ์",
              "มีนาคม",
              "เมษายน",
              "พฤษภาคม",
              "มิถุนายน",
              "กรกฎาคม",
              "สิงหาคม",
              "กันยายน",
              "ตุลาคม",
              "พฤศจิกายน",
              "ธันวาคม",
            ];
      return monthNames[date.getMonth()] || "?";
    }
  };

  // Helper function to check if dates are in same period
  const isSamePeriod = (start: Date, end: Date) => {
    return {
      sameDay:
        start.getDate() === end.getDate() &&
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear(),
      sameMonth:
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear(),
      sameYear: start.getFullYear() === end.getFullYear(),
    };
  };

  // Memoized date calculations for performance
  const dateInfo = useMemo(() => {
    // Early return for single day projects
    if (!isMultiDayProject) {
      return {
        type: "single" as const,
        displayDay:
          day || (startDateTime ? startDateTime.getDate().toString() : "?"),
      };
    }

    // Multi-day project processing
    if (startDateTime && endDateTime) {
      // Validate that we have valid Date objects
      if (!(startDateTime instanceof Date) || !(endDateTime instanceof Date)) {
        console.warn("Invalid Date objects provided to ProjectCardDateDisplay");
        return {
          type: "legacy" as const,
          startDay: dayStart || "?",
          endDay: dayEnd || "?",
        };
      }

      // Check for invalid dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.warn("Invalid Date objects provided to ProjectCardDateDisplay");
        return {
          type: "legacy" as const,
          startDay: dayStart || "?",
          endDay: dayEnd || "?",
        };
      }

      const startDay = startDateTime.getDate();
      const endDay = endDateTime.getDate();
      const periods = isSamePeriod(startDateTime, endDateTime);

      // Same day
      if (periods.sameDay) {
        return {
          type: "single" as const,
          displayDay: startDay.toString(),
        };
      }

      // Same month and year
      if (periods.sameMonth) {
        return {
          type: "sameMonth" as const,
          startDay,
          endDay,
        };
      }

      // Different months but same year
      if (periods.sameYear) {
        return {
          type: "differentMonthSameYear" as const,
          startDay,
          endDay,
          startMonth: formatMonthName(startDateTime, "short"),
          endMonth: formatMonthName(endDateTime, "short"),
          startMonthLong: formatMonthName(startDateTime, "long"),
          endMonthLong: formatMonthName(endDateTime, "long"),
          year: startDateTime.getFullYear(),
        };
      }

      // Different years
      return {
        type: "differentYear" as const,
        startDay,
        endDay,
        startMonth: formatMonthName(startDateTime, "short"),
        endMonth: formatMonthName(endDateTime, "short"),
        startMonthLong: formatMonthName(startDateTime, "long"),
        endMonthLong: formatMonthName(endDateTime, "long"),
        startYear: startDateTime.getFullYear(),
        endYear: endDateTime.getFullYear(),
      };
    } else if (dayStart && dayEnd) {
      // Legacy data format
      return {
        type: "legacy" as const,
        startDay: dayStart,
        endDay: dayEnd,
      };
    }

    // Fallback for invalid multi-day project data
    return {
      type: "single" as const,
      displayDay: day || "?",
    };
  }, [isMultiDayProject, startDateTime, endDateTime, dayStart, dayEnd, day]);

  // Memoized render based on date type
  const renderDateDisplay = useMemo(() => {
    switch (dateInfo.type) {
      case "single":
        return (
          <div className="text-white text-sm xs:text-base sm:text-xl md:text-2xl font-medium leading-tight">
            {dateInfo.displayDay}
          </div>
        );

      case "sameMonth":
        return (
          <div className="text-white font-light flex items-center justify-center">
            <span className="text-xs xs:text-sm sm:text-base md:text-lg font-medium">
              {dateInfo.startDay}
            </span>
            <span className="text-[0.6rem] xs:text-xs sm:text-sm md:text-base mx-0.5 opacity-80">
              -
            </span>
            <span className="text-xs xs:text-sm sm:text-base md:text-lg font-medium">
              {dateInfo.endDay}
            </span>
          </div>
        );

      case "differentMonthSameYear":
        return (
          <div className="text-white font-light flex items-center justify-center space-y-0.5">
            {/* Start Date */}
            <div className="text-xs xs:text-sm sm:text-base md:text-lg leading-tight text-center">
              <span className="font-medium">{dateInfo.startDay}</span>
            </div>
            <div className="w-1" />

            {/* Separator with line */}
            <div className="flex items-center justify-center">-</div>
            <div className="w-1" />
            
            {/* End Date */}
            <div className="text-xs xs:text-sm sm:text-base md:text-lg leading-tight text-center">
              <span className="font-medium">{dateInfo.endDay}</span>
            </div>
          </div>
        );

      case "differentYear":
        return (
          <div className="text-white font-light flex flex-col items-center justify-center space-y-0.5">
            {/* Start Date with Year */}
            <div className="text-[0.5rem] xs:text-[0.55rem] sm:text-[0.6rem] md:text-xs leading-tight text-center">
              <div>
                <span className="font-medium">{dateInfo.startDay}</span>
                <span className="ml-0.5 opacity-90">{dateInfo.startMonth}</span>
              </div>
              <div className="opacity-80 text-[0.45rem] xs:text-[0.5rem] sm:text-[0.55rem] md:text-[0.6rem]">
                {dateInfo.startYear}
              </div>
            </div>

            {/* Separator */}
            <div className="text-[0.4rem] xs:text-[0.45rem] sm:text-[0.5rem] md:text-[0.6rem] opacity-70 leading-none">
              ถึง
            </div>

            {/* End Date with Year */}
            <div className="text-[0.5rem] xs:text-[0.55rem] sm:text-[0.6rem] md:text-xs leading-tight text-center">
              <div>
                <span className="font-medium">{dateInfo.endDay}</span>
                <span className="ml-0.5 opacity-90">{dateInfo.endMonth}</span>
              </div>
              <div className="opacity-80 text-[0.45rem] xs:text-[0.5rem] sm:text-[0.55rem] md:text-[0.6rem]">
                {dateInfo.endYear}
              </div>
            </div>
          </div>
        );

      case "legacy":
        return (
          <div className="text-white font-light flex items-center justify-center">
            <span className="text-xs xs:text-sm sm:text-base md:text-lg font-medium">
              {dateInfo.startDay}
            </span>
            <span className="text-[0.6rem] xs:text-xs sm:text-sm md:text-base mx-0.5 opacity-80">
              -
            </span>
            <span className="text-xs xs:text-sm sm:text-base md:text-lg font-medium">
              {dateInfo.endDay}
            </span>
          </div>
        );

      default:
        // Fallback for unexpected cases
        return (
          <div className="text-white text-sm xs:text-base sm:text-xl md:text-2xl font-medium">
            ?
          </div>
        );
    }
  }, [dateInfo]);

  // Add tooltip for cross-month/year dates
  const getTooltipText = useMemo(() => {
    if (dateInfo.type === "differentMonthSameYear") {
      return `${dateInfo.startDay} ${dateInfo.startMonthLong} - ${dateInfo.endDay} ${dateInfo.endMonthLong} ${dateInfo.year}`;
    }
    if (dateInfo.type === "differentYear") {
      return `${dateInfo.startDay} ${dateInfo.startMonthLong} ${dateInfo.startYear} - ${dateInfo.endDay} ${dateInfo.endMonthLong} ${dateInfo.endYear}`;
    }
    return undefined;
  }, [dateInfo]);

  return (
    <div className="relative group" title={getTooltipText}>
      {renderDateDisplay}

      {/* Tooltip for detailed date range */}
      {getTooltipText && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          {getTooltipText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProjectCardDateDisplay);
