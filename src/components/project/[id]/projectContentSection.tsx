"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeUtils } from '../../../hooks/useThemeUtils';
import { formatDateForDisplay } from '../../../utils/formatdate';
import CompetencyActivitiesDisplay from './competencyActiviSection';

interface ScheduleItemProps {
  day: any;
  index: number;
}

interface ContentSectionProps {
  project: any;
  projectData: any;
}

// Pre-defined animation variants
const containerVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

const expandableVariants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const ClockIcon = () => (
  <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Helper function to extract time from ISO string or regular time string
const formatTimeFromString = (timeString: string): string => {
  if (!timeString) return '';
  
  if (timeString.includes('T') && (timeString.includes('Z') || timeString.includes('+'))) {
    try {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('th-TH', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Asia/Bangkok'
        });
      }
    } catch (error) {
      console.warn('Error parsing ISO date string:', timeString);
    }
  }
  
  return timeString;
};

const TimeSlot = React.memo<{
  timeSlot: { startTime: string; endTime: string; description: string };
  slotIndex: number;
  themeUtils: ReturnType<typeof useThemeUtils>;
}>(({ timeSlot, slotIndex, themeUtils }) => {
  const { combine, getValueForTheme } = themeUtils;

  const timeDisplay = useMemo(() => {
    const startTime = formatTimeFromString(timeSlot.startTime);
    const endTime = formatTimeFromString(timeSlot.endTime);
    
    if (startTime && endTime) {
      return `${startTime} - ${endTime} น.`;
    } else if (startTime) {
      return `${startTime} น.`;
    }
    return 'ไม่ระบุเวลา';
  }, [timeSlot.startTime, timeSlot.endTime]);

  return (
    <motion.div
      variants={itemVariants}
      initial="initial"
      animate="animate"
      transition={{ delay: slotIndex * 0.05 }}
      className={combine(
        "p-2 xs:p-3 rounded-md border-l-2 mt-3 xs:mt-4",
        getValueForTheme(
          "bg-white/5 border-l-[#54CF90]/50",
          "bg-gray-50 border-l-[#006C67]/50"
        )
      )}
    >
      <div className="flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2">
        <div className={combine(
          "w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full flex-shrink-0",
          getValueForTheme("bg-[#54CF90]", "bg-[#006C67]")
        )} />
        
        <div className={combine(
          "text-xs xs:text-sm font-medium break-words",
          getValueForTheme("text-[#54CF90]", "text-[#006C67]")
        )}>
          {timeDisplay}
        </div>
      </div>
      
      {timeSlot.description && (
        <p className={combine(
          "text-xs xs:text-sm leading-relaxed pl-2 xs:pl-4 break-words",
          getValueForTheme("text-white/80", "text-[#006C67]/70")
        )}>
          {timeSlot.description}
        </p>
      )}
    </motion.div>
  );
});

