"use client";

import React from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../../hooks/useThemeUtils";
import ProjectCardDateDisplay from "../../ui/dateDisplay";

interface ActivityTag {
  type: string;
  hours: number;
}

interface ActivityTagComponentProps {
  type: string;
  hours: number;
  resolvedTheme: "light" | "dark";
}

interface BackButtonProps {
  onClick: () => void;
}

interface HeroSectionProps {
  projectData: any;
  dateTimeInfo: any;
  activityTags: ActivityTag[];
  organizationInfo: any;
  resolvedTheme: "light" | "dark";
  onBack: () => void;
  onViewOrganization: (orgId: string) => void;
}

const ActivityTag = React.memo<ActivityTagComponentProps>(
  ({ type, hours, resolvedTheme }) => {
    const ACTIVITY_LABELS = {
      social_activities: "กิจกรรมสังคม",
      university_activities: "กิจกรรมมหาวิทยาลัย",
      competency_development_activities: "กิจกรรมเสริมสมรรถนะ",
    };

    const ACTIVITY_COLORS = {
      social_activities: {
        light: "bg-[#006C67]/10 text-[#006C67] border border-[#006C67]/20",
        dark: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
      },
      university_activities: {
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        dark: "bg-green-500/20 text-green-300 border border-green-500/30",
      },
      competency_development_activities: {
        light: "bg-purple-50 text-purple-700 border border-purple-200",
        dark: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
      },
    };

    const label = ACTIVITY_LABELS[type as keyof typeof ACTIVITY_LABELS] || type;
    const colors = ACTIVITY_COLORS[type as keyof typeof ACTIVITY_COLORS];

    if (!colors) return null;

    const colorClass = resolvedTheme === "dark" ? colors.dark : colors.light;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${colorClass}`}
      >
        <span className="truncate">{label}</span>
        <span className="ml-2 text-xs opacity-75">{hours} ชั่วโมง</span>
      </motion.div>
    );
  }
);
ActivityTag.displayName = "ActivityTag";

const BackButton = React.memo<BackButtonProps>(({ onClick }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={combine(
        "flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300",
        getValueForTheme(
          "text-white/70 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10",
          "text-[#006C67]/70 hover:text-[#006C67] bg-white border border-[#006C67]/20 hover:bg-[#006C67]/5"
        )
      )}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      กลับ
    </motion.button>
  );
});
BackButton.displayName = "BackButton";

const ProjectHeroSection = React.memo<HeroSectionProps>(
  ({
    projectData,
    dateTimeInfo,
    activityTags,
    organizationInfo,
    resolvedTheme,
    onBack,
    onViewOrganization,
  }) => {
    const { combine, getValueForTheme } = useThemeUtils();

    const themeValues = {
      headerBackdrop: getValueForTheme("bg-[#ffffff]/2", "bg-[#006C67]/5"),
      dateCardBg: getValueForTheme(
        "bg-gradient-to-br from-[#006C67]/80 to-[#54CF90]/80 border border-[#54CF90]/20",
        "bg-[#006C67]/100 border border-[#006C67]/20 shadow-[#006C67]/10 "
      ),
      primaryText: getValueForTheme("text-white", "text-[#006C67]"),
      accentBlue: getValueForTheme("text-white", "text-white"),
      iconColor: getValueForTheme("text-[#54CF90]/75", "text-[#006C67]/80"),
      pillBg: getValueForTheme(
        "bg-white/5 text-white/70",
        "bg-white text-[#006C67]/70 border border-[#006C67]/20"
      ),
    };

    const icons = {
      calendar: (
        <svg
          className={`w-3.5 xs:w-4 h-3.5 xs:h-4 mr-1.5 xs:mr-2 ${themeValues.iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    };

    const renderInfoPill = (
      icon: React.ReactNode,
      content: React.ReactNode
    ) => {
      return (
        <div
          className={combine(
            "flex items-center px-3 py-1.5 xs:py-2 backdrop-blur-sm rounded-full",
            themeValues.pillBg
          )}
        >
          {icon}
          {content}
        </div>
      );
    };

    return (
      <div className="relative mb-6 xs:mb-8 sm:mb-10">
        <div
          className={combine(
            "absolute inset-0 backdrop-blur-sm",
            themeValues.headerBackdrop
          )}
        ></div>
        <div className="container relative mx-auto px-4 xs:px-5 sm:px-6 py-8 xs:py-10 sm:py-12 max-w-6xl">
          <BackButton onClick={onBack} />

          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            {/* Date Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={combine(
                "flex-shrink-0 backdrop-blur-md rounded-2xl p-4 xs:p-5 sm:p-6 text-center w-28 xs:w-30 sm:w-32 h-30 xs:h-35 sm:h-40 flex flex-col justify-center shadow-lg mx-auto md:mx-0 ",
                themeValues.dateCardBg
              )}
            >
              <div
                className={combine(
                  "text-sm xs:text-base font-medium uppercase tracking-wider mb-2 ",
                  themeValues.accentBlue
                )}
              >
                {projectData.month}
              </div>

              <ProjectCardDateDisplay
                isMultiDayProject={projectData.isMultiDay}
                startDateTime={projectData.startDateTime}
                endDateTime={projectData.endDateTime}
                dayStart={projectData.day}
                dayEnd={projectData.endDateTime?.getDate().toString()}
                day={projectData.day}
              />
            </motion.div>

            {/* Project Title and Info */}
            <div className="flex-grow text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={combine(
                  "text-2xl xs:text-3xl md:text-4xl font-light mb-4 xs:mb-5 leading-tight",
                  themeValues.primaryText
                )}
              >
                {projectData.displayName}
              </motion.h1>

              {/* Activity Tags */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex flex-wrap justify-center md:justify-start gap-2 mb-4"
              >
                {activityTags.map((tag, index) => (
                  <ActivityTag
                    key={`${tag.type}-${index}`}
                    type={tag.type}
                    hours={tag.hours}
                    resolvedTheme={resolvedTheme}
                  />
                ))}
              </motion.div>

              {/* Info Pills */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-wrap justify-center md:justify-start gap-y-2 xs:gap-y-3 gap-x-3 xs:gap-x-4 sm:gap-x-6 text-xs xs:text-sm"
              >
                {/* Date Range Pill */}
                {projectData.startDate &&
                  renderInfoPill(
                    icons.calendar,
                    <span className={combine("ml-0.5", )}>
                      {dateTimeInfo?.isMultiDay
                        ? `${dateTimeInfo.startDate} - ${dateTimeInfo.endDate}`
                        : dateTimeInfo?.startDate}
                    </span>
                  )}

                {/* Location Pill */}
                {projectData.location &&
                  renderInfoPill(
                    <svg
                      className={combine(
                        "w-3.5 xs:w-4 h-3.5 xs:h-4 mr-1.5 xs:mr-2",
                        themeValues.iconColor
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>,
                    <span>{projectData.location}</span>
                  )}

                {/* Organizer Pill */}
                {organizationInfo.name &&
                  renderInfoPill(
                    <svg
                      className={combine(
                        "w-3.5 xs:w-4 h-3.5 xs:h-4 mr-1.5 xs:mr-2",
                        themeValues.iconColor
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>,
                    <span>
                      จัดโดย:{" "}
                      {organizationInfo.isValid ? (
                        <span
                          onClick={() =>
                            onViewOrganization(organizationInfo.id!)
                          }
                          className={getValueForTheme(
                            "text-[#54CF90] hover:text-blue-300 transition-colors cursor-pointer",
                            "text-[#006C67] hover:text-[#006C67]/80 transition-colors cursor-pointer"
                          )}
                        >
                          {organizationInfo.name}
                        </span>
                      ) : (
                        <span
                          className={getValueForTheme(
                            "text-white/70",
                            "text-[#006C67]/70"
                          )}
                        >
                          {organizationInfo.name}
                        </span>
                      )}
                    </span>
                  )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProjectHeroSection.displayName = "ProjectHeroSection";

export default ProjectHeroSection;
