"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { useTheme } from "../contexts/ThemeContext";
import { useOrganizationTypes } from "../hooks/useOrganizationType";
import { useOrganizations } from "../hooks/useOrganization";

import { useAllProjects } from "../hooks/useProject";
import HeroSection from "../components/home/heroSection";
import { Vortex } from "../components/ui/vortex";

import CategorySection from "../components/home/categorySection";
import OrganizationSection from "../components/home/organizationSection";
import UpcomingProjectSection from "../components/home/upcomingProjectSection";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { organizationTypes, loading: typesLoading } = useOrganizationTypes();
  const { organizations, loading: orgsLoading } = useOrganizations();
  const { projects, loading: projectsLoading } = useAllProjects();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const combine = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const getValueForTheme = (darkValue: string, lightValue: string) => {
    return resolvedTheme === "dark" ? darkValue : lightValue;
  };

  const categories = useMemo(() => {
    const allCategory = { id: undefined, name: "ทั้งหมด" };
    const typeCategories = organizationTypes.map((type) => ({
      id: type.name,
      name: type.name,
    }));

    return [allCategory, ...typeCategories];
  }, [organizationTypes]);

  const totalClubCount = useMemo(() => {
    return organizations.length;
  }, [organizations]);

  const searchOrganizations = useCallback(
    (query: string, orgs: typeof organizations) => {
      if (!query.trim()) return orgs;

      const searchTerm = query.toLowerCase().trim();

      return orgs.filter((org) => {
        const thaiName = org.orgnameth?.toLowerCase() || "";
        const englishName = org.orgnameen?.toLowerCase() || "";
        const nickname = org.org_nickname?.toLowerCase() || "";
        const description = org.description?.toLowerCase() || "";
        const orgType = org.org_type_name?.toLowerCase() || "";

        return (
          thaiName.includes(searchTerm) ||
          englishName.includes(searchTerm) ||
          nickname.includes(searchTerm) ||
          description.includes(searchTerm) ||
          orgType.includes(searchTerm)
        );
      });
    },
    []
  );

  // Filter organizations based on active category and search query
  const filteredOrganizations = useMemo(() => {
    let filtered = organizations;

    // Apply search filter first if there's a search query
    if (searchQuery.trim()) {
      filtered = searchOrganizations(searchQuery, filtered);
    }

    // Then apply category filter if a category is selected
    if (activeCategory !== undefined) {
      filtered = filtered.filter((org) => {
        return org.org_type_name === activeCategory;
      });
    }

    return filtered;
  }, [organizations, activeCategory, searchQuery, searchOrganizations]);

  const handleCategoryChange = useCallback(
    (categoryName: string | undefined) => {
      setActiveCategory(categoryName);
    },
    []
  );

  const handleSearch = useCallback((query: string) => {
    setIsSearching(true);

    // Simulate search delay for better UX
    setTimeout(() => {
      setSearchQuery(query);

      // Reset category when searching to show all matching results
      if (query.trim()) {
        setActiveCategory(undefined);
      }

      setIsSearching(false);
    }, 300);
  }, []);

  const handleProjectClick = useCallback((project: any) => {
    try {
      const projectId = project.id || project.projectid || project.project_id;
      
      if (!projectId) {
        console.error('Project ID not found:', project);
        return;
      }
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error navigating to project:', error);
    }
  }, [router]);

  // Loading state is true if either types or organizations are loading or if searching
  const loading = typesLoading || orgsLoading;

  return (
    <div
      className={combine(
        "min-h-screen pt-16 md:pt-20",
        getValueForTheme(
          "bg-gradient-to-b from-[#000000] to-[#123067]",
          "bg-gradient-to-b from-white via-gray-50 to-gray-100"
        )
      )}
    >
      <HeroSection
        title="ค้นพบชมรมที่ใช่สำหรับคุณ"
        description={`เลือกจากกว่า ${totalClubCount} ชมรมที่มีความหลากหลาย พร้อมพัฒนาทักษะ ความสามารถและสร้างเครือข่ายที่มีคุณค่าตลอดชีวิตการเป็นนิสิต`}
        onSearch={handleSearch}
        initialQuery={searchQuery}
        isLoading={isSearching}
      />

      <div className="h-8 md:h-12" />

      <CategorySection
        categories={categories}
        activeCategory={activeCategory}
        totalClubCount={
          searchQuery ? filteredOrganizations.length : totalClubCount
        }
        categoryCountMap={categoryCountMap}
        loading={loading}
        onCategoryChange={handleCategoryChange}
      />

      <OrganizationSection
        organizations={organizations}
        filteredOrganizations={filteredOrganizations}
        activeCategory={activeCategory}
        categories={categories}
        loading={loading || isSearching}
        onCategoryChange={handleCategoryChange}
      />

      {/* Add spacing between sections */}
      <div className="h-16" />
      <UpcomingProjectSection
        projects={projects}
        loading={projectsLoading}
        onProjectClick={handleProjectClick}
        maxProjects={6}
        title="โครงการที่กำลังจะเกิดขึ้น"
        description={`เลือกจากกว่า ${totalClubCount} ชมรมที่มีความหลากหลาย พร้อมพัฒนาทักษะ ความสามารถและสร้างเครือข่ายที่มีคุณค่าตลอดชีวิตการเป็นนิสิต`}
      />
    </div>
  );
}