const ScheduleItem = React.memo<ScheduleItemProps>(({ day, index }) => {
  const themeUtils = useThemeUtils();
  const { combine, getValueForTheme } = themeUtils;
  const [isExpanded, setIsExpanded] = useState(false);

  const parsedDay = useMemo(() => {
    if (!day) return null;

    let date: Date;
    let timeSlots: Array<{
      startTime: string;
      endTime: string;
      description: string;
    }> = [];
    let dayDescription = '';

    try {
      date = day.date ? new Date(day.date) : new Date();
      if (isNaN(date.getTime())) date = new Date();
    } catch {
      date = new Date();
    }

    dayDescription = day.description ? String(day.description) : '';

    if (day.time) {
      if (Array.isArray(day.time)) {
        if (day.time.length > 0 && typeof day.time[0] === 'object' && day.time[0].time_start) {
          timeSlots = day.time.map((timeSlot: any) => ({
            startTime: formatTimeFromString(timeSlot.time_start || ''),
            endTime: formatTimeFromString(timeSlot.time_end || ''),
            description: timeSlot.description || dayDescription
          }));
        } else if (day.time.length >= 2 && typeof day.time[0] === 'string') {
          timeSlots = [{
            startTime: formatTimeFromString(day.time[0]),
            endTime: formatTimeFromString(day.time[1]),
            description: dayDescription
          }];
        } else if (day.time.length === 1) {
          timeSlots = [{
            startTime: formatTimeFromString(day.time[0]),
            endTime: '',
            description: dayDescription
          }];
        }
      } else if (typeof day.time === 'string') {
        timeSlots = [{
          startTime: formatTimeFromString(day.time),
          endTime: '',
          description: dayDescription
        }];
      }
    }

    if (timeSlots.length === 0) {
      timeSlots = [{
        startTime: '',
        endTime: '',
        description: dayDescription || 'ไม่มีรายละเอียดเวลา'
      }];
    }

    return { date, timeSlots, dayDescription };
  }, [day]);

  const scheduleInfo = useMemo(() => {
    if (!parsedDay) return null;

    const { timeSlots } = parsedDay;
    const totalTimeSlots = timeSlots.length;
    const hasMultipleSlots = totalTimeSlots > 1;
    const firstTimeSlot = timeSlots[0];
    const lastTimeSlot = timeSlots[totalTimeSlots - 1];

    const timeDisplay = hasMultipleSlots 
      ? `${firstTimeSlot.startTime} - ${lastTimeSlot.endTime} น.`
      : firstTimeSlot.startTime && firstTimeSlot.endTime 
        ? `${firstTimeSlot.startTime} - ${firstTimeSlot.endTime} น.`
        : firstTimeSlot.startTime 
          ? `${firstTimeSlot.startTime} น.`
          : 'ไม่ระบุเวลา';

    return { totalTimeSlots, hasMultipleSlots, firstTimeSlot, timeDisplay };
  }, [parsedDay]);

  const handleToggle = useCallback(() => {
    if (scheduleInfo?.hasMultipleSlots) {
      setIsExpanded(prev => !prev);
    }
  }, [scheduleInfo?.hasMultipleSlots]);

  if (!parsedDay || !scheduleInfo) return null;

  const { date, timeSlots, dayDescription } = parsedDay;
  const { totalTimeSlots, hasMultipleSlots, firstTimeSlot, timeDisplay } = scheduleInfo;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.1 }}
      className={combine(
        "rounded-lg xs:rounded-xl border overflow-hidden",
        getValueForTheme(
          "bg-white/5 border-white/10",
          "bg-gray-50 border border-[#006C67]/20"
        )
      )}
    >
      <div
        className={combine(
          "p-3 xs:p-4 transition-all duration-200",
          hasMultipleSlots ? "cursor-pointer" : "",
          getValueForTheme(
            hasMultipleSlots ? "hover:bg-white/5" : "",
            hasMultipleSlots ? "hover:bg-[#006C67]/5" : ""
          )
        )}
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 mb-2">
              <h4 className={combine(
                "font-medium text-md xs:text-base break-words",
                getValueForTheme("text-white", "text-[#006C67]")
              )}>
                {formatDateForDisplay(date)}
              </h4>
              
              <div className="flex items-center gap-1 xs:gap-2">
                <ClockIcon />
                <span className={combine(
                  "text-xs xs:text-sm font-medium break-words",
                  getValueForTheme("text-white/75", "text-[#006C67]")
                )}>
                  {timeDisplay}
                </span>
              </div>
            </div>

            {dayDescription && (
              <p className={combine(
                "text-sm xs:text-sm font-medium mb-2 break-words",
                getValueForTheme("text-[#54CF90]", "text-[#006C67]/80")
              )}>
                {dayDescription}
              </p>
            )}

            <div className="space-y-2">
              {hasMultipleSlots && (
                <span className={combine(
                  "text-xs px-2 py-1 rounded-full",
                  getValueForTheme(
                    "bg-purple-500/20 text-purple-300",
                    "bg-purple-100 text-purple-700"
                  )
                )}>
                  {totalTimeSlots} กิจกรรม
                </span>
              )}

              {firstTimeSlot.description && firstTimeSlot.description !== dayDescription && (
                <span className={combine(
                  "text-xs xs:text-sm leading-relaxed break-words block",
                  getValueForTheme("text-white/70", "text-[#006C67]/60")
                )}>
                  {firstTimeSlot.description}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-end xs:items-center gap-2 flex-shrink-0">
            <div className={combine(
              "text-xs px-2 py-1 rounded-full",
              getValueForTheme(
                "bg-[#54CF90]/20 text-[#54CF90]",
                "bg-[#006C67]/10 text-[#006C67]"
              )
            )}>
              วันที่ {index + 1}
            </div>

            {hasMultipleSlots && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={combine(
                  "p-1 rounded-full transition-colors",
                  getValueForTheme(
                    "text-white/60 hover:text-white hover:bg-white/10",
                    "text-[#006C67]/60 hover:text-[#006C67] hover:bg-[#006C67]/10"
                  )
                )}
              >
                <ChevronDownIcon />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {hasMultipleSlots && isExpanded && (
          <motion.div
            variants={expandableVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={combine(
              "px-3 xs:px-4 pb-3 xs:pb-4 border-t space-y-2 xs:space-y-3",
              getValueForTheme(
                "border-white/10 bg-white/3",
                "border-[#006C67]/20 bg-white"
              )
            )}>
              {timeSlots.map((timeSlot, slotIndex) => (
                <TimeSlot
                  key={slotIndex}
                  timeSlot={timeSlot}
                  slotIndex={slotIndex}
                  themeUtils={themeUtils}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Static icons
const ICONS = {
  objectives: (
    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  outcomes: (
    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
        d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  activities: (
    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  schedule: (
    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  location: (
    <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

const ProjectContentSection = React.memo<ContentSectionProps>(({ project, projectData }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeValues = useMemo(() => ({
    cardBg: getValueForTheme(
      "bg-white/5 border-white/10 shadow-black/20",
      "bg-white border border-[#006C67]/20 shadow-[#006C67]/10"
    ),
    primaryText: getValueForTheme("text-white", "text-[#006C67]"),
    secondaryText: getValueForTheme("text-white/70", "text-[#006C67]/70"),
    accentBlue: getValueForTheme("text-[#54CF90]", "text-[#006C67]"),
    bulletPoint: getValueForTheme("bg-[#54CF90]", "bg-[#006C67]"),
    locationCardBg: getValueForTheme(
      "bg-white/5 border-white/10",
      "bg-gray-50 border border-[#006C67]/20"
    ),
    locationTitle: getValueForTheme("text-white", "text-[#006C67]"),
    locationText: getValueForTheme("text-white/80", "text-[#006C67]/70"),
    contentText: getValueForTheme("text-white/80", "text-[#006C67]/80"),
  }), [getValueForTheme]);

  const renderProjectCard = useCallback((
    title: string, 
    content: React.ReactNode, 
    delay = 0.4, 
    icon?: React.ReactNode
  ) => (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={combine(
        "backdrop-blur-sm rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl",
        "p-4 xs:p-5 sm:p-6 lg:p-8 border shadow-xl",
        "mx-2 xs:mx-0", 
        themeValues.cardBg
      )}
    >
      <h2 className={combine(
        "text-lg xs:text-xl sm:text-2xl font-semibold mb-4 xs:mb-6",
        "flex items-center gap-2 xs:gap-3 break-words",
        themeValues.primaryText
      )}>
        <span className={themeValues.accentBlue}>{icon}</span>
        <span className="break-words">{title}</span>
      </h2>
      <div className={combine(
        "leading-relaxed font-light text-xs xs:text-sm sm:text-base",
        themeValues.contentText
      )}>
        {content}
      </div>
    </motion.section>
  ), [combine, themeValues]);

  const scheduleData = useMemo(() => {
    if (!projectData?.scheduleData) return null;
    
    if (typeof projectData.scheduleData === 'string') {
      try {
        return JSON.parse(projectData.scheduleData);
      } catch {
        return null;
      }
    }
    
    return projectData.scheduleData;
  }, [projectData?.scheduleData]);

  return (
    <div className="lg:col-span-2 space-y-4 xs:space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Project Description Card */}
      {project.project_description && renderProjectCard(
        "รายละเอียดกิจกรรม",
        <p className="text-sm xs:text-base leading-relaxed break-words">
          {project.project_description}
        </p>,
        0.3
      )}

      {/* Objectives Card */}
      {projectData?.objectives?.length > 0 && renderProjectCard(
        "วัตถุประสงค์", 
        <ul className="space-y-2 xs:space-y-3">
          {projectData.objectives.map((objective: string, index: number) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={combine(
                "flex items-start gap-2 xs:gap-3 text-sm xs:text-base leading-relaxed",
                themeValues.secondaryText
              )}
            >
              <span className={combine(
                "flex-shrink-0 w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full mt-1.5 xs:mt-2 ml-6 xs:ml-8 md:ml-10",
                themeValues.bulletPoint
              )} />
              <span className="break-words">{objective}</span>
            </motion.li>
          ))}
        </ul>,
        0.4,
        ICONS.objectives
      )}

      {/* Activity Hours Display Card */}
      {project.activity_hours && renderProjectCard(
        "ชั่วโมงกิจกรรม",
        <CompetencyActivitiesDisplay activityData={project.activity_hours} />,
        0.45,
        ICONS.activities
      )}

      {/* Schedule Card */}
      {scheduleData?.each_day?.length > 0 && renderProjectCard(
        "ตารางการดำเนินงาน",
        <div className="space-y-4 xs:space-y-6">
          {scheduleData.location && (
            <div className={combine(
              "p-3 xs:p-4 rounded-lg border flex items-start gap-2 xs:gap-3",
              themeValues.locationCardBg
            )}>
              <span className={combine("flex-shrink-0 relative z-10 top-1", themeValues.accentBlue)}>
                {ICONS.location}
              </span>
              <div className="flex-1 min-w-0">
                <p className={combine(
                  "text-md xs:text-sm font-medium mb-1",
                  themeValues.locationTitle
                )}>
                  สถานที่จัดกิจกรรม
                </p>
                <p className={combine(
                  "text-xs xs:text-sm leading-relaxed break-words",
                  themeValues.locationText
                )}>
                  {scheduleData.location}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3 xs:space-y-4">
            {scheduleData.each_day.map((day: any, index: number) => (
              <ScheduleItem
                key={`schedule-${index}-${day.date || index}`}
                day={day}
                index={index}
              />
            ))}
          </div>
        </div>,
        0.5,
        ICONS.schedule
      )}
      
      {/* Expected Outcomes Card */}
      {projectData?.outcomes?.length > 0 && renderProjectCard(
        "ผลลัพธ์ที่คาดหวัง", 
        <ul className="space-y-2 xs:space-y-3">
          {projectData.outcomes.map((outcome: string, index: number) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={combine(
                "flex items-start gap-2 xs:gap-3 text-sm xs:text-base leading-relaxed",
                themeValues.secondaryText
              )}
            >
              <span className={combine(
                "flex-shrink-0 w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full mt-1.5 xs:mt-2 ml-6 xs:ml-8 md:ml-10",
                themeValues.bulletPoint
              )} />
              <span className="break-words">{outcome}</span>
            </motion.li>
          ))}
        </ul>,
        0.6,
        ICONS.outcomes
      )}
    </div>
  );
});

export default ProjectContentSection;