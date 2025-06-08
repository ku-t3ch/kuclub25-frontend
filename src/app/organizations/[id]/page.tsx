"use client";

import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganizationDetail } from "../../../hooks/useOrganization";
import { useProjectsByOrganization } from "../../../hooks/useProject";
import { useThemeUtils } from "../../../hooks/useThemeUtils";

const OrganizationHeroSection = React.lazy(() => 
  import("../../../components/organization/[id]/heroSection")
);
const OrganizationAboutSection = React.lazy(() => 
  import("../../../components/organization/[id]/abountSection")
);
const OrganizationProjectSection = React.lazy(() => 
  import("../../../components/organization/[id]/projectSection")
);
const OrganizationSidebarSection = React.lazy(() => 
  import("../../../components/organization/[id]/sidebarSection")
);
const LoadingPage = React.lazy(() => 
  import("../../../components/ui/loading/loadingOrganizationID")
);
const ErrorPage = React.lazy(() => 
  import("../../../components/ui/error/errorOrganizationID")
);

// Constants moved outside component to prevent recreation
const DEFAULT_STATE = {
  all: [],
  upcoming: [],
  ongoing: [],
  past: [],
  counts: { all: 0, upcoming: 0, ongoing: 0, past: 0 },
} as const;

// Memoized social media link processor
const processSocialLink = (link: string | undefined, platform: string) => {
  if (!link) return null;
  return link.startsWith("http") ? link : `https://${platform}.com/${link}`;
};

// Optimized date comparison functions
const createDateComparator = (field: string, reverse = false) => {
  return (a: any, b: any) => {
    const dateA = new Date(a[field] || a.date_start || 0).getTime();
    const dateB = new Date(b[field] || b.date_start || 0).getTime();
    const result = dateA - dateB;
    return reverse ? -result : result;
  };
};

// Memoized comparators
const upcomingComparator = createDateComparator("date_start_the_project");
const ongoingComparator = createDateComparator("date_start_the_project", true);
const pastComparator = (a: any, b: any) => {
  const getEndDate = (project: any) => 
    project.date_end_the_project || 
    project.date_end || 
    project.date_start_the_project || 
    project.date_start || 
    0;
  
  const dateA = new Date(getEndDate(a)).getTime();
  const dateB = new Date(getEndDate(b)).getTime();
  return dateB - dateA;
};

