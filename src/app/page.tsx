"use client";

import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import HeroSection from "../components/home/heroSection";
import { Vortex } from "../components/ui/vortex";


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
