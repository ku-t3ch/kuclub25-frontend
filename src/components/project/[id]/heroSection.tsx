"use client";

import React, { useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../../hooks/useThemeUtils";
import { useUpdateOrganizationViews } from "../../../hooks/useOrganization";
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

// Constants moved outside components to prevent recreation
const ACTIVITY_LABELS = {
  university_activities: "กิจกรรมมหาวิทยาลัย",
  social_activities: "กิจกรรมสังคม",
  competency_development_activities: "กิจกรรมเสริมสมรรถนะ",
} as const;

const ACTIVITY_COLORS = {
  university_activities: {
    light: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    dark: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },
  social_activities: {
    light: "bg-orange-100 text-orange-700 border border-orange-200",
    dark: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  },
  competency_development_activities: {
    light: "bg-purple-100 text-purple-700 border border-purple-200",
    dark: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  },
} as const;

const ACTIVITY_ORDER = [
  "university_activities",
  "social_activities", 
  "competency_development_activities",
] as const;

// Animation variants as constants
const ANIMATION_VARIANTS = {
  activityTag: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  backButton: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
  },
  dateCard: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  title: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.1 },
  },
  tags: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.15 },
  },
  pills: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.2 },
  },
} as const;

// Memoized SVG icons
const CalendarIcon = memo(({ className }: { className: string }) => (
  <svg
    className={className}
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
));
CalendarIcon.displayName = "CalendarIcon";

const LocationIcon = memo(({ className }: { className: string }) => (
  <svg
    className={className}
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
  </svg>
));
LocationIcon.displayName = "LocationIcon";

const OrganizationIcon = memo(({ className }: { className: string }) => (
  <svg
    className={className}
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
  </svg>
));
OrganizationIcon.displayName = "OrganizationIcon";

const BackIcon = memo(() => (
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
));
BackIcon.displayName = "BackIcon";

