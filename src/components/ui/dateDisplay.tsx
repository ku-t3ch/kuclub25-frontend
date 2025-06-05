import React, { useMemo } from 'react';

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
  day 
}) => {
  // Memoized date calculations for performance
  const dateInfo = useMemo(() => {
    // Early return for single day projects
    if (!isMultiDayProject) {
      return {
        type: 'single',
        displayDay: day || (startDateTime ? startDateTime.getDate().toString() : "?")
      };
    }

    // Multi-day project processing
    if (startDateTime && endDateTime) {
      // Validate that we have valid Date objects
      if (!(startDateTime instanceof Date) || !(endDateTime instanceof Date)) {
        console.warn('Invalid Date objects provided to ProjectCardDateDisplay');
        return {
          type: 'legacy',
          startDay: dayStart || '?',
          endDay: dayEnd || '?'
        };
      }

      // Check for invalid dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.warn('Invalid Date objects provided to ProjectCardDateDisplay');
        return {
          type: 'legacy',
          startDay: dayStart || '?',
          endDay: dayEnd || '?'
        };
      }

      const startDay = startDateTime.getDate();
      const endDay = endDateTime.getDate();
      const startMonth = startDateTime.getMonth();
      const endMonth = endDateTime.getMonth();
      const startYear = startDateTime.getFullYear();
      const endYear = endDateTime.getFullYear();

      // Same month and year
      if (startMonth === endMonth && startYear === endYear) {
        return {
          type: 'sameMonth',
          startDay,
          endDay
        };
      } else {
        // Different months or years
        try {
          const startMonthName = startDateTime.toLocaleString("th-TH", {
            month: "short",
          });
          const endMonthName = endDateTime.toLocaleString("th-TH", {
            month: "short",
          });

          return {
            type: 'differentMonth',
            startDay,
            endDay,
            startMonth: startMonthName,
            endMonth: endMonthName
          };
        } catch (error) {
          console.warn('Error formatting month names:', error);
          return {
            type: 'legacy',
            startDay: dayStart || startDay?.toString() || '?',
            endDay: dayEnd || endDay?.toString() || '?'
          };
        }
      }
    } else if (dayStart && dayEnd) {
      // Legacy data format
      return {
        type: 'legacy',
        startDay: dayStart,
        endDay: dayEnd
      };
    }

    // Fallback for invalid multi-day project data
    return {
      type: 'single',
      displayDay: day || '?'
    };
  }, [isMultiDayProject, startDateTime, endDateTime, dayStart, dayEnd, day]);

  // Memoized render based on date type
  const renderDateDisplay = useMemo(() => {
    switch (dateInfo.type) {
      case 'single':
        return (
          <div className="text-white text-sm xs:text-base sm:text-xl font-medium">
            {dateInfo.displayDay}
          </div>
        );

      case 'sameMonth':
        return (
          <div className="text-white font-light flex items-center justify-center">
            <span className="text-xs xs:text-sm sm:text-base font-medium">
              {dateInfo.startDay}
            </span>
            <span className="text-[0.6rem] xs:text-xs sm:text-sm mx-0.5 opacity-80">
              -
            </span>
            <span className="text-xs xs:text-sm sm:text-base font-medium">
              {dateInfo.endDay}
            </span>
          </div>
        );

      case 'differentMonth':
        return (
          <div className="text-white font-light flex flex-col items-center justify-center space-y-0.5">
            <div className="text-[0.6rem] xs:text-xs sm:text-sm leading-tight">
              <span className="font-medium">{dateInfo.startDay}</span>
              <span className="ml-1 opacity-90">{dateInfo.startMonth}</span>
            </div>
            <div className="text-[0.5rem] xs:text-[0.6rem] sm:text-xs opacity-70 leading-none">
              ถึง
            </div>
            <div className="text-[0.6rem] xs:text-xs sm:text-sm leading-tight">
              <span className="font-medium">{dateInfo.endDay}</span>
              <span className="ml-1 opacity-90">{dateInfo.endMonth}</span>
            </div>
          </div>
        );

      case 'legacy':
        return (
          <div className="text-white font-light flex items-center justify-center">
            <span className="text-xs xs:text-sm sm:text-base font-medium">
              {dateInfo.startDay}
            </span>
            <span className="text-[0.6rem] xs:text-xs sm:text-sm mx-0.5 opacity-80">
              -
            </span>
            <span className="text-xs xs:text-sm sm:text-base font-medium">
              {dateInfo.endDay}
            </span>
          </div>
        );

      default:
        // Fallback for unexpected cases
        return (
          <div className="text-white text-sm xs:text-base sm:text-xl font-medium">
            ?
          </div>
        );
    }
  }, [dateInfo]);

  return renderDateDisplay;
};

export default React.memo(ProjectCardDateDisplay);