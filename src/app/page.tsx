"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useOrganizationTypes } from "../hooks/useOrganizationType";
import { useOrganizations } from "../hooks/useOrganization";
import HeroSection from "../components/home/heroSection";
import { Vortex } from "../components/ui/vortex";

import CategorySection from "../components/home/categorySection";
import OrganizationSection from "../components/home/organizationSection";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const { organizationTypes, loading: typesLoading } = useOrganizationTypes();
  const { organizations, loading: orgsLoading } = useOrganizations();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const combine = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const getValueForTheme = (darkValue: string, lightValue: string) => {
    return resolvedTheme === "dark" ? darkValue : lightValue;
  };

  // สร้าง categories จาก organization types และใช้ name เป็น id
  const categories = useMemo(() => {
    const allCategory = { id: undefined, name: "ทั้งหมด" };
    const typeCategories = organizationTypes.map(type => ({
      id: type.name,
      name: type.name
    }));
    
    return [allCategory, ...typeCategories];
  }, [organizationTypes]);

  const totalClubCount = useMemo(() => {
    return organizations.length;
  }, [organizations]);

  // Filter organizations based on active category (type name)
  const filteredOrganizations = useMemo(() => {
    if (activeCategory === undefined) {
      return organizations; // Show all
    }
    
    return organizations.filter(org => {
      const orgTypeName = org.org_type_name;
      return orgTypeName === activeCategory;
    });
  }, [organizations, activeCategory]);

  // Create category count map
  const categoryCountMap = useMemo(() => {
    const countMap = new Map<string | undefined, number>();
    
    // Count for "ทั้งหมด" (all organizations)
    countMap.set(undefined, organizations.length);
    
    // Count for each specific category
    organizationTypes.forEach(type => {
      const count = organizations.filter(org => org.org_type_name === type.name).length;
      countMap.set(type.name, count);
    });
    
    return countMap;
  }, [organizations, organizationTypes]);

  const handleCategoryChange = (categoryName: string | undefined) => {
    setActiveCategory(categoryName);
  };

  // Loading state is true if either types or organizations are loading
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
      />

      <div className="h-9"/>
      
      <CategorySection
        categories={categories}
        activeCategory={activeCategory}
        totalClubCount={totalClubCount}
        categoryCountMap={categoryCountMap}
        loading={loading}
        onCategoryChange={handleCategoryChange}
      />

      <OrganizationSection
        organizations={organizations}
        filteredOrganizations={filteredOrganizations}
        activeCategory={activeCategory}
        categories={categories}
        loading={loading}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
}

