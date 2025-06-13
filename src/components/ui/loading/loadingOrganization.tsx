"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  viewMode: "grid" | "list";
  themeClasses: any;
}

const LoadingSkeleton = memo(({ 
  viewMode, 
  themeClasses 
}: LoadingSkeletonProps) => {
  // Grid classes based on view mode
  const gridClasses = viewMode === "grid" 
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
    : "grid-cols-1";

  // Individual skeleton item height based on view mode
  const skeletonHeight = viewMode === "grid" ? "h-80" : "h-32";

  // Animation variants for staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Shimmer animation variants
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

  const SkeletonElement = ({ 
    className, 
    style 
  }: { 
    className?: string; 
    style?: React.CSSProperties; 
  }) => (
    <div 
      className={`bg-gray-700/30 dark:bg-gray-300/60 rounded animate-pulse ${className}`}
      style={style}
    />
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid gap-6 ${gridClasses}`}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className={`
            ${skeletonHeight} 
            relative 
            overflow-hidden 
            rounded-xl 
            border
            ${themeClasses.cardBg || 'bg-gray-800/30 border-gray-700/50 dark:bg-white dark:border-gray-200/50'}
          `}
        >
          {/* Enhanced shimmer effect */}
          <motion.div 
            variants={shimmerVariants}
            animate="animate"
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-600/20 dark:via-gray-300/30 to-transparent"
          />
          
          {viewMode === "grid" ? (
            // Grid skeleton content
            <div className="p-4 xs:p-5 h-full flex flex-col">
              {/* Image placeholder */}
              <SkeletonElement className="w-full h-40 xs:h-44 rounded-lg mb-4" />
              
              {/* Title placeholder */}
              <SkeletonElement 
                className="h-4 xs:h-5 rounded-lg mb-2" 
                style={{ width: '80%' }} 
              />
              
              {/* Subtitle placeholder */}
              <SkeletonElement 
                className="h-3 xs:h-4 rounded-lg mb-3" 
                style={{ width: '60%' }} 
              />
              
              {/* Description placeholders */}
              <div className="space-y-2 xs:space-y-3 flex-1">
                <SkeletonElement className="h-3 rounded-lg" />
                <SkeletonElement 
                  className="h-3 rounded-lg" 
                  style={{ width: '90%' }} 
                />
                <SkeletonElement 
                  className="h-3 rounded-lg" 
                  style={{ width: '75%' }} 
                />
              </div>
              
              {/* Tags placeholder */}
              <div className="flex gap-2 mb-4 mt-3">
                <SkeletonElement className="h-6 xs:h-7 w-16 xs:w-20 rounded-full" />
                <SkeletonElement className="h-6 xs:h-7 w-20 xs:w-24 rounded-full" />
                <SkeletonElement className="h-6 xs:h-7 w-14 xs:w-16 rounded-full" />
              </div>
              
              {/* Button placeholder */}
              <SkeletonElement className="h-8 xs:h-10 rounded-lg" />
            </div>
          ) : (
            // List skeleton content
            <div className="p-4 xs:p-5 h-full flex">
              {/* Image placeholder */}
              <SkeletonElement className="w-20 xs:w-24 h-20 xs:h-24 rounded-lg mr-4 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                {/* Title placeholder */}
                <SkeletonElement 
                  className="h-4 xs:h-5 rounded-lg mb-2" 
                  style={{ width: '70%' }} 
                />
                
                {/* Subtitle placeholder */}
                <SkeletonElement 
                  className="h-3 xs:h-4 rounded-lg mb-2" 
                  style={{ width: '50%' }} 
                />
                
                {/* Description placeholders */}
                <div className="space-y-1 xs:space-y-2 mb-3">
                  <SkeletonElement 
                    className="h-3 rounded-lg" 
                    style={{ width: '90%' }} 
                  />
                  <SkeletonElement 
                    className="h-3 rounded-lg" 
                    style={{ width: '75%' }} 
                  />
                </div>
                
                {/* Tags placeholder - horizontal layout for list view */}
                <div className="flex gap-1 xs:gap-2">
                  <SkeletonElement className="h-5 xs:h-6 w-12 xs:w-16 rounded-full" />
                  <SkeletonElement className="h-5 xs:h-6 w-16 xs:w-20 rounded-full" />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
});

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;