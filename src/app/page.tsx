"use client";

import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import HeroSection from "../components/home/heroSection";

export default function Home() {
  const { resolvedTheme } = useTheme();

  const combine = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const getValueForTheme = (darkValue: string, lightValue: string) => {
    return resolvedTheme === "dark" ? darkValue : lightValue;
  };

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
        description="เลือกจากกว่า 100 ชมรมที่มีความหลากหลาย พร้อมพัฒนาทักษะ ความสามารถและสร้างเครือข่ายที่มีคุณค่าตลอดชีวิตการเป็นนิสิต"
      />
    </div>
  );
}
