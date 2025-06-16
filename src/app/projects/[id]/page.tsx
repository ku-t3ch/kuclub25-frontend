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

// Loading skeleton component for project details
const ProjectDetailSkeleton = React.memo(() => {
  const { combine, getValueForTheme } = useThemeUtils();
  
  const skeletonClasses = useMemo(() => ({
    container: combine(
      "min-h-screen",
      getValueForTheme(
        "bg-[#ffff]/2",
        "bg-gradient-to-b from-white to-gray-50"
      )
    ),
    card: combine(
      "rounded-xl border overflow-hidden",
      getValueForTheme(
        "bg-white/5 border-white/10 backdrop-blur-sm",
        "bg-white border-gray-200"
      )
    ),
    skeleton: {
      base: combine(
        "animate-pulse rounded",
        getValueForTheme("bg-white/10", "bg-gray-200")
      ),
      image: combine(
        "animate-pulse rounded-lg",
        getValueForTheme("bg-white/15", "bg-gray-300")
      ),
      text: combine(
        "animate-pulse rounded",
        getValueForTheme("bg-white/8", "bg-gray-200")
      ),
      button: combine(
        "animate-pulse rounded-lg",
        getValueForTheme("bg-white/15", "bg-gray-300")
      ),
      tag: combine(
        "animate-pulse rounded-full",
        getValueForTheme("bg-white/12", "bg-gray-250")
      )
    },
    shimmer: combine(
      "absolute inset-0 -translate-x-full bg-gradient-to-r animate-shimmer",
      getValueForTheme(
        "from-transparent via-white/10 to-transparent",
        "from-transparent via-gray-100 to-transparent"
      )
    )
  }), [combine, getValueForTheme]);

  return (
    <div className={skeletonClasses.container}>
      <NavBar />
      <div className="h-16 xs:h-18 sm:h-20" />

      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden py-8 xs:py-12 sm:py-16">
        <div className="container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xs:gap-8 sm:gap-10">
            {/* Left Content */}
            <div className="lg:col-span-8">
              <div className="space-y-4 xs:space-y-6">
                {/* Back button skeleton */}
                <div className={skeletonClasses.skeleton.button} style={{ width: '120px', height: '40px' }} />
                
                {/* Title skeleton */}
                <div className={skeletonClasses.skeleton.text} style={{ width: '85%', height: '48px' }} />
                
                {/* Organization info skeleton */}
                <div className="flex items-center gap-3">
                  <div className={skeletonClasses.skeleton.image} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                  <div className="space-y-2">
                    <div className={skeletonClasses.skeleton.text} style={{ width: '200px', height: '20px' }} />
                    <div className={skeletonClasses.skeleton.text} style={{ width: '150px', height: '16px' }} />
                  </div>
                </div>
                
                {/* Activity tags skeleton */}
                <div className="flex gap-2 flex-wrap">
                  <div className={skeletonClasses.skeleton.tag} style={{ width: '80px', height: '32px' }} />
                  <div className={skeletonClasses.skeleton.tag} style={{ width: '100px', height: '32px' }} />
                  <div className={skeletonClasses.skeleton.tag} style={{ width: '90px', height: '32px' }} />
                </div>
              </div>
            </div>
            
            {/* Right Content - Date Card */}
            <div className="lg:col-span-4">
              <div className={combine(skeletonClasses.card, "p-6 text-center relative overflow-hidden")}>
                <div className={skeletonClasses.shimmer} />
                <div className={skeletonClasses.skeleton.text} style={{ width: '60px', height: '80px', margin: '0 auto 16px' }} />
                <div className={skeletonClasses.skeleton.text} style={{ width: '120px', height: '20px', margin: '0 auto 8px' }} />
                <div className={skeletonClasses.skeleton.text} style={{ width: '100px', height: '16px', margin: '0 auto' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 pb-12 xs:pb-16 sm:pb-20 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-6 xs:space-y-8">
            {/* Content sections */}
            {[1, 2, 3].map((section) => (
              <div key={section} className={combine(skeletonClasses.card, "p-6 xs:p-8 relative overflow-hidden")}>
                <div className={skeletonClasses.shimmer} />
                <div className="space-y-4">
                  {/* Section title */}
                  <div className={skeletonClasses.skeleton.text} style={{ width: '200px', height: '24px' }} />
                  
                  {/* Content blocks */}
                  <div className="space-y-3">
                    <div className={skeletonClasses.skeleton.text} style={{ width: '100%', height: '16px' }} />
                    <div className={skeletonClasses.skeleton.text} style={{ width: '95%', height: '16px' }} />
                    <div className={skeletonClasses.skeleton.text} style={{ width: '90%', height: '16px' }} />
                    <div className={skeletonClasses.skeleton.text} style={{ width: '85%', height: '16px' }} />
                  </div>

                  {/* Additional elements for variety */}
                  {section === 2 && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className={skeletonClasses.skeleton.image} style={{ height: '120px' }} />
                      <div className={skeletonClasses.skeleton.image} style={{ height: '120px' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sidebar sections */}
            {[1, 2, 3].map((section) => (
              <div key={section} className={combine(skeletonClasses.card, "p-6 relative overflow-hidden")}>
                <div className={skeletonClasses.shimmer} />
                <div className="space-y-4">
                  {/* Section icon and title */}
                  <div className="flex items-center gap-3">
                    <div className={skeletonClasses.skeleton.base} style={{ width: '24px', height: '24px' }} />
                    <div className={skeletonClasses.skeleton.text} style={{ width: '120px', height: '20px' }} />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2">
                    <div className={skeletonClasses.skeleton.text} style={{ width: '100%', height: '16px' }} />
                    <div className={skeletonClasses.skeleton.text} style={{ width: '80%', height: '16px' }} />
                  </div>

                  {/* Special content for different sections */}
                  {section === 1 && (
                    <div className="space-y-2 mt-4">
                      <div className={skeletonClasses.skeleton.tag} style={{ width: '60px', height: '24px' }} />
                      <div className={skeletonClasses.skeleton.tag} style={{ width: '80px', height: '24px' }} />
                    </div>
                  )}
                  
                  {section === 3 && (
                    <div className={skeletonClasses.skeleton.button} style={{ width: '100%', height: '40px', marginTop: '16px' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className={combine(
          "flex items-center gap-3 px-4 py-3 rounded-full shadow-lg backdrop-blur-sm",
          getValueForTheme(
            "bg-white/10 border border-white/20 text-white",
            "bg-white border border-gray-200 text-gray-700 shadow-xl"
          )
        )}>
          <div className={combine(
            "w-4 h-4 border-2 border-t-transparent rounded-full animate-spin",
            getValueForTheme("border-[#54CF90]", "border-[#006C67]")
          )} />
          <span className="text-sm font-medium">กำลังโหลดข้อมูลกิจกรรม...</span>
        </div>
      </div>
    </div>
  );
});
ProjectDetailSkeleton.displayName = "ProjectDetailSkeleton";

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
        "bg-gradient-to-b from-gray-900 to-black",
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
        <h1 className={combine(
          "text-2xl font-bold mb-4", 
          getValueForTheme("text-white", "text-[#006C67]")
        )}>
          ไม่พบข้อมูลกิจกรรม
        </h1>
        <p className={combine(
          "mb-6", 
          getValueForTheme("text-white/70", "text-[#006C67]/70")
        )}>
          {error || "ไม่สามารถโหลดข้อมูลกิจกรรมได้"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className={combine(
            "px-6 py-3 rounded-lg font-medium transition-all duration-300 text-white shadow-lg",
            getValueForTheme(
              "bg-gradient-to-r from-[#54CF90] to-[#54CF90]/90 hover:from-[#4AB87E] hover:to-[#4AB87E]/90",
              "bg-gradient-to-r from-[#006C67] to-[#006C67]/90 hover:from-[#006C67]/90 hover:to-[#006C67]/80"
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
      "bg-[#ffff]/2",
      "bg-gradient-to-b from-white to-gray-50 text-[#006C67]"
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
                   'ไม่ระบุชื่อกิจกรรม',
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
      console.error('Project loading error:', projectError);
    }
  }, [projectError]);

  // Handle loading state with detailed skeleton
  if (projectLoading) {
    return <ProjectDetailSkeleton />;
  }

  // Handle error state
  if (projectError || !project || !projectData) {
    return <ErrorMessage onBack={handleBackNavigation} error={projectError} />;
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

      <div className="container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 pb-12 xs:pb-16 sm:pb-20 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10">
          <div className="lg:col-span-2">
            <ProjectContentSection project={project} projectData={projectData} />
          </div>
          
          <div className="lg:col-span-1">
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
      </div>
    </div>
  );
};

export default React.memo(DetailProjectPage);