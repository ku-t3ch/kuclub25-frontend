import React, { useMemo, useCallback } from "react";
import { useThemeUtils } from "../../hooks/useThemeUtils";

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
  const { getValueForTheme, combine } = useThemeUtils();

  const formatMonthName = useCallback(
    (date: Date, format: "short" | "long" = "short") => {
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
    },
    []
  );

  const isSamePeriod = useCallback((start: Date, end: Date) => {
    const yearDiff = end.getFullYear() - start.getFullYear();
    return {
      sameDay:
        start.getDate() === end.getDate() &&
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear(),
      sameMonth:
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear(),
      sameYear: start.getFullYear() === end.getFullYear(),
      yearDifference: yearDiff,
      isMultiYear: yearDiff > 0,
    };
  }, []);

  const dateInfo = useMemo(() => {
    if (!isMultiDayProject) {
      return {
        type: "single" as const,
        displayDay:
          day || (startDateTime ? startDateTime.getDate().toString() : "?"),
        monthText: startDateTime
          ? formatMonthName(startDateTime, "short")
          : "?",
      };
    }

    if (startDateTime && endDateTime) {
      if (!(startDateTime instanceof Date) || !(endDateTime instanceof Date)) {
        console.warn("Invalid Date objects provided to ProjectCardDateDisplay");
        return {
          type: "legacy" as const,
          startDay: dayStart || "?",
          endDay: dayEnd || "?",
          monthText: "?",
        };
      }

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.warn("Invalid Date objects provided to ProjectCardDateDisplay");
        return {
          type: "legacy" as const,
          startDay: dayStart || "?",
          endDay: dayEnd || "?",
          monthText: "?",
        };
      }

      const startDay = startDateTime.getDate();
      const endDay = endDateTime.getDate();
      const periods = isSamePeriod(startDateTime, endDateTime);

      if (periods.sameDay) {
        return {
          type: "single" as const,
          displayDay: startDay.toString(),
          monthText: formatMonthName(startDateTime, "short"),
        };
      }

      if (periods.sameMonth) {
        return {
          type: "sameMonth" as const,
          startDay,
          endDay,
          monthText: formatMonthName(startDateTime, "short"),
        };
      }

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
          monthText: `${formatMonthName(
            startDateTime,
            "short"
          )} – ${formatMonthName(endDateTime, "short")}`,
        };
      }

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
        yearDifference: periods.yearDifference,
        isLongTerm: periods.yearDifference > 1,
        monthText: `${formatMonthName(
          startDateTime,
          "short"
        )} – ${formatMonthName(endDateTime, "short")}`,
      };
    } else if (dayStart && dayEnd) {
      return {
        type: "legacy" as const,
        startDay: dayStart,
        endDay: dayEnd,
        monthText: "?",
      };
    }

    return {
      type: "single" as const,
      displayDay: day || "?",
      monthText: "?",
    };
  }, [
    isMultiDayProject,
    startDateTime,
    endDateTime,
    dayStart,
    dayEnd,
    day,
    formatMonthName,
    isSamePeriod,
  ]);

  // Memoized render based on date type - ปรับ responsive ให้ดีขึ้น
  const renderDateDisplay = useMemo(() => {
    const textColorClass = getValueForTheme("text-white", "text-white");
    
    // ปรับ font size ให้เหมาะสมกับ mobile
    const baseFontClass = "text-base xs:text-lg sm:text-xl md:text-2xl font-semibold leading-tight";
    const secondaryFontClass = "text-sm xs:text-base sm:text-lg md:text-xl font-medium";
    const tertiaryFontClass = "text-xs xs:text-sm sm:text-base md:text-lg font-normal";
    const monthFontClass = "text-[0.6rem] xs:text-xs sm:text-sm md:text-sm font-medium uppercase tracking-wide";

    // ปรับ spacing ให้เหมาะสมกับ mobile
    const monthMargin = "mb-0.5 xs:mb-1 sm:mb-1";
    const elementSpacing = "space-x-0.5 xs:space-x-1";

    switch (dateInfo.type) {
      case "single":
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[3rem] xs:min-h-[3.5rem] sm:min-h-[4rem]">
            {/* Month Display */}
            <div className={combine("text-white/90", monthMargin, monthFontClass)}>
              {dateInfo.monthText}
            </div>
            {/* Day Display */}
            <div className={combine(baseFontClass, textColorClass)}>
              {dateInfo.displayDay}
            </div>
          </div>
        );

      case "sameMonth":
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[3rem] xs:min-h-[3.5rem] sm:min-h-[4rem]">
            {/* Month Display */}
            <div className={combine("text-white/90", monthMargin, monthFontClass)}>
              {dateInfo.monthText}
            </div>
            {/* Day Range Display */}
            <div className={combine("flex items-center justify-center", elementSpacing, textColorClass)}>
              <span className={secondaryFontClass}>{dateInfo.startDay}</span>
              <span className={combine(tertiaryFontClass, "opacity-80")}>-</span>
              <span className={secondaryFontClass}>{dateInfo.endDay}</span>
            </div>
          </div>
        );

      case "differentMonthSameYear":
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[3rem] xs:min-h-[3.5rem] sm:min-h-[4rem]">
            {/* Month Range Display */}
            <div className={combine("text-white/90", monthMargin)}>
              <div className="flex items-center justify-center space-x-0.5 xs:space-x-1">
                <div className="text-[0.5rem] xs:text-[0.6rem] sm:text-xs md:text-sm opacity-90 text-center font-medium">
                  {dateInfo.startMonth}
                </div>
                <div className="text-[0.5rem] xs:text-[0.6rem] sm:text-xs opacity-80">-</div>
                <div className="text-[0.5rem] xs:text-[0.6rem] sm:text-xs md:text-sm opacity-90 text-center font-medium">
                  {dateInfo.endMonth}
                </div>
              </div>
            </div>
            {/* Day Range Display */}
            <div className={combine("flex items-center", elementSpacing)}>
              <span className={secondaryFontClass}>{dateInfo.startDay}</span>
              <span className={combine(tertiaryFontClass, "opacity-80")}>-</span>
              <span className={secondaryFontClass}>{dateInfo.endDay}</span>
            </div>
          </div>
        );

      case "differentYear":
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[3rem] xs:min-h-[3.5rem] sm:min-h-[4rem]">
            {/* Year range สำหรับโครงการข้ามหลายปี */}
            {dateInfo.isLongTerm && (
              <div className={combine(
                "text-[0.7rem] xs:text-[0.8rem] sm:text-xs md:text-sm",
                "font-semibold opacity-90 mb-0.5 text-white/90"
              )}>
                {dateInfo.startYear} - {dateInfo.endYear}
              </div>
            )}
            
            {/* Month Range Display */}
            <div className={combine("text-white/90", monthMargin)}>
              <div className="flex items-center justify-center space-x-0.5 xs:space-x-1">
                <div className="text-[0.7rem] xs:text-[0.8rem] sm:text-xs md:text-sm opacity-90 font-semibold text-center">
                  {dateInfo.startMonth}
                </div>
                <div className="text-[0.7rem] xs:text-[0.8rem] sm:text-xs opacity-80">-</div>
                <div className="text-[0.7rem] xs:text-[0.8rem] sm:text-xs md:text-sm opacity-90 font-semibold text-center">
                  {dateInfo.endMonth}
                </div>
              </div>
            </div>

            {/* Main date display */}
            <div className={combine("flex items-center", elementSpacing)}>
              <div className="text-center">
                <div className={secondaryFontClass}>{dateInfo.startDay}</div>
              </div>
              <div className={combine(tertiaryFontClass, "opacity-80")}>-</div>
              <div className="text-center">
                <div className={secondaryFontClass}>{dateInfo.endDay}</div>
              </div>
            </div>

            {/* Year display for non-long-term cross-year projects */}
            {!dateInfo.isLongTerm && (
              <div className="flex items-center justify-center space-x-0.5 xs:space-x-1 mt-0.5">
                <div className="text-[0.45rem] xs:text-[0.5rem] sm:text-xs opacity-70 text-center">
                  {dateInfo.startYear}
                </div>
                <div className="text-[0.45rem] xs:text-[0.5rem] sm:text-xs opacity-70">-</div>
                <div className="text-[0.45rem] xs:text-[0.5rem] sm:text-xs opacity-70 text-center">
                  {dateInfo.endYear}
                </div>
              </div>
            )}
          </div>
        );

      case "legacy":
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[3rem] xs:min-h-[3.5rem] sm:min-h-[4rem]">
            {/* Month Display */}
            <div className={combine("text-white/90", monthMargin, monthFontClass)}>
              {dateInfo.monthText}
            </div>
            {/* Day Range Display */}
            <div className={combine("flex items-center justify-center", elementSpacing, textColorClass)}>
              <span className={secondaryFontClass}>{dateInfo.startDay}</span>
              <span className={combine(tertiaryFontClass, "opacity-80")}>-</span>
              <span className={secondaryFontClass}>{dateInfo.endDay}</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[3rem] xs:min-h-[3.5rem] sm:min-h-[4rem]">
            {/* Month Display */}
            <div className={combine("text-white/90", monthMargin, monthFontClass)}>
              ?
            </div>
            {/* Day Display */}
            <div className={combine(baseFontClass, textColorClass)}>?</div>
          </div>
        );
    }
  }, [dateInfo, getValueForTheme, combine]);

  const getTooltipText = useMemo(() => {
    if (dateInfo.type === "differentMonthSameYear") {
      return `${dateInfo.startDay} ${dateInfo.startMonthLong} - ${dateInfo.endDay} ${dateInfo.endMonthLong} ${dateInfo.year}`;
    }
    if (dateInfo.type === "differentYear") {
      const duration = dateInfo.yearDifference
        ? dateInfo.yearDifference > 1
          ? ` • ระยะเวลา ${dateInfo.yearDifference} ปี`
          : ` • ข้ามปี`
        : "";
      return `${dateInfo.startDay} ${dateInfo.startMonthLong} ${dateInfo.startYear} - ${dateInfo.endDay} ${dateInfo.endMonthLong} ${dateInfo.endYear}${duration}`;
    }
    return undefined;
  }, [dateInfo]);

  return (
    <div className="relative group w-full h-full" title={getTooltipText}>
      {renderDateDisplay}

      {/* Enhanced tooltip with better styling - ปรับให้เหมาะกับ mobile */}
      {getTooltipText && (
        <div
          className={combine(
            "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 xs:px-3 py-1.5 xs:py-2",
            "text-2xs xs:text-xs rounded-md xs:rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100",
            "transition-all duration-300 pointer-events-none z-20 shadow-lg",
            "border border-white/10 backdrop-blur-md max-w-xs",
            getValueForTheme(
              "bg-gray-900/95 text-white",
              "bg-[#006C67]/95 text-white"
            )
          )}
        >
          {getTooltipText}
          <div
            className={combine(
              "absolute top-full left-1/2 transform -translate-x-1/2 border-3 xs:border-4 border-transparent",
              getValueForTheme("border-t-gray-900/95", "border-t-[#006C67]/95")
            )}
          ></div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProjectCardDateDisplay);