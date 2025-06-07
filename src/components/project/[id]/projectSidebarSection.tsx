"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeUtils } from '../../../hooks/useThemeUtils';

interface DateInfoCardProps {
  icon: React.ReactNode;
  label: string;
  date: string | React.ReactNode;
  time?: string | null;
}

interface SidebarSectionProps {
  dateTimeInfo: any;
  projectData: any;
  organization: any;
  organizationInfo: any;
  orgLoading: boolean;
  onViewOrganization: (orgId: string) => void;
}

const DateInfoCard = React.memo<DateInfoCardProps>(({ icon, label, date, time }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeValues = {
    iconBg: getValueForTheme(
      "bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 shadow-blue-900/10",
      "bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 shadow-teal-900/5"
    ),
    accentColor: getValueForTheme("text-blue-300", "text-teal-700"),
    primaryText: getValueForTheme("text-white", "text-gray-800"),
    accentBg: getValueForTheme("bg-blue-500/10 border-blue-500/20", "bg-teal-50 border-teal-200"),
    secondaryText: getValueForTheme("text-white/70", "text-gray-600"),
  };

  return (
    <div className="flex items-start">
      <div className={combine(
        "w-9 xs:w-10 h-9 xs:h-10 rounded-full flex items-center justify-center mr-3 xs:mr-4 shadow-lg flex-shrink-0",
        themeValues.iconBg
      )}>
        {icon}
      </div>
      <div className="flex-grow">
        <div className={combine(
          "text-xs xs:text-sm uppercase tracking-wider mb-1 font-medium",
          themeValues.accentColor
        )}>
          {label}
        </div>
        <div className={combine(
          "text-base xs:text-lg font-light",
          themeValues.primaryText
        )}>
          {date}
        </div>
        {time && (
          <div className="mt-1 text-xs xs:text-sm">
            <div className={combine(
              "flex items-center",
              themeValues.secondaryText
            )}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{time}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
DateInfoCard.displayName = "DateInfoCard";

const ProjectSidebarSection = React.memo<SidebarSectionProps>(({
  dateTimeInfo,
  projectData,
  organization,
  organizationInfo,
  orgLoading,
  onViewOrganization
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeValues = {
    cardBg: getValueForTheme(
      "bg-white/5 border-white/10 shadow-blue-900/5",
      "bg-white border-gray-200 shadow-gray-200/20"
    ),
    primaryText: getValueForTheme("text-white", "text-gray-800"),
    secondaryText: getValueForTheme("text-white/70", "text-gray-600"),
    accentBlueBg: getValueForTheme("bg-blue-500/10 border-blue-500/20", "bg-teal-50 border-teal-200"),
    buttonPrimary: getValueForTheme(
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-900/20 hover:shadow-blue-900/30",
      "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-teal-600/20 hover:shadow-teal-600/30"
    ),
  };

  const icons = {
    calendar: (
      <svg className={`w-4 h-4 ${getValueForTheme("text-blue-400", "text-teal-600")}`} 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    checkmark: (
      <svg className={`w-4 h-4 ${getValueForTheme("text-green-400", "text-green-600")}`}
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M5 13l4 4L19 7" />
      </svg>
    ),
    clock: (
      <svg className={`w-4 h-4 mr-2 ${getValueForTheme("text-blue-400", "text-teal-600")}`}
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    arrow: (
      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    )
  };

  return (
    <div className="space-y-6 xs:space-y-8 sm:space-y-10">
      {/* Event Date Info Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={combine(
          "backdrop-blur-md p-5 xs:p-6 sm:p-8 rounded-2xl xs:rounded-3xl border shadow-xl",
          themeValues.cardBg
        )}
      >
        <h3 className={combine(
          "text-lg font-bold mb-4 flex items-center gap-2",
          themeValues.primaryText
        )}>
          {dateTimeInfo?.isMultiDay ? "ระยะเวลากิจกรรม" : "วันที่จัดกิจกรรม"}
        </h3>

        <div className="space-y-4 xs:space-y-5 sm:space-y-6">
          {!dateTimeInfo?.isMultiDay ? (
            <DateInfoCard 
              icon={icons.calendar}
              label="วันที่จัดกิจกรรม"
              date={dateTimeInfo?.startDate || "ไม่ระบุวันที่"}
              time={dateTimeInfo?.startTime}
            />
          ) : (
            <>
              <DateInfoCard 
                icon={icons.calendar}
                label="วันที่เริ่มต้น"
                date={dateTimeInfo?.startDate || "ไม่ระบุวันที่"}
                time={dateTimeInfo?.startTime}
              />

              {projectData.endDateTime && (
                <DateInfoCard 
                  icon={icons.checkmark}
                  label="วันที่สิ้นสุด"
                  date={dateTimeInfo?.endDate || "ไม่ระบุวันที่"}
                  time={dateTimeInfo?.endTime}
                />
              )}

              <div className={combine(
                "mt-3 rounded-lg p-2 xs:p-3 border text-xs xs:text-sm",
                themeValues.accentBlueBg
              )}>
                <div className={combine(
                  "flex items-center justify-center",
                  themeValues.secondaryText
                )}>
                  {icons.clock}
                  <span>รวมระยะเวลา: {projectData.durationDays} วัน</span>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Organization Info Card */}
      {organization && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={combine(
            "backdrop-blur-lg rounded-2xl p-6 shadow-xl border",
            themeValues.cardBg
          )}
        >
          <h3 className={combine(
            "text-lg font-bold mb-4 flex items-center gap-2",
            themeValues.primaryText
          )}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            จัดโดย
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className={combine("font-semibold", themeValues.primaryText)}>
                {organization.org_nickname || organization.orgnameth}
              </h4>
              {organization.org_nickname && (
                <p className={combine("text-sm", themeValues.secondaryText)}>
                  {organization.orgnameth}
                </p>
              )}
            </div>
            {organization.org_type_name && (
              <div className={combine(
                "inline-block px-3 py-1 rounded-full text-xs font-medium",
                getValueForTheme(
                  "bg-blue-500/20 text-blue-300",
                  "bg-primary/10 text-primary"
                )
              )}>
                {organization.org_type_name}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Activity formats */}
      {projectData.formats && projectData.formats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={combine(
            "backdrop-blur-lg rounded-2xl p-6 shadow-xl border",
            themeValues.cardBg
          )}
        >
          <h3 className={combine(
            "text-lg font-bold mb-4 flex items-center gap-2",
            themeValues.primaryText
          )}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            รูปแบบกิจกรรม
          </h3>
          <div className="flex flex-wrap gap-2">
            {projectData.formats.map((format: string, index: number) => (
              <span
                key={index}
                className={combine(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  getValueForTheme(
                    "bg-purple-500/20 text-purple-300 border border-purple-500/30",
                    "bg-purple-50 text-purple-600 border border-purple-200"
                  )
                )}
              >
                {format}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Organization Details Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        {organizationInfo.isValid ? (
          <button
            onClick={() => onViewOrganization(organizationInfo.id!)}
            disabled={orgLoading}
            className={combine(
              "group block w-full text-white text-center py-3 xs:py-3.5 sm:py-4 px-4 xs:px-5 sm:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm xs:text-base disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none",
              themeValues.buttonPrimary
            )}
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">
                {orgLoading ? "กำลังโหลด..." : "ดูข้อมูลองค์กร"}
              </span>
              {!orgLoading && icons.arrow}
            </span>
          </button>
        ) : (
          <button
            disabled
            className={combine(
              "block w-full text-center py-3 xs:py-3.5 sm:py-4 px-4 xs:px-5 sm:px-6 rounded-xl cursor-not-allowed text-sm xs:text-base",
              getValueForTheme(
                "bg-white/10 text-white/50",
                "bg-gray-100 text-gray-400"
              )
            )}
          >
            ไม่มีข้อมูลองค์กร
          </button>
        )}
      </motion.div>
    </div>
  );
});

ProjectSidebarSection.displayName = "ProjectSidebarSection";

export default ProjectSidebarSection;