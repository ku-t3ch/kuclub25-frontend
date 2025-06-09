"use client";

import React from 'react';
import { useThemeUtils } from '../../hooks/useThemeUtils';

interface OrganizationPageHeaderProps {
  title: string;
  error?: string;
  campusError?: string;
  onClearError: () => void;
}

const OrganizationPageHeader: React.FC<OrganizationPageHeaderProps> = ({
  title,
  error,
  campusError,
  onClearError
}) => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeClasses = {
    title: combine(
      "text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center px-2",
      getValueForTheme("text-white", "text-[#006C67]")
    ),
    errorContainer: combine(
      "mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-4 text-sm",
      getValueForTheme(
        "bg-red-500/10 border-red-500 text-red-300",
        "bg-red-50 border-red-500 text-red-700"
      )
    ),
    clearButton: combine(
      "w-auto mx-auto px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center justify-center gap-2",
      getValueForTheme(
        "bg-white/5 hover:bg-white/10 text-white border-white/20",
        "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
      )
    )
  };

  return (
    <>
      {/* Page Title */}
      <h1 className={themeClasses.title}>
        {title}
      </h1>

      {/* Error States */}
      {(error || campusError) && (
        <div className={themeClasses.errorContainer}>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">เกิดข้อผิดพลาด</h3>
          {error && <p className="mb-1 text-xs sm:text-sm">Organizations: {error}</p>}
          {campusError && <p className="mb-2 text-xs sm:text-sm">Campus: {campusError}</p>}
          <button 
            onClick={onClearError}
            className={combine(
              themeClasses.clearButton,
              "text-xs sm:text-sm px-3 py-1.5 w-auto"
            )}
          >
            ลองอีกครั้ง
          </button>
        </div>
      )}
    </>
  );
};

export default React.memo(OrganizationPageHeader);