"use client";

import React, { memo } from "react";

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

  return (
    <div className={`grid gap-6 ${gridClasses}`}>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className={`${themeClasses.skeleton} ${skeletonHeight} relative overflow-hidden`}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {viewMode === "grid" ? (
            // Grid skeleton content
            <div className="p-4 h-full flex flex-col">
              {/* Image placeholder */}
              <div className={`w-full h-40 rounded-lg mb-4 ${themeClasses.skeleton}`} />
              
              {/* Title placeholder */}
              <div className={`h-4 rounded mb-2 ${themeClasses.skeleton}`} style={{ width: '80%' }} />
              
              {/* Subtitle placeholder */}
              <div className={`h-3 rounded mb-3 ${themeClasses.skeleton}`} style={{ width: '60%' }} />
              
              {/* Description placeholders */}
              <div className="space-y-2 flex-1">
                <div className={`h-3 rounded ${themeClasses.skeleton}`} />
                <div className={`h-3 rounded ${themeClasses.skeleton}`} style={{ width: '90%' }} />
                <div className={`h-3 rounded ${themeClasses.skeleton}`} style={{ width: '75%' }} />
              </div>
              
              {/* Button placeholder */}
              <div className={`h-8 rounded-lg mt-4 ${themeClasses.skeleton}`} />
            </div>
          ) : (
            // List skeleton content
            <div className="p-4 h-full flex">
              {/* Image placeholder */}
              <div className={`w-24 h-24 rounded-lg mr-4 flex-shrink-0 ${themeClasses.skeleton}`} />
              
              <div className="flex-1">
                {/* Title placeholder */}
                <div className={`h-4 rounded mb-2 ${themeClasses.skeleton}`} style={{ width: '70%' }} />
                
                {/* Subtitle placeholder */}
                <div className={`h-3 rounded mb-2 ${themeClasses.skeleton}`} style={{ width: '50%' }} />
                
                {/* Description placeholder */}
                <div className={`h-3 rounded ${themeClasses.skeleton}`} style={{ width: '90%' }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;