// Optimized ActivityTag component
const ActivityTag = memo<ActivityTagComponentProps>(({ type, hours, resolvedTheme }) => {
  const label = ACTIVITY_LABELS[type as keyof typeof ACTIVITY_LABELS] || type;
  const colors = ACTIVITY_COLORS[type as keyof typeof ACTIVITY_COLORS];

  if (!colors) return null;

  const colorClass = resolvedTheme === "dark" ? colors.dark : colors.light;

  return (
    <motion.div
      {...ANIMATION_VARIANTS.activityTag}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${colorClass}`}
    >
      <span className="truncate">{label}</span>
      <span className="ml-2 text-xs opacity-75">{hours} ชั่วโมง</span>
    </motion.div>
  );
});
ActivityTag.displayName = "ActivityTag";

// Optimized BackButton component
const BackButton = memo<BackButtonProps>(({ onClick }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const buttonClass = useMemo(() => combine(
    "flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300",
    getValueForTheme(
      "text-white/70 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10",
      "text-[#006C67]/70 hover:text-[#006C67] bg-white border border-[#006C67]/20 hover:bg-[#006C67]/5"
    )
  ), [combine, getValueForTheme]);

  return (
    <motion.button
      {...ANIMATION_VARIANTS.backButton}
      onClick={onClick}
      className={buttonClass}
    >
      <BackIcon />
      กลับ
    </motion.button>
  );
});
BackButton.displayName = "BackButton";

// Optimized InfoPill component
const InfoPill = memo<{
  icon: React.ReactNode;
  content: React.ReactNode;
  className: string;
}>(({ icon, content, className }) => (
  <div className={className}>
    {icon}
    {content}
  </div>
));
InfoPill.displayName = "InfoPill";

// Main component
const ProjectHeroSection = memo<HeroSectionProps>(({
  projectData,
  dateTimeInfo,
  activityTags,
  organizationInfo,
  resolvedTheme,
  onBack,
  onViewOrganization,
}) => {
  const { combine, getValueForTheme } = useThemeUtils();
  const { updateViews } = useUpdateOrganizationViews();

  // เพิ่ม state เพื่อป้องกันการเรียกซ้ำ
  const [isUpdatingViews, setIsUpdatingViews] = React.useState(false);

  // Memoize sorted activity tags
  const sortedActivityTags = useMemo(() => {
    return [...activityTags].sort((a, b) => {
      const indexA = ACTIVITY_ORDER.indexOf(a.type as any);
      const indexB = ACTIVITY_ORDER.indexOf(b.type as any);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  }, [activityTags]);

  // Memoize theme values
  const themeValues = useMemo(() => ({
    headerBackdrop: getValueForTheme("bg-[#ffffff]/2", "bg-[#006C67]/5"),
    dateCardBg: getValueForTheme(
      "bg-gradient-to-br from-[#006C67]/80 to-[#54CF90]/80 border border-[#54CF90]/20",
      "bg-[#006C67]/100 border border-[#006C67]/20 shadow-[#006C67]/10"
    ),
    primaryText: getValueForTheme("text-white", "text-[#006C67]"),
    accentBlue: getValueForTheme("text-white", "text-white"),
    iconColor: getValueForTheme("text-[#54CF90]/75", "text-[#006C67]/80"),
    pillBg: getValueForTheme(
      "bg-white/5 text-white/70",
      "bg-white text-[#006C67]/70 border border-[#006C67]/20"
    ),
    organizationButton: getValueForTheme(
      "text-[#54CF90] hover:text-[#54CF90]/80",
      "text-[#006C67] hover:text-[#006C67]/80"
    ),
    organizationText: getValueForTheme(
      "text-white/70",
      "text-[#006C67]/70"
    ),
  }), [getValueForTheme]);

  // Memoize icon classes
  const iconClasses = useMemo(() => ({
    calendar: `w-3.5 xs:w-4 h-3.5 xs:h-4 mr-1.5 xs:mr-2 ${themeValues.iconColor}`,
    location: `w-3.5 xs:w-4 h-3.5 xs:h-4 mr-1.5 xs:mr-2 ${themeValues.iconColor}`,
    organization: `w-3.5 xs:w-4 h-3.5 xs:h-4 mr-1.5 xs:mr-2 ${themeValues.iconColor}`,
  }), [themeValues.iconColor]);

  // Memoize pill styles
  const pillClassName = useMemo(() => combine(
    "flex items-center px-3 py-1.5 xs:py-2 backdrop-blur-sm rounded-full",
    themeValues.pillBg
  ), [combine, themeValues.pillBg]);

  // แก้ไข organization click handler
  const handleOrganizationClick = useCallback(async (orgId: string) => {
    if (isUpdatingViews) return; // ป้องกันการคลิกซ้ำ
    
    setIsUpdatingViews(true);
    
    try {
      const newViewCount = await updateViews(orgId);
      
      if (newViewCount !== null) {
        console.log(`อัพเดทจำนวนการดูองค์กรเป็น: ${newViewCount}`);
      }

      onViewOrganization(orgId);
    } catch (error) {
      console.warn("ไม่สามารถอัพเดทจำนวนการดูองค์กรได้:", error);
      onViewOrganization(orgId);
    } finally {
      // รอสักครู่ก่อน reset state
      setTimeout(() => setIsUpdatingViews(false), 1000);
    }
  }, [updateViews, onViewOrganization, isUpdatingViews]);

  // Memoize date display text
  const dateDisplayText = useMemo(() => {
    if (!dateTimeInfo?.isMultiDay) {
      return dateTimeInfo?.startDate;
    }
    return `${dateTimeInfo.startDate} - ${dateTimeInfo.endDate}`;
  }, [dateTimeInfo]);

  return (
    <div className="relative mb-6 xs:mb-8 sm:mb-10">
      <div className={combine("absolute inset-0 backdrop-blur-sm", themeValues.headerBackdrop)} />
      
      <div className="container relative mx-auto px-4 xs:px-5 sm:px-6 py-8 xs:py-10 sm:py-12 max-w-6xl">
        <BackButton onClick={onBack} />

        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
          {/* Date Card */}
          <motion.div
            {...ANIMATION_VARIANTS.dateCard}
            className={combine(
              "flex-shrink-0 backdrop-blur-md rounded-2xl p-4 xs:p-5 sm:p-6 text-center w-28 xs:w-30 sm:w-32 h-30 xs:h-35 sm:h-40 flex flex-col justify-center shadow-lg mx-auto md:mx-0",
              themeValues.dateCardBg
            )}
          >
            <div className={combine(
              "text-sm xs:text-base font-medium uppercase tracking-wider mb-2",
              themeValues.accentBlue
            )}>
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
              {...ANIMATION_VARIANTS.title}
              className={combine(
                "text-2xl xs:text-3xl md:text-4xl font-light mb-4 xs:mb-5 leading-tight",
                themeValues.primaryText
              )}
            >
              {projectData.displayName}
            </motion.h1>

            {/* Activity Tags */}
            {sortedActivityTags.length > 0 && (
              <motion.div
                {...ANIMATION_VARIANTS.tags}
                className="flex flex-wrap justify-center md:justify-start gap-2 mb-4"
              >
                {sortedActivityTags.map((tag, index) => (
                  <ActivityTag
                    key={`${tag.type}-${index}`}
                    type={tag.type}
                    hours={tag.hours}
                    resolvedTheme={resolvedTheme}
                  />
                ))}
              </motion.div>
            )}

            {/* Info Pills */}
            <motion.div
              {...ANIMATION_VARIANTS.pills}
              className="flex flex-wrap justify-center md:justify-start gap-y-2 xs:gap-y-3 gap-x-3 xs:gap-x-4 sm:gap-x-6 text-xs xs:text-sm"
            >
              {/* Date Range Pill */}
              {projectData.startDate && (
                <InfoPill
                  icon={<CalendarIcon className={iconClasses.calendar} />}
                  content={<span className="ml-0.5">{dateDisplayText}</span>}
                  className={pillClassName}
                />
              )}

              {/* Location Pill */}
              {projectData.location && (
                <InfoPill
                  icon={<LocationIcon className={iconClasses.location} />}
                  content={<span>{projectData.location}</span>}
                  className={pillClassName}
                />
              )}

              {/* Organization Pill */}
              {organizationInfo.name && (
                <InfoPill
                  icon={<OrganizationIcon className={iconClasses.organization} />}
                  content={
                    <span>
                      จัดโดย:{" "}
                      {organizationInfo.isValid ? (
                        <button
                          onClick={() => handleOrganizationClick(organizationInfo.id!)}
                          disabled={isUpdatingViews}
                          className={combine(
                            "transition-colors cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-not-allowed",
                            themeValues.organizationButton
                          )}
                        >
                          {isUpdatingViews ? "กำลังโหลด..." : organizationInfo.name}
                        </button>
                      ) : (
                        <span className={themeValues.organizationText}>
                          {organizationInfo.name}
                        </span>
                      )}
                    </span>
                  }
                  className={pillClassName}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectHeroSection.displayName = "ProjectHeroSection";

export default ProjectHeroSection;