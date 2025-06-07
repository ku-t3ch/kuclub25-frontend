"use client";

import React from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../../hooks/useThemeUtils";

interface ErrorPageProps {
  error: string | null;
  onBack: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, onBack }) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeValues = {
    containerBg: getValueForTheme(
      "bg-gradient-to-b from-[#051D35] to-[#091428]",
      "bg-gradient-to-b from-white to-gray-50"
    ),
    primaryText: getValueForTheme("text-white", "text-gray-800"),
    secondaryText: getValueForTheme("text-white/70", "text-gray-600"),
    buttonPrimary: getValueForTheme(
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      "bg-gradient-to-r from-primary to-teal-700 hover:from-teal-700 hover:to-teal-800"
    ),
  };

  return (
    <div
      className={combine(
        "min-h-screen pt-16 md:pt-20 flex items-center justify-center",
        themeValues.containerBg
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div
          className={combine(
            "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center",
            getValueForTheme("bg-red-500/20", "bg-red-50")
          )}
        >
          <svg
            className={combine(
              "w-8 h-8",
              getValueForTheme("text-red-400", "text-red-500")
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className={combine("text-2xl font-bold mb-4", themeValues.primaryText)}>
          ไม่พบข้อมูลองค์กร
        </h1>
        <p className={combine("mb-6", themeValues.secondaryText)}>
          {error || "ไม่สามารถโหลดข้อมูลองค์กรได้"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className={combine(
            "px-6 py-3 rounded-lg font-medium transition-all duration-300 text-white shadow-lg",
            themeValues.buttonPrimary
          )}
        >
          กลับหน้าก่อนหน้า
        </motion.button>
      </motion.div>
    </div>
  );
};

export default React.memo(ErrorPage);