// Suspense fallback component
const SuspenseFallback = memo(() => {
  const { combine, getValueForTheme } = useThemeUtils();
  
  return (
    <div className={combine(
      "min-h-screen pt-16 md:pt-20 flex items-center justify-center",
      getValueForTheme(
        "bg-gradient-to-b from-[#051D35] to-[#091428]",
        "bg-gradient-to-b from-white to-gray-50"
      )
    )}>
      <div className="flex flex-col items-center space-y-4">
        <div className={combine(
          "animate-spin rounded-full h-12 w-12 border-b-2",
          getValueForTheme("border-blue-500", "border-primary")
        )} />
        <p className={getValueForTheme("text-white/70", "text-gray-600")}>
          กำลังโหลด...
        </p>
      </div>
    </div>
  );
});
SuspenseFallback.displayName = "SuspenseFallback";

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { combine, getValueForTheme } = useThemeUtils();
  
  // Optimized state management
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "past" | "all">("all");

  const {
    organization,
    loading: orgLoading,
    error: orgError,
  } = useOrganizationDetail(id);
  
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjectsByOrganization(id);

  // Optimized parallax scroll effect with throttling
  useEffect(() => {
    let ticking = false;
    let lastKnownScrollPosition = 0;
    
    const handleScroll = () => {
      lastKnownScrollPosition = window.scrollY;
      
      if (!ticking) {
        requestAnimationFrame(() => {
          // Only update if scroll change is significant (performance optimization)
          if (Math.abs(scrollY - lastKnownScrollPosition) > 2) {
            setScrollY(lastKnownScrollPosition);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { 
      passive: true,
      capture: false 
    });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]); // Include scrollY dependency for optimization

  // Memoized theme values (computed only once per theme change)
  const themeValues = useMemo(() => ({
    containerBg: getValueForTheme(
      "bg-gradient-to-b from-[#051D35] to-[#091428]",
      "bg-gradient-to-b from-white to-gray-50"
    ),
  }), [getValueForTheme]);

  // Optimized organization info processing with better memoization
  const organizationInfo = useMemo(() => {
    if (!organization) return null;

    const {
      org_nickname,
      orgnameth,
      orgnameen,
      description,
      details,
      org_type_name,
      campus_name,
      views,
      facebook,
      instagram,
    } = organization;

    // Use more efficient display name logic
    const displayName = org_nickname || orgnameth || orgnameen || "ไม่ระบุชื่อองค์กร";
    const isNicknameUsed = displayName === org_nickname;

    // Build alternative names array more efficiently
    const alternativeNames = [];
    if (isNicknameUsed && orgnameth && orgnameth !== org_nickname) {
      alternativeNames.push({ text: orgnameth, type: "thai" });
    }
    if (orgnameen && orgnameen !== displayName && orgnameen !== orgnameth) {
      alternativeNames.push({ text: orgnameen, type: "english" });
    }

    return {
      displayName,
      alternativeNames,
      description: description || "องค์กรนี้ไม่มีคำอธิบายเพิ่มเติมในขณะนี้",
      details: details || "ไม่มีรายละเอียดเพิ่มเติม",
      orgType: org_type_name,
      campus: campus_name,
      views: views || 0,
      socialMedia: {
        facebook: processSocialLink(facebook, "facebook"),
        instagram: processSocialLink(instagram, "instagram"),
      },
    };
  }, [organization]);

  // Highly optimized project categorization with single pass sorting
  const projectCategories = useMemo(() => {
    if (!projects?.length) return DEFAULT_STATE;

    const now = new Date();
    const categorized = {
      upcoming: [] as typeof projects,
      ongoing: [] as typeof projects,
      past: [] as typeof projects,
    };

    // Single pass categorization for better performance O(n) instead of O(3n)
    for (const project of projects) {
      const startDate = project.date_start_the_project || project.date_start;
      const endDate = project.date_end_the_project || project.date_end;

      if (!startDate) {
        categorized.past.push(project);
        continue;
      }

      const projectStartDate = new Date(startDate);
      const projectEndDate = endDate ? new Date(endDate) : null;

      if (projectStartDate > now) {
        categorized.upcoming.push(project);
      } else if (projectEndDate && projectEndDate < now) {
        categorized.past.push(project);
      } else {
        categorized.ongoing.push(project);
      }
    }

    // Optimized sorting with pre-compiled comparators
    categorized.upcoming.sort(upcomingComparator);
    categorized.ongoing.sort(ongoingComparator);
    categorized.past.sort(pastComparator);

    return {
      all: projects,
      ...categorized,
      counts: {
        all: projects.length,
        upcoming: categorized.upcoming.length,
        ongoing: categorized.ongoing.length,
        past: categorized.past.length,
      },
    };
  }, [projects]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleBackNavigation = useCallback(() => {
    router.back();
  }, [router]);

  const handleProjectClick = useCallback((project: any) => {
    router.push(`/projects/${project.id}`);
  }, [router]);

  const handleTabChange = useCallback((tab: typeof activeTab) => {
    setActiveTab(tab);
  }, []);

  // Early returns with optimized loading states
  if (orgLoading) {
    return (
      <React.Suspense fallback={<SuspenseFallback />}>
        <LoadingPage />
      </React.Suspense>
    );
  }

  if (orgError || !organization || !organizationInfo) {
    return (
      <React.Suspense fallback={<SuspenseFallback />}>
        <ErrorPage error={orgError} onBack={handleBackNavigation} />
      </React.Suspense>
    );
  }

  return (
    <div className={combine("min-h-screen", themeValues.containerBg)}>
      <div className="h-16 md:h-20" />

      <React.Suspense fallback={<SuspenseFallback />}>
        <OrganizationHeroSection
          organization={organization}
          organizationInfo={organizationInfo}
          scrollY={scrollY}
          onBack={handleBackNavigation}
        />

        <div className="container mx-auto px-4 md:px-6 pb-16 max-w-10xl ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <OrganizationAboutSection organizationInfo={organizationInfo} />
              
              <OrganizationProjectSection
                projectCategories={projectCategories}
                projectsLoading={projectsLoading}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onProjectClick={handleProjectClick}
              />
            </div>

            <OrganizationSidebarSection
              organizationInfo={organizationInfo}
              projectCategories={projectCategories}
            />
          </div>
        </div>

        {/* Visual separator - moved inside Suspense for consistency */}
        <div
          className={combine(
            "relative h-px mx-auto w-[70%] my-8",
            getValueForTheme(
              "bg-gradient-to-r from-transparent via-white/20 to-transparent",
              "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
            )
          )}
        />
      </React.Suspense>
    </div>
  );
}