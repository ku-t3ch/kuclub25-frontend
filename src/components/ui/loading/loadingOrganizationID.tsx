
"use client";
import React from "react";
import { useThemeUtils } from "../../../hooks/useThemeUtils";

const LoadingPage: React.FC = () => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeValues = {
    containerBg: getValueForTheme(
      "bg-gradient-to-b from-[#051D35] to-[#091428]",
      "bg-gradient-to-b from-white to-gray-50"
    ),
  };

  return (
    <div
      className={combine(
        "min-h-screen pt-16 md:pt-20",
        themeValues.containerBg
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div
            className={combine(
              "h-64 rounded-2xl mb-8",
              getValueForTheme("bg-gray-800/40", "bg-gray-200")
            )}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={combine(
                    "h-32 rounded-xl",
                    getValueForTheme("bg-gray-800/40", "bg-gray-200")
                  )}
                />
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className={combine(
                    "h-24 rounded-xl",
                    getValueForTheme("bg-gray-800/40", "bg-gray-200")
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoadingPage);