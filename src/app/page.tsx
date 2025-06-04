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
          "bg-gradient-to-b from-[#051D35] to-[#091428]",
          "bg-gradient-to-b from-white via-gray-50 to-gray-100"
        )
      )}
    >
      <HeroSection
        title="ค้นพบชมรมที่ใช่สำหรับคุณ"
        description={`เลือกจากกว่า ${totalClubCount} ชมรมที่มีความหลากหลาย พร้อมพัฒนาทักษะ ความสามารถและสร้างเครือข่ายที่มีคุณค่าตลอดชีวิตการเป็นนิสิต`}
      />

      <div className="h-8 md:h-12"/>
      
      <CategorySection
        categories={categories}
        activeCategory={activeCategory}
        totalClubCount={totalClubCount}
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

// export default function VortexDemo() {
  
//   return (
//     <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-[30rem] overflow-hidden">
//       <Vortex
//         backgroundColor="black"
//         className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
//       >
//         <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
//           ค้นพบชมรมที่ใช่สำหรับคุณ
//         </h2>
//         <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
//           เลือกจากกว่า 100 ชมรมที่มีความหลากหลาย พร้อมพัฒนาทักษะ ความสามารถและสร้างเครือข่ายที่มีคุณค่าตลอดชีวิตการเป็นนิสิต
//         </p>
//       </Vortex>
//     </div>
//   );
// }
