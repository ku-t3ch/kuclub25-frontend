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
import { Vortex } from "../components/ui/vortex";

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

  // Debug logs
  useEffect(() => {
    console.log("Organizations sample:", organizations.slice(0, 3));
    console.log("Campuses:", campuses);
    console.log("Active Campus:", activeCampus);
    if (organizations.length > 0) {
      console.log("Organization fields:", Object.keys(organizations[0]));
      // แสดง campus_name จากองค์กรตัวอย่าง
      console.log(
        "Sample campus names from orgs:",
        organizations.slice(0, 5).map((org) => org.campus_name)
      );
    }
  }, [organizations, campuses, activeCampus]);

  // ตั้งค่า default campus เป็นวิทยาเขตบางเขน
  useEffect(() => {
    if (campuses.length > 0 && activeCampus === undefined) {
      console.log("Setting default campus from:", campuses);
      const bangkhenCampus = campuses.find(
        (campus) =>
          campus.name.includes("บางเขน") ||
          campus.name.includes("Bangkhen") ||
          campus.name.toLowerCase().includes("bangkhen")
      );

      if (bangkhenCampus) {
        console.log("Found Bangkhen campus:", bangkhenCampus);
        setActiveCampus(bangkhenCampus.id);
      } else {
        console.log(
          "Bangkhen campus not found, using first campus:",
          campuses[0]
        );
        setActiveCampus(campuses[0].id);
      }
    }
  }, [campuses, activeCampus]);

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

  // ฟังก์ชันช่วยในการเทียบชื่อวิทยาเขต - เช็คเฉพาะ campus_name
  const isCampusMatch = useCallback(
    (
      orgCampusName: string | null | undefined,
      selectedCampusName: string
    ): boolean => {
      if (!orgCampusName || !selectedCampusName) return false;

      // เช็คให้ตรงกันทุกตัวอักษร
      return orgCampusName === selectedCampusName;
    },
    []
  );

  // กรององค์กรตามวิทยาเขตก่อน (สำหรับการนับ)
  const organizationsByCampus = useMemo(() => {
    if (activeCampus === undefined) {
      return organizations;
    }

    const selectedCampus = campuses.find(
      (campus) => campus.id === activeCampus
    );
    if (!selectedCampus) {
      return organizations;
    }

    const filtered = organizations.filter((org) => {
      return isCampusMatch(org.campus_name, selectedCampus.name);
    });

    console.log("Organizations by campus filter:", {
      selectedCampus: selectedCampus.name,
      totalOrgs: organizations.length,
      filteredOrgs: filtered.length,
      sampleMatches: filtered.slice(0, 3).map((org) => ({
        name: org.orgnameth,
        campus: org.campus_name,
      })),
    });

    return filtered;
  }, [organizations, activeCampus, campuses, isCampusMatch]);

  const totalClubCount = useMemo(() => {
    return organizationsByCampus.length;
  }, [organizationsByCampus]);

  // สร้าง categoryCountMap จากองค์กรที่กรองตามวิทยาเขตแล้ว
  const categoryCountMap = useMemo(() => {
    const countMap = new Map<string | undefined, number>();

    organizationsByCampus.forEach((org) => {
      const typeName = org.org_type_name;
      countMap.set(typeName, (countMap.get(typeName) || 0) + 1);
    });

    // เพิ่มจำนวนรวมทั้งหมดสำหรับ "ทั้งหมด"
    countMap.set(undefined, organizationsByCampus.length);

    console.log("Category count map:", Object.fromEntries(countMap));

    return countMap;
  }, [organizationsByCampus]);

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
        const campusName = org.campus_name?.toLowerCase() || "";

        return (
          thaiName.includes(searchTerm) ||
          englishName.includes(searchTerm) ||
          nickname.includes(searchTerm) ||
          description.includes(searchTerm) ||
          orgType.includes(searchTerm) ||
          campusName.includes(searchTerm)
        );
      });
    },
    []
  );

  // Filter organizations based on active category, campus, and search query
  const filteredOrganizations = useMemo(() => {
    let filtered = organizations;

    // Apply search filter first if there's a search query
    if (searchQuery.trim()) {
      filtered = searchOrganizations(searchQuery, filtered);
    }

    // Apply campus filter - ใช้ campus name เป็นหลัก
    if (activeCampus !== undefined) {
      const selectedCampus = campuses.find(
        (campus) => campus.id === activeCampus
      );
      if (selectedCampus) {
        filtered = filtered.filter((org) => {
          return isCampusMatch(org.campus_name, selectedCampus.name);
        });
      }
    }

    // Then apply category filter if a category is selected
    if (activeCategory !== undefined) {
      filtered = filtered.filter((org) => {
        return org.org_type_name === activeCategory;
      });
    }

    console.log("Final filtered organizations:", {
      total: organizations.length,
      byCampus: organizationsByCampus.length,
      final: filtered.length,
      activeCampus,
      activeCategory,
      searchQuery,
    });

    return filtered;
  }, [
    organizations,
    activeCategory,
    activeCampus,
    searchQuery,
    searchOrganizations,
    campuses,
    organizationsByCampus,
    isCampusMatch,
  ]);

  const handleCategoryChange = useCallback(
    (categoryName: string | undefined) => {
      setActiveCategory(categoryName);
    },
    []
  );

  const handleCampusChange = useCallback((campusId: string | undefined) => {
    setActiveCampus(campusId);
    // Reset category เมื่อเปลี่ยนวิทยาเขต เพื่อแสดงข้อมูลที่ถูกต้อง
    setActiveCategory(undefined);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setIsSearching(true);

    setTimeout(() => {
      setSearchQuery(query);

      if (query.trim()) {
        setActiveCategory(undefined);
        // อย่า reset campus เมื่อค้นหา เพื่อให้ค้นหาในวิทยาเขตที่เลือกไว้
      }

      setIsSearching(false);
    }, 300);
  }, []);

  const handleProjectClick = useCallback(
    (project: any) => {
      try {
        const projectId = project.id || project.projectid || project.project_id;

        if (!projectId) {
          console.error("Project ID not found:", project);
          return;
        }
        router.push(`/projects/${projectId}`);
      } catch (error) {
        console.error("Error navigating to project:", error);
      }
    },
    [router]
  );

  const loading = typesLoading || orgsLoading;

  return (
    <div className={combine("min-h-screen pt-16 md:pt-20")}>
      <Vortex
        backgroundColor="transparent"
        rangeY={800}
        particleCount={100}
        baseHue={120}
        particleOpacity={0.3}
        className="flex flex-col items-center justify-start w-full min-h-screen px-4"
        containerClassName={combine(
          "fixed inset-0 z-0 ",
          getValueForTheme(
            "bg-gradient-to-b from-[#000000] to-[#123067]",
            "bg-gradient-to-b from-white via-gray-50 to-gray-100"
          )
        )}
      />

      {/* แสดง error ถ้ามี */}
      {campusError && (
        <div className="fixed top-20 right-4 bg-red-500 text-white p-4 rounded-lg z-50">
          <p>Campus Error: {campusError}</p>
        </div>
      )}

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
        campuses={campuses}
        activeCampus={activeCampus}
        onCampusChange={handleCampusChange}
        campusLoading={campusLoading}
      />

      <OrganizationSection
        organizations={organizations}
        filteredOrganizations={filteredOrganizations}
        activeCategory={activeCategory}
        categories={categories}
        loading={loading || isSearching}
        onCategoryChange={handleCategoryChange}
      />

      <div className="h-16" />

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
