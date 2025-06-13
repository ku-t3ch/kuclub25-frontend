"use client";
import React from "react";
import { motion } from "framer-motion";
import { useThemeUtils } from "../../../hooks/useThemeUtils";

const LoadingPage: React.FC = () => {
  const { combine, getValueForTheme } = useThemeUtils();

  const themeValues = {
    containerBg: getValueForTheme(
      "bg-[#ffff]/2",
      "bg-gradient-to-b from-white to-gray-50"
    ),
    skeletonBg: getValueForTheme(
      "bg-[#ffff]/2",
      "bg-gray-200 border border-gray-300/30"
    ),
    shimmerBg: getValueForTheme(
      "bg-[#ffff]/2",
      "bg-gradient-to-r from-transparent via-gray-300/80 to-transparent"
    ),
    cardBg: getValueForTheme(
      "bg-gray-800/30 border border-gray-700/50",
      "bg-white border border-[#006C67]/10"
    ),
  };

  // Animation variants for staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Shimmer animation for skeleton elements
  const shimmerVariants = {
    animate: {
      x: ["-100%", "100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 1.5,
          ease: "linear",
        },
      },
    },
  };

  const SkeletonBox = ({ 
    className, 
    children 
  }: { 
    className?: string; 
    children?: React.ReactNode; 
  }) => (
    <motion.div
      variants={itemVariants}
      className={combine(
        "relative overflow-hidden rounded-xl",
        themeValues.skeletonBg,
        className
      )}
    >
      <motion.div
        variants={shimmerVariants}
        animate="animate"
        className={combine(
          "absolute inset-0 -translate-x-full",
          themeValues.shimmerBg
        )}
      />
      {children}
    </motion.div>
  );

  return (
    <div
      className={combine(
        "min-h-screen pt-16 md:pt-20",
        themeValues.containerBg
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section Skeleton */}
          <SkeletonBox className="h-64 xs:h-72 md:h-80">
            <div className="p-6 xs:p-8 h-full flex items-end">
              <div className="w-full space-y-4">
                {/* Title skeleton */}
                <div className={combine(
                  "h-8 xs:h-10 w-3/4 rounded-lg",
                  getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                )} />
                {/* Subtitle skeleton */}
                <div className={combine(
                  "h-4 xs:h-5 w-1/2 rounded-lg",
                  getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                )} />
                {/* Tags skeleton */}
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={combine(
                        "h-6 xs:h-7 w-20 xs:w-24 rounded-full",
                        getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </SkeletonBox>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <SkeletonBox className="p-6 xs:p-8 space-y-4">
                <div className={combine(
                  "h-6 xs:h-7 w-32 rounded-lg",
                  getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                )} />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={combine(
                        "h-4 rounded-lg",
                        i === 4 ? "w-3/4" : "w-full",
                        getValueForTheme("bg-gray-700/30", "bg-gray-300/60")
                      )}
                    />
                  ))}
                </div>
              </SkeletonBox>

              {/* Projects Section */}
              <SkeletonBox className="p-6 xs:p-8 space-y-6">
                <div className={combine(
                  "h-6 xs:h-7 w-40 rounded-lg",
                  getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={combine(
                        "h-48 xs:h-52 rounded-xl border",
                        getValueForTheme(
                          "bg-gray-800/40 border-gray-700/30",
                          "bg-gray-100 border-gray-200/50"
                        )
                      )}
                    />
                  ))}
                </div>
              </SkeletonBox>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 xs:space-y-6">
              {/* Organization Info Card */}
              <SkeletonBox className="p-6 xs:p-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className={combine(
                    "w-16 h-16 xs:w-20 xs:h-20 rounded-full",
                    getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                  )} />
                  <div className="flex-1 space-y-2">
                    <div className={combine(
                      "h-5 xs:h-6 w-32 rounded-lg",
                      getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                    )} />
                    <div className={combine(
                      "h-4 w-24 rounded-lg",
                      getValueForTheme("bg-gray-700/30", "bg-gray-300/60")
                    )} />
                  </div>
                </div>
              </SkeletonBox>

              {/* Contact Info Card */}
              <SkeletonBox className="p-6 xs:p-8 space-y-4">
                <div className={combine(
                  "h-6 w-28 rounded-lg",
                  getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                )} />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={combine(
                        "w-5 h-5 rounded",
                        getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                      )} />
                      <div className={combine(
                        "h-4 flex-1 rounded-lg",
                        getValueForTheme("bg-gray-700/30", "bg-gray-300/60")
                      )} />
                    </div>
                  ))}
                </div>
              </SkeletonBox>

              {/* Stats Card */}
              <SkeletonBox className="p-6 xs:p-8 space-y-4">
                <div className={combine(
                  "h-6 w-24 rounded-lg",
                  getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                )} />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="text-center space-y-2">
                      <div className={combine(
                        "h-8 xs:h-10 w-full rounded-lg",
                        getValueForTheme("bg-gray-700/50", "bg-gray-300/80")
                      )} />
                      <div className={combine(
                        "h-3 w-full rounded-lg",
                        getValueForTheme("bg-gray-700/30", "bg-gray-300/60")
                      )} />
                    </div>
                  ))}
                </div>
              </SkeletonBox>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(LoadingPage);