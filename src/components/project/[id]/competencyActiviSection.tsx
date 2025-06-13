import React from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../../hooks/useThemeUtils";
import { ACTIVITY_LABELS, competencyNames } from "../../../constants/activity";

interface CompetencyActivitiesDisplayProps {
  activityData: any;
}

// Activity icons - optimized with proper sizing
const activityIcons = {
  university: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  social: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  competency: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  summary: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
} as const;

const ActivityContentWithTheme: React.FC<CompetencyActivitiesDisplayProps> = ({ activityData }) => {
  const { getValueForTheme, combine } = useThemeUtils();

  // Safety check for activityData structure
  if (!activityData) {
    return (
      <div className={combine(
        "p-4 rounded-lg text-center italic",
        "text-sm sm:text-base",
        getValueForTheme("text-white/50", "text-[#006C67]/60")
      )}>
        ไม่มีข้อมูลกิจกรรม
      </div>
    );
  }

  // Optimized calculation function with memoization potential
  const calculateTotalHours = React.useMemo(() => {
    let total = 0;
    
    if (activityData.university_activities) {
      total += activityData.university_activities;
    }
    
    if (activityData.social_activities) {
      total += activityData.social_activities;
    }
    
    if (activityData.competency_development_activities) {
      total += Object.values(activityData.competency_development_activities)
        .reduce((sum: number, hours: any) => sum + (Number(hours) || 0), 0);
    }
    
    return total;
  }, [activityData]);

  // Animation variants - optimized for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 8, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.15,
        ease: "easeOut"
      },
    },
  };

  // Shared styling for activity items
  const activityItemClasses = combine(
    "flex items-center justify-between gap-3",
    "p-3 sm:p-4 rounded-xl transition-colors duration-200",
    getValueForTheme(
      "bg-white/5 border border-white/10 hover:bg-white/8",
      "bg-white border border-[#006C67]/20 hover:bg-[#006C67]/5 shadow-sm"
    )
  );

  const iconContainerClasses = combine(
    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
    getValueForTheme(
      "bg-[#54CF90]/20 text-[#54CF90]",
      "bg-[#006C67]/15 text-[#006C67]"
    )
  );

  const badgeClasses = combine(
    "px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap",
    getValueForTheme(
      "bg-[#54CF90]/20 text-[#54CF90]",
      "bg-[#006C67]/15 text-[#006C67]"
    )
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 max-w-4xl mx-auto"
    >
      {/* Summary Card */}
      <motion.div variants={itemVariants}>
        <div className={activityItemClasses}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={iconContainerClasses}>
              {activityIcons.summary}
            </div>
            <span className={combine(
              "text-sm sm:text-base font-medium truncate",
              getValueForTheme("text-white/90", "text-[#006C67]/90")
            )}>
              รวมทั้งหมด
            </span>
          </div>
          <div className={badgeClasses}>
            {calculateTotalHours} ชั่วโมง
          </div>
        </div>
      </motion.div>

      {/* Section Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-2">
      
        <h3 className={combine(
          "text-sm sm:text-base font-medium",
          getValueForTheme("text-white/90", "text-[#006C67]/90")
        )}>
          ประเภทกิจกรรม
        </h3>
      </motion.div>

      {/* Activity Items */}
      <div className="space-y-3 sm:space-y-4">
        {/* University Activities */}
        {activityData.university_activities !== undefined && (
          <motion.div variants={itemVariants} className={activityItemClasses}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={iconContainerClasses}>
                {activityIcons.university}
              </div>
              <span className={combine(
                "text-sm sm:text-base line-clamp-2",
                getValueForTheme("text-white/90", "text-[#006C67]/90")
              )}>
                {ACTIVITY_LABELS.university_activities}
              </span>
            </div>
            <div className={badgeClasses}>
              {activityData.university_activities} ชั่วโมง
            </div>
          </motion.div>
        )}

        {/* Social Activities */}
        {activityData.social_activities !== undefined && (
          <motion.div variants={itemVariants} className={activityItemClasses}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={iconContainerClasses}>
                {activityIcons.social}
              </div>
              <span className={combine(
                "text-sm sm:text-base line-clamp-2",
                getValueForTheme("text-white/90", "text-[#006C67]/90")
              )}>
                {ACTIVITY_LABELS.social_activities}
              </span>
            </div>
            <div className={badgeClasses}>
              {activityData.social_activities} ชั่วโมง
            </div>
          </motion.div>
        )}

        {/* Competency Development Activities */}
        {activityData.competency_development_activities && 
         Object.keys(activityData.competency_development_activities).length > 0 && (
          <motion.div variants={itemVariants}>
            <div className={combine(
              "p-3 sm:p-4 rounded-xl space-y-3 sm:space-y-4",
              getValueForTheme(
                "bg-white/5 border border-white/10",
                "bg-white border border-[#006C67]/20 shadow-sm"
              )
            )}>
              {/* Competency Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={iconContainerClasses}>
                    {activityIcons.competency}
                  </div>
                  <h4 className={combine(
                    "text-sm sm:text-base  line-clamp-2",
                    getValueForTheme("text-white/90", "text-[#006C67]/90")
                  )}>
                    {ACTIVITY_LABELS.competency_development_activities}
                  </h4>
                </div>
                <div className={badgeClasses}>
                  {Object.values(activityData.competency_development_activities)
                    .reduce((sum: number, hours: any) => sum + (Number(hours) || 0), 0)} ชั่วโมง
                </div>
              </div>

              {/* Competency Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                {Object.entries(competencyNames)
                  .filter(([key]) => {
                    const hours = activityData.competency_development_activities?.[key];
                    return hours !== undefined && Number(hours) > 0;
                  })
                  .map(([key, name]) => {
                    const hours = activityData.competency_development_activities[key];
                    
                    return (
                      <motion.div
                        key={key}
                        variants={itemVariants}
                        className={combine(
                          "flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-lg",
                          getValueForTheme(
                            "bg-white/5 border border-white/10",
                            "bg-[#006C67]/5 border border-[#006C67]/20"
                          )
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className={combine(
                            "h-1 w-1 rounded-full flex-shrink-0",
                            getValueForTheme("bg-[#54CF90]", "bg-[#006C67]")
                          )} />
                          <span className={combine(
                            "text-xs sm:text-sm line-clamp-2",
                            getValueForTheme("text-white/85", "text-[#006C67]/80")
                          )}>
                            {name}
                          </span>
                        </div>
                        <span className={combine(
                          "text-xs sm:text-sm font-medium whitespace-nowrap",
                          getValueForTheme("text-white/70", "text-[#006C67]/70")
                        )}>
                          {hours} ชั่วโมง
                        </span>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const CompetencyActivitiesDisplay: React.FC<CompetencyActivitiesDisplayProps> = ({ 
  activityData 
}) => {
  return <ActivityContentWithTheme activityData={activityData} />;
};

export default CompetencyActivitiesDisplay;