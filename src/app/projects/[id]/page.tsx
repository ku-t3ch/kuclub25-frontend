"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useThemeUtils } from '../../../hooks/useThemeUtils';
import { useProjectDetail } from '../../../hooks/useProject';
import { useOrganizationDetail } from '../../../hooks/useOrganization';
import NavBar from '../../../components/layout/Navbar';
import ProjectHeroSection from '../../../components/project/[id]/heroSection';
import ProjectContentSection from '../../../components/project/[id]/projectContentSection';
import ProjectSidebarSection from '../../../components/project/[id]/projectSidebarSection';

// Loading component
const LoadingSpinner = React.memo(() => {
  const { combine, getValueForTheme } = useThemeUtils();
  
  return (
    <div className={combine(
      "min-h-screen pt-16 md:pt-20 flex items-center justify-center",
      getValueForTheme(
        "bg-gradient-to-b from-[#051D35] to-[#091428]",
        "bg-gradient-to-b from-white to-gray-50"
      )
    )}>
      <div className="text-center">
        <div className={combine(
          "w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4",
          getValueForTheme("border-blue-400", "border-primary")
        )} />
        <p className={combine(
          "text-lg",
          getValueForTheme("text-white/70", "text-gray-600")
        )}>
          กำลังโหลดข้อมูลโครงการ...
        </p>
      </div>
    </div>
  );
});
LoadingSpinner.displayName = "LoadingSpinner";

