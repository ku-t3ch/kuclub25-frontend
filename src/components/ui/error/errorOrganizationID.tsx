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
      "bg-gradient-to-b from-gray-900 via-gray-800 to-black",
      "bg-gradient-to-b from-white to-gray-50"
    ),
    primaryText: getValueForTheme("text-white", "text-[#006C67]"),
    secondaryText: getValueForTheme("text-gray-300", "text-[#006C67]/70"),
    cardBg: getValueForTheme(
      "bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm",
      "bg-white border border-[#006C67]/20 backdrop-blur-sm"
    ),
    iconBg: getValueForTheme(
      "bg-red-500/20 border border-red-500/30",
      "bg-red-50 border border-red-200"
    ),
    iconColor: getValueForTheme("text-red-400", "text-red-500"),
    buttonPrimary: getValueForTheme(
      "bg-gradient-to-r from-[#54CF90] to-[#54CF90]/80 hover:from-[#54CF90]/90 hover:to-[#54CF90]/70 border border-[#54CF90]/30",
      "bg-gradient-to-r from-[#006C67] to-[#006C67]/90 hover:from-[#006C67]/90 hover:to-[#006C67]/80 border border-[#006C67]/20"
    ),
    buttonText: getValueForTheme("text-gray-900", "text-white"),
  };

  return (
    <div
      className={combine(
        "min-h-screen pt-16 md:pt-20 flex items-center justify-center px-4",
        themeValues.containerBg
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={combine(
          "text-center max-w-md mx-auto p-8 rounded-2xl shadow-2xl",
          themeValues.cardBg
        )}
      >
        {/* Error Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={combine(
            "w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg",
            themeValues.iconBg
          )}
        >
          <svg
            className={combine("w-10 h-10", themeValues.iconColor)}
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
        </motion.div>

        {/* Error Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={combine("text-2xl xs:text-3xl font-bold mb-4", themeValues.primaryText)}
        >
          ไม่พบข้อมูลองค์กร
        </motion.h1>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={combine("mb-8 text-sm xs:text-base leading-relaxed", themeValues.secondaryText)}
        >
          {error || "ไม่สามารถโหลดข้อมูลองค์กรได้ กรุณาลองใหม่อีกครั้ง หรือกลับไปหน้าก่อนหน้า"}
        </motion.p>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className={combine(
            "w-full px-6 py-3 xs:py-4 rounded-xl font-semibold text-sm xs:text-base transition-all duration-300 shadow-lg hover:shadow-xl",
            themeValues.buttonPrimary,
            themeValues.buttonText
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับหน้าก่อนหน้า
          </span>
        </motion.button>

        {/* Additional Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 pt-6 border-t border-gray-700/30 dark:border-[#006C67]/20"
        >
          <p className={combine("text-xs", themeValues.secondaryText)}>
            หากปัญหายังคงมีอยู่ กรุณาติดต่อผู้ดูแลระบบ
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default React.memo(ErrorPage);