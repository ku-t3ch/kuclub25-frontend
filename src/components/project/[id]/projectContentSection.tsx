"use client";

import React from 'react';
import { motion } from 'framer-motion';
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

const ScheduleItem = React.memo<ScheduleItemProps>(({ day, index }) => {
  const { combine, getValueForTheme } = useThemeUtils();
  const date = new Date(day.date);
  const startTime = day.time?.[0] || '';
  const endTime = day.time?.[1] || '';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={combine(
        "p-4 rounded-lg border",
        getValueForTheme(
          "bg-white/5 border-white/10",
          "bg-gray-50 border-gray-200"
        )
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className={combine(
            "font-semibold",
            getValueForTheme("text-white", "text-gray-800")
          )}>
            {formatDateForDisplay(date)}
          </h4>
          {startTime && endTime && (
            <p className={combine(
              "text-sm",
              getValueForTheme("text-blue-300", "text-primary")
            )}>
              {startTime} - {endTime} น.
            </p>
          )}
        </div>
        <div className={combine(
          "text-xs px-2 py-1 rounded-full",
          getValueForTheme(
            "bg-blue-500/20 text-blue-300",
            "bg-primary/10 text-primary"
          )
        )}>
          วันที่ {index + 1}
        </div>
      </div>
      <p className={combine(
        "text-sm leading-relaxed",
        getValueForTheme("text-white/80", "text-gray-600")
      )}>
        {day.description || 'ไม่มีรายละเอียด'}
      </p>
    </motion.div>
  );
});
ScheduleItem.displayName = "ScheduleItem";

const ProjectContentSection = React.memo<ContentSectionProps>(({ project, projectData }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeValues = {
    cardBg: getValueForTheme(
      "bg-white/5 border-white/10 shadow-blue-900/5",
      "bg-white border-gray-200 shadow-gray-200/20"
    ),
    primaryText: getValueForTheme("text-white", "text-gray-800"),
    secondaryText: getValueForTheme("text-white/70", "text-gray-600"),
    accentBlue: getValueForTheme("text-blue-300", "text-teal-700"),
  };

  const icons = {
    objectives: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    outcomes: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    activities: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    schedule: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const renderProjectCard = (title: string, content: React.ReactNode, delay = 0.4, icon?: React.ReactNode) => {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={combine(
          "backdrop-blur-sm rounded-2xl xs:rounded-3xl p-5 xs:p-6 sm:p-8 border shadow-xl",
          themeValues.cardBg
        )}
      >
        <h2 className={combine(
          "text-2xl font-bold mb-6 flex items-center gap-3",
          themeValues.primaryText
        )}>
          {icon}
          {title}
        </h2>
        <div className={combine(
          "leading-relaxed font-light text-sm xs:text-base",
          getValueForTheme("text-white/80", "text-gray-700")
        )}>
          {content}
        </div>
      </motion.section>
    );
  };

  return (
    <div className="lg:col-span-2 space-y-6 xs:space-y-8 sm:space-y-10">
      {/* Project Description Card */}
      {project.project_description && renderProjectCard(
        "รายละเอียดโครงการ",
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            {project.project_description}
          </p>
        </div>,
        0.3
      )}

      {/* Objectives Card */}
      {projectData.objectives.length > 0 && renderProjectCard(
        "วัตถุประสงค์", 
        <ul className="space-y-3">
          {projectData.objectives.map((objective: string, index: number) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={combine(
                "flex items-start gap-3 text-base leading-relaxed",
                themeValues.secondaryText
              )}
            >
              <span className={combine(
                "flex-shrink-0 w-2 h-2 rounded-full mt-2",
                themeValues.accentBlue.replace('text-', 'bg-')
              )} />
              {objective}
            </motion.li>
          ))}
        </ul>,
        0.4,
        icons.objectives
      )}

      {/* Activity Hours Display Card */}
      {project.activity_hours && renderProjectCard(
        "ชั่วโมงกิจกรรม",
        <CompetencyActivitiesDisplay activityData={project.activity_hours} />,
        0.45,
        icons.activities
      )}

      {/* Schedule Card */}
      {projectData.scheduleData?.each_day && renderProjectCard(
        "ตารางการดำเนินงาน",
        <div className="space-y-4">
          {projectData.scheduleData.each_day.map((day: any, index: number) => (
            <ScheduleItem
              key={index}
              day={day}
              index={index}
            />
          ))}
        </div>,
        0.5,
        icons.schedule
      )}
      
      {/* Expected Outcomes Card */}
      {projectData.outcomes.length > 0 && renderProjectCard(
        "ผลลัพธ์ที่คาดหวัง", 
        <ul className="space-y-3">
          {projectData.outcomes.map((outcome: string, index: number) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={combine(
                "flex items-start gap-3 text-base leading-relaxed",
                themeValues.secondaryText
              )}
            >
              <span className={combine(
                "flex-shrink-0 w-2 h-2 rounded-full mt-2",
                themeValues.accentBlue.replace('text-', 'bg-')
              )} />
              {outcome}
            </motion.li>
          ))}
        </ul>,
        0.6,
        icons.outcomes
      )}
    </div>
  );
});

ProjectContentSection.displayName = "ProjectContentSection";

export default ProjectContentSection;