// Error component
const ErrorMessage = React.memo<{
  onBack: () => void;
  error?: string | null;
}>(({ onBack, error }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  return (
    <div className={combine(
      "min-h-screen pt-16 md:pt-20 flex items-center justify-center",
      getValueForTheme(
        "bg-gradient-to-b from-[#051D35] to-[#091428]",
        "bg-gradient-to-b from-white to-gray-50"
      )
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className={combine(
          "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center",
          getValueForTheme("bg-red-500/20", "bg-red-50")
        )}>
          <svg className={combine(
            "w-8 h-8",
            getValueForTheme("text-red-400", "text-red-500")
          )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className={combine("text-2xl font-bold mb-4", getValueForTheme("text-white", "text-gray-800"))}>
          ไม่พบข้อมูลโครงการ
        </h1>
        <p className={combine("mb-6", getValueForTheme("text-white/70", "text-gray-600"))}>
          {error || "ไม่สามารถโหลดข้อมูลโครงการได้"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className={combine(
            "px-6 py-3 rounded-lg font-medium transition-all duration-300 text-white shadow-lg",
            getValueForTheme(
              "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
              "bg-gradient-to-r from-primary to-teal-700 hover:from-teal-700 hover:to-teal-800"
            )
          )}
        >
          กลับหน้าก่อนหน้า
        </motion.button>
      </motion.div>
    </div>
  );
});
ErrorMessage.displayName = "ErrorMessage";

const DetailProjectPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { combine, getValueForTheme, resolvedTheme } = useThemeUtils();

  // Fetch project data
  const { project, loading: projectLoading, error: projectError } = useProjectDetail(id);
  
  // Extract organization ID and fetch organization data
  const orgId = project?.organization_orgid;
  const { organization, loading: orgLoading } = useOrganizationDetail(orgId || null);

  // Memoized organization info to prevent recalculation
  const organizationInfo = useMemo(() => ({
    id: project?.organization_orgid,
    name: project?.org_nickname || project?.org_name_th || project?.org_name_en || "ไม่ระบุชมรม",
    isValid: !!project?.organization_orgid,
  }), [project?.organization_orgid, project?.org_nickname, project?.org_name_th, project?.org_name_en]);

  // Memoized theme values for performance
  const themeValues = useMemo(() => ({
    containerBg: getValueForTheme(
      "bg-gradient-to-b from-[#051D35] to-[#0A1A2F] text-white",
      "bg-gradient-to-b from-white to-gray-50 text-gray-800"
    ),
  }), [getValueForTheme]);

  // Memoized processed project data
  const projectData = useMemo(() => {
    if (!project) return null;

    // Process activity hours
    const activityTags = [];
    if (project.activity_hours && typeof project.activity_hours === 'object') {
      const hours = project.activity_hours;
      
      if (hours.social_activities) {
        activityTags.push({ type: 'social_activities', hours: hours.social_activities });
      }
      
      if (hours.university_activities) {
        activityTags.push({ type: 'university_activities', hours: hours.university_activities });
      }
      
      if (hours.competency_development_activities) {
        if (typeof hours.competency_development_activities === 'object') {
          const totalHours = Object.values(hours.competency_development_activities)
            .filter((h): h is number => typeof h === 'number')
            .reduce((sum, h) => sum + h, 0);
          if (totalHours > 0) {
            activityTags.push({ type: 'competency_development_activities', hours: totalHours });
          }
        } else if (typeof hours.competency_development_activities === 'number') {
          activityTags.push({ type: 'competency_development_activities', hours: hours.competency_development_activities });
        }
      }
    }

    // Process schedule
    let scheduleData = null;
    if (project.schedule && typeof project.schedule === 'object' && project.schedule.each_day) {
      scheduleData = project.schedule;
    }

    // Process activity formats
    const formats = Array.isArray(project.activity_format) 
      ? project.activity_format 
      : typeof project.activity_format === 'string' 
        ? [project.activity_format] 
        : [];

    // Process expected outcomes
    const outcomes = Array.isArray(project.expected_project_outcome) 
      ? project.expected_project_outcome 
      : typeof project.expected_project_outcome === 'string' 
        ? [project.expected_project_outcome] 
        : [];

    // Process objectives
    const objectives = Array.isArray(project.project_objectives) 
      ? project.project_objectives 
      : typeof project.project_objectives === 'string' 
        ? [project.project_objectives] 
        : [];

    // Calculate duration and check if multi-day
    const startDate = project.date_start_the_project || project.date_start ? 
      new Date(project.date_start_the_project || project.date_start) : null;
    const endDate = project.date_end_the_project || project.date_end ? 
      new Date(project.date_end_the_project || project.date_end) : null;
    
    const isMultiDay = startDate && endDate && 
      startDate.toDateString() !== endDate.toDateString();
    
    const durationDays = startDate && endDate ? 
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 1;

    return {
      ...project,
      activityTags,
      scheduleData,
      formats,
      outcomes,
      objectives,
      displayName: project.project_name_th || project.name_th || 
                   project.project_name_en || project.name_en || 
                   'ไม่ระบุชื่อโครงการ',
      startDate: startDate,
      endDate: endDate,
      location: scheduleData?.location || project.project_location || project.location || 'ไม่ระบุสถานที่',
      isMultiDay,
      durationDays,
      startDateTime: startDate,
      endDateTime: endDate,
      month: startDate ? startDate.toLocaleDateString('th-TH', { month: 'short' }) : '?',
      day: startDate ? startDate.getDate().toString() : '?'
    };
  }, [project]);

  // Memoized date and time formatting
  const dateTimeInfo = useMemo(() => {
    if (!projectData) return null;

    return {
      isMultiDay: projectData.isMultiDay,
      startDate: projectData.startDateTime?.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      endDate: projectData.endDateTime?.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long", 
        day: "numeric",
      }),
      startTime: projectData.startDateTime && 
        `เวลา ${projectData.startDateTime.toLocaleTimeString("th-TH", { 
          hour: "2-digit", 
          minute: "2-digit" 
        })} น.`,
      endTime: projectData.endDateTime && 
        `เวลา ${projectData.endDateTime.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        })} น.`
    };
  }, [projectData]);

  // Handler for viewing organization details
  const handleViewOrganizationDetails = useCallback((orgId: string) => {
    if (orgId) {
      router.push(`/organizations/${orgId}`);
    }
  }, [router]);

  // Handle back navigation
  const handleBackNavigation = useCallback(() => {
    router.back();
  }, [router]);

  // Effect for error handling
  useEffect(() => {
    if (projectError) {
      console.error('Error loading project:', projectError);
    }
  }, [projectError]);

  // Handle loading state
  if (projectLoading) {
    return (
      <div className={themeValues.containerBg}>
        <NavBar />
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state
  if (projectError || !project || !projectData) {
    return (
      <div className={themeValues.containerBg}>
        <NavBar />
        <ErrorMessage onBack={handleBackNavigation} error={projectError} />
      </div>
    );
  }

  return (
    <div className={combine("min-h-screen", themeValues.containerBg)}>
      <NavBar />
      <div className="h-16 xs:h-18 sm:h-20" />

      <ProjectHeroSection
        projectData={projectData}
        dateTimeInfo={dateTimeInfo}
        activityTags={projectData.activityTags}
        organizationInfo={organizationInfo}
        resolvedTheme={resolvedTheme}
        onBack={handleBackNavigation}
        onViewOrganization={handleViewOrganizationDetails}
      />

      {/* Main Content Section */}
      <div className="container mx-auto px-4 xs:px-5 sm:px-6 pb-12 xs:pb-14 sm:pb-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10">
          <ProjectContentSection
            project={project}
            projectData={projectData}
          />

          <ProjectSidebarSection
            dateTimeInfo={dateTimeInfo}
            projectData={projectData}
            organization={organization}
            organizationInfo={organizationInfo}
            orgLoading={orgLoading}
            onViewOrganization={handleViewOrganizationDetails}
          />
        </div>
      </div>

      {/* Visual separator */}
      <div className={combine(
        "relative h-px mx-auto w-[90%] xs:w-[80%] sm:w-[70%] my-4 xs:my-6 sm:my-8",
        getValueForTheme(
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        )
      )}></div>
    </div>
  );
};

export default React.memo(DetailProjectPage);