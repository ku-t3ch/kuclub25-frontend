"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import { useOrganizationTypes } from "../hooks/useOrganizationType";
import { useOrganizations } from "../hooks/useOrganization";
import { useAllProjects } from "../hooks/useProject";
import { useCampuses } from "../hooks/useCampuses";
import HeroSection from "../components/home/heroSection";
import CategorySection from "../components/home/categorySection";
import OrganizationSection from "../components/home/organizationSection";
import UpcomingProjectSection from "../components/home/upcomingProjectSection";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { organizationTypes, loading: typesLoading } = useOrganizationTypes();
  const { organizations, loading: orgsLoading } = useOrganizations();
  const { projects, loading: projectsLoading } = useAllProjects();
  const {
    campuses,
    loading: campusLoading,
    error: campusError,
  } = useCampuses();

  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    undefined
  );
  const [activeCampus, setActiveCampus] = useState<string | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (campuses.length > 0 && activeCampus === undefined) {
      const bangkhenCampus = campuses.find((campus) =>
        campus.name.includes("บางเขน")
      );
      const selectedCampusId = bangkhenCampus?.name|| campuses[0]?.name;
      setActiveCampus(selectedCampusId);
    }
  }, [campuses, activeCampus]);

  

  const combine = useCallback(
    (...classes: string[]) => classes.filter(Boolean).join(" "),
    []
  );

  const getValueForTheme = useCallback(
    (darkValue: string, lightValue: string) =>
      resolvedTheme === "dark" ? darkValue : lightValue,
    [resolvedTheme]
  );

  const categories = useMemo(() => {
    const allCategory = { id: undefined, name: "ทั้งหมด" };
    const typeCategories = organizationTypes.map((type) => ({
      id: type.name,
      name: type.name,
    }));
    return [allCategory, ...typeCategories];
  }, [organizationTypes]);

  const isCampusMatch = useCallback(
    (
      orgCampusId: string | null | undefined,
      selectedCampusId: string
    ): boolean => {
      return orgCampusId === selectedCampusId;
    },
    []
  );

  const organizationsByCampus = useMemo(() => {
    if (activeCampus === undefined) return organizations;
    return organizations.filter((org) =>
      isCampusMatch(org.campus_name, activeCampus)
    );
  }, [organizations, activeCampus, isCampusMatch]);

  const totalClubCount = useMemo(
    () => organizationsByCampus.length,
    [organizationsByCampus]
  );

  const categoryCountMap = useMemo(() => {
    const countMap = new Map<string | undefined, number>();

    organizationsByCampus.forEach((org) => {
      const typeName = org.org_type_name;
      countMap.set(typeName, (countMap.get(typeName) || 0) + 1);
    });

    countMap.set(undefined, organizationsByCampus.length);
    return countMap;
  }, [organizationsByCampus]);

  const searchOrganizations = useCallback(
    (query: string, orgs: typeof organizations) => {
      if (!query.trim()) return orgs;

      const searchTerm = query.toLowerCase().trim();
      return orgs.filter((org) => {
        const searchFields = [
          org.orgnameth,
          org.orgnameen,
          org.org_nickname,
          org.description,
          org.org_type_name,
          org.campus_name,
        ];

        return searchFields.some((field) =>
          field?.toLowerCase().includes(searchTerm)
        );
      });
    },
    []
  );

  const filteredOrganizations = useMemo(() => {
    let filtered = organizationsByCampus;

    if (searchQuery.trim()) {
      filtered = searchOrganizations(searchQuery, filtered);
    }

    if (activeCategory !== undefined) {
      filtered = filtered.filter((org) => org.org_type_name === activeCategory);
    }

    return filtered;
  }, [organizationsByCampus, activeCategory, searchQuery, searchOrganizations]);

  const handleCategoryChange = useCallback(
    (categoryName: string | undefined) => setActiveCategory(categoryName),
    []
  );

  const handleCampusChange = useCallback((campusId: string | undefined) => {
    setActiveCampus(campusId);
    setActiveCategory(undefined);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setIsSearching(true);

    setTimeout(() => {
      setSearchQuery(query);
      if (query.trim()) {
        setActiveCategory(undefined);
      }
      setIsSearching(false);
    }, 300);
  }, []);

  const handleProjectClick = useCallback(
    (project: any) => {
      try {
        const projectId = project.id ;
        if (projectId) {
          router.push(`/projects/${projectId}`);
        }
      } catch (error) {
  
      }
    },
    [router]
  );

  const loading = typesLoading || orgsLoading;


  const containerClassName = useMemo(
    () =>
      combine(
        "min-h-screen pt-16 md:pt-20",
        getValueForTheme(
          "bg-[#ffff]/2",
          "bg-gradient-to-b from-white via-gray-50 to-gray-100"
        )
      ),
    [combine, getValueForTheme]
  );

  return (
    <div className={containerClassName}>
      {campusError && (
        <div className="fixed top-20 right-4 bg-red-500 text-white p-4 rounded-lg z-50">
          <p>Campus Error: {campusError}</p>
        </div>
      )}

      <HeroSection
        title="ค้นพบชมรมและกิจกรรมที่ใช่สำหรับคุณ"
        description={`เลือกจากกว่า ${totalClubCount} ชมรมที่หลากหลาย
                        พร้อมพัฒนาทักษะ ความสามารถ 
                        และสร้างเครือข่ายที่มีคุณค่าตลอดชีวิตการเป็นนิสิต`}
        onSearch={handleSearch}
        initialQuery={searchQuery}
        isLoading={isSearching}
      />

      <div className="h-8 md:h-12" />

      <CategorySection
        categories={categories}
        activeCategory={activeCategory}
        totalClubCount={searchQuery ? filteredOrganizations.length : totalClubCount}
        categoryCountMap={categoryCountMap}
        loading={loading}
        onCategoryChange={handleCategoryChange}
        campuses={campuses}
        activeCampus={activeCampus}
        onCampusChange={handleCampusChange}
        campusLoading={campusLoading}
      />

      <div className="h-10" />

      <OrganizationSection
        filteredOrganizations={filteredOrganizations}
        activeCategory={activeCategory}
        categories={categories}
        loading={loading || isSearching}
        onCategoryChange={handleCategoryChange}
      />

      <div className="h-8 md:h-6 xs:h-4" />

      <UpcomingProjectSection
        projects={projects}
        loading={projectsLoading}
        onProjectClick={handleProjectClick}
        maxProjects={6}
        activeCampus={activeCampus}
        campuses={campuses}
      />
    </div>
  );